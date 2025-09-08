import { Link, useLocation } from "wouter";
import { User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { WildflowerLogo } from "./wildflower-logo";
import { useUserFilter } from "@/contexts/user-filter-context";
import { logger } from "@/lib/logger";
import { useAuth } from "@/contexts/auth-context";

export default function Header() {
  const [location] = useLocation();
  const { showOnlyMyRecords, setShowOnlyMyRecords } = useUserFilter();
  const { isAuthenticated, user, loginWithGoogle, logout } = useAuth();
  



  const isDashboardActive = location === "/" || location === "/dashboard";
  const isTeachersActive = location === "/teachers" || location.startsWith("/teacher/");
  const isSchoolsActive = location === "/schools" || location.startsWith("/school/");
  const isChartersActive = location === "/charters" || location.startsWith("/charter/");
  const isLoansActive = location === "/loans" || location.startsWith("/loan/");

  // Simplified header: navigation, My records toggle, account menu



  return (
    <>
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo - Always visible and protected from overlap */}
            <div className="flex-shrink-0 flex items-center min-w-0 mr-4">
              <WildflowerLogo className="h-10 w-auto" />
            </div>
            
            {/* Right side content */}
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 ml-auto">
              {/* Navigation - always visible, compact on mobile */}
              <nav className="flex items-center space-x-3 sm:space-x-4 lg:space-x-8 flex-shrink-0">
                <Link href="/dashboard" className={`px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  isDashboardActive
                    ? "text-wildflower-blue"
                    : "text-slate-500 hover:text-slate-700"
                }`}>
                  Dashboard
                </Link>
                <Link href="/teachers" className={`px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  isTeachersActive
                    ? "text-wildflower-blue"
                    : "text-slate-500 hover:text-slate-700"
                }`}>
                  Teachers
                </Link>
                <Link href="/schools" className={`px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  isSchoolsActive
                    ? "text-wildflower-blue"
                    : "text-slate-500 hover:text-slate-700"
                }`}>
                  Schools
                </Link>
                <Link href="/charters" className={`px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  isChartersActive
                    ? "text-wildflower-blue"
                    : "text-slate-500 hover:text-slate-700"
                }`}>
                  Charters
                </Link>
                <Link href="/loans" className={`px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  isLoansActive
                    ? "text-wildflower-blue"
                    : "text-slate-500 hover:text-slate-700"
                }`}>
                  Loans
                </Link>
              </nav>
              
              {/* Right-side controls */}
              <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                {/* User Filter Toggle */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Switch
                    id="user-filter"
                    checked={showOnlyMyRecords}
                    onCheckedChange={setShowOnlyMyRecords}
                    className="data-[state=checked]:bg-wildflower-blue"
                  />
                  <Label htmlFor="user-filter" className="text-xs text-slate-600 whitespace-nowrap cursor-pointer">
                    My records
                  </Label>
                </div>
                
                {!isAuthenticated ? (
                  <Button onClick={() => loginWithGoogle()} size="sm" className="bg-wildflower-blue hover:bg-blue-700 text-white flex-shrink-0">
                    Sign in with Google
                  </Button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-slate-600" />
                        </div>
                        <span className="max-w-[160px] truncate text-slate-700">{user?.email}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/settings">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => logout()}>Sign out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
