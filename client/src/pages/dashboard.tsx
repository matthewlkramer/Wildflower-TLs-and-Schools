/**
 * Application landing page. For the user selected in the header it loads action
 * steps (`/api/action-steps/user/:id`) and schools (`/api/schools/user/:id`). It
 * surfaces the top five incomplete tasks (overdue first) with human‑friendly due
 * date labels and shows associated schools. An “Add New” menu registers creation
 * modals for schools and teachers plus placeholders for charters/tasks. Each
 * card links to the relevant detail screen.
 */
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CheckSquare, Building2, Users, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { format, parseISO, isToday, isTomorrow, isPast, differenceInDays } from "date-fns";
import { useUserFilter } from "@/contexts/user-filter-context";
import { type ActionStep, type School, type Educator } from "@/types/db-options";
import { useEffect, useState } from "react";
import AddEducatorModal from "@/components/add-teacher-modal";
import AddSchoolModal from "@/components/add-school-modal";

// Helper function to format due dates
function formatDueDate(dueDate: string | null) {
  if (!dueDate) return null;
  
  try {
    const date = parseISO(dueDate);
    
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isPast(date)) {
      const daysOverdue = differenceInDays(new Date(), date);
      return `${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`;
    }
    
    const daysUntil = differenceInDays(date, new Date());
    if (daysUntil <= 7) {
      return `In ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`;
    }
    
    return format(date, "MMM d");
  } catch (error) {
    return null;
  }
}

// Helper function to get status color
function getStatusColor(status: string | null, dueDate: string | null) {
  if (status === "Complete") return "text-green-600";
  if (dueDate && isPast(parseISO(dueDate))) return "text-red-600";
  if (status === "In Progress") return "text-blue-600";
  return "text-gray-600";
}

export default function Dashboard() {
  const { selectedUser } = useUserFilter();
  const [showAddEducatorModal, setShowAddEducatorModal] = useState(false);
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);

  // Fetch user's action steps
//  const { data: actionSteps = [], isLoading: actionStepsLoading } = useQuery<ActionStep[]>({
  //  queryKey: ['/api/action-steps/user', selectedUser],
//    enabled: !!selectedUser,
//  });

  // Fetch user's schools
//  const { data: schools = [], isLoading: schoolsLoading } = useQuery<School[]>({
  //  queryKey: ['/api/schools/user', selectedUser],
//    enabled: !!selectedUser,
//  });

  // Fetch user's TLs/ETLs
//  const { data: tls = [], isLoading: tlsLoading } = useQuery<Educator[]>({
  //  queryKey: ['/api/tls/user', selectedUser],
//    enabled: !!selectedUser,
//  });

  // Filter incomplete action steps and sort by priority (overdue first, then by due date)
/*  const incompleteTasks = actionSteps
    .filter(step => step.status !== "Complete")
    .sort((a, b) => {
      // Overdue tasks first
      const aOverdue = a.dueDate && isPast(parseISO(a.dueDate));
      const bOverdue = b.dueDate && isPast(parseISO(b.dueDate));
      
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      
      // Then by due date (soonest first)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      // Tasks with due dates before tasks without
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      return 0;
    })
    .slice(0, 5); // Show top 5 tasks
*/
  return (
    <>
      <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* My Tasks Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                My Tasks
              </CardTitle>
              <CardDescription>
                {actionStepsLoading ? (
                  <Skeleton className="h-4 w-16" />
                ) : (
                  `${incompleteTasks.length} pending`
                )}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {actionStepsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : incompleteTasks.length > 0 ? (
              <div className="space-y-3">
                {incompleteTasks.map((task) => (
                  <div key={task.id} className="border-l-2 border-gray-200 pl-3 py-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {task.item}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {task.schoolShortName && (
                        <span className="text-xs text-gray-500">{task.schoolShortName}</span>
                      )}
                      {task.dueDate && (
                        <span className={`text-xs font-medium ${getStatusColor(task.status, task.dueDate)}`}>
                          {formatDueDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {actionSteps.filter(s => s.status !== "Complete").length > 5 && (
                  <Button variant="ghost" size="sm" className="w-full mt-2">
                    View all tasks
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No pending tasks
              </p>
            )}
          </CardContent>
        </Card>

        {/* My Schools Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                My Schools
              </CardTitle>
              <CardDescription>
                {schoolsLoading ? (
                  <Skeleton className="h-4 w-16" />
                ) : (
                  `${schools.length} school${schools.length !== 1 ? 's' : ''}`
                )}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {schoolsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : schools.length > 0 ? (
              <div className="space-y-3">
                {schools.slice(0, 5).map((school) => (
                  <Link key={school.id} href={`/schools/${school.id}`}>
                    <div className="border-l-2 border-gray-200 pl-3 py-1 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm font-medium text-gray-900">
                        {school.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {school.city && school.state && (
                          <span className="text-xs text-gray-500">
                            {school.city}, {school.state}
                          </span>
                        )}
                        {school.stageStatus && (
                          <span className={`text-xs font-medium ${
                            school.stageStatus.includes('Closed') || school.stageStatus.includes('Left Network')
                              ? 'text-red-600'
                              : school.stageStatus.includes('Operating')
                              ? 'text-green-600'
                              : 'text-blue-600'
                          }`}>
                            {school.stageStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
                {schools.length > 5 && (
                  <Link href="/schools">
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      View all schools
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No schools assigned
              </p>
            )}
          </CardContent>
        </Card>

        {/* My ETLs/TLs Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                My ETLs/TLs
              </CardTitle>
              <CardDescription>
                {tlsLoading ? (
                  <Skeleton className="h-4 w-16" />
                ) : (
                  `${tls.length} total`
                )}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {tlsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : tls.length > 0 ? (
              <div className="space-y-3">
                {tls.slice(0, 6).map((e) => (
                  <Link key={e.id} href={`/teacher/${e.id}`}>
                    <div className="border-l-2 border-gray-200 pl-3 py-1 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm font-medium text-gray-900">{e.fullName}</p>
                      <div className="text-xs text-gray-500">
                        {Array.isArray(e.currentRole) ? e.currentRole.join(', ') : (e.currentRole || '')}
                      </div>
                    </div>
                  </Link>
                ))}
                {tls.length > 6 && (
                  <Link href="/teachers">
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      View all teachers
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  No TLs found
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    
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
