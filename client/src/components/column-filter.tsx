import { useState, useEffect } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface ColumnFilterProps {
  column: string;
  data: any[];
  fieldKey: string;
  filterValues: string[];
  onFilterChange: (column: string, values: string[]) => void;
  isMultiValue?: boolean;
}

export default function ColumnFilter({
  column,
  data,
  fieldKey,
  filterValues,
  onFilterChange,
  isMultiValue = false,
}: ColumnFilterProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Extract unique values from the data
  const getUniqueValues = () => {
    const values = new Set<string>();
    
    data.forEach((item) => {
      const fieldValue = item[fieldKey];
      
      if (fieldValue === null || fieldValue === undefined || fieldValue === "") {
        values.add("(Empty)");
      } else if (isMultiValue && Array.isArray(fieldValue)) {
        fieldValue.forEach((val) => {
          if (val && val.trim()) {
            values.add(val.trim());
          }
        });
      } else if (typeof fieldValue === "string" && fieldValue.trim()) {
        values.add(fieldValue.trim());
      } else if (typeof fieldValue === "boolean") {
        values.add(fieldValue.toString());
      } else if (fieldValue) {
        values.add(fieldValue.toString());
      }
    });

    return Array.from(values).sort();
  };

  const uniqueValues = getUniqueValues();
  const filteredValues = uniqueValues.filter(value =>
    value.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleValueToggle = (value: string) => {
    const newFilterValues = filterValues.includes(value)
      ? filterValues.filter(v => v !== value)
      : [...filterValues, value];
    
    onFilterChange(column, newFilterValues);
  };

  const selectAll = () => {
    onFilterChange(column, [...uniqueValues]);
  };

  const clearAll = () => {
    onFilterChange(column, []);
  };

  const hasActiveFilters = filterValues.length > 0 && filterValues.length < uniqueValues.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 w-6 p-0 ${hasActiveFilters ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <Filter className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3 py-2">
            <Filter className="h-4 w-4 mr-2 text-slate-500" />
            <span className="text-sm font-medium">Filter {column}</span>
          </div>
          
          <CommandInput
            placeholder="Search values..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="border-none focus:ring-0"
          />

          <div className="flex items-center justify-between px-3 py-2 border-b">
            <Button
              variant="ghost"
              size="sm"
              onClick={selectAll}
              className="h-6 text-xs"
            >
              Select All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-6 text-xs"
            >
              Clear All
            </Button>
          </div>

          <CommandList className="max-h-48">
            <CommandEmpty>No values found.</CommandEmpty>
            <CommandGroup>
              {filteredValues.map((value) => (
                <CommandItem
                  key={value}
                  className="flex items-center space-x-2 cursor-pointer"
                  onSelect={() => handleValueToggle(value)}
                >
                  <Checkbox
                    checked={filterValues.includes(value)}
                    onChange={() => handleValueToggle(value)}
                  />
                  <span className="text-sm">{value}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}