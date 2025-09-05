import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, createContext, useEffect, useMemo, useContext } from "react";
import Header from "@/components/header";
import { TourLauncher } from "@/components/interactive-tour";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { UserFilterProvider } from "@/contexts/user-filter-context";
import { initAgGridEnterprise } from "@/lib/ag-grid-enterprise";

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
import Settings from "@/pages/settings";
import GoogleSyncPage from "@/pages/google-sync";
import LoginPage from "@/pages/login";
import ResetPasswordPage from "@/pages/reset";
import ComposeEmailPage from "@/pages/compose-email";

// Use a shared search context to avoid module duplication issues
import { SearchContext } from "@/contexts/search-context";

// Create a context for page title functionality
const PageTitleContext = createContext<{
  pageTitle: string;
  setPageTitle: (title: string) => void;
}>({
  pageTitle: "",
  setPageTitle: () => {},
});

export const usePageTitle = () => useContext(PageTitleContext);
// Removed Add New context; header shows a fixed Add menu.

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [loc, navigate] = useLocation();
  const isAuthFree = loc === '/login' || loc.startsWith('/reset');

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && !isAuthFree) navigate('/login', { replace: true });
    if (isAuthenticated && loc === '/login') navigate('/', { replace: true });
  }, [isAuthenticated, isLoading, loc, navigate, isAuthFree]);

  // During auth check, or when redirecting unauthenticated users, avoid rendering target routes
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading...
      </div>
    );
  }
  if (!isAuthenticated && !isAuthFree) {
    return <LoginPage />;
  }

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/reset" component={ResetPasswordPage} />
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
      <Route path="/settings" component={Settings} />
      <Route path="/google-sync" component={GoogleSyncPage} />
      <Route path="/compose-email" component={ComposeEmailPage} />
      <Route path="/ach-setup/:loanId" component={ACHSetup} />
      <Route path="/ach-setup-complete" component={ACHSetupComplete} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  // Initialize AG Grid Enterprise (license + modules) if available
  initAgGridEnterprise();
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  
  

  


  // Helpers to determine top-level section (dashboard/teachers/schools/charters/loans)
  const sectionFor = (path: string) => {
    if (path === "/" || path.startsWith("/dashboard")) return "dashboard";
    if (path.startsWith("/teachers") || path.startsWith("/teacher/")) return "teachers";
    if (path.startsWith("/schools") || path.startsWith("/school/")) return "schools";
    if (path.startsWith("/charters") || path.startsWith("/charter/")) return "charters";
    if (path.startsWith("/loans") || path.startsWith("/loan/")) return "loans";
    return "other";
  };

  // Clear search only when switching between top-level sections
  const [prevSection, setPrevSection] = useState(sectionFor(location));
  useEffect(() => {
    const currentSection = sectionFor(location);
    if (prevSection && prevSection !== currentSection) {
      setSearchTerm("");
    }
    setPrevSection(currentSection);
  }, [location, prevSection]);

  const searchContextValue = useMemo(() => ({ 
    searchTerm, 
    setSearchTerm 
  }), [searchTerm]);

  // Debug search term changes reliably
  useEffect(() => {
    try { console.log('[App] searchTerm:', searchTerm); } catch {}
  }, [searchTerm]);

  // Debug section changes and resets
  useEffect(() => {
    try { console.log('[App] location:', location); } catch {}
  }, [location]);

  // Prefetch core datasets only when authenticated
  useEffect(() => {
    (async () => {
      if (!isAuthenticated) return;
      try {
        // In serverless mode we rely on Authorization header injection; no server session required.
      } catch {}
      const keys = [
        ['/api/educators'],
        ['/api/schools'],
        ['/api/charters'],
      ] as const;
      keys.forEach(([k]) => {
        queryClient.prefetchQuery({ queryKey: [k] });
      });
    })();
  }, [isAuthenticated]);


  return (
    <SearchContext.Provider value={searchContextValue}>
      <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
          <div className="min-h-screen bg-slate-50">
            {isAuthenticated && location !== '/login' && !location.startsWith('/reset') && (
              <Header 
                searchTerm={searchTerm} 
                onSearchChange={(value) => {
                  setSearchTerm(value);
                  try { console.log('[App] onSearchChange ->', value); } catch {}
                }}
              />
            )}
            <Router />
            {isAuthenticated && import.meta.env.VITE_TOUR_ENABLED === 'true' && <TourLauncher />}
            <Toaster />
          </div>
      </PageTitleContext.Provider>
    </SearchContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <UserFilterProvider>
            <AppContent />
          </UserFilterProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
