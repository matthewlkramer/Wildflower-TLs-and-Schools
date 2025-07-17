import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, createContext, useContext, useEffect } from "react";
import { addNewEmitter } from "@/lib/add-new-emitter";
import Header from "@/components/header";
import { TourLauncher } from "@/components/interactive-tour";
import { UserFilterProvider } from "@/contexts/user-filter-context";

import Dashboard from "@/pages/dashboard";
import Teachers from "@/pages/teachers";
import Schools from "@/pages/schools";
import Charters from "@/pages/charters";
import LoansPage from "@/pages/loans";
import LoanOrigination from "@/pages/loan-origination";
import LoanDetail from "@/pages/loan-detail";
import ACHSetup from "@/pages/ach-setup";
import ACHSetupComplete from "@/pages/ach-setup-complete";
import TeacherDetail from "@/pages/teacher-detail";
import SchoolDetail from "@/pages/school-detail";
import CharterDetail from "@/pages/charter-detail";
import NotFound from "@/pages/not-found";

// Create a context for search functionality
const SearchContext = createContext<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}>({
  searchTerm: "",
  setSearchTerm: () => {},
});

// Create a context for page title functionality
const PageTitleContext = createContext<{
  pageTitle: string;
  setPageTitle: (title: string) => void;
}>({
  pageTitle: "",
  setPageTitle: () => {},
});

// Create a context for Add New functionality
const AddNewContext = createContext<{
  addNewOptions: Array<{ label: string; onClick: () => void; }>;
  setAddNewOptions: (options: Array<{ label: string; onClick: () => void; }>) => void;
}>({
  addNewOptions: [],
  setAddNewOptions: () => {},
});

export const useSearch = () => useContext(SearchContext);
export const usePageTitle = () => useContext(PageTitleContext);
export const useAddNew = () => useContext(AddNewContext);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/teachers" component={Teachers} />
      <Route path="/teacher/:id" component={TeacherDetail} />
      <Route path="/schools" component={Schools} />
      <Route path="/school/:id" component={SchoolDetail} />
      <Route path="/charters" component={Charters} />
      <Route path="/charter/:id" component={CharterDetail} />
      <Route path="/loans" component={LoansPage} />
      <Route path="/loans/:id" component={LoanDetail} />
      <Route path="/loan-origination" component={LoanOrigination} />
      <Route path="/ach-setup/:loanId" component={ACHSetup} />
      <Route path="/ach-setup-complete" component={ACHSetupComplete} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [addNewOptions, setAddNewOptions] = useState<Array<{ label: string; onClick: () => void; }>>([]);
  
  // Listen to add new options changes
  useEffect(() => {
    const handleOptionsChanged = (e: CustomEvent) => {
      setAddNewOptions(e.detail);
    };
    
    addNewEmitter.addEventListener('optionsChanged', handleOptionsChanged as EventListener);
    
    return () => {
      addNewEmitter.removeEventListener('optionsChanged', handleOptionsChanged as EventListener);
    };
  }, []);
  

  


  // Reset search when navigating between pages
  const isDashboardActive = location === "/" || location === "/dashboard";
  const isTeachersActive = location === "/teachers" || location.startsWith("/teacher/");
  const isSchoolsActive = location === "/schools" || location.startsWith("/school/");
  const isChartersActive = location === "/charters" || location.startsWith("/charter/");

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
        <AddNewContext.Provider value={{ addNewOptions, setAddNewOptions }}>
          <div className="min-h-screen bg-slate-50">
            <Header 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm}
              addNewOptions={addNewOptions}
              setAddNewOptions={setAddNewOptions}
            />
            <Router />
            <TourLauncher />
            <Toaster />
          </div>
        </AddNewContext.Provider>
      </PageTitleContext.Provider>
    </SearchContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserFilterProvider>
          <AppContent />
        </UserFilterProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
