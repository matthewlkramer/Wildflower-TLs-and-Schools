import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Edit, Trash2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { School2, Building } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { insertTeacherSchema, type Teacher, type School, type TeacherSchoolAssociation } from "@shared/schema";
import { getInitials, getStatusColor } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal";

export default function TeacherDetail() {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { toast } = useToast();

  const { data: teacher, isLoading } = useQuery<Teacher>({
    queryKey: ["/api/teachers", id],
    queryFn: async () => {
      const response = await fetch(`/api/teachers/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch teacher");
      return response.json();
    },
  });

  const { data: associations } = useQuery<TeacherSchoolAssociation[]>({
    queryKey: ["/api/teacher-associations", id],
    queryFn: async () => {
      const response = await fetch(`/api/teacher-associations/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch associations");
      return response.json();
    },
  });

  const { data: schools } = useQuery<School[]>({
    queryKey: ["/api/schools"],
  });

  const form = useForm({
    resolver: zodResolver(insertTeacherSchema),
    defaultValues: {
      name: teacher?.name || "",
      email: teacher?.email || "",
      phone: teacher?.phone || "",
      department: teacher?.department || "",
      subject: teacher?.subject || "",
      status: teacher?.status || "Active",
      startDate: teacher?.startDate || "",
      education: teacher?.education || "",
      certifications: teacher?.certifications || "",
      experience: teacher?.experience || 0,
      emergencyContact: teacher?.emergencyContact || "",
      biography: teacher?.biography || "",
    },
  });

  const updateTeacherMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", `/api/teachers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teachers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/teachers", id] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Teacher updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update teacher",
        variant: "destructive",
      });
    },
  });

  const deleteTeacherMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/teachers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teachers"] });
      toast({
        title: "Success",
        description: "Teacher deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete teacher",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    updateTeacherMutation.mutate(data);
  };

  const handleDelete = () => {
    deleteTeacherMutation.mutate();
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

  if (!teacher) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Teacher not found</h2>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/teachers">
                  <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Teachers
                  </Button>
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-wildflower-green rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {getInitials(teacher.name)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{teacher.name}</h2>
                    <p className="text-sm text-slate-600">{teacher.subject} Teacher</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-wildflower-blue hover:bg-blue-700 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit Teacher"}
                </Button>
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  variant="destructive"
                  className="bg-wildflower-red hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs defaultValue="summary" className="w-full">
              <div className="border-b border-slate-200">
                <TabsList className="grid w-full grid-cols-9 bg-transparent h-auto p-0">
                  <TabsTrigger value="summary" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="demographics" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Demographics
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Contact Info
                  </TabsTrigger>
                  <TabsTrigger value="schools" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Schools
                  </TabsTrigger>
                  <TabsTrigger value="cultivation" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Early Cultivation
                  </TabsTrigger>
                  <TabsTrigger value="certs" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Certs
                  </TabsTrigger>
                  <TabsTrigger value="events" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Events
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Notes
                  </TabsTrigger>
                  <TabsTrigger value="linked" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                    Linked Email/Meetings
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="basic" className="mt-0">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input {...field} type="tel" disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Department</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                                  <SelectItem value="Science">Science</SelectItem>
                                  <SelectItem value="English">English</SelectItem>
                                  <SelectItem value="History">History</SelectItem>
                                  <SelectItem value="Arts">Arts</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input {...field} type="date" disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="On Leave">On Leave</SelectItem>
                                  <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {isEditing && (
                        <div className="flex justify-end space-x-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-wildflower-blue hover:bg-blue-700"
                            disabled={updateTeacherMutation.isPending}
                          >
                            {updateTeacherMutation.isPending ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      )}
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="schools" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-slate-900">School Associations</h3>
                      <Button className="bg-wildflower-green hover:bg-green-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Association
                      </Button>
                    </div>
                    
                    {associations && associations.length > 0 ? (
                      <div className="space-y-3">
                        {associations.map((association) => {
                          const school = schools?.find(s => s.id === association.schoolId);
                          return (
                            <div key={association.id} className="bg-slate-50 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-wildflower-green rounded-lg flex items-center justify-center">
                                    <School2 className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-slate-900">{school?.name || 'Unknown School'}</div>
                                    <div className="text-sm text-slate-500">
                                      {association.role} • Since {new Date(association.startDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant={association.isPrimary ? "default" : "secondary"}>
                                    {association.isPrimary ? "Primary" : "Secondary"}
                                  </Badge>
                                  <Button variant="ghost" size="sm" className="text-wildflower-red hover:text-red-700">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        No school associations found
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="additional" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Biography</label>
                      <Textarea
                        value={teacher.biography || ""}
                        readOnly={!isEditing}
                        placeholder="Enter teacher biography..."
                        className="min-h-[120px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Education</label>
                        <Input
                          value={teacher.education || ""}
                          readOnly={!isEditing}
                          placeholder="Enter education details"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Certifications</label>
                        <Input
                          value={teacher.certifications || ""}
                          readOnly={!isEditing}
                          placeholder="Enter certifications"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Years of Experience</label>
                        <Input
                          type="number"
                          value={teacher.experience || ""}
                          readOnly={!isEditing}
                          placeholder="Enter years of experience"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Contact</label>
                        <Input
                          value={teacher.emergencyContact || ""}
                          readOnly={!isEditing}
                          placeholder="Enter emergency contact"
                        />
                      </div>
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
        title="Delete Teacher"
        description="Are you sure you want to delete this teacher? This action cannot be undone."
        isLoading={deleteTeacherMutation.isPending}
      />
    </>
  );
}
