import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X, ZoomIn, ChevronLeft, ChevronRight, Phone, Mail } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from '@/hooks/use-mobile';
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as RovingFocusPrimitive from '@radix-ui/react-roving-focus';
import { cn } from "@/lib/utils";
const floorPlans = {
  "1-комнатные": [{
    id: 1,
    title: "1-комнатная",
    subtitle: "квартира",
    area: "31.01 м²",
    areaLabel: "площадь",
    price: "Цена по запросу",
    monthly: "Узнайте условия у менеджера",
    image: "/assets/Pushkin/14.jpg"
  }, {
    id: 2,
    title: "1-комнатная",
    subtitle: "квартира",
    area: "39.51 м²",
    areaLabel: "площадь",
    price: "Цена по запросу",
    monthly: "Узнайте условия у менеджера",
    image: "/assets/Pushkin/14.jpg"
  }, {
    id: 3,
    title: "1-комнатная",
    subtitle: "квартира",
    area: "35.43 м²",
    areaLabel: "площадь",
    price: "Цена по запросу",
    monthly: "Узнайте условия у менеджера",
    image: "/assets/Pushkin/14.jpg"
  }],
  "2-комнатные": [{
    id: 4,
    title: "2-комнатная",
    subtitle: "квартира",
    area: "58.32 м²",
    areaLabel: "площадь",
    price: "Цена по запросу",
    monthly: "Узнайте условия у менеджера",
    image: "/assets/Pushkin/14.jpg"
  }, {
    id: 5,
    title: "2-комнатная",
    subtitle: "квартира",
    area: "62.45 м²",
    areaLabel: "площадь",
    price: "Цена по запросу",
    monthly: "Узнайте условия у менеджера",
    image: "/assets/Pushkin/14.jpg"
  }, {
    id: 6,
    title: "2-комнатная",
    subtitle: "квартира",
    area: "65.18 м²",
    areaLabel: "площадь",
    price: "Цена по запросу",
    monthly: "Узнайте условия у менеджера",
    image: "/assets/Pushkin/14.jpg"
  }, {
    id: 7,
    title: "2-комнатная",
    subtitle: "квартира",
    area: "60.55 м²",
    areaLabel: "площадь",
    price: "Цена по запросу",
    monthly: "Узнайте условия у менеджера",
    image: "/assets/Pushkin/14.jpg"
  }, {
    id: 8,
    title: "2-комнатная",
    subtitle: "квартира",
    area: "64.37 м²",
    areaLabel: "площадь",
    price: "Цена по запросу",
    monthly: "Узнайте условия у менеджера",
    image: "/assets/Pushkin/14.jpg"
  }],
  "3-комнатные": [{
    id: 9,
    title: "3-комнатная",
    subtitle: "квартира",
    area: "84.76 м²",
    areaLabel: "площадь",
    price: "Цена по запросу",
    monthly: "Узнайте условия у менеджера",
    image: "/assets/Pushkin/14.jpg"
  }, {
    id: 10,
    title: "3-комнатная",
    subtitle: "квартира",
    area: "89.24 м²",
    areaLabel: "площадь",
    price: "Цена по запросу",
    monthly: "Узнайте условия у менеджера",
    image: "/assets/Pushkin/14.jpg"
  }, {
    id: 11,
    title: "3-комнатная",
    subtitle: "квартира",
    area: "93.12 м²",
    areaLabel: "площадь",
    price: "Цена по запросу",
    monthly: "Узнайте условия у менеджера",
    image: "/assets/Pushkin/14.jpg"
  }, {
    id: 12,
    title: "3-комнатная",
    subtitle: "квартира",
    area: "91.55 м²",
    areaLabel: "площадь",
    price: "Цена по запросу",
    monthly: "Узнайте условия у менеджера",
    image: "/assets/Pushkin/14.jpg"
  }, {
    id: 13,
    title: "3-комнатная",
    subtitle: "квартира",
    area: "95.67 м²",
    areaLabel: "площадь",
    price: "Цена по запросу",
    monthly: "Узнайте условия у менеджера",
    image: "/assets/Pushkin/14.jpg"
  }]
};
const FloorPlansSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("1-комнатные");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  const openFullScreenImage = (planId: number) => {
    setSelectedPlan(planId);
    setIsImageOpen(true);
  };
  const getSelectedPlanData = () => {
    if (selectedPlan === null) return null;
    for (const category in floorPlans) {
      const plan = floorPlans[category as keyof typeof floorPlans].find(p => p.id === selectedPlan);
      if (plan) return plan;
    }
    return null;
  };
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -150,
        behavior: 'smooth'
      });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 150,
        behavior: 'smooth'
      });
    }
  };
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const activeElement = container.querySelector(`[data-state="active"]`) as HTMLElement;
    if (activeElement) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      const centerPosition = elementRect.left + elementRect.width / 2 - containerRect.left - containerRect.width / 2;
      container.scrollBy({
        left: centerPosition,
        behavior: 'smooth'
      });
    }
  }, [activeTab]);
  const selectedPlanData = getSelectedPlanData();
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 10
    },
    visible: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -10
    }
  };
  const CustomTabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(({
    className,
    value,
    children,
    ...props
  }, ref) => <TabsPrimitive.Trigger ref={ref} value={value} className={cn("px-5 py-2.5 min-w-[140px] sm:min-w-[160px] text-base font-medium transition-all border rounded-lg shrink-0", "focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus-visible:ring-offset-2", activeTab === value ? "border-brand-primary bg-brand-primary text-white shadow-lg shadow-brand-primary/20" : "border-white/20 bg-[#1a1a1a] text-white hover:bg-[#222] hover:border-brand-primary/40", className)} {...props}>
      {children}
    </TabsPrimitive.Trigger>);
  CustomTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
  return;
};
export default FloorPlansSection;