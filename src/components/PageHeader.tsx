import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, className }) => {
  return (
    <div className={cn("mb-8 w-full px-4 md:px-0", className)}>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};