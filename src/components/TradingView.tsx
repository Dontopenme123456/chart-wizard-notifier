
import { useState, useEffect } from "react";
import { SignalType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown } from "lucide-react";

const TradingView = ({ signal }: { signal?: SignalType }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<{ points: number[] }>({ points: [] });
  
  useEffect(() => {
    // Simulate chart loading
    setIsLoading(true);
    
    // Generate random chart data
    const generateChartData = () => {
      let lastPrice = 100;
      const volatility = 2;
      const points: number[] = [];
      
      // Generate 100 price points
      for (let i = 0; i < 100; i++) {
        // Random walk with slight trend
        const change = (Math.random() - 0.5) * volatility;
        lastPrice = lastPrice + change;
        
        // Ensure price doesn't go below 0
        lastPrice = Math.max(lastPrice, 1);
        points.push(lastPrice);
      }
      
      return { points };
    };
    
    const timer = setTimeout(() => {
      setChartData(generateChartData());
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [signal]);
  
  // Generate SVG path for chart
  const generatePath = () => {
    const { points } = chartData;
    if (points.length === 0) return "";
    
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min;
    
    // Scale points to fit in the SVG
    const height = 200;
    const width = 320;
    const xStep = width / (points.length - 1);
    
    // Generate SVG path
    let path = `M 0,${height - ((points[0] - min) / range) * height}`;
    
    for (let i = 1; i < points.length; i++) {
      const x = i * xStep;
      const y = height - ((points[i] - min) / range) * height;
      path += ` L ${x},${y}`;
    }
    
    return path;
  };
  
  const signalPositions = [25, 60, 85]; // Fixed positions for demonstration

  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Chart Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative">
        {isLoading ? (
          <div className="p-4 space-y-3">
            <Skeleton className="h-[240px] w-full rounded-md" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ) : (
          <div className="relative h-[280px] w-full overflow-hidden pt-4">
            {/* Chart SVG */}
            <svg width="100%" height="220" viewBox="0 0 320 200" preserveAspectRatio="none" className="px-4">
              {/* Grid lines */}
              <g className="grid-lines">
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 50}
                    x2="320"
                    y2={i * 50}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}
              </g>
              
              {/* Chart line */}
              <path
                d={generatePath()}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                className="drop-shadow-md"
              />
              
              {/* Buy/Sell markers */}
              {signal && signalPositions.map((pos, index) => {
                const x = pos * 3.2; // Scale to 320px width
                const pointIndex = Math.floor(pos * chartData.points.length / 100);
                const y = 200 - ((chartData.points[pointIndex] - Math.min(...chartData.points)) / 
                  (Math.max(...chartData.points) - Math.min(...chartData.points)) * 200);
                
                const isSignalPoint = index === 1; // Middle point is our main signal
                const signalType = isSignalPoint ? signal.type : (Math.random() > 0.5 ? 'buy' : 'sell');
                
                return (
                  <g key={index} className="animate-fade-in" style={{animationDelay: `${index * 200}ms`}}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isSignalPoint ? 5 : 3}
                      fill={signalType === 'buy' ? '#34C759' : '#FF3B30'}
                      stroke="white"
                      strokeWidth="1.5"
                      className={isSignalPoint ? 'animate-pulse-gentle' : ''}
                    />
                    {isSignalPoint && (
                      <rect
                        x={x - 20}
                        y={y - 30}
                        width="40"
                        height="20"
                        rx="4"
                        fill={signalType === 'buy' ? '#34C75920' : '#FF3B3020'}
                        stroke={signalType === 'buy' ? '#34C759' : '#FF3B30'}
                        strokeWidth="1"
                        className="animate-scale-in"
                      />
                    )}
                    {isSignalPoint && (
                      <text
                        x={x}
                        y={y - 16}
                        fontSize="9"
                        fontWeight="bold"
                        fill={signalType === 'buy' ? '#34C759' : '#FF3B30'}
                        textAnchor="middle"
                        className="animate-fade-in"
                        style={{animationDelay: '300ms'}}
                      >
                        {signalType.toUpperCase()}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            
            {/* Legend at bottom */}
            <div className="flex justify-between px-4 pt-2 pb-4 border-t mt-2 text-xs text-muted-foreground">
              <span>9:30 AM</span>
              <span>12:00 PM</span>
              <span>4:00 PM</span>
            </div>
            
            {/* Signal overlay */}
            {signal && (
              <div className="absolute top-4 right-4 flex items-center gap-2 animate-fade-in">
                <div className={`p-1 rounded-full ${signal.type === 'buy' 
                  ? 'bg-signal-buy/10 text-signal-buy' 
                  : 'bg-signal-sell/10 text-signal-sell'}`}
                >
                  {signal.type === 'buy' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                </div>
                <span className={`text-xs font-semibold ${signal.type === 'buy' 
                  ? 'text-signal-buy' 
                  : 'text-signal-sell'}`}
                >
                  {signal.pair}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingView;
