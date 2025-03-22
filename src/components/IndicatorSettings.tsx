
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getDefaultIndicators } from "@/lib/indicators";
import { IndicatorType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const IndicatorSettings = () => {
  const { toast } = useToast();
  const [indicators, setIndicators] = useState<IndicatorType[]>(getDefaultIndicators());
  
  const handleToggleIndicator = (id: string) => {
    setIndicators(indicators.map(indicator => 
      indicator.id === id 
        ? { ...indicator, enabled: !indicator.enabled } 
        : indicator
    ));
    
    const indicator = indicators.find(i => i.id === id);
    
    if (indicator) {
      toast({
        title: `${indicator.name} ${!indicator.enabled ? 'enabled' : 'disabled'}`,
        description: !indicator.enabled 
          ? `You will now receive ${indicator.name} signals` 
          : `You will no longer receive ${indicator.name} signals`,
      });
    }
  };
  
  const handleUpdateSetting = (
    indicatorId: string, 
    settingKey: string, 
    value: number
  ) => {
    setIndicators(indicators.map(indicator => 
      indicator.id === indicatorId 
        ? { 
            ...indicator, 
            settings: { 
              ...indicator.settings, 
              [settingKey]: value 
            } 
          } 
        : indicator
    ));
  };
  
  const handleResetSettings = () => {
    setIndicators(getDefaultIndicators());
    toast({
      title: "Settings reset",
      description: "All indicator settings have been reset to defaults",
    });
  };
  
  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {indicators.map((indicator) => (
          <AccordionItem value={indicator.id} key={indicator.id} className="border-b">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Switch 
                  id={`toggle-${indicator.id}`}
                  checked={indicator.enabled}
                  onCheckedChange={() => handleToggleIndicator(indicator.id)}
                />
                <AccordionTrigger className="hover:no-underline py-0 -my-2">
                  <label 
                    htmlFor={`toggle-${indicator.id}`}
                    className={`text-sm font-medium ${!indicator.enabled ? 'text-muted-foreground' : ''}`}
                  >
                    {indicator.name}
                  </label>
                </AccordionTrigger>
              </div>
            </div>
            <AccordionContent>
              <div className="pt-2 pb-1 text-xs text-muted-foreground">
                {indicator.description}
              </div>
              
              {indicator.settings && Object.entries(indicator.settings).map(([key, value]) => (
                <div key={key} className="my-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded">
                      {typeof value === 'number' ? value : ''}
                    </span>
                  </div>
                  
                  {typeof value === 'number' && (
                    <Slider
                      disabled={!indicator.enabled}
                      value={[value]}
                      min={key.includes('Period') ? 1 : key === 'stdDev' ? 1 : 0}
                      max={key.includes('Period') ? 200 : key === 'stdDev' ? 4 : 100}
                      step={key.includes('Period') ? 1 : key === 'stdDev' ? 0.1 : 1}
                      onValueChange={([newValue]) => 
                        handleUpdateSetting(indicator.id, key, newValue)
                      }
                    />
                  )}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-2"
        onClick={handleResetSettings}
      >
        Reset to Defaults
      </Button>
    </div>
  );
};

export default IndicatorSettings;
