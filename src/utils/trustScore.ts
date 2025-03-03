
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Flipkart_logo.svg/1920px-Flipkart_logo.svg.png',
    connected: false,
  },
  {
    id: 'walmart',
    name: 'Walmart',
    logo: 'https://logos-world.net/wp-content/uploads/2020/11/Walmart-Logo.png',
    connected: false,
  },
  {
    id: 'ebay',
    name: 'eBay',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/1200px-EBay_logo.svg.png',
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
    masterKey: score > 40 ? generateMasterKey() : undefined,
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
