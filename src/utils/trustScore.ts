export interface Platform {
  id: string;
  name: string;
  icon: string;
  description: string;
  isConnected: boolean;
  connectedAt?: string;
  lastSync?: string;
  orderCount?: number;
  totalSpent?: number;
  averageOrderValue?: number;
  lastOrderDate?: string;
  orderFrequency?: string;
  platformScore?: number;
  status: 'active' | 'pending' | 'error';
  error?: string;
}

export interface OrderHistory {
  id: string;
  platform: string;
  orderNumber: string;
  date: string;
  amount: number;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export interface UserScore {
  score: number;
  level: string;
  masterKey?: string;
  orderHistory: {
    total: number;
    recent: OrderHistory[];
  };
  platforms: {
    [key: string]: {
      connected: boolean;
      connectedAt?: string;
      lastSync?: string;
      orderCount?: number;
      totalSpent?: number;
      averageOrderValue?: number;
      lastOrderDate?: string;
      orderFrequency?: string;
      platformScore?: number;
    };
  };
  badges: string[];
  achievements: string[];
  lastUpdated: string;
}

// Demo data for available platforms
export const availablePlatforms: Platform[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    icon: 'amazon',
    description: 'Connect your Amazon account to track orders and spending',
    isConnected: false,
    status: 'pending'
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    icon: 'flipkart',
    description: 'Track your Flipkart orders and analyze spending patterns',
    isConnected: false,
    status: 'pending'
  },
  {
    id: 'myntra',
    name: 'Myntra',
    icon: 'myntra',
    description: 'Monitor your Myntra fashion orders and track spending',
    isConnected: false,
    status: 'pending'
  },
  {
    id: 'ajio',
    name: 'AJIO',
    icon: 'ajio',
    description: 'Connect AJIO to track your fashion and lifestyle orders',
    isConnected: false,
    status: 'pending'
  },
  {
    id: 'meesho',
    name: 'Meesho',
    icon: 'meesho',
    description: 'Track your Meesho orders and analyze shopping patterns',
    isConnected: false,
    status: 'pending'
  }
];

export function getScoreLevel(score: number): string {
  if (score >= 1000) return 'Master';
  if (score >= 800) return 'Expert';
  if (score >= 600) return 'Pro';
  if (score >= 400) return 'Advanced';
  if (score >= 200) return 'Intermediate';
  return 'Beginner';
}

export function generateMasterKey(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function createNewMasterKey(): string {
  // Generate a random master key
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function calculatePlatformScore(platform: Platform): number {
  let score = 0;
  
  // Base score for connection
  if (platform.isConnected) {
    score += 50;
  }
  
  // Order count contribution
  if (platform.orderCount) {
    score += Math.min(platform.orderCount * 2, 200);
  }
  
  // Total spent contribution
  if (platform.totalSpent) {
    score += Math.min(platform.totalSpent / 100, 200);
  }
  
  // Order frequency contribution
  if (platform.orderFrequency) {
    const frequency = platform.orderFrequency.toLowerCase();
    if (frequency.includes('daily')) score += 100;
    else if (frequency.includes('weekly')) score += 75;
    else if (frequency.includes('monthly')) score += 50;
    else if (frequency.includes('quarterly')) score += 25;
  }
  
  // Last order recency
  if (platform.lastOrderDate) {
    const lastOrder = new Date(platform.lastOrderDate);
    const now = new Date();
    const monthsSinceLastOrder = (now.getTime() - lastOrder.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (monthsSinceLastOrder < 1) score += 50;
    else if (monthsSinceLastOrder < 3) score += 30;
    else if (monthsSinceLastOrder < 6) score += 20;
    else if (monthsSinceLastOrder < 12) score += 10;
  }
  
  return Math.min(score, 500);
}

export function calculateUserScore(userScore: UserScore): number {
  let totalScore = 0;
  
  // Base score for each connected platform
  Object.values(userScore.platforms).forEach(platform => {
    if (platform.connected) {
      totalScore += 100;
    }
  });
  
  // Platform-specific scores
  Object.values(userScore.platforms).forEach(platform => {
    if (platform.platformScore) {
      totalScore += platform.platformScore;
    }
  });
  
  // Badge and achievement bonuses
  totalScore += userScore.badges.length * 50;
  totalScore += userScore.achievements.length * 100;
  
  return totalScore;
}

export function generateUserScore(): UserScore {
  const platforms = availablePlatforms.reduce((acc, platform) => {
    acc[platform.id] = {
      connected: false
    };
    return acc;
  }, {} as UserScore['platforms']);

  return {
    score: 0,
    level: 'Beginner',
    orderHistory: {
      total: 0,
      recent: []
    },
    platforms,
    badges: [],
    achievements: [],
    lastUpdated: new Date().toISOString()
  };
}

export function generateRandomScore(): UserScore {
  const score = Math.floor(Math.random() * 1000);
  const platforms = availablePlatforms.reduce((acc, platform) => {
    acc[platform.id] = {
      connected: false
    };
    return acc;
  }, {} as UserScore['platforms']);

  return {
    score,
    level: getScoreLevel(score),
    orderHistory: {
      total: Math.floor(Math.random() * 50),
      recent: []
    },
    platforms,
    badges: [],
    achievements: [],
    lastUpdated: new Date().toISOString()
  };
}

export function updateUserScore(
  currentScore: UserScore,
  platformId: string,
  platformData: Partial<Platform>
): UserScore {
  const updatedScore = { ...currentScore };
  
  // Update platform data
  if (updatedScore.platforms[platformId]) {
    updatedScore.platforms[platformId] = {
      ...updatedScore.platforms[platformId],
      ...platformData
    };
  }
  
  // Recalculate total score
  updatedScore.score = calculateUserScore(updatedScore);
  updatedScore.level = getScoreLevel(updatedScore.score);
  updatedScore.lastUpdated = new Date().toISOString();
  
  return updatedScore;
}
