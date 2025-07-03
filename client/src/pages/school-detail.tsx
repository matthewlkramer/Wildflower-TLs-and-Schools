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
import { School2, User } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { insertSchoolSchema, type School, type Teacher, type TeacherSchoolAssociation } from "@shared/schema";
import { getInitials, getStatusColor } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal";

export default function SchoolDetail() {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { toast } = useToast();

  const { data: school, isLoading } = useQuery<School>({
    queryKey: ["/api/schools", id],
    queryFn: async () => {
      const response = await fetch(`/api/schools/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch school");
      return response.json();
    },
  });

  const { data: associations } = useQuery<TeacherSchoolAssociation[]>({
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

  const form = useForm({
    resolver: zodResolver(insertSchoolSchema),
    defaultValues: {
      name: school?.name || "",
      address: school?.address || "",
      city: school?.city || "",
      state: school?.state || "",
      zipCode: school?.zipCode || "",
      type: school?.type || "Elementary",
      established: school?.established || 2020,
      status: school?.status || "Active",
      phone: school?.phone || "",
      email: school?.email || "",
    },
  });

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/schools">
                  <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Schools
                  </Button>
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-wildflower-green rounded-lg flex items-center justify-center">
                    <School2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{school.name}</h2>
                    <p className="text-sm text-slate-600">{school.type} • Est. {school.established}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-wildflower-blue hover:bg-blue-700 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit School"}
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
            <Tabs defaultValue="basic" className="w-full">
              <div className="border-b border-slate-200">
                <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto p-0">
                  <TabsTrigger 
                    value="basic" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-6"
                  >
                    Basic Information
                  </TabsTrigger>
                  <TabsTrigger 
                    value="teachers" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-6"
                  >
                    Associated Teachers
                  </TabsTrigger>
                  <TabsTrigger 
                    value="additional" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-6"
                  >
                    Additional Details
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
                              <FormLabel>School Name</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>School Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Elementary">Elementary</SelectItem>
                                  <SelectItem value="Middle School">Middle School</SelectItem>
                                  <SelectItem value="High School">High School</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
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
                          name="established"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Established Year</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" disabled={!isEditing} />
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
                            disabled={updateSchoolMutation.isPending}
                          >
                            {updateSchoolMutation.isPending ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      )}
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="teachers" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-slate-900">Associated Teachers</h3>
                      <Button className="bg-wildflower-green hover:bg-green-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Teacher
                      </Button>
                    </div>
                    
                    {associations && associations.length > 0 ? (
                      <div className="space-y-3">
                        {associations.map((association) => {
                          const teacher = teachers?.find(t => t.id === association.teacherId);
                          return (
                            <div key={association.id} className="bg-slate-50 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-wildflower-blue rounded-full flex items-center justify-center">
                                    <span className="text-white font-medium text-sm">
                                      {teacher ? getInitials(teacher.name) : "?"}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-slate-900">{teacher?.name || 'Unknown Teacher'}</div>
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
                        No associated teachers found
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="additional" className="mt-0">
                  <div className="space-y-6">
                    <div className="text-center py-8 text-slate-500">
                      Additional school details and metadata can be added here
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
    </>
  );
}
