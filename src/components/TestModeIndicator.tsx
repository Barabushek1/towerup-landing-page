
import React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestModeIndicatorProps {
  className?: string;
}

const TestModeIndicator: React.FC<TestModeIndicatorProps> = ({ className }) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-center gap-2 bg-[#8B5CF6] px-3 py-1.5 text-white text-xs font-medium",
        className
      )}
    >
      <AlertTriangle className="h-3.5 w-3.5" />
      <span className="font-benzin tracking-wide">Сайт работает в тестовом режиме</span>
    </div>
  );
};

export default TestModeIndicator;
