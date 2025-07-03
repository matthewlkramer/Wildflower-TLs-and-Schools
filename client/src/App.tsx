import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, createContext, useContext } from "react";
import Header from "@/components/header";
import Teachers from "@/pages/teachers";
import Schools from "@/pages/schools";
import TeacherDetail from "@/pages/teacher-detail";
import SchoolDetail from "@/pages/school-detail";
import NotFound from "@/pages/not-found";

// Create a context for search functionality
const SearchContext = createContext<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}>({
  searchTerm: "",
  setSearchTerm: () => {},
  showFilters: false,
  onToggleFilters: () => {},
});

export const useSearch = () => useContext(SearchContext);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Teachers} />
      <Route path="/teachers" component={Teachers} />
      <Route path="/schools" component={Schools} />
      <Route path="/teacher/:id" component={TeacherDetail} />
      <Route path="/school/:id" component={SchoolDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Reset search when navigating between pages
  const isTeachersActive = location === "/" || location === "/teachers" || location.startsWith("/teacher/");
  const isSchoolsActive = location === "/schools" || location.startsWith("/school/");

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, showFilters, onToggleFilters: handleToggleFilters }}>
      <div className="min-h-screen bg-slate-50">
        <Header 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={handleToggleFilters}
        />
        <Router />
        <Toaster />
      </div>
    </SearchContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
