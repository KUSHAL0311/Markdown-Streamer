import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PaneContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function PaneContainer({ children, className, title, icon, action }: PaneContainerProps) {
  return (
    <div className={cn(
      "flex flex-col h-full bg-card border border-border/50 shadow-sm rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-border",
      className
    )}>
      {(title || action) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-secondary/30 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
            {icon && <span className="text-primary/70">{icon}</span>}
            {title}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="flex-1 overflow-auto relative">
        {children}
      </div>
    </div>
  );
}
