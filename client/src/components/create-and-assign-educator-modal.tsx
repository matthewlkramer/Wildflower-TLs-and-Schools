import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const createAndAssignEducatorSchema = z.object({
  // Educator fields
  fullName: z.string().min(1, "Full name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  primaryPhone: z.string().optional(),
  homeAddress: z.string().optional(),
  
  // Assignment fields
  role: z.array(z.string()).min(1, "Please select at least one role"),
  startDate: z.string().min(1, "Start date is required"),
  emailAtSchool: z.string().email("Please enter a valid email").optional().or(z.literal("")),
});

interface CreateAndAssignEducatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
}

export default function CreateAndAssignEducatorModal({ open, onOpenChange, schoolId }: CreateAndAssignEducatorModalProps) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(createAndAssignEducatorSchema),
    defaultValues: {
      fullName: "",
      firstName: "",
      lastName: "",
      primaryPhone: "",
      homeAddress: "",
      role: [],
      startDate: "",
      emailAtSchool: "",
    },
  });

  const createAndAssignEducatorMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createAndAssignEducatorSchema>) => {
      // First create the educator
      const educator = await apiRequest("POST", "/api/educators", {
        fullName: data.fullName,
        firstName: data.firstName,
        lastName: data.lastName,
        primaryPhone: data.primaryPhone,
        homeAddress: data.homeAddress,
      });

      // Then create the association
      await apiRequest("POST", "/api/teacher-school-associations", {
        educatorId: educator.id,
        schoolId: schoolId,
        role: data.role,
        startDate: data.startDate,
        emailAtSchool: data.emailAtSchool,
        isActive: true,
      });

      return educator;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/educators"] });
      queryClient.invalidateQueries({ queryKey: ["/api/teachers"] }); // Legacy compatibility
      queryClient.invalidateQueries({ queryKey: ["/api/school-associations", schoolId] });
      toast({
        title: "Success",
        description: "Educator created and assigned to school successfully",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create and assign educator",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof createAndAssignEducatorSchema>) => {
    createAndAssignEducatorMutation.mutate(data);
  };

  const roleOptions = [
    "Teacher Leader",
    "Teacher",
    "Founder",
    "Board Member",
    "Director",
    "Assistant Teacher",
    "Guide",
    "Emerging Teacher Leader"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create New Educator and Assign to School</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Educator Information</h3>
                
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter first name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter last name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="primaryPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Phone</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" placeholder="Enter phone number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="homeAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter home address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">School Assignment</h3>
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role(s)</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value?.[0] || ""} 
                          onValueChange={(value) => field.onChange([value])}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roleOptions.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emailAtSchool"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email at School (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Enter email for this school" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createAndAssignEducatorMutation.isPending}
                  className="bg-wildflower-blue hover:bg-wildflower-blue/90"
                >
                  {createAndAssignEducatorMutation.isPending ? "Creating..." : "Create and Assign TL to School"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}