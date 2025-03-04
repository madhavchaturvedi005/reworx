# Gmail Integration Implementation Guide

This document outlines the steps to implement a real Gmail integration for extracting e-commerce order data in the Reworx application.

## Prerequisites

1. Create a Google Cloud Platform (GCP) project
2. Configure OAuth consent screen
3. Create OAuth 2.0 credentials
4. Enable Gmail API

## Step 1: Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Library"
4. Search for "Gmail API" and enable it

## Step 2: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (or "Internal" if for organization use only)
3. Fill in required app information:
   - App name: "Reworx"
   - User support email
   - Developer contact information
4. Add scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
5. Add test users if using External user type

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as application type
4. Add authorized JavaScript origins:
   - `https://your-app-domain.com`
5. Add authorized redirect URIs:
   - `https://your-app-domain.com/auth/gmail/callback`
6. Click "Create" and note your Client ID and Client Secret

## Step 4: Update Frontend Code

Replace the placeholder in `generateGmailOAuthUrl()` function in `src/utils/trustScore.ts`:

```typescript
export const generateGmailOAuthUrl = (): string => {
  const clientId = "YOUR_ACTUAL_GOOGLE_CLIENT_ID"; // Replace with your GCP Client ID
  const redirectUri = encodeURIComponent(window.location.origin + "/auth/gmail/callback");
  const scope = encodeURIComponent("https://www.googleapis.com/auth/gmail.readonly");
  
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
};
```

## Step 5: Create Backend API Endpoint

Since this is a frontend-only project, you'll need a backend service to:
1. Exchange the authorization code for tokens
2. Use the tokens to access Gmail API
3. Parse emails and extract order data

### Example Backend API (Node.js + Express)

```javascript
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// OAuth client configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

app.post('/api/gmail/callback', async (req, res) => {
  try {
    const { code } = req.body;
    
    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // Create Gmail client
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    
    // Search for e-commerce order emails
    const searchQueries = [
      'from:order@amazon subject:"Your Order"',
      'from:flipkart subject:"Order Confirmation"',
      'from:myntra subject:"Order Confirmation"',
      'from:meesho subject:"Order Confirmed"'
    ];
    
    let orderData = [];
    
    // Process each search query
    for (const query of searchQueries) {
      const res = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: 10
      });
      
      const messages = res.data.messages || [];
      
      // Process each message
      for (const message of messages) {
        const emailData = await gmail.users.messages.get({
          userId: 'me',
          id: message.id
        });
        
        // Extract order details from email body and headers
        // This requires parsing the email content with regex or HTML parsers
        // The implementation details will vary based on email format
        
        const parsedOrder = parseOrderFromEmail(emailData.data);
        if (parsedOrder) {
          orderData.push(parsedOrder);
        }
      }
    }
    
    res.json({ success: true, orders: orderData });
  } catch (error) {
    console.error('Gmail API Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function to parse order details from email
function parseOrderFromEmail(email) {
  // Implementation will vary based on email structure
  // This is a placeholder for the actual parsing logic
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Step 6: Update Frontend to Handle OAuth Callback

Create a new component to handle the OAuth callback:

```typescript
// src/components/GmailCallback.tsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';

const GmailCallback = () => {
  const [status, setStatus] = useState('Processing...');
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const processAuth = async () => {
      try {
        // Get the authorization code from URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          throw new Error('No authorization code received');
        }
        
        // Send code to backend
        const response = await fetch('YOUR_BACKEND_URL/api/gmail/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to process Gmail data');
        }
        
        // Store the order data or update the application state
        localStorage.setItem('gmailOrders', JSON.stringify(data.orders));
        
        setStatus('Success! Redirecting...');
        
        // Redirect back to integration page
        setTimeout(() => {
          navigate('/integration', { 
            state: { 
              gmailConnected: true,
              orderCount: data.orders.length 
            } 
          });
        }, 2000);
        
      } catch (error) {
        console.error('Error processing Gmail auth:', error);
        setStatus(`Error: ${error.message}`);
        
        // Redirect back to integration page with error
        setTimeout(() => {
          navigate('/integration', { 
            state: { 
              gmailConnected: false,
              error: error.message 
            } 
          });
        }, 3000);
      }
    };
    
    processAuth();
  }, [location, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold text-center mb-6">
          Gmail Integration
        </h1>
        <div className="flex flex-col items-center justify-center space-y-4">
          <Spinner size="lg" />
          <p>{status}</p>
        </div>
      </div>
    </div>
  );
};

export default GmailCallback;
```

## Step 7: Add the Callback Route to App.tsx

```typescript
// In App.tsx, add the new route:
<Route path="/auth/gmail/callback" element={<GmailCallback />} />
```

## Step 8: Update Integration Page to Process Returned Data

Modify the Integration page to handle the returned state:

```typescript
// In Integration.tsx
import { useLocation } from 'react-router-dom';

const Integration = () => {
  const location = useLocation();
  const { state } = location;
  
  useEffect(() => {
    // Check if coming back from Gmail OAuth flow
    if (state?.gmailConnected === true) {
      // Update platform connection status
      setPlatforms(platforms.map(p => 
        p.id === 'gmail' ? { ...p, connected: true, lastSynced: new Date().toISOString() } : p
      ));
      
      // Show success toast
      toast({
        title: 'Gmail Connected Successfully',
        description: `Found ${state.orderCount} orders in your Gmail.`,
      });
      
      // Show success dialog with order details
      setGmailOrdersCount(state.orderCount);
      setShowGmailSuccess(true);
    } else if (state?.gmailConnected === false) {
      // Show error toast
      toast({
        variant: "destructive",
        title: 'Gmail Connection Failed',
        description: state.error || 'Failed to connect to Gmail.',
      });
    }
  }, [state]);
  
  // ...rest of the component
};
```

## Security Considerations

1. **Token Storage**: Store refresh tokens securely on your backend, not in the frontend.
2. **Data Encryption**: Encrypt sensitive user data before storing.
3. **Minimal Permissions**: Only request the permissions you absolutely need.
4. **Consent Screen**: Clearly explain what data you're accessing and why.
5. **Revocation**: Allow users to revoke access at any time.

## Real-World Implementation

For a production application, consider:

1. Using a backend service (Node.js, Python, etc.) to handle API calls and data processing
2. Implementing a secure database for storing order data
3. Setting up periodic refresh of Gmail data
4. Adding data analytics for order patterns and insights
5. Implementing proper error handling and retry mechanisms
