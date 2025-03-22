
export type SignalType = {
  id?: string;
  type: "buy" | "sell" | "hold";
  pair: string;
  price: number;
  timestamp: string;
  indicator: string;
  confidence: number;
};

export type IndicatorType = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  settings?: Record<string, any>;
};

export type StrategyGuideType = {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "text";
  content: string;
  imageUrl?: string;
};
