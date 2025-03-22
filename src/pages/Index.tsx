
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowUp, ArrowDown, History, BookOpen, Settings, TrendingUp, BarChart3, Eye, Download } from "lucide-react";
import { useState, useEffect } from "react";
import TradingView from "@/components/TradingView";
import IndicatorSettings from "@/components/IndicatorSettings";
import SignalHistory from "@/components/SignalHistory";
import StrategyGuides from "@/components/StrategyGuides";
import { SignalType } from "@/lib/types";
import { calculateSignals } from "@/lib/indicators";

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("signals");
  const [isConnected, setIsConnected] = useState(false);
  const [recentSignals, setRecentSignals] = useState<SignalType[]>([]);
  const [isLive, setIsLive] = useState(false);
  
  useEffect(() => {
    // This simulates the extension connecting to a trading platform
    const timer = setTimeout(() => {
      setIsConnected(true);
      toast({
        title: "Successfully connected",
        description: "Now monitoring TradingView for signals",
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!isLive) return;
    
    // Simulate real-time signal generation
    const interval = setInterval(() => {
      const newSignal = calculateSignals();
      setRecentSignals(prev => [newSignal, ...prev].slice(0, 10));
      
      toast({
        title: `New ${newSignal.type.toUpperCase()} Signal`,
        description: `${newSignal.pair} at ${newSignal.price}`,
        variant: newSignal.type === "buy" ? "default" : "destructive",
      });
    }, 8000);
    
    return () => clearInterval(interval);
  }, [isLive]);
  
  const toggleLiveMode = () => {
    setIsLive(!isLive);
    if (!isLive) {
      toast({
        title: "Live mode activated",
        description: "You will now receive real-time trading signals",
      });
    }
  };
  
  const latestSignal = recentSignals[0];

  return (
    <div className="flex flex-col p-4 min-h-screen animate-fade-in">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Signal Bot</h1>
          <p className="text-sm text-muted-foreground">Trading Assistant</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isConnected ? "default" : "outline"} className="animate-pulse-gentle">
            {isConnected ? "Connected" : "Connecting..."}
          </Badge>
          <div className="flex items-center space-x-1">
            <Switch
              id="live-mode"
              checked={isLive}
              onCheckedChange={toggleLiveMode}
              disabled={!isConnected}
            />
            <label htmlFor="live-mode" className="text-xs font-medium">
              Live
            </label>
          </div>
        </div>
      </header>
      
      {isConnected && latestSignal && (
        <Card className="mb-6 overflow-hidden border-0 shadow-md animate-slide-in">
          <div className={`h-1 ${latestSignal.type === 'buy' ? 'bg-signal-buy' : 'bg-signal-sell'}`}></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Latest Signal</CardTitle>
            <CardDescription>{new Date().toLocaleTimeString()}</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className={`mr-2 p-2 rounded-full ${latestSignal.type === 'buy' 
                  ? 'bg-signal-buy/10 text-signal-buy' 
                  : 'bg-signal-sell/10 text-signal-sell'}`}
                >
                  {latestSignal.type === 'buy' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                </div>
                <div>
                  <p className="font-semibold">{latestSignal.pair}</p>
                  <p className="text-sm text-muted-foreground">{latestSignal.indicator}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-semibold">${latestSignal.price}</p>
                <p className={`text-sm ${latestSignal.type === 'buy' ? 'text-signal-buy' : 'text-signal-sell'}`}>
                  {latestSignal.type === 'buy' ? 'BUY' : 'SELL'} Signal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <main className="flex-1">
        <Tabs defaultValue="signals" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 h-10">
            <TabsTrigger value="signals" className="text-xs">
              <BarChart3 size={14} className="mr-1.5" />
              Signals
            </TabsTrigger>
            <TabsTrigger value="chart" className="text-xs">
              <TrendingUp size={14} className="mr-1.5" />
              Chart
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs">
              <History size={14} className="mr-1.5" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <Settings size={14} className="mr-1.5" />
              Setup
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="signals" className="space-y-4 animate-fade-in">
            <div className="grid gap-3">
              {isConnected ? (
                recentSignals.length > 0 ? (
                  recentSignals.map((signal, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm"
                    >
                      <div className="flex items-center">
                        <div className={`mr-2 p-1.5 rounded-full ${signal.type === 'buy' 
                          ? 'bg-signal-buy/10 text-signal-buy' 
                          : 'bg-signal-sell/10 text-signal-sell'}`}
                        >
                          {signal.type === 'buy' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        </div>
                        <div>
                          <p className="font-medium">{signal.pair}</p>
                          <p className="text-xs text-muted-foreground">{signal.timestamp}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono">${signal.price}</p>
                        <p className={`text-xs ${signal.type === 'buy' ? 'text-signal-buy' : 'text-signal-sell'}`}>
                          {signal.indicator}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">No signals yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Turn on Live mode to receive signals
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">Connecting to trading platform...</p>
                </div>
              )}
            </div>
            
            <Button 
              variant="default" 
              className="w-full"
              disabled={!isConnected || recentSignals.length === 0}
              onClick={() => {
                setActiveTab("chart");
                toast({
                  title: "Viewing chart",
                  description: "Displaying latest signal on chart",
                });
              }}
            >
              <Eye size={16} className="mr-2" />
              View on Chart
            </Button>
          </TabsContent>
          
          <TabsContent value="chart" className="animate-fade-in">
            <TradingView signal={latestSignal} />
          </TabsContent>
          
          <TabsContent value="history" className="animate-fade-in">
            <SignalHistory signals={recentSignals} />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 animate-fade-in">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Indicator Settings</h3>
                <IndicatorSettings />
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Strategy Guides</h3>
                <StrategyGuides />
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full" onClick={() => {
                  toast({
                    title: "Guides Downloaded",
                    description: "All strategy guides have been saved",
                  });
                }}>
                  <Download size={14} className="mr-2" />
                  Download All Guides
                </Button>
              </div>
              
              <Separator />
              
              <div className="rounded-lg border p-3 bg-muted/40">
                <p className="text-xs text-muted-foreground">
                  <strong>Disclaimer:</strong> Trading signals are for educational purposes only. 
                  Always conduct your own research before making investment decisions.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="mt-6 pt-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          Signal Bot v1.0 — For educational purposes only
        </p>
      </footer>
    </div>
  );
};

export default Index;
