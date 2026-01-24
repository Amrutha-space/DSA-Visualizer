import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface VisualizerCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  controls?: ReactNode;
}

const VisualizerCard = ({ 
  title, 
  description, 
  children, 
  className,
  controls 
}: VisualizerCardProps) => {
  return (
    <div className={cn(
      "glass-card rounded-3xl overflow-hidden animate-fade-in",
      className
    )}>
      <div className="p-6 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {controls && (
            <div className="flex flex-wrap items-center gap-2">
              {controls}
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default VisualizerCard;
