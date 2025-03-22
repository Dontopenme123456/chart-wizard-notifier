
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BookOpen, FileText, Download } from "lucide-react";
import { getDefaultStrategyGuides } from "@/lib/indicators";
import { StrategyGuideType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const StrategyGuideCard = ({ guide }: { guide: StrategyGuideType }) => {
  const { toast } = useToast();
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <AspectRatio ratio={16/9} className="bg-muted">
        <img 
          src={guide.imageUrl} 
          alt={guide.title}
          className="object-cover w-full h-full transition-all hover:scale-105"
        />
      </AspectRatio>
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-base">{guide.title}</CardTitle>
        <CardDescription className="text-xs">{guide.description}</CardDescription>
      </CardHeader>
      <CardFooter className="p-3 pt-0 mt-auto">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <FileText size={14} className="mr-2" />
              View Guide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{guide.title}</DialogTitle>
              <DialogDescription>{guide.description}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/40 rounded-md">
              <BookOpen className="text-muted-foreground mb-2" size={32} />
              <p className="text-muted-foreground">Preview not available in demo</p>
              <p className="text-xs text-muted-foreground mt-1">PDF would be displayed here in the actual extension</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => {
                  toast({
                    title: "Guide Downloaded",
                    description: `${guide.title} has been saved to your device`,
                  });
                }}
              >
                <Download size={14} className="mr-2" />
                Download PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

const StrategyGuides = () => {
  const guides = getDefaultStrategyGuides();
  
  return (
    <div className="grid grid-cols-1 gap-4">
      {guides.map((guide) => (
        <StrategyGuideCard key={guide.id} guide={guide} />
      ))}
    </div>
  );
};

export default StrategyGuides;
