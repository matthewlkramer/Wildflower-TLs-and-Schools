import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { getStatusColor } from "@/lib/utils";

export const BadgeRenderer = ({ value, field }: { value: string | string[]; field?: string }) => {
  if (!value) return null;
  
  const values = Array.isArray(value) ? value : [value];
  
  const getFieldColor = (val: string, fieldName?: string) => {
    if (fieldName === 'montessoriCertified') {
      return val?.toLowerCase() === 'yes' 
        ? 'bg-green-100 text-green-800 border-green-200' 
        : 'bg-gray-100 text-gray-800 border-gray-200';
    }
    
    if (fieldName === 'discoveryStatus') {
      const status = val?.toLowerCase();
      if (status === 'complete') return 'bg-green-100 text-green-800 border-green-200';
      if (status === 'in process' || status === 'in progress') return 'bg-green-50 text-green-700 border-green-200';
      if (status === 'paused') return 'bg-gray-100 text-gray-800 border-gray-200';
    }
    
    if (fieldName === 'stageStatus' || fieldName === 'membershipStatus') {
      return getStatusColor(val);
    }
    
    return getStatusColor(val);
  };
  
  return (
    <div className="flex flex-wrap gap-1 items-center h-full">
      {values.map((val, index) => (
        <Badge 
          key={index}
          variant="outline" 
          className={`text-xs ${getFieldColor(val, field)}`}
        >
          {val}
        </Badge>
      ))}
    </div>
  );
};

export const PillRenderer = ({ value }: { value: string | string[] }) => {
  if (!value) return null;
  
  const values = Array.isArray(value) ? value : [value];
  return (
    <div className="flex flex-wrap gap-1 items-center h-full">
      {values.map((val, index) => (
        <span 
          key={index}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
        >
          {val}
        </span>
      ))}
    </div>
  );
};

export const LinkRenderer = ({ value, href, className = "text-blue-600 hover:text-blue-800 hover:underline" }: { 
  value: string; 
  href: string;
  className?: string;
}) => {
  if (!value) return null;
  
  return (
    <Link href={href} className={className}>
      {value}
    </Link>
  );
};

export const StatusBadgeCellRenderer = (params: any) => {
  const value = params.value;
  if (!value) return <span></span>;
  
  return (
    <div className="flex items-center h-full">
      <Badge className={getStatusColor(value)}>
        {value}
      </Badge>
    </div>
  );
};

export const MultiValueCellRenderer = (params: any) => {
  const values = params.value;
  if (!values || !Array.isArray(values) || values.length === 0) {
    return <span></span>;
  }
  
  return (
    <div className="flex flex-wrap gap-1 items-center h-full">
      {values.map((value: string, index: number) => (
        <Badge key={index} variant="outline" className="text-xs">
          {value}
        </Badge>
      ))}
    </div>
  );
};

export const EmailCellRenderer = (params: any) => {
  const email = params.value;
  if (!email) return <span className="text-slate-400">-</span>;
  
  return (
    <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-800 hover:underline">
      {email}
    </a>
  );
};

export const DateCellRenderer = (params: any) => {
  const date = params.value;
  if (!date) return <span className="text-slate-400">-</span>;
  
  try {
    const dateObj = new Date(date);
    return <span>{dateObj.toLocaleDateString()}</span>;
  } catch {
    return <span>{date}</span>;
  }
};