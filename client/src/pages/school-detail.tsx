import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Edit, Trash2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { School2, User } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { insertSchoolSchema, type School, type Teacher, type TeacherSchoolAssociation, type Location } from "@shared/schema";
import { getInitials, getStatusColor } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "../App";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal";

// LocationRow component for inline editing
function LocationRow({ 
  location, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  isSaving 
}: {
  location: Location;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({
    address: location.address || "",
    currentPhysicalAddress: location.currentPhysicalAddress || "",
    currentMailingAddress: location.currentMailingAddress || "",
    startDate: location.startDate || "",
    endDate: location.endDate || "",
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        address: location.address || "",
        currentPhysicalAddress: location.currentPhysicalAddress || "",
        currentMailingAddress: location.currentMailingAddress || "",
        startDate: location.startDate || "",
        endDate: location.endDate || "",
      });
    }
  }, [isEditing, location]);

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            value={editData.address}
            onChange={(e) => setEditData({...editData, address: e.target.value})}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.currentPhysicalAddress}
            onChange={(e) => setEditData({...editData, currentPhysicalAddress: e.target.value})}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.currentMailingAddress}
            onChange={(e) => setEditData({...editData, currentMailingAddress: e.target.value})}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.startDate}
            onChange={(e) => setEditData({...editData, startDate: e.target.value})}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.endDate}
            onChange={(e) => setEditData({...editData, endDate: e.target.value})}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSave(editData)}
              disabled={isSaving}
              className="h-8 w-8 p-0"
            >
              ✓
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>{location.address || '-'}</TableCell>
      <TableCell>{location.currentPhysicalAddress || '-'}</TableCell>
      <TableCell>{location.currentMailingAddress || '-'}</TableCell>
      <TableCell>{location.startDate || '-'}</TableCell>
      <TableCell>{location.endDate || '-'}</TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function SchoolDetail() {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [deletingLocationId, setDeletingLocationId] = useState<string | null>(null);
  const [locationDeleteModalOpen, setLocationDeleteModalOpen] = useState(false);
  const [isCreatingLocation, setIsCreatingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({
    address: "",
    currentPhysicalAddress: "",
    currentMailingAddress: "",
    startDate: "",
    endDate: "",
  });
  const { toast } = useToast();
  const { setPageTitle } = usePageTitle();

  const { data: school, isLoading } = useQuery<School>({
    queryKey: ["/api/schools", id],
    queryFn: async () => {
      const response = await fetch(`/api/schools/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch school");
      return response.json();
    },
  });

  const { data: associations, isLoading: associationsLoading } = useQuery<TeacherSchoolAssociation[]>({
    queryKey: ["/api/school-associations", id],
    queryFn: async () => {
      const response = await fetch(`/api/school-associations/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch associations");
      return response.json();
    },
  });

  const { data: teachers } = useQuery<Teacher[]>({
    queryKey: ["/api/teachers"],
  });

  const { data: locations, isLoading: locationsLoading } = useQuery<Location[]>({
    queryKey: [`/api/locations/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/locations/school/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch locations");
      return response.json();
    },
    enabled: !!id,
  });

  const form = useForm({
    resolver: zodResolver(insertSchoolSchema),
    defaultValues: {
      name: school?.name || "",
      address: school?.address || "",
      city: school?.city || "",
      state: school?.state || "",
      zipCode: school?.zipCode || "",
      status: school?.status || "Active",
      phone: school?.phone || "",
      email: school?.email || "",
    },
  });

  useEffect(() => {
    if (school) {
      setPageTitle(school.name);
    }
    return () => setPageTitle(""); // Clear title when component unmounts
  }, [school, setPageTitle]);

  const updateSchoolMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", `/api/schools/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schools"] });
      queryClient.invalidateQueries({ queryKey: ["/api/schools", id] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "School updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update school",
        variant: "destructive",
      });
    },
  });

  const deleteSchoolMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/schools/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schools"] });
      toast({
        title: "Success",
        description: "School deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete school",
        variant: "destructive",
      });
    },
  });

  // Location mutations
  const createLocationMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/locations", { ...data, schoolId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/locations/school/${id}`] });
      setIsCreatingLocation(false);
      setNewLocation({
        address: "",
        currentPhysicalAddress: "",
        currentMailingAddress: "",
        startDate: "",
        endDate: "",
      });
      toast({
        title: "Success",
        description: "Location created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create location",
        variant: "destructive",
      });
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: async ({ locationId, data }: { locationId: string; data: any }) => {
      return await apiRequest("PUT", `/api/locations/${locationId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/locations/school/${id}`] });
      setEditingLocationId(null);
      toast({
        title: "Success",
        description: "Location updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update location",
        variant: "destructive",
      });
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: async (locationId: string) => {
      return await apiRequest("DELETE", `/api/locations/${locationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/locations/school/${id}`] });
      setLocationDeleteModalOpen(false);
      setDeletingLocationId(null);
      toast({
        title: "Success",
        description: "Location deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete location",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    updateSchoolMutation.mutate(data);
  };

  const handleDelete = () => {
    deleteSchoolMutation.mutate();
    setShowDeleteModal(false);
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    );
  }

  if (!school) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900">School not found</h2>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="summary" className="w-full">
              <div className="border-b border-slate-200">
                <TabsList className="grid w-full grid-cols-11 bg-transparent h-auto p-0">
                  <TabsTrigger value="summary" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="tls" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    TLs
                  </TabsTrigger>
                  <TabsTrigger value="locations" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Locations
                  </TabsTrigger>
                  <TabsTrigger value="governance" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Governance
                  </TabsTrigger>
                  <TabsTrigger value="guides" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Guides
                  </TabsTrigger>
                  <TabsTrigger value="support" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Support
                  </TabsTrigger>
                  <TabsTrigger value="grants" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Grants/Loans
                  </TabsTrigger>
                  <TabsTrigger value="membership" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Membership Fees
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Notes/Actions
                  </TabsTrigger>
                  <TabsTrigger value="linked" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Linked Email/Meetings
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="summary" className="mt-0">
                  <div className="space-y-8">
                    {/* Basic School Information */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4">
                          <School2 className="h-6 w-6 text-slate-600" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">School Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-slate-600">School Name</label>
                            <p className="text-sm text-slate-900">{school.name || '-'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Governance Model</label>
                            <p className="text-sm text-slate-900">{school.governanceModel || '-'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">School Open Date</label>
                            <p className="text-sm text-slate-900">{school.openDate || '-'}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Short Name</label>
                            <p className="text-sm text-slate-900">{school.shortName || '-'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Founders</label>
                            <p className="text-sm text-slate-900">-</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">School Status</label>
                            <div className="mt-1">
                              <Badge className={getStatusColor(school.status || '')}>{school.status || '-'}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Ages Served</label>
                            <p className="text-sm text-slate-900">{school.agesServed?.join(', ') || '-'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Current TLs</label>
                            <p className="text-sm text-slate-900">
                              {typeof school.currentTLs === 'string' 
                                ? school.currentTLs
                                : school.currentTLs && Array.isArray(school.currentTLs) && school.currentTLs.length > 0 
                                  ? school.currentTLs.join(', ')
                                  : '-'
                              }
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Membership Status</label>
                            <p className="text-sm text-slate-900">{school.membershipFeeStatus || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* School Information Section */}
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">School Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <label className="text-sm font-medium text-slate-600">Program Focus</label>
                          <p className="text-sm text-slate-900">-</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Max Capacity</label>
                          <p className="text-sm text-slate-900">{school.enrollmentCap || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Number of Classrooms</label>
                          <p className="text-sm text-slate-900">-</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Public Funding</label>
                          <p className="text-sm text-slate-900">{school.publicFunding ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information Section */}
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <label className="text-sm font-medium text-slate-600">School Email</label>
                          <p className="text-sm text-slate-900">{school.email || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">School Phone</label>
                          <p className="text-sm text-slate-900">{school.phone || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Website</label>
                          <p className="text-sm text-slate-900">{school.website || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Email Domain</label>
                          <p className="text-sm text-slate-900">-</p>
                        </div>
                      </div>
                    </div>

                    {/* Legal Entity Section */}
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Legal Entity</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <label className="text-sm font-medium text-slate-600">EIN</label>
                          <p className="text-sm text-slate-900">-</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Legal Name</label>
                          <p className="text-sm text-slate-900">{school.fullName || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Incorporation Date</label>
                          <p className="text-sm text-slate-900">-</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Nonprofit Status</label>
                          <p className="text-sm text-slate-900">-</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-0">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-900">School Information</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-slate-600">Full Name:</span> {school.fullName || '-'}</p>
                          <p><span className="text-slate-600">Website:</span> {school.website || '-'}</p>
                          <p><span className="text-slate-600">Phone:</span> {school.phone || '-'}</p>
                          <p><span className="text-slate-600">Email:</span> {school.email || '-'}</p>
                          <p><span className="text-slate-600">Ages Served:</span> {school.agesServed?.join(', ') || '-'}</p>
                          <p><span className="text-slate-600">Grades:</span> {school.grades?.join(', ') || '-'}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-900">Operations</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-slate-600">Open Date:</span> {school.openDate || '-'}</p>
                          <p><span className="text-slate-600">Target Open Date:</span> {school.targetOpenDate || '-'}</p>
                          <p><span className="text-slate-600">Current Enrollment:</span> {school.currentEnrollment || '-'}</p>
                          <p><span className="text-slate-600">Enrollment Cap:</span> {school.enrollmentCap || '-'}</p>
                          <p><span className="text-slate-600">Tuition Range:</span> {school.tuitionRange || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tls" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-900">Teachers</h4>
                      <Button size="sm" className="bg-wildflower-blue hover:bg-wildflower-blue/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Teacher
                      </Button>
                    </div>
                    
                    {associationsLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ) : associations && associations.length > 0 ? (
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Teacher Full Name</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Start Date</TableHead>
                              <TableHead>End Date</TableHead>
                              <TableHead>Currently Active</TableHead>
                              <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {associations.map((association) => {
                              const teacher = teachers?.find(t => t.id === association.educatorId);
                              return (
                                <TableRow key={association.id}>
                                  <TableCell>
                                    {teacher ? (
                                      <Link 
                                        href={`/teachers/${teacher.id}`}
                                        className="text-wildflower-blue hover:underline"
                                      >
                                        {teacher.fullName}
                                      </Link>
                                    ) : (
                                      association.educatorId
                                    )}
                                  </TableCell>
                                  <TableCell>{association.role || '-'}</TableCell>
                                  <TableCell>{association.startDate || '-'}</TableCell>
                                  <TableCell>{association.endDate || '-'}</TableCell>
                                  <TableCell>
                                    <Badge 
                                      variant={association.isActive ? "default" : "secondary"}
                                      className={association.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                                    >
                                      {association.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 p-0"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <p>No teachers found for this school.</p>
                        <p className="text-sm mt-2">Click "Add Teacher" to associate teachers with this school.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="locations" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-900">Locations</h4>
                      <Button 
                        size="sm" 
                        className="bg-wildflower-blue hover:bg-wildflower-blue/90"
                        onClick={() => setIsCreatingLocation(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Location
                      </Button>
                    </div>
                    
                    {locationsLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ) : (
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Address</TableHead>
                              <TableHead>Current Physical Address</TableHead>
                              <TableHead>Current Mailing Address</TableHead>
                              <TableHead>Start Date</TableHead>
                              <TableHead>End Date</TableHead>
                              <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {/* Create new location row */}
                            {isCreatingLocation && (
                              <TableRow>
                                <TableCell>
                                  <Input
                                    value={newLocation.address}
                                    onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                                    placeholder="Enter address"
                                    className="h-8"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={newLocation.currentPhysicalAddress}
                                    onChange={(e) => setNewLocation({...newLocation, currentPhysicalAddress: e.target.value})}
                                    placeholder="Current physical address"
                                    className="h-8"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={newLocation.currentMailingAddress}
                                    onChange={(e) => setNewLocation({...newLocation, currentMailingAddress: e.target.value})}
                                    placeholder="Current mailing address"
                                    className="h-8"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="date"
                                    value={newLocation.startDate}
                                    onChange={(e) => setNewLocation({...newLocation, startDate: e.target.value})}
                                    className="h-8"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="date"
                                    value={newLocation.endDate}
                                    onChange={(e) => setNewLocation({...newLocation, endDate: e.target.value})}
                                    className="h-8"
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => createLocationMutation.mutate(newLocation)}
                                      disabled={createLocationMutation.isPending}
                                      className="h-8 w-8 p-0"
                                    >
                                      ✓
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setIsCreatingLocation(false);
                                        setNewLocation({
                                          address: "",
                                          currentPhysicalAddress: "",
                                          currentMailingAddress: "",
                                          startDate: "",
                                          endDate: "",
                                        });
                                      }}
                                      className="h-8 w-8 p-0"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                            
                            {/* Existing locations */}
                            {locations && locations.map((location) => (
                              <LocationRow
                                key={location.id}
                                location={location}
                                isEditing={editingLocationId === location.id}
                                onEdit={() => setEditingLocationId(location.id)}
                                onSave={(data) => updateLocationMutation.mutate({ locationId: location.id, data })}
                                onCancel={() => setEditingLocationId(null)}
                                onDelete={() => {
                                  setDeletingLocationId(location.id);
                                  setLocationDeleteModalOpen(true);
                                }}
                                isSaving={updateLocationMutation.isPending}
                              />
                            ))}
                            
                            {!locations?.length && !isCreatingLocation && (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                  <p>No locations found for this school.</p>
                                  <p className="text-sm mt-2">Click "Add Location" to create the first location entry.</p>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="governance" className="mt-0">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Governance & Legal</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 text-sm">
                        <p><span className="text-slate-600">Governance Model:</span> {school.governanceModel || '-'}</p>
                        <p><span className="text-slate-600">Charter Status:</span> {school.charterStatus || '-'}</p>
                        <p><span className="text-slate-600">Authorizer:</span> {school.authorizer || '-'}</p>
                        <p><span className="text-slate-600">Public Funding:</span> {school.publicFunding ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="guides" className="mt-0">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Guides & Staff</h4>
                    <div className="text-center py-8 text-slate-500">
                      Guide and staff information will be displayed here
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="support" className="mt-0">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Support & Resources</h4>
                    <div className="text-center py-8 text-slate-500">
                      Support and resource information will be displayed here
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="grants" className="mt-0">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Grants & Loans</h4>
                    <div className="text-center py-8 text-slate-500">
                      Grant and loan information will be displayed here
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="membership" className="mt-0">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Membership Fees</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 text-sm">
                        <p><span className="text-slate-600">Membership Fee Status:</span> {school.membershipFeeStatus || '-'}</p>
                        <p><span className="text-slate-600">Membership Fee Amount:</span> {school.membershipFeeAmount ? `$${school.membershipFeeAmount}` : '-'}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-0">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Notes & Actions</h4>
                    <div className="text-center py-8 text-slate-500">
                      Notes and action items will be displayed here
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="linked" className="mt-0">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Linked Email & Meetings</h4>
                    <div className="text-center py-8 text-slate-500">
                      Linked emails and meeting information will be displayed here
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDelete}
        title="Delete School"
        description="Are you sure you want to delete this school? This action cannot be undone."
        isLoading={deleteSchoolMutation.isPending}
      />

      <DeleteConfirmationModal
        open={locationDeleteModalOpen}
        onOpenChange={setLocationDeleteModalOpen}
        onConfirm={() => {
          if (deletingLocationId) {
            deleteLocationMutation.mutate(deletingLocationId);
          }
        }}
        title="Delete Location"
        description="Are you sure you want to delete this location? This action cannot be undone."
        isLoading={deleteLocationMutation.isPending}
      />
    </>
  );
}
