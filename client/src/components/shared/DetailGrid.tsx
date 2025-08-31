import React from "react";

interface DetailGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 2 | 3; // default 2
}

export function DetailGrid({ children, className = "", columns = 2 }: DetailGridProps) {
  const colsClass = columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2';
  return (
    <div className={`grid grid-cols-1 ${colsClass} gap-6 ${className}`.trim()}>
      {children}
    </div>
  );
}

