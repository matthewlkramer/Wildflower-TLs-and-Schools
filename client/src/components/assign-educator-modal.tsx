import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { type Educator } from "@shared/schema.generated";
import { queryClient } from "@/lib/queryClient";
import { useEducatorsSupabase } from "@/hooks/use-educators-supabase";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";


const assignEducatorSchema = z.object({
  educatorId: z.string().min(1, "Please select an educator"),
  role: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  emailAtSchool: z.string().email("Please enter a valid email").optional().or(z.literal("")),
});

interface AssignEducatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
  preselectedEducatorId?: string;
}

export default function AssignEducatorModal({ open, onOpenChange, schoolId, preselectedEducatorId }: AssignEducatorModalProps) {
  const { toast } = useToast();
  const [selectedEducator, setSelectedEducator] = useState<Educator | null>(null);

  const { data: educators = [] } = useEducatorsSupabase();

  const form = useForm({
    resolver: zodResolver(assignEducatorSchema),
    defaultValues: {
      educatorId: preselectedEducatorId || "",
      role: [],
      startDate: "",
      emailAtSchool: "",
    },
  });

  // Set preselected educator when provided
  useEffect(() => {
    if (preselectedEducatorId) {
      form.setValue("educatorId", preselectedEducatorId);
      const educator = educators.find(e => e.id === preselectedEducatorId);
      setSelectedEducator(educator || null);
      // Clear when educator is preselected
    }
  }, [preselectedEducatorId, form, educators]);

  const assignEducatorMutation = useMutation({
    mutationFn: async (data: z.infer<typeof assignEducatorSchema>) => {
      const payload: any = {
        people_id: data.educatorId,
        school_id: schoolId,
        role: data.role || [],
        start_date: data.startDate || null,
        role_specific_email: data.emailAtSchool || null,
        currently_active: true,
      };
      const { error } = await supabase.from('people_roles_associations').insert(payload);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      // Invalidate Supabase-driven associations list
      queryClient.invalidateQueries({ queryKey: ["supabase/details_associations", { schoolId }] });
      
      toast({
        title: "Success",
        description: "Educator assigned to school successfully",
      });
      form.reset();
      setSelectedEducator(null);
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to assign educator to school",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof assignEducatorSchema>) => {
    assignEducatorMutation.mutate(data);
  };

  const roleOptions = [
    "TL",
    "ETL",
    "Classroom Staff",
    "Fellow",
    "Other",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Educator to School</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="educatorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Educator *</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Select 
                        value={field.value} 
                        onValueChange={(value) => {
                          field.onChange(value);
                          const educator = educators.find(e => e.id === value);
                          setSelectedEducator(educator || null);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Search and select an educator">
                            {selectedEducator && (
                              <span className="text-left">
                                {selectedEducator.fullName || `${selectedEducator.firstName} ${selectedEducator.lastName}`}
                              </span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {educators.map((educator) => (
                            <SelectItem key={educator.id} value={educator.id}>
                              <div className="flex flex-col">
                          <span className="font-medium">
                            {(educator as any).full_name || educator.fullName || `${(educator as any).first_name ?? educator.firstName ?? ''} ${(educator as any).last_name ?? educator.lastName ?? ''}`}
                          </span>
                          {(educator as any).current_primary_email_address && (
                            <span className="text-sm text-gray-500">{(educator as any).current_primary_email_address}</span>
                          )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedEducator && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <strong>Selected:</strong> {(selectedEducator as any).full_name || selectedEducator.fullName || `${(selectedEducator as any).first_name ?? selectedEducator.firstName ?? ''} ${(selectedEducator as any).last_name ?? selectedEducator.lastName ?? ''}`}
                          {(selectedEducator as any).current_primary_email_address && <span className="ml-2">({(selectedEducator as any).current_primary_email_address})</span>}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={assignEducatorMutation.isPending}
                className="bg-wildflower-blue hover:bg-wildflower-blue/90"
              >
                {assignEducatorMutation.isPending ? "Assigning..." : "Assign TL to School"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
