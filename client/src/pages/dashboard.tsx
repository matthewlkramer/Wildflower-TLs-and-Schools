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
import { Calendar, CheckSquare, Building2, Users, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { format, parseISO, isToday, isTomorrow, isPast, differenceInDays } from "date-fns";
import { useUserFilter } from "@/contexts/user-filter-context";
import { ActionStep, School } from "@/lib/schema";
import { useEffect, useState } from "react";
import { addNewEmitter } from "@/lib/add-new-emitter";
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
  
  // Set up Add New options for dashboard
  useEffect(() => {
    const options = [
      { label: "Create New School", onClick: () => setShowAddSchoolModal(true) },
      { label: "Create New Teacher", onClick: () => setShowAddEducatorModal(true) },
      { label: "Create New Charter", onClick: () => console.log("Create Charter - to be implemented") },
      { label: "Create New Task", onClick: () => console.log("Create Task - to be implemented") }
    ];
    
    addNewEmitter.setOptions(options);
    
    return () => {
      addNewEmitter.setOptions([]);
    };
  }, []);

  // Fetch user's action steps
  const { data: actionSteps = [], isLoading: actionStepsLoading } = useQuery<ActionStep[]>({
    queryKey: ['/api/action-steps/user', selectedUser],
    enabled: !!selectedUser,
  });

  // Fetch user's schools
  const { data: schools = [], isLoading: schoolsLoading } = useQuery<School[]>({
    queryKey: ['/api/schools/user', selectedUser],
    enabled: !!selectedUser,
  });

  // For now, meetings will be a placeholder
  const meetings = [];
  const meetingsLoading = false;

  // Filter incomplete action steps and sort by priority (overdue first, then by due date)
  const incompleteTasks = actionSteps
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

        {/* My Meetings Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                My Meetings
              </CardTitle>
              <CardDescription>
                {meetingsLoading ? (
                  <Skeleton className="h-4 w-16" />
                ) : (
                  `${meetings.length} upcoming`
                )}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {meetingsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : meetings.length > 0 ? (
              <div className="space-y-3">
                {/* Meetings will be implemented later */}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  No upcoming meetings
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Meeting integration coming soon
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