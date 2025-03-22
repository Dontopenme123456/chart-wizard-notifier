
import { useState } from "react";
import { SignalType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, BarChart3, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SignalHistory = ({ signals }: { signals: SignalType[] }) => {
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');
  
  const filteredSignals = signals.filter(signal => 
    filter === 'all' || signal.type === filter
  );
  
  // Group signals by date
  const groupedSignals: Record<string, SignalType[]> = {};
  
  filteredSignals.forEach(signal => {
    const date = new Date().toLocaleDateString();
    if (!groupedSignals[date]) {
      groupedSignals[date] = [];
    }
    groupedSignals[date].push(signal);
  });
  
  const dateKeys = Object.keys(groupedSignals);
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" value={filter} onValueChange={(value) => setFilter(value as any)}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">
            <ArrowUpDown size={14} className="mr-1.5" />
            All
          </TabsTrigger>
          <TabsTrigger value="buy">
            <ArrowUp size={14} className="mr-1.5" />
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell">
            <ArrowDown size={14} className="mr-1.5" />
            Sell
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {dateKeys.length > 0 ? (
        dateKeys.map(date => (
          <div key={date} className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">
                {date === new Date().toLocaleDateString() ? 'Today' : date}
              </h3>
              <Badge variant="outline" className="font-normal">
                {groupedSignals[date].length} signals
              </Badge>
            </div>
            
            <div className="space-y-2">
              {groupedSignals[date].map((signal, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className={`h-0.5 ${signal.type === 'buy' ? 'bg-signal-buy' : 'bg-signal-sell'}`}></div>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`mr-2 p-1.5 rounded-full ${signal.type === 'buy' 
                          ? 'bg-signal-buy/10 text-signal-buy' 
                          : 'bg-signal-sell/10 text-signal-sell'}`}
                        >
                          {signal.type === 'buy' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{signal.pair}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">{signal.timestamp}</span>
                            <Badge variant="outline" className="text-[10px] h-4 px-1 font-normal">
                              {signal.indicator}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm">${signal.price}</p>
                        <p className={`text-xs ${signal.type === 'buy' ? 'text-signal-buy' : 'text-signal-sell'}`}>
                          {signal.type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <BarChart3 className="text-muted-foreground mb-2" size={28} />
          <p className="text-muted-foreground mb-1">No signal history</p>
          <p className="text-xs text-muted-foreground">
            {filter === 'all' 
              ? 'Enable live mode to start collecting signals' 
              : `No ${filter} signals collected yet`}
          </p>
        </div>
      )}
    </div>
  );
};

export default SignalHistory;
