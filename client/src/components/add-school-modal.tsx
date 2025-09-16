import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { SCHOOLS_SCHEMA } from "@/types/ui-schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { createSchool } from "@/integrations/supabase/wftls";

const addSchoolSchema = SCHOOLS_SCHEMA.pick({
  name: true,
  shortName: true,
  agesServed: true,
  governanceModel: true,
  about: true,
  phone: true,
  email: true,
  website: true,
  membershipStatus: true
}).extend({
  name: z.string().min(1, "School name is required")
});

interface AddSchoolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddSchoolModal({ open, onOpenChange }: AddSchoolModalProps) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(addSchoolSchema),
    defaultValues: {
      name: "",
      shortName: "",
      agesServed: [],
      governanceModel: "",
      about: "",
      phone: "",
      email: "",
      website: "",
      membershipStatus: ""
    },
  });

  const createSchoolMutation = useMutation({
    mutationFn: async (data: any) => createSchool(data),
    onSuccess: async () => {
      // Invalidate Supabase-backed queries for schools
      queryClient.invalidateQueries({ queryKey: ["supabase/grid_school"] });
      queryClient.invalidateQueries({ queryKey: ["supabase/details_schools"] });
      await queryClient.refetchQueries({ queryKey: ["supabase/grid_school"] });
      toast({ title: "Success", description: "School created successfully" });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error("School creation error:", error);
      const errorMessage = error?.message || error?.response?.data?.message || "Failed to create school";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    },
  });

  const onSubmit = (data: any) => {
    createSchoolMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New School</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter school name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shortName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter short name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="governanceModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Governance Model</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select governance model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Independent">Independent</SelectItem>
                        <SelectItem value="Charter">Charter</SelectItem>
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="membershipStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Membership Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select membership status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Member school">Member school</SelectItem>
                        <SelectItem value="Affiliated non-member">Affiliated non-member</SelectItem>
                        <SelectItem value="Membership terminated">Membership terminated</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>



            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" placeholder="Enter phone number" />
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
                      <Input {...field} type="email" placeholder="Enter email address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Enter website (e.g., example.com)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter description about the school"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-wildflower-green hover:bg-green-700"
                disabled={createSchoolMutation.isPending}
              >
                {createSchoolMutation.isPending ? "Creating..." : "Add School"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
