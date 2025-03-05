export interface Platform {
  id: string;
  name: string;
  logo: string;
  connected: boolean;
  lastSynced?: string;
}

export interface OrderHistory {
  total: number;
  accepted: number;
  cancelled: number;
  rejected: number;
}

export interface UserScore {
  score: number;
  level: 'low' | 'medium' | 'high';
  orderHistory: OrderHistory;
  platforms: Platform[];
  masterKey?: string;
}

export interface GmailOrderData {
  orderId: string;
  merchant: string;
  amount: number;
  date: string;
  status: 'delivered' | 'cancelled' | 'returned' | 'processing';
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

// Demo platforms
export const availablePlatforms: Platform[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png',
    connected: true,
    lastSynced: new Date().toISOString(),
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    logo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Emblem.png',
    connected: false,
  },
  {
    id: 'meesho',
    name: 'Meesho',
    logo: 'https://www.meesho.com/favicon.ico',
    connected: false,
  },
  {
    id: 'myntra',
    name: 'Myntra',
    logo: 'https://logolook.net/wp-content/uploads/2023/01/Myntra-Emblem-2048x1152.png',
    connected: false,
  },
  {
    id: 'gmail',
    name: 'Gmail',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png',
    connected: false,
  },
];

// Calculate score level
export const getScoreLevel = (score: number): 'low' | 'medium' | 'high' => {
  if (score < 50) return 'low';
  if (score < 75) return 'medium';
  return 'high';
};

// Generate a random score
export const generateRandomScore = (): UserScore => {
  // Random score between 20 and 95
  const score = Math.floor(Math.random() * 75) + 20;
  
  // Demo order history
  const total = Math.floor(Math.random() * 30) + 10;
  const accepted = Math.floor(total * 0.7) + Math.floor(Math.random() * 5);
  const cancelled = Math.floor((total - accepted) * 0.7);
  const rejected = total - accepted - cancelled;
  
  // Only Amazon connected in the demo
  const connectedPlatforms = availablePlatforms.map(platform => ({
    ...platform,
    connected: platform.id === 'amazon'
  }));
  
  return {
    score,
    level: getScoreLevel(score),
    orderHistory: {
      total,
      accepted,
      cancelled,
      rejected
    },
    platforms: connectedPlatforms,
    masterKey: score > 40 ? 'D!S4A-2003-EFGH' : undefined,
  };
};

// Generate a master key
export const generateMasterKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  
  // Format: XXXX-XXXX-XXXX
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 2) key += '-';
  }
  
  return key;
};

// Create a new master key
export const createNewMasterKey = (): string => {
  return generateMasterKey();
};

// Get user score (simulated)
export const getUserScore = (): UserScore => {
  return generateRandomScore();
};

// Gmail OAuth URL generation with real client ID (to be updated)
export const generateGmailOAuthUrl = (): string => {
  // In a real implementation, this would create a proper OAuth URL with your client ID
  const clientId = "your-google-client-id"; // Replace with your actual Google client ID
  const redirectUri = encodeURIComponent(window.location.origin + "/auth/gmail/callback");
  const scope = encodeURIComponent("https://www.googleapis.com/auth/gmail.readonly");
  
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
};

// Mock function to simulate Gmail data extraction
export const extractOrdersFromGmail = async (authCode: string): Promise<GmailOrderData[]> => {
  // In a real implementation, this would:
  // 1. Exchange the auth code for tokens
  // 2. Use the tokens to fetch emails from Gmail API
  // 3. Parse the emails to extract order data
  
  // For demo purposes, we're returning mock data
  console.log("Extracting orders with auth code:", authCode);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return [
    {
      orderId: "OD12345678",
      merchant: "Amazon",
      amount: 1299.99,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "delivered",
      products: [
        { name: "Wireless Earbuds", quantity: 1, price: 1299.99 }
      ]
    },
    {
      orderId: "FK987654321",
      merchant: "Flipkart",
      amount: 24999.00,
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: "delivered",
      products: [
        { name: "Smartphone", quantity: 1, price: 24999.00 }
      ]
    },
    {
      orderId: "MEE112233",
      merchant: "Meesho",
      amount: 599.00,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "processing",
      products: [
        { name: "T-shirt", quantity: 2, price: 299.50 }
      ]
    },
    {
      orderId: "MYN445566",
      merchant: "Myntra",
      amount: 3499.00,
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "returned",
      products: [
        { name: "Sneakers", quantity: 1, price: 3499.00 }
      ]
    }
  ];
};

// Connect Gmail Account
export const connectGmailAccount = async (): Promise<boolean> => {
  try {
    // In a real implementation, this would redirect to the OAuth URL
    // and handle the callback with the auth code
    
    // For demo purposes, we'll simulate a successful connection
    const authUrl = generateGmailOAuthUrl();
    
    // In a real implementation, this would open the authUrl in a popup or redirect
    console.log("Redirecting to:", authUrl);
    
    // Simulate a successful connection
    return true;
  } catch (error) {
    console.error("Error connecting Gmail:", error);
    return false;
  }
};

// Process Gmail Order Data to update score
export const processGmailOrderData = (orderData: GmailOrderData[]): OrderHistory => {
  const result = {
    total: orderData.length,
    accepted: 0,
    cancelled: 0,
    rejected: 0
  };
  
  // Count by status
  orderData.forEach(order => {
    if (order.status === 'delivered') {
      result.accepted++;
    } else if (order.status === 'cancelled') {
      result.cancelled++;
    } else if (order.status === 'returned') {
      result.rejected++;
    }
    // 'processing' orders are counted in total but not in other categories
  });
  
  return result;
};
