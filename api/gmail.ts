import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const oauth2Client = new google.auth.OAuth2(
  process.env.VITE_GOOGLE_CLIENT_ID,
  process.env.VITE_GOOGLE_CLIENT_SECRET,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/gmail/callback` : 'http://localhost:5173/api/gmail/callback'
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.readonly']
    });
    res.redirect(authUrl);
  } else if (req.method === 'POST') {
    try {
      const { code } = req.body;
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
      const response = await gmail.users.messages.list({
        userId: 'me',
        q: 'from:(orders@amazon.com OR orders@flipkart.com)',
        maxResults: 50
      });

      const messages = response.data.messages || [];
      const orders = await Promise.all(
        messages.map(async (message) => {
          const email = await gmail.users.messages.get({
            userId: 'me',
            id: message.id!
          });
          return {
            id: message.id,
            threadId: message.threadId,
            ...parseOrderDetails(email.data)
          };
        })
      );

      res.status(200).json({ orders });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

function parseOrderDetails(email: any) {
  const headers = email.payload.headers;
  const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
  const from = headers.find((h: any) => h.name === 'From')?.value || '';
  const date = headers.find((h: any) => h.name === 'Date')?.value || '';

  let orderId = '';
  let amount = '';
  let status = '';

  // Extract order details from subject and body
  if (from.includes('amazon.com')) {
    orderId = subject.match(/Order #(\d+)/)?.[1] || '';
    amount = subject.match(/\$(\d+\.\d+)/)?.[1] || '';
    status = subject.includes('Delivered') ? 'Delivered' : 'Processing';
  } else if (from.includes('flipkart.com')) {
    orderId = subject.match(/Order #(\d+)/)?.[1] || '';
    amount = subject.match(/₹(\d+)/)?.[1] || '';
    status = subject.includes('Delivered') ? 'Delivered' : 'Processing';
  }

  return {
    orderId,
    amount,
    status,
    date,
    from
  };
} 