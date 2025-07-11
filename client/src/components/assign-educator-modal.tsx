import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { type Educator } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

const assignEducatorSchema = z.object({
  educatorId: z.string().min(1, "Please select an educator"),
  role: z.array(z.string()).min(1, "Please select at least one role"),
  startDate: z.string().min(1, "Start date is required"),
  emailAtSchool: z.string().email("Please enter a valid email").optional().or(z.literal("")),
});

interface AssignEducatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
}

export default function AssignEducatorModal({ open, onOpenChange, schoolId }: AssignEducatorModalProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: educators = [] } = useQuery<Educator[]>({
    queryKey: ["/api/teachers"], // Using legacy endpoint for compatibility
    enabled: open,
  });

  // Filter educators based on search term
  const filteredEducators = useMemo(() => {
    if (!searchTerm) return educators;
    const term = searchTerm.toLowerCase();
    return educators.filter(educator => 
      (educator.fullName || `${educator.firstName} ${educator.lastName}`).toLowerCase().includes(term) ||
      (educator.firstName || "").toLowerCase().includes(term) ||
      (educator.lastName || "").toLowerCase().includes(term)
    );
  }, [educators, searchTerm]);

  const form = useForm({
    resolver: zodResolver(assignEducatorSchema),
    defaultValues: {
      educatorId: "",
      role: [],
      startDate: "",
      emailAtSchool: "",
    },
  });

  const assignEducatorMutation = useMutation({
    mutationFn: async (data: z.infer<typeof assignEducatorSchema>) => {
      return await apiRequest("POST", "/api/teacher-school-associations", {
        educatorId: data.educatorId,
        schoolId: schoolId,
        role: data.role,
        startDate: data.startDate,
        emailAtSchool: data.emailAtSchool,
        isActive: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/school-associations", schoolId] });
      toast({
        title: "Success",
        description: "Educator assigned to school successfully",
      });
      form.reset();
      setSearchTerm("");
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
                  <FormLabel>Select Educator</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search educators..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an educator" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredEducators.map((educator) => (
                            <SelectItem key={educator.id} value={educator.id}>
                              {educator.fullName || `${educator.firstName} ${educator.lastName}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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