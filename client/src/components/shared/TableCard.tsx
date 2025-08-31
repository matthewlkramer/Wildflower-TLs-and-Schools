import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TableCardProps {
  title: string;
  description?: string;
  actionsRight?: React.ReactNode;
  children: React.ReactNode; // table/grid content
}

export function TableCard({ title, description, actionsRight, children }: TableCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {actionsRight}
        </div>
      </div>
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  );
}

