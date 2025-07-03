import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header";
import Teachers from "@/pages/teachers";
import Schools from "@/pages/schools";
import TeacherDetail from "@/pages/teacher-detail";
import SchoolDetail from "@/pages/school-detail";
import NotFound from "@/pages/not-found";

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-slate-50">
          <Header />
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
