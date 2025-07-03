import { useState, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent, FilterChangedEvent } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);
import { Link } from "wouter";
import { Edit, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type Teacher } from "@shared/schema";
import { getStatusColor } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationModal from "./delete-confirmation-modal";
import { useSearch } from "@/App";

interface TeachersGridProps {
  teachers: Teacher[];
  isLoading: boolean;
}

interface FilterState {
  [key: string]: string[] | string;
}

// Custom filter components
const TextFilter = ({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) => {
  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 text-xs"
    />
  );
};

const MultiSelectFilter = ({ 
  value, 
  onChange, 
  options, 
  placeholder 
}: { 
  value: string[]; 
  onChange: (value: string[]) => void; 
  options: string[]; 
  placeholder: string;
}) => {
  const [open, setOpen] = useState(false);
  
  const handleToggle = (option: string) => {
    const newValue = value.includes(option) 
      ? value.filter(v => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  const displayText = value.length === 0 ? placeholder : `${value.length} selected`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-8 w-full justify-between text-xs px-2"
          onClick={() => setOpen(!open)}
        >
          <span className="truncate">{displayText}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is-blank"
              checked={value.includes('__BLANK__')}
              onCheckedChange={(checked) => handleToggle('__BLANK__')}
            />
            <label htmlFor="is-blank" className="text-xs">Is blank</label>
          </div>
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={value.includes(option)}
                onCheckedChange={(checked) => handleToggle(option)}
              />
              <label htmlFor={option} className="text-xs">{option}</label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Custom cell renderers
const NameCellRenderer = (params: any) => {
  const teacher = params.data;
  return (
    <Link href={`/teacher/${teacher.id}`}>
      <div className="flex items-center cursor-pointer hover:bg-slate-50 p-1 rounded">
        <div className="font-medium text-slate-900">{teacher.fullName}</div>
      </div>
    </Link>
  );
};

const BadgeCellRenderer = (params: any) => {
  const value = params.value;
  if (!value) return <span></span>;
  
  return (
    <Badge className={getStatusColor(value)}>
      {value}
    </Badge>
  );
};

const DiscoveryStatusCellRenderer = (params: any) => {
  const value = params.value;
  if (!value) return <span></span>;
  
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  
  if (value.toLowerCase() === "complete") {
    bgColor = "bg-green-100";
    textColor = "text-green-800";
  } else if (value.toLowerCase() === "in process") {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-800";
  } else if (value.toLowerCase() === "paused") {
    bgColor = "bg-red-100";
    textColor = "text-red-800";
  }
  
  return (
    <Badge className={`${bgColor} ${textColor} border-transparent`}>
      {value}
    </Badge>
  );
};

const CurrentSchoolCellRenderer = (params: any) => {
  const values = params.value;
  if (!values || !Array.isArray(values) || values.length === 0) {
    return <span></span>;
  }
  
  return (
    <span className="text-slate-900">
      {values.join(", ")}
    </span>
  );
};

const BooleanCellRenderer = (params: any) => {
  const value = params.value;
  return (
    <Badge variant={value ? "default" : "secondary"}>
      {value ? 'Yes' : 'No'}
    </Badge>
  );
};

const MultiValueCellRenderer = (params: any) => {
  const values = params.value;
  if (!values || !Array.isArray(values) || values.length === 0) {
    return <span></span>;
  }
  
  return (
    <div className="flex flex-wrap gap-1">
      {values.map((value: string, index: number) => (
        <Badge key={index} variant="outline" className="text-xs">
          {value}
        </Badge>
      ))}
    </div>
  );
};

const ActionsCellRenderer = (params: any) => {
  const teacher = params.data;
  
  return (
    <div className="flex space-x-1">
      <Link href={`/teacher/${teacher.id}`}>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Edit className="h-3 w-3" />
        </Button>
      </Link>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
        onClick={() => {
          // This would trigger delete - you can add the handler here
          console.log('Delete teacher:', teacher.id);
        }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default function TeachersGrid({ teachers, isLoading }: TeachersGridProps) {
  const { toast } = useToast();
  const { showFilters } = useSearch();
  console.log('showFilters in TeachersGrid:', showFilters);
  const [filters, setFilters] = useState<FilterState>({});
  
  // Get unique values for filter dropdowns
  const getUniqueValues = (field: string) => {
    const values = new Set<string>();
    teachers.forEach(teacher => {
      const value = teacher[field as keyof Teacher];
      if (Array.isArray(value)) {
        value.forEach(v => values.add(v));
      } else if (value && typeof value === 'string') {
        values.add(value);
      }
    });
    return Array.from(values).sort();
  };

  // Apply filters to teachers data
  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher => {
      return Object.entries(filters).every(([field, filterValue]) => {
        if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) {
          return true;
        }

        const teacherValue = teacher[field as keyof Teacher];

        if (Array.isArray(filterValue)) {
          // Multi-select filter
          if (filterValue.includes('__BLANK__') && (!teacherValue || (Array.isArray(teacherValue) && teacherValue.length === 0))) {
            return true;
          }
          
          if (Array.isArray(teacherValue)) {
            return filterValue.some(fv => fv !== '__BLANK__' && teacherValue.includes(fv));
          } else if (teacherValue) {
            // Handle boolean values for multi-select filters
            const stringValue = typeof teacherValue === 'boolean' ? (teacherValue ? 'Yes' : 'No') : String(teacherValue);
            return filterValue.includes(stringValue);
          }
          return false;
        } else {
          // Text filter
          let textValue = '';
          if (Array.isArray(teacherValue)) {
            textValue = teacherValue.join(' ');
          } else if (typeof teacherValue === 'boolean') {
            textValue = teacherValue ? 'Yes' : 'No';
          } else {
            textValue = String(teacherValue || '');
          }
          const filterStr = String(filterValue || '');
          return textValue.toLowerCase().includes(filterStr.toLowerCase());
        }
      });
    });
  }, [teachers, filters]);

  // Debug logging
  console.log('TeachersGrid received:', { teachers, isLoading, count: teachers?.length });
  console.log('Current filters:', filters);
  console.log('Filtered teachers count:', filteredTeachers?.length);

  const handleFilterChange = (field: string, value: string | string[]) => {
    console.log('Filter change:', field, value);
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const columnDefs: ColDef[] = [
    {
      field: "fullName",
      headerName: "Full Name",
      width: 200,
      cellRenderer: NameCellRenderer,
      filter: false,
    },
    {
      field: "currentlyActiveSchool",
      headerName: "Current School",
      width: 180,
      cellRenderer: CurrentSchoolCellRenderer,
      filter: false,
    },
    {
      field: "startupStageForActiveSchool",
      headerName: "School Stage Status",
      width: 160,
      cellRenderer: MultiValueCellRenderer,
      filter: false,
    },
    {
      field: "currentRole",
      headerName: "Current Role",
      width: 140,
      cellRenderer: MultiValueCellRenderer,
      filter: false,
    },
    {
      field: "montessoriCertified",
      headerName: "Montessori Certified",
      width: 140,
      cellRenderer: BooleanCellRenderer,
      filter: false,
    },
    {
      field: "raceEthnicity",
      headerName: "Race/Ethnicity",
      width: 180,
      cellRenderer: MultiValueCellRenderer,
      filter: false,
    },
    {
      field: "discoveryStatus",
      headerName: "Discovery Status",
      width: 140,
      cellRenderer: DiscoveryStatusCellRenderer,
      filter: false,
    },
    {
      field: "individualType",
      headerName: "Individual Type",
      width: 140,
      cellRenderer: BadgeCellRenderer,
      filter: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      resizable: false,
    },
  ];

  const defaultColDef: ColDef = {
    sortable: true,
    filter: false,
    resizable: true,
    floatingFilter: false,
  };

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  if (isLoading) {
    return (
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-slate-500">Loading teachers...</div>
        </div>
      </div>
    );
  }

  // Define filter row components for each column
  const renderFilterRow = () => {
    if (!showFilters) return null;

    return (
      <div className="border-b border-slate-200 bg-slate-50 p-2">
        <div className="flex gap-2 items-center" style={{ paddingLeft: '12px' }}>
          <div style={{ width: '200px' }}>
            <TextFilter
              value={filters.fullName as string || ''}
              onChange={(value) => handleFilterChange('fullName', value)}
              placeholder="Filter names..."
            />
          </div>
          <div style={{ width: '180px' }}>
            <TextFilter
              value={filters.currentlyActiveSchool as string || ''}
              onChange={(value) => handleFilterChange('currentlyActiveSchool', value)}
              placeholder="Filter schools..."
            />
          </div>
          <div style={{ width: '160px' }}>
            <MultiSelectFilter
              value={filters.startupStageForActiveSchool as string[] || []}
              onChange={(value) => handleFilterChange('startupStageForActiveSchool', value)}
              options={getUniqueValues('startupStageForActiveSchool')}
              placeholder="Stage..."
            />
          </div>
          <div style={{ width: '140px' }}>
            <MultiSelectFilter
              value={filters.currentRole as string[] || []}
              onChange={(value) => handleFilterChange('currentRole', value)}
              options={getUniqueValues('currentRole')}
              placeholder="Role..."
            />
          </div>
          <div style={{ width: '140px' }}>
            <MultiSelectFilter
              value={filters.montessoriCertified as string[] || []}
              onChange={(value) => handleFilterChange('montessoriCertified', value)}
              options={['Yes', 'No']}
              placeholder="Certified..."
            />
          </div>
          <div style={{ width: '180px' }}>
            <MultiSelectFilter
              value={filters.raceEthnicity as string[] || []}
              onChange={(value) => handleFilterChange('raceEthnicity', value)}
              options={getUniqueValues('raceEthnicity')}
              placeholder="Race/Ethnicity..."
            />
          </div>
          <div style={{ width: '140px' }}>
            <MultiSelectFilter
              value={filters.discoveryStatus as string[] || []}
              onChange={(value) => handleFilterChange('discoveryStatus', value)}
              options={getUniqueValues('discoveryStatus')}
              placeholder="Status..."
            />
          </div>
          <div style={{ width: '140px' }}>
            <MultiSelectFilter
              value={filters.individualType as string[] || []}
              onChange={(value) => handleFilterChange('individualType', value)}
              options={getUniqueValues('individualType')}
              placeholder="Type..."
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {renderFilterRow()}
      <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          rowData={filteredTeachers}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          animateRows={true}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          enableBrowserTooltips={true}
        />
      </div>
    </div>
  );
}