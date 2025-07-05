import { Link, useLocation } from "wouter";
import { Plus, User, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import AddEducatorModal from "./add-teacher-modal";
import AddSchoolModal from "./add-school-modal";
import { WildflowerLogo } from "./wildflower-logo";

interface HeaderProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  onAddNew?: () => void;
  addNewOptions?: Array<{ label: string; onClick: () => void; }>;
}

export default function Header({ searchTerm = "", onSearchChange, searchPlaceholder, showFilters = false, onToggleFilters, onAddNew, addNewOptions }: HeaderProps) {
  const [location] = useLocation();
  const [showAddEducatorModal, setShowAddEducatorModal] = useState(false);
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);

  const isTeachersActive = location === "/" || location === "/teachers" || location.startsWith("/teacher/");
  const isSchoolsActive = location === "/schools" || location.startsWith("/school/");

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew();
    } else if (isTeachersActive) {
      setShowAddEducatorModal(true);
    } else if (isSchoolsActive) {
      setShowAddSchoolModal(true);
    }
  };

  const getSearchPlaceholder = () => {
    if (searchPlaceholder) return searchPlaceholder;
    if (isTeachersActive) return "Search teachers...";
    if (isSchoolsActive) return "Search schools...";
    return "Search...";
  };



  return (
    <>
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo - Always visible and protected from overlap */}
            <div className="flex-shrink-0 flex items-center min-w-0 mr-4">
              <WildflowerLogo className="h-10 w-auto" />
            </div>
            
            {/* Right side content - allow horizontal overflow on mobile */}
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 ml-auto overflow-x-auto">
              {/* Navigation - always visible, compact on mobile */}
              <nav className="flex space-x-3 sm:space-x-4 lg:space-x-8 flex-shrink-0">
                <Link href="/teachers" className={`px-1 pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isTeachersActive
                    ? "text-wildflower-blue border-wildflower-blue"
                    : "text-slate-500 hover:text-slate-700 border-transparent"
                }`}>
                  Teachers
                </Link>
                <Link href="/schools" className={`px-1 pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isSchoolsActive
                    ? "text-wildflower-blue border-wildflower-blue"
                    : "text-slate-500 hover:text-slate-700 border-transparent"
                }`}>
                  Schools
                </Link>
              </nav>
              
              {/* Search and Actions */}
              <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                {onSearchChange && (
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder={getSearchPlaceholder()}
                      value={searchTerm}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="w-32 sm:w-48 lg:w-64 pl-10"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  </div>
                )}

                {addNewOptions && addNewOptions.length > 0 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        className="bg-wildflower-blue hover:bg-blue-700 text-white flex-shrink-0"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Add New</span>
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {addNewOptions.map((option, index) => (
                        <DropdownMenuItem key={index} onClick={option.onClick}>
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    onClick={handleAddNew}
                    className="bg-wildflower-blue hover:bg-blue-700 text-white flex-shrink-0"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add New</span>
                  </Button>
                )}
                <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AddEducatorModal 
        open={showAddEducatorModal} 
        onOpenChange={setShowAddEducatorModal}
      />
      <AddSchoolModal 
        open={showAddSchoolModal} 
        onOpenChange={setShowAddSchoolModal}
      />
    </>
  );
}
