import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Gmail API scopes we need
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/userinfo.email'
];

// Types for Gmail data
export interface GmailUserData {
  email: string;
  name?: string;
  orders: GmailOrder[];
  profile?: {
    picture?: string;
    locale?: string;
    emailVerified: boolean;
  };
  code?: string; // Store auth code for refreshing
}

export interface GmailOrder {
  orderId: string;
  merchant: string;
  amount: number;
  date: string;
  status: 'delivered' | 'processing' | 'cancelled' | 'returned';
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

// Create OAuth2 client
export const createOAuth2Client = () => {
  const isProduction = window.location.hostname !== 'localhost';
  const redirectUri = isProduction 
    ? 'https://reworx.vercel.app/auth/gmail/callback'
    : `${window.location.origin}/auth/gmail/callback`;

  return new google.auth.OAuth2(
    import.meta.env.VITE_GOOGLE_CLIENT_ID,
    import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
    redirectUri
  );
};

// Generate OAuth URL
export const generateOAuthUrl = (oauth2Client: OAuth2Client): string => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
};

// Exchange code for tokens
export const getTokens = async (oauth2Client: OAuth2Client, code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

// Get user profile
export const getUserProfile = async (oauth2Client: OAuth2Client) => {
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();
  return data;
};

// Extract orders from emails
export const extractOrdersFromEmails = async (oauth2Client: OAuth2Client): Promise<GmailOrder[]> => {
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const orders: GmailOrder[] = [];

  // Search queries for different e-commerce platforms
  const searchQueries = [
    'from:amazon.in subject:order',
    'from:flipkart.com subject:order',
    'from:myntra.com subject:order',
    'from:meesho.com subject:order'
  ];

  for (const query of searchQueries) {
    try {
      // Search for emails
      const res = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: 100
      });

      const messages = res.data.messages || [];

      // Process each message
      for (const message of messages) {
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'full'
        });

        const order = parseOrderFromEmail(email.data);
        if (order) {
          orders.push(order);
        }
      }
    } catch (error) {
      console.error(`Error processing query "${query}":`, error);
    }
  }

  return orders;
};

// Parse order details from email
const parseOrderFromEmail = (email: any): GmailOrder | null => {
  try {
    const headers = email.payload.headers;
    const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
    const from = headers.find((h: any) => h.name === 'From')?.value || '';
    
    // Extract merchant
    let merchant = '';
    if (from.includes('amazon')) merchant = 'Amazon';
    else if (from.includes('flipkart')) merchant = 'Flipkart';
    else if (from.includes('myntra')) merchant = 'Myntra';
    else if (from.includes('meesho')) merchant = 'Meesho';
    else return null;

    // Get email body
    const body = email.payload.parts?.[0]?.body?.data || email.payload.body?.data;
    if (!body) return null;

    const decodedBody = atob(body.replace(/-/g, '+').replace(/_/g, '/'));

    // Extract order details using regex patterns
    const orderIdMatch = decodedBody.match(/Order(?:\s+|#|ID|:)\s*([A-Z0-9-]+)/i);
    const amountMatch = decodedBody.match(/(?:Total|Amount|Price):\s*(?:Rs\.|₹|INR)?\s*([0-9,.]+)/i);
    const dateMatch = decodedBody.match(/Order(?:\s+|Date|:)\s*([A-Za-z0-9,\s]+)/i);

    if (!orderIdMatch) return null;

    return {
      orderId: orderIdMatch[1],
      merchant,
      amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0,
      date: dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString(),
      status: determineOrderStatus(decodedBody),
      products: extractProducts(decodedBody)
    };
  } catch (error) {
    console.error('Error parsing email:', error);
    return null;
  }
};

// Determine order status from email content
const determineOrderStatus = (body: string): GmailOrder['status'] => {
  const lowerBody = body.toLowerCase();
  if (lowerBody.includes('delivered') || lowerBody.includes('completed')) return 'delivered';
  if (lowerBody.includes('cancelled') || lowerBody.includes('canceled')) return 'cancelled';
  if (lowerBody.includes('returned') || lowerBody.includes('refund')) return 'returned';
  return 'processing';
};

// Extract products from email content
const extractProducts = (body: string): GmailOrder['products'] => {
  const products: GmailOrder['products'] = [];
  
  // Simple regex pattern to find product details
  const productPattern = /([A-Za-z0-9\s&-]+)\s*(?:x\s*(\d+))?\s*(?:Rs\.|₹|INR)?\s*([0-9,.]+)/gi;
  let match;

  while ((match = productPattern.exec(body)) !== null) {
    const [_, name, quantity, price] = match;
    products.push({
      name: name.trim(),
      quantity: quantity ? parseInt(quantity) : 1,
      price: parseFloat(price.replace(/,/g, ''))
    });
  }

  return products;
};

// Get all user data
export const getUserData = async (code: string): Promise<GmailUserData> => {
  const oauth2Client = createOAuth2Client();
  
  // Get tokens
  const tokens = await getTokens(oauth2Client, code);
  oauth2Client.setCredentials(tokens);

  // Get user profile
  const profile = await getUserProfile(oauth2Client);
  
  // Get orders
  const orders = await extractOrdersFromEmails(oauth2Client);

  return {
    email: profile.email!,
    name: profile.name,
    profile: {
      picture: profile.picture,
      locale: profile.locale,
      emailVerified: profile.verified_email || false
    },
    orders,
    code // Store the code for refreshing data later
  };
}; 