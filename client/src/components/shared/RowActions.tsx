import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";

interface RowActionsProps<T> {
  item: T;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export function RowActions<T>({ item, onView, onEdit, onDelete }: RowActionsProps<T>) {
  return (
    <div className="flex gap-1">
      {onView && (
        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onView(item); }}>
          <Eye className="h-4 w-4" />
        </Button>
      )}
      {onEdit && (
        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(item); }}>
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDelete(item); }}>
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

