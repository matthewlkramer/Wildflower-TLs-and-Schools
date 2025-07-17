import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  FileText,
  Edit,
  Copy,
  Settings,
  Plus,
  Trash2,
  Eye,
  Download,
  History
} from "lucide-react";
import { format } from "date-fns";

interface PromissoryNoteTemplate {
  id: number;
  name: string;
  templateType: string;
  version: number;
  content: string;
  variableFields: any[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateField {
  id: number;
  templateId: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  placeholder: string;
  isRequired: boolean;
  defaultValue?: string;
  sortOrder: number;
}

const templateTypeLabels = {
  standard: "Standard Loan",
  founders: "Founder's Note",
  bridge: "Bridge Loan",
  emergency: "Emergency Loan"
};

const fieldTypeOptions = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "currency", label: "Currency" },
  { value: "date", label: "Date" },
  { value: "address", label: "Address" }
];

export default function PromissoryNoteManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<PromissoryNoteTemplate | null>(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showFieldDialog, setShowFieldDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<PromissoryNoteTemplate> | null>(null);
  const [editingField, setEditingField] = useState<Partial<TemplateField> | null>(null);

  // Fetch templates
  const { data: templates, isLoading: templatesLoading } = useQuery<PromissoryNoteTemplate[]>({
    queryKey: ["/api/promissory-note-templates"],
  });

  // Fetch fields for selected template
  const { data: templateFields, isLoading: fieldsLoading } = useQuery<TemplateField[]>({
    queryKey: ["/api/promissory-note-templates", selectedTemplate?.id, "fields"],
    enabled: !!selectedTemplate?.id
  });

  // Create/update template mutation
  const templateMutation = useMutation({
    mutationFn: async (template: Partial<PromissoryNoteTemplate>) => {
      if (template.id) {
        return apiRequest("PUT", `/api/promissory-note-templates/${template.id}`, template);
      } else {
        return apiRequest("POST", "/api/promissory-note-templates", template);
      }
    },
    onSuccess: () => {
      toast({
        title: "Template Saved",
        description: "Promissory note template has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/promissory-note-templates"] });
      setShowTemplateDialog(false);
      setEditingTemplate(null);
    },
    onError: (error: any) => {
      console.error("Template save error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save template.",
        variant: "destructive",
      });
    },
  });

  // Create new version mutation
  const newVersionMutation = useMutation({
    mutationFn: async ({ templateId, updates }: { templateId: number; updates: any }) => {
      return apiRequest("POST", `/api/promissory-note-templates/${templateId}/new-version`, {
        ...updates,
        createdBy: "Admin User" // TODO: Get from auth context
      });
    },
    onSuccess: () => {
      toast({
        title: "New Version Created",
        description: "A new template version has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/promissory-note-templates"] });
      setShowTemplateDialog(false);
      setEditingTemplate(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create new template version.",
        variant: "destructive",
      });
    },
  });

  // Field mutation
  const fieldMutation = useMutation({
    mutationFn: async (field: Partial<TemplateField>) => {
      if (field.id) {
        return apiRequest("PUT", `/api/template-fields/${field.id}`, field);
      } else {
        return apiRequest("POST", "/api/template-fields", field);
      }
    },
    onSuccess: () => {
      toast({
        title: "Field Saved",
        description: "Template field has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/promissory-note-templates", selectedTemplate?.id, "fields"] });
      setShowFieldDialog(false);
      setEditingField(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save field.",
        variant: "destructive",
      });
    },
  });

  // Delete field mutation
  const deleteFieldMutation = useMutation({
    mutationFn: async (fieldId: number) => {
      return apiRequest("DELETE", `/api/template-fields/${fieldId}`);
    },
    onSuccess: () => {
      toast({
        title: "Field Deleted",
        description: "Template field has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/promissory-note-templates", selectedTemplate?.id, "fields"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete field.",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const getTemplatesByType = () => {
    if (!templates) return {};
    return templates.reduce((acc, template) => {
      if (!acc[template.templateType]) {
        acc[template.templateType] = [];
      }
      acc[template.templateType].push(template);
      return acc;
    }, {} as Record<string, PromissoryNoteTemplate[]>);
  };

  const getCurrentVersion = (templateType: string) => {
    const typeTemplates = templates?.filter(t => t.templateType === templateType) || [];
    return Math.max(...typeTemplates.map(t => t.version), 0);
  };

  const openEditTemplate = (template: PromissoryNoteTemplate, asNewVersion = false) => {
    if (asNewVersion) {
      setEditingTemplate({
        ...template,
        id: undefined, // Remove ID for new version
        version: getCurrentVersion(template.templateType) + 1,
        createdBy: "Admin User"
      });
    } else {
      setEditingTemplate(template);
    }
    setShowTemplateDialog(true);
  };

  const parseAndCreateFields = async (templateId: number, content: string) => {
    try {
      const response = await apiRequest("POST", "/api/parse-template-fields", { content });
      const fields = response.fields || [];
      
      // Create field records for parsed fields
      for (let i = 0; i < fields.length; i++) {
        const fieldPlaceholder = fields[i];
        const fieldName = fieldPlaceholder.replace(/[\[\]$]/g, '').replace(/\s+/g, '_').toUpperCase();
        
        await apiRequest("POST", "/api/template-fields", {
          templateId,
          fieldName,
          fieldLabel: fieldName.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
          fieldType: fieldName.includes('AMOUNT') || fieldName.includes('FEE') ? 'currency' : 
                     fieldName.includes('DATE') ? 'date' : 'text',
          placeholder: fieldPlaceholder,
          isRequired: true,
          sortOrder: i + 1
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/promissory-note-templates", templateId, "fields"] });
    } catch (error) {
      console.error("Error parsing template fields:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Promissory Note Templates</h1>
          <p className="text-muted-foreground">Manage promissory note templates and generate documents</p>
        </div>
        <Button
          onClick={() => {
            setEditingTemplate({
              name: "",
              templateType: "standard",
              version: 1,
              content: "",
              variableFields: [],
              isActive: true,
              createdBy: "Admin User"
            });
            setShowTemplateDialog(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="fields">Field Management</TabsTrigger>
          <TabsTrigger value="preview">Preview & Test</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-6">
            {Object.entries(getTemplatesByType()).map(([templateType, typeTemplates]) => (
              <Card key={templateType}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {templateTypeLabels[templateType as keyof typeof templateTypeLabels] || templateType}
                  </CardTitle>
                  <CardDescription>
                    {typeTemplates.length} version{typeTemplates.length !== 1 ? 's' : ''} available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {typeTemplates
                      .sort((a, b) => b.version - a.version)
                      .map((template) => (
                        <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{template.name}</span>
                                <Badge variant={template.isActive ? "default" : "secondary"}>
                                  v{template.version}
                                </Badge>
                                {template.isActive && (
                                  <Badge variant="outline">Active</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Created by {template.createdBy} on {formatDate(template.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedTemplate(template);
                                setShowPreviewDialog(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedTemplate(template)}
                            >
                              <Settings className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditTemplate(template)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditTemplate(template, true)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fields" className="space-y-4">
          {!selectedTemplate ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Select a template from the Templates tab to manage its fields</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Fields for {selectedTemplate.name} v{selectedTemplate.version}</span>
                  <Button
                    onClick={() => {
                      setEditingField({
                        templateId: selectedTemplate.id,
                        fieldName: "",
                        fieldLabel: "",
                        fieldType: "text",
                        placeholder: "",
                        isRequired: true,
                        sortOrder: (templateFields?.length || 0) + 1
                      });
                      setShowFieldDialog(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {fieldsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Field Name</TableHead>
                          <TableHead>Label</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Placeholder</TableHead>
                          <TableHead>Required</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {templateFields?.map((field) => (
                          <TableRow key={field.id}>
                            <TableCell className="font-medium">{field.fieldName}</TableCell>
                            <TableCell>{field.fieldLabel}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{field.fieldType}</Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{field.placeholder}</TableCell>
                            <TableCell>
                              <Badge variant={field.isRequired ? "default" : "secondary"}>
                                {field.isRequired ? "Required" : "Optional"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingField(field);
                                    setShowFieldDialog(true);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteFieldMutation.mutate(field.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          {!selectedTemplate ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Select a template to preview and test document generation</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Preview: {selectedTemplate.name} v{selectedTemplate.version}</CardTitle>
                <CardDescription>
                  Test template field population and document generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">
                      {selectedTemplate.content.substring(0, 500)}...
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Full Preview
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Sample
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Template Edit Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate?.id ? "Edit Template" : "Create New Template"}
            </DialogTitle>
          </DialogHeader>
          {editingTemplate && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Template Name</Label>
                  <Input
                    value={editingTemplate.name || ""}
                    onChange={(e) => setEditingTemplate({
                      ...editingTemplate,
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Template Type</Label>
                  <Select
                    value={editingTemplate.templateType || "standard"}
                    onValueChange={(value) => setEditingTemplate({
                      ...editingTemplate,
                      templateType: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Loan</SelectItem>
                      <SelectItem value="founders">Founder's Note</SelectItem>
                      <SelectItem value="bridge">Bridge Loan</SelectItem>
                      <SelectItem value="emergency">Emergency Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Template Content</Label>
                <Textarea
                  className="min-h-[300px] font-mono text-sm"
                  value={editingTemplate.content || ""}
                  onChange={(e) => setEditingTemplate({
                    ...editingTemplate,
                    content: e.target.value
                  })}
                  placeholder="Enter your template content with field placeholders like [SCHOOL_NAME], [LOAN_AMOUNT], etc."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => {
                if (editingTemplate?.id && getCurrentVersion(editingTemplate.templateType || "") > (editingTemplate.version || 0)) {
                  // Creating new version
                  newVersionMutation.mutate({
                    templateId: editingTemplate.id,
                    updates: editingTemplate
                  });
                } else {
                  // Creating new or updating existing
                  const { createdAt, updatedAt, ...templateData } = editingTemplate!;
                  const cleanedData = {
                    ...templateData,
                    createdBy: templateData.createdBy || "Admin User"
                  };
                  templateMutation.mutate(cleanedData);
                }
              }}
              disabled={templateMutation.isPending || newVersionMutation.isPending}
            >
              {editingTemplate?.id && getCurrentVersion(editingTemplate.templateType || "") > (editingTemplate.version || 0)
                ? "Create New Version"
                : "Save Template"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Field Edit Dialog */}
      <Dialog open={showFieldDialog} onOpenChange={setShowFieldDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingField?.id ? "Edit Field" : "Add Field"}
            </DialogTitle>
          </DialogHeader>
          {editingField && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Field Name</Label>
                  <Input
                    value={editingField.fieldName || ""}
                    onChange={(e) => setEditingField({
                      ...editingField,
                      fieldName: e.target.value
                    })}
                    placeholder="SCHOOL_NAME"
                  />
                </div>
                <div>
                  <Label>Field Label</Label>
                  <Input
                    value={editingField.fieldLabel || ""}
                    onChange={(e) => setEditingField({
                      ...editingField,
                      fieldLabel: e.target.value
                    })}
                    placeholder="School Name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Field Type</Label>
                  <Select
                    value={editingField.fieldType || "text"}
                    onValueChange={(value) => setEditingField({
                      ...editingField,
                      fieldType: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Placeholder</Label>
                  <Input
                    value={editingField.placeholder || ""}
                    onChange={(e) => setEditingField({
                      ...editingField,
                      placeholder: e.target.value
                    })}
                    placeholder="[SCHOOL_NAME]"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => fieldMutation.mutate(editingField!)}
              disabled={fieldMutation.isPending}
            >
              Save Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Template Preview: {selectedTemplate?.name} v{selectedTemplate?.version}
            </DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="py-4">
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">
                  {selectedTemplate.content}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}