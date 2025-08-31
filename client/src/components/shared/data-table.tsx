import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Edit, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";

export interface TableColumn<T = any> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => any);
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  cell?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  data: T[] | undefined;
  columns: TableColumn<T>[];
  isLoading: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => Promise<void>;
  deleteEndpoint?: (id: string) => string;
  invalidateQueries?: string[];
  itemName?: string;
  detailPath?: (id: string) => string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  isLoading,
  searchable = true,
  searchPlaceholder = "Search...",
  onRowClick,
  onEdit,
  onDelete,
  deleteEndpoint,
  invalidateQueries = [],
  itemName = "item",
  detailPath,
}: DataTableProps<T>) {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteItem, setDeleteItem] = useState<T | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (item: T) => {
      if (onDelete) {
        return onDelete(item);
      }
      if (deleteEndpoint) {
        const response = await fetch(deleteEndpoint(item.id), {
          method: "DELETE",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Failed to delete ${itemName}`);
        }
      }
    },
    onSuccess: () => {
      invalidateQueries.forEach(query => {
        queryClient.invalidateQueries({ queryKey: [query] });
      });
      setDeleteItem(null);
    },
  });

  const handleDelete = (item: T, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteItem(item);
  };

  const handleEdit = (item: T, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(item);
    }
  };

  const handleView = (item: T, e: React.MouseEvent) => {
    e.stopPropagation();
    if (detailPath) {
      navigate(detailPath(item.id));
    }
  };

  const filteredData = data?.filter(item => {
    if (!searchTerm) return true;
    return columns.some(column => {
      const value = typeof column.accessor === 'function' 
        ? column.accessor(item) 
        : item[column.accessor as keyof T];
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {searchable && <Skeleton className="h-10 w-full max-w-sm" />}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map(column => (
                  <TableHead key={column.id}>{column.header}</TableHead>
                ))}
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map(column => (
                    <TableCell key={column.id}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Skeleton className="h-8 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="flex items-center gap-2 max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead 
                  key={column.id}
                  style={{ width: column.width ? `${column.width}px` : undefined }}
                >
                  {column.header}
                </TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow
                  key={item.id}
                  className={onRowClick || detailPath ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map(column => {
                    const value = typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : item[column.accessor as keyof T];
                    
                    return (
                      <TableCell key={column.id}>
                        {column.cell ? column.cell(value, item) : String(value ?? '')}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <div className="flex gap-2">
                      {detailPath && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleView(item, e)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleEdit(item, e)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {(onDelete || deleteEndpoint) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDelete(item, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + 1} 
                  className="h-24 text-center text-muted-foreground"
                >
                  No {itemName}s found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this {itemName}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteItem && deleteMutation.mutate(deleteItem)}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
