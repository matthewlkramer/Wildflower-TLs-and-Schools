import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ResizableTableProps {
  children: React.ReactNode;
  className?: string;
}

interface ResizableColumnProps {
  children: React.ReactNode;
  className?: string;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
}

export function ResizableTable({ children, className }: ResizableTableProps) {
  return (
    <div className={cn("relative overflow-auto", className)}>
      <table className="w-full caption-bottom text-sm">
        {children}
      </table>
    </div>
  );
}

export function ResizableTableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <thead className={cn("[&_tr]:border-b", className)}>
      {children}
    </thead>
  );
}

export function ResizableTableBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)}>
      {children}
    </tbody>
  );
}

export function ResizableTableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <tr className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}>
      {children}
    </tr>
  );
}

export function ResizableTableHead({ 
  children, 
  className, 
  minWidth = 100,
  maxWidth = 500,
  defaultWidth = 150
}: ResizableColumnProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const thRef = useRef<HTMLTableCellElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - startXRef.current;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + deltaX));
    setWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <th
      ref={thRef}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground relative select-none",
        className
      )}
      style={{ width: `${width}px`, minWidth: `${minWidth}px`, maxWidth: `${maxWidth}px` }}
    >
      {children}
      <div
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500 hover:opacity-100 opacity-0 transition-opacity"
        onMouseDown={handleMouseDown}
      />
    </th>
  );
}

export function ResizableTableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}>
      {children}
    </td>
  );
}