
import React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface TestModeIndicatorProps {
  className?: string; // Prop to accept external classes
}

const TestModeIndicator: React.FC<TestModeIndicatorProps> = ({ className }) => {
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        // Apply incoming classes first (these should include fixed, top, left, right, z-index)
        className,
        // Then apply internal styles that define the bar's look and content centering
        "flex items-center justify-center gap-2 bg-[#8B5CF6] px-3 py-1.5 text-white text-xs font-medium"
        // Removed w-full from here as left/right/fixed from className handle width
      )}
    >
      <AlertTriangle className="h-3.5 w-3.5" />
      <span className="font-benzin tracking-wide">{t("testModeIndicator")}</span>
    </div>
  );
};

export default TestModeIndicator;
