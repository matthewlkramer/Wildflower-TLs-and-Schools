import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Teacher } from "@shared/schema";

const createAndAssignEducatorSchema = z.object({
  // Educator fields (full name is calculated field, so excluded)
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  nonWildflowerEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  primaryPhone: z.string().optional(),
  homeAddress: z.string().optional(),
  
  // Assignment fields (all optional except role which needs at least one)
  role: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  emailAtSchool: z.string().email("Please enter a valid email").optional().or(z.literal("")),
});

interface CreateAndAssignEducatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
  onSwitchToAssign?: (educatorId: string) => void;
}

export default function CreateAndAssignEducatorModal({ open, onOpenChange, schoolId, onSwitchToAssign }: CreateAndAssignEducatorModalProps) {
  const { toast } = useToast();
  const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false);
  const [potentialDuplicate, setPotentialDuplicate] = useState<Teacher | null>(null);

  // Fetch educators for duplicate checking
  const { data: educators = [] } = useQuery<Teacher[]>({
    queryKey: ["/api/teachers"],
  });

  const form = useForm({
    resolver: zodResolver(createAndAssignEducatorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      nonWildflowerEmail: "",
      primaryPhone: "",
      homeAddress: "",
      role: [],
      startDate: "",
      emailAtSchool: "",
    },
  });

  // Check for duplicates when first/last name changes
  const checkForDuplicates = (firstName: string, lastName: string) => {
    if (!firstName || !lastName) return;
    
    const normalizedFirst = firstName.toLowerCase().trim();
    const normalizedLast = lastName.toLowerCase().trim();
    
    const duplicate = educators.find(educator => 
      educator.firstName?.toLowerCase().trim() === normalizedFirst &&
      educator.lastName?.toLowerCase().trim() === normalizedLast
    );
    
    if (duplicate) {
      setPotentialDuplicate(duplicate);
      setShowDuplicateConfirm(true);
    }
  };

  // Watch first and last name changes
  const firstName = form.watch("firstName");
  const lastName = form.watch("lastName");
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkForDuplicates(firstName, lastName);
    }, 500); // Debounce the check
    
    return () => clearTimeout(timeoutId);
  }, [firstName, lastName, educators]);

  const createAndAssignEducatorMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createAndAssignEducatorSchema>) => {
      console.log("Creating educator with data:", data);
      
      // First create the educator (fullName is calculated field, so excluded)
      const educatorResponse = await apiRequest("POST", "/api/educators", {
        firstName: data.firstName,
        lastName: data.lastName,
        primaryPhone: data.primaryPhone,
        homeAddress: data.homeAddress,
        nonWildflowerEmail: data.nonWildflowerEmail,
      });

      const educator = await educatorResponse.json();
      console.log("Educator created:", educator);

      // Then create the association (only if role is provided)
      if (data.role && data.role.length > 0) {
        console.log("Creating association with:", {
          educatorId: educator.id,
          schoolId: schoolId,
          role: data.role,
          startDate: data.startDate,
          emailAtSchool: data.emailAtSchool,
          isActive: true,
        });
        
        const associationResponse = await apiRequest("POST", "/api/teacher-school-associations", {
          educatorId: educator.id,
          schoolId: schoolId,
          role: data.role,
          startDate: data.startDate,
          emailAtSchool: data.emailAtSchool,
          isActive: true,
        });

        const association = await associationResponse.json();
        console.log("Association created:", association);
      } else {
        console.log("No role provided, skipping association creation");
      }

      return educator;
    },
    onSuccess: () => {
      // Invalidate all possible query key formats
      queryClient.invalidateQueries({ queryKey: ["/api/educators"] });
      queryClient.invalidateQueries({ queryKey: ["/api/teachers"] }); // Legacy compatibility
      queryClient.invalidateQueries({ queryKey: [`/api/school-associations/${schoolId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/school-associations", schoolId] });
      
      // Force refetch all school-related data
      queryClient.refetchQueries({ queryKey: [`/api/school-associations/${schoolId}`] });
      
      // Additional safety - refetch after a short delay
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: [`/api/school-associations/${schoolId}`] });
      }, 500);
      
      toast({
        title: "Success",
        description: "Educator created and assigned to school successfully",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error creating and assigning educator:", error);
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
    <>
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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
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
                          <FormLabel>Last Name *</FormLabel>
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
                    name="nonWildflowerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Non-Wildflower Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="personal@example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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
                        <FormLabel>Email at School</FormLabel>
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
      
      {/* Duplicate Confirmation Dialog */}
      <Dialog open={showDuplicateConfirm} onOpenChange={setShowDuplicateConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Potential Duplicate Found</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {potentialDuplicate && (
              <Alert>
                <AlertDescription>
                  An educator with the name "{potentialDuplicate.firstName} {potentialDuplicate.lastName}" already exists. 
                  Is this the same person you want to assign to this school?
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDuplicateConfirm(false);
                setPotentialDuplicate(null);
              }}
            >
              No, Continue Creating
            </Button>
            <Button
              onClick={() => {
                if (potentialDuplicate && onSwitchToAssign) {
                  onSwitchToAssign(potentialDuplicate.id);
                  setShowDuplicateConfirm(false);
                  setPotentialDuplicate(null);
                  onOpenChange(false);
                }
              }}
              className="bg-wildflower-blue hover:bg-wildflower-blue/90"
            >
              Yes, Switch to Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}