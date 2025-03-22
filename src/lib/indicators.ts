
import { SignalType } from './types';

// Currency pairs to randomly select from
const CURRENCY_PAIRS = [
  'BTC/USD', 'ETH/USD', 'SOL/USD', 'BNB/USD', 'XRP/USD',
  'ADA/USD', 'DOGE/USD', 'AVAX/USD', 'LINK/USD', 'DOT/USD'
];

// Indicator types to randomly select from
const INDICATORS = [
  'RSI Crossover', 'MACD Signal', 'Bollinger Breakout', 
  'EMA Cross', 'Fibonacci Retracement', 'Ichimoku Cloud',
  'Stochastic Oscillator', 'Volume Profile', 'ADX Trend'
];

// Generate random price within a realistic range
const getRandomPrice = (pair: string): number => {
  const baseValues: Record<string, [number, number]> = {
    'BTC/USD': [25000, 75000],
    'ETH/USD': [1500, 5000],
    'SOL/USD': [20, 200],
    'BNB/USD': [200, 700],
    'XRP/USD': [0.3, 1.5],
    'ADA/USD': [0.2, 1],
    'DOGE/USD': [0.05, 0.2],
    'AVAX/USD': [10, 50],
    'LINK/USD': [5, 30],
    'DOT/USD': [5, 25],
  };
  
  const [min, max] = baseValues[pair] || [10, 100];
  const price = min + Math.random() * (max - min);
  
  // Format to 2 decimal places, or to satoshis for BTC
  return pair === 'BTC/USD' 
    ? Math.round(price) 
    : Math.round(price * 100) / 100;
};

// Random time in the last 10 minutes
const getRandomTimeInLastMinutes = (minutes: number = 10): string => {
  const now = new Date();
  const pastTime = new Date(now.getTime() - Math.random() * minutes * 60000);
  return pastTime.toLocaleTimeString();
};

// Simulate the calculation of technical indicators
export const calculateSignals = (): SignalType => {
  const randomPair = CURRENCY_PAIRS[Math.floor(Math.random() * CURRENCY_PAIRS.length)];
  const randomIndicator = INDICATORS[Math.floor(Math.random() * INDICATORS.length)];
  const price = getRandomPrice(randomPair);
  const signalType = Math.random() > 0.5 ? 'buy' : 'sell';
  const confidence = Math.round(70 + Math.random() * 30); // 70-100% confidence
  
  return {
    type: signalType,
    pair: randomPair,
    price: price,
    timestamp: getRandomTimeInLastMinutes(),
    indicator: randomIndicator,
    confidence: confidence,
  };
};

// Sample indicator calculation functions (simplified for demo)
export const calculateRSI = (prices: number[], period: number = 14): number => {
  // Simplified RSI calculation for demonstration
  return 30 + Math.random() * 40; // RSI between 30 and 70
};

export const calculateMACD = (prices: number[]): { macd: number, signal: number, histogram: number } => {
  // Simplified MACD calculation for demonstration
  return {
    macd: Math.random() * 2 - 1,
    signal: Math.random() * 2 - 1,
    histogram: Math.random() * 0.5 - 0.25
  };
};

export const calculateBollingerBands = (
  prices: number[], 
  period: number = 20, 
  stdDev: number = 2
): { upper: number, middle: number, lower: number } => {
  // Simplified Bollinger Bands calculation for demonstration
  const middle = prices[prices.length - 1];
  const band = middle * 0.05 * stdDev;
  
  return {
    upper: middle + band,
    middle: middle,
    lower: middle - band
  };
};

// Get default indicator settings
export const getDefaultIndicators = () => [
  {
    id: 'rsi',
    name: 'RSI Crossover',
    description: 'Relative Strength Index crosses above 30 (buy) or below 70 (sell)',
    enabled: true,
    settings: {
      period: 14,
      overbought: 70,
      oversold: 30
    }
  },
  {
    id: 'macd',
    name: 'MACD Signal',
    description: 'Moving Average Convergence Divergence signal line crossovers',
    enabled: true,
    settings: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9
    }
  },
  {
    id: 'bollinger',
    name: 'Bollinger Bands',
    description: 'Price breaking out of Bollinger Bands indicates potential reversal',
    enabled: true,
    settings: {
      period: 20,
      stdDev: 2
    }
  },
  {
    id: 'ema',
    name: 'EMA Cross',
    description: 'Exponential Moving Average crossover strategy (Golden Cross and Death Cross)',
    enabled: false,
    settings: {
      shortPeriod: 50,
      longPeriod: 200
    }
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci Retracement',
    description: 'Price retraction to key Fibonacci levels indicating support/resistance',
    enabled: false,
    settings: {
      levels: [0.236, 0.382, 0.5, 0.618, 0.786]
    }
  }
];

// Get default strategy guides
export const getDefaultStrategyGuides = (): StrategyGuideType[] => [
  {
    id: 'rsi-strategy',
    title: 'RSI Strategy Guide',
    description: 'Learn how to use the Relative Strength Index for optimal trade entries and exits',
    type: 'pdf',
    content: 'assets/guides/rsi-strategy.pdf',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhZGluZ3xlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    id: 'macd-strategy',
    title: 'MACD Trading System',
    description: 'Complete guide to the Moving Average Convergence Divergence indicator',
    type: 'pdf',
    content: 'assets/guides/macd-strategy.pdf',
    imageUrl: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJhZGluZ3xlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    id: 'bollinger-strategy',
    title: 'Bollinger Bands Mastery',
    description: 'Advanced techniques for trading with Bollinger Bands in volatile markets',
    type: 'pdf',
    content: 'assets/guides/bollinger-strategy.pdf',
    imageUrl: 'https://images.unsplash.com/photo-1642790551116-18e90f4b29bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJpdGNvaW58ZW58MHx8MHx8fDA%3D'
  },
  {
    id: 'fibonacci-strategy',
    title: 'Fibonacci Trading Secrets',
    description: 'How to use Fibonacci retracement levels to predict price movements',
    type: 'pdf',
    content: 'assets/guides/fibonacci-strategy.pdf',
    imageUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dHJhZGluZ3xlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    id: 'indicator-combinations',
    title: 'Indicator Combinations',
    description: 'Learn how to combine multiple indicators for higher probability trades',
    type: 'pdf',
    content: 'assets/guides/indicator-combinations.pdf',
    imageUrl: 'https://images.unsplash.com/photo-1616309787323-28d050a9cb56?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNyeXB0b3xlbnwwfHwwfHx8MA%3D%3D'
  }
];
