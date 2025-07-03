import { Link, useLocation } from "wouter";
import { Sprout, Plus, User, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import AddTeacherModal from "./add-teacher-modal";
import AddSchoolModal from "./add-school-modal";

interface HeaderProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

export default function Header({ searchTerm = "", onSearchChange, searchPlaceholder, showFilters = false, onToggleFilters }: HeaderProps) {
  const [location] = useLocation();
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);

  const isTeachersActive = location === "/" || location === "/teachers" || location.startsWith("/teacher/");
  const isSchoolsActive = location === "/schools" || location.startsWith("/school/");

  const handleAddNew = () => {
    if (isTeachersActive) {
      setShowAddTeacherModal(true);
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
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Sprout className="text-wildflower-green h-8 w-8 mr-2" />
                <span className="text-xl font-bold text-slate-900">Wildflower Schools</span>
              </div>
              <nav className="ml-8 flex space-x-8">
                <Link href="/teachers" className={`px-1 pb-4 text-sm font-medium border-b-2 transition-colors ${
                  isTeachersActive
                    ? "wildflower-blue border-wildflower-blue"
                    : "text-slate-500 hover:text-slate-700 border-transparent"
                }`}>
                  Teachers
                </Link>
                <Link href="/schools" className={`px-1 pb-4 text-sm font-medium border-b-2 transition-colors ${
                  isSchoolsActive
                    ? "wildflower-blue border-wildflower-blue"
                    : "text-slate-500 hover:text-slate-700 border-transparent"
                }`}>
                  Schools
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {onSearchChange && (
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={getSearchPlaceholder()}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-64 pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              )}
              {onToggleFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleFilters}
                  className={`${showFilters ? 'bg-slate-100' : ''}`}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              )}
              <Button 
                onClick={handleAddNew}
                className="bg-wildflower-blue hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <AddTeacherModal 
        open={showAddTeacherModal} 
        onOpenChange={setShowAddTeacherModal}
      />
      <AddSchoolModal 
        open={showAddSchoolModal} 
        onOpenChange={setShowAddSchoolModal}
      />
    </>
  );
}
