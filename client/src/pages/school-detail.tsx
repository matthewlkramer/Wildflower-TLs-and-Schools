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
import { insertSchoolSchema, type School, type Teacher, type TeacherSchoolAssociation, type Location, type GuideAssignment, type GovernanceDocument, type SchoolNote, type Grant, type Loan } from "@shared/schema";
import { getInitials, getStatusColor } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAddNew } from "@/App";

import DeleteConfirmationModal from "@/components/delete-confirmation-modal";

// TeacherAssociationRow component for inline editing
function TeacherAssociationRow({ 
  association, 
  teacher,
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete,
  onEndStint,
  isSaving 
}: {
  association: TeacherSchoolAssociation;
  teacher?: Teacher;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  onEndStint: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({
    role: association.role || '',
    startDate: association.startDate || '',
    endDate: association.endDate || '',
    isActive: association.isActive || false
  });

  useEffect(() => {
    setEditData({
      role: association.role || '',
      startDate: association.startDate || '',
      endDate: association.endDate || '',
      isActive: association.isActive || false
    });
  }, [association]);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <TableRow>
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
        <TableCell>
          <Input
            value={editData.role}
            onChange={(e) => setEditData(prev => ({ ...prev, role: e.target.value }))}
            placeholder="Role"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.startDate}
            onChange={(e) => setEditData(prev => ({ ...prev, startDate: e.target.value }))}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.endDate}
            onChange={(e) => setEditData(prev => ({ ...prev, endDate: e.target.value }))}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Select
            value={editData.isActive ? "true" : "false"}
            onValueChange={(value) => setEditData(prev => ({ ...prev, isActive: value === "true" }))}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="h-8 px-2"
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
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2 text-orange-600 hover:text-orange-700"
            onClick={onEndStint}
          >
            End Stint
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2 text-red-600 hover:text-red-700"
            onClick={onDelete}
          >
            Delete Stint
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// GuideAssignmentRow component for inline editing
function GuideAssignmentRow({ 
  assignment, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  isSaving 
}: {
  assignment: GuideAssignment;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({
    guideShortName: assignment.guideShortName || '',
    type: assignment.type || '',
    startDate: assignment.startDate || '',
    endDate: assignment.endDate || '',
    isActive: assignment.isActive || false
  });

  useEffect(() => {
    setEditData({
      guideShortName: assignment.guideShortName || '',
      type: assignment.type || '',
      startDate: assignment.startDate || '',
      endDate: assignment.endDate || '',
      isActive: assignment.isActive || false
    });
  }, [assignment]);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            value={editData.guideShortName}
            onChange={(e) => setEditData(prev => ({ ...prev, guideShortName: e.target.value }))}
            placeholder="Guide short name"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.type}
            onChange={(e) => setEditData(prev => ({ ...prev, type: e.target.value }))}
            placeholder="Type"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.startDate}
            onChange={(e) => setEditData(prev => ({ ...prev, startDate: e.target.value }))}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.endDate}
            onChange={(e) => setEditData(prev => ({ ...prev, endDate: e.target.value }))}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Select
            value={editData.isActive ? "true" : "false"}
            onValueChange={(value) => setEditData(prev => ({ ...prev, isActive: value === "true" }))}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="h-8 px-2"
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
      <TableCell>{assignment.guideShortName || '-'}</TableCell>
      <TableCell>{assignment.type || '-'}</TableCell>
      <TableCell>{assignment.startDate || '-'}</TableCell>
      <TableCell>{assignment.endDate || '-'}</TableCell>
      <TableCell>
        <Badge 
          variant={assignment.isActive ? "default" : "secondary"}
          className={assignment.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
        >
          {assignment.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

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
    currentPhysicalAddress: location.currentPhysicalAddress || false,
    currentMailingAddress: location.currentMailingAddress || false,
    startDate: location.startDate || "",
    endDate: location.endDate || "",
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        address: location.address || "",
        currentPhysicalAddress: location.currentPhysicalAddress || false,
        currentMailingAddress: location.currentMailingAddress || false,
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
          <input
            type="checkbox"
            checked={editData.currentPhysicalAddress}
            onChange={(e) => setEditData({...editData, currentPhysicalAddress: e.target.checked})}
            className="h-4 w-4"
          />
        </TableCell>
        <TableCell>
          <input
            type="checkbox"
            checked={editData.currentMailingAddress}
            onChange={(e) => setEditData({...editData, currentMailingAddress: e.target.checked})}
            className="h-4 w-4"
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
      <TableCell>
        <input 
          type="checkbox" 
          checked={location.currentPhysicalAddress || false} 
          readOnly 
          className="h-4 w-4"
        />
      </TableCell>
      <TableCell>
        <input 
          type="checkbox" 
          checked={location.currentMailingAddress || false} 
          readOnly 
          className="h-4 w-4"
        />
      </TableCell>
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

// GovernanceDocumentRow component for inline editing
function GovernanceDocumentRow({ 
  document, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  isSaving 
}: {
  document: GovernanceDocument;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({
    docType: document.docType || "",
    doc: document.doc || "",
    dateEntered: document.dateEntered || "",
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        docType: document.docType || "",
        doc: document.doc || "",
        dateEntered: document.dateEntered || "",
      });
    }
  }, [isEditing, document]);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            value={editData.docType}
            onChange={(e) => setEditData({...editData, docType: e.target.value})}
            placeholder="Document Type"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.doc}
            onChange={(e) => setEditData({...editData, doc: e.target.value})}
            placeholder="Document"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.dateEntered}
            onChange={(e) => setEditData({...editData, dateEntered: e.target.value})}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="h-8 px-2"
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
      <TableCell>{document.docType || '-'}</TableCell>
      <TableCell>{document.doc || '-'}</TableCell>
      <TableCell>{document.dateEntered || '-'}</TableCell>
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

// SchoolNoteRow component for inline editing
function SchoolNoteRow({ 
  note, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  isSaving 
}: {
  note: SchoolNote;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({
    dateCreated: note.dateCreated || "",
    createdBy: note.createdBy || "",
    notes: note.notes || "",
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        dateCreated: note.dateCreated || "",
        createdBy: note.createdBy || "",
        notes: note.notes || "",
      });
    }
  }, [isEditing, note]);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            type="date"
            value={editData.dateCreated}
            onChange={(e) => setEditData({...editData, dateCreated: e.target.value})}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.createdBy}
            onChange={(e) => setEditData({...editData, createdBy: e.target.value})}
            placeholder="Created By"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.notes}
            onChange={(e) => setEditData({...editData, notes: e.target.value})}
            placeholder="Notes"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="h-8 px-2"
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
      <TableCell>{note.dateCreated || '-'}</TableCell>
      <TableCell>{note.createdBy || '-'}</TableCell>
      <TableCell>{note.notes || '-'}</TableCell>
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

// GrantRow component for inline editing
function GrantRow({ 
  grant, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  isSaving 
}: {
  grant: Grant;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({
    amount: grant.amount || 0,
    issuedDate: grant.issuedDate || "",
    issuedBy: grant.issuedBy || "",
    status: grant.status || "",
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        amount: grant.amount || 0,
        issuedDate: grant.issuedDate || "",
        issuedBy: grant.issuedBy || "",
        status: grant.status || "",
      });
    }
  }, [isEditing, grant]);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            type="number"
            value={editData.amount}
            onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value) || 0})}
            placeholder="Amount"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.issuedDate}
            onChange={(e) => setEditData({...editData, issuedDate: e.target.value})}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.issuedBy}
            onChange={(e) => setEditData({...editData, issuedBy: e.target.value})}
            placeholder="Issued By"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.status}
            onChange={(e) => setEditData({...editData, status: e.target.value})}
            placeholder="Status"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="h-8 px-2"
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
      <TableCell>{grant.amount ? `$${grant.amount.toLocaleString()}` : '-'}</TableCell>
      <TableCell>{grant.issuedDate || '-'}</TableCell>
      <TableCell>{grant.issuedBy || '-'}</TableCell>
      <TableCell>{grant.status || '-'}</TableCell>
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

// LoanRow component for inline editing
function LoanRow({ 
  loan, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  isSaving 
}: {
  loan: Loan;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({
    amount: loan.amount || 0,
    status: loan.status || "",
    interestRate: loan.interestRate || 0,
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        amount: loan.amount || 0,
        status: loan.status || "",
        interestRate: loan.interestRate || 0,
      });
    }
  }, [isEditing, loan]);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            type="number"
            value={editData.amount}
            onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value) || 0})}
            placeholder="Amount"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.status}
            onChange={(e) => setEditData({...editData, status: e.target.value})}
            placeholder="Status"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            step="0.01"
            value={editData.interestRate}
            onChange={(e) => setEditData({...editData, interestRate: parseFloat(e.target.value) || 0})}
            placeholder="Interest Rate"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="h-8 px-2"
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
      <TableCell>{loan.amount ? `$${loan.amount.toLocaleString()}` : '-'}</TableCell>
      <TableCell>{loan.status || '-'}</TableCell>
      <TableCell>{loan.interestRate ? `${loan.interestRate}%` : '-'}</TableCell>
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
  const { setAddNewOptions } = useAddNew();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [deletingLocationId, setDeletingLocationId] = useState<string | null>(null);
  const [locationDeleteModalOpen, setLocationDeleteModalOpen] = useState(false);
  const [isCreatingLocation, setIsCreatingLocation] = useState(false);
  const [isCreatingTeacher, setIsCreatingTeacher] = useState(false);
  const [isAssociatingTeacher, setIsAssociatingTeacher] = useState(false);
  const [isCreatingGuideAssignment, setIsCreatingGuideAssignment] = useState(false);
  const [editingAssociationId, setEditingAssociationId] = useState<string | null>(null);
  const [deletingAssociationId, setDeletingAssociationId] = useState<string | null>(null);
  const [associationDeleteModalOpen, setAssociationDeleteModalOpen] = useState(false);
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);
  const [deletingGuideId, setDeletingGuideId] = useState<string | null>(null);
  const [guideDeleteModalOpen, setGuideDeleteModalOpen] = useState(false);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(null);
  const [documentDeleteModalOpen, setDocumentDeleteModalOpen] = useState(false);
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [noteDeleteModalOpen, setNoteDeleteModalOpen] = useState(false);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [editingGrantId, setEditingGrantId] = useState<string | null>(null);
  const [deletingGrantId, setDeletingGrantId] = useState<string | null>(null);
  const [grantDeleteModalOpen, setGrantDeleteModalOpen] = useState(false);
  const [isCreatingGrant, setIsCreatingGrant] = useState(false);
  const [editingLoanId, setEditingLoanId] = useState<string | null>(null);
  const [deletingLoanId, setDeletingLoanId] = useState<string | null>(null);
  const [loanDeleteModalOpen, setLoanDeleteModalOpen] = useState(false);
  const [isCreatingLoan, setIsCreatingLoan] = useState(false);
  const [newLocation, setNewLocation] = useState({
    address: "",
    currentPhysicalAddress: false,
    currentMailingAddress: false,
    startDate: "",
    endDate: "",
  });
  const [newDocument, setNewDocument] = useState({
    docType: "",
    doc: "",
    dateEntered: "",
  });
  const [newNote, setNewNote] = useState({
    dateCreated: "",
    createdBy: "",
    notes: "",
  });
  const [newGrant, setNewGrant] = useState({
    amount: 0,
    issuedDate: "",
    issuedBy: "",
    status: "",
  });
  const [newLoan, setNewLoan] = useState({
    amount: 0,
    status: "",
    interestRate: 0,
  });

  const { toast } = useToast();

  // Update Add New options when active tab changes
  useEffect(() => {
    const getAddNewOptions = () => {
      switch (activeTab) {
        case "tls":
          return [
            { label: "Create New Educator", onClick: () => setIsCreatingTeacher(true) },
            { label: "Associate Existing Educator", onClick: () => setIsAssociatingTeacher(true) }
          ];
        case "locations":
          return [{ label: "Add Location", onClick: () => setIsCreatingLocation(true) }];
        case "governance":
          return [{ label: "Add Document", onClick: () => setIsCreatingDocument(true) }];
        case "guides":
          return [{ label: "Add Guide Assignment", onClick: () => setIsCreatingGuideAssignment(true) }];
        case "notes":
          return [
            { label: "Add Note", onClick: () => setIsCreatingNote(true) },
            { label: "Add Action Step", onClick: () => console.log("Add Action Step - to be implemented") }
          ];
        case "grants":
          return [
            { label: "Add Grant", onClick: () => setIsCreatingGrant(true) },
            { label: "Add Loan", onClick: () => setIsCreatingLoan(true) }
          ];
        default:
          return [];
      }
    };

    const options = getAddNewOptions();
    setAddNewOptions(options);
  }, [activeTab, setAddNewOptions]);


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

  const { data: guideAssignments, isLoading: guidesLoading } = useQuery<GuideAssignment[]>({
    queryKey: [`/api/guide-assignments/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/guide-assignments/school/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch guide assignments");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: governanceDocuments, isLoading: documentsLoading } = useQuery<GovernanceDocument[]>({
    queryKey: [`/api/governance-documents/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/governance-documents/school/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch governance documents");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: grants, isLoading: grantsLoading } = useQuery<Grant[]>({
    queryKey: [`/api/grants/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/grants/school/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch grants");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: loans, isLoading: loansLoading } = useQuery<Loan[]>({
    queryKey: [`/api/loans/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/loans/school/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch loans");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: schoolNotes, isLoading: notesLoading } = useQuery<SchoolNote[]>({
    queryKey: [`/api/school-notes/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/school-notes/school/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch school notes");
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
        currentPhysicalAddress: false,
        currentMailingAddress: false,
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

  const updateAssociationMutation = useMutation({
    mutationFn: async ({ associationId, data }: { associationId: string; data: any }) => {
      return await apiRequest("PUT", `/api/teacher-school-associations/${associationId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/school-associations", id] });
      setEditingAssociationId(null);
      toast({
        title: "Success",
        description: "Teacher association updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update teacher association",
        variant: "destructive",
      });
    },
  });

  const deleteAssociationMutation = useMutation({
    mutationFn: async (associationId: string) => {
      return await apiRequest("DELETE", `/api/teacher-school-associations/${associationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/school-associations", id] });
      setAssociationDeleteModalOpen(false);
      setDeletingAssociationId(null);
      toast({
        title: "Success",
        description: "Teacher association deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete teacher association",
        variant: "destructive",
      });
    },
  });

  const endStintMutation = useMutation({
    mutationFn: async (associationId: string) => {
      const today = new Date().toISOString().split('T')[0];
      return await apiRequest("PUT", `/api/teacher-school-associations/${associationId}`, {
        endDate: today,
        isActive: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/school-associations", id] });
      toast({
        title: "Success",
        description: "Teacher stint ended successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to end teacher stint",
        variant: "destructive",
      });
    },
  });

  const updateGuideAssignmentMutation = useMutation({
    mutationFn: async ({ guideId, data }: { guideId: string; data: any }) => {
      return await apiRequest("PUT", `/api/guide-assignments/${guideId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/guide-assignments/school/${id}`] });
      setEditingGuideId(null);
      toast({
        title: "Success",
        description: "Guide assignment updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update guide assignment",
        variant: "destructive",
      });
    },
  });

  const deleteGuideAssignmentMutation = useMutation({
    mutationFn: async (guideId: string) => {
      return await apiRequest("DELETE", `/api/guide-assignments/${guideId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/guide-assignments/school/${id}`] });
      setGuideDeleteModalOpen(false);
      setDeletingGuideId(null);
      toast({
        title: "Success",
        description: "Guide assignment deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete guide assignment",
        variant: "destructive",
      });
    },
  });

  // Governance document mutations
  const createGovernanceDocumentMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/governance-documents", {
        ...data,
        schoolId: id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/governance-documents/school/${id}`] });
      setIsCreatingDocument(false);
      setNewDocument({ docType: "", doc: "", dateEntered: "" });
      toast({
        title: "Success",
        description: "Governance document created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create governance document",
        variant: "destructive",
      });
    },
  });

  const updateGovernanceDocumentMutation = useMutation({
    mutationFn: async ({ documentId, data }: { documentId: string; data: any }) => {
      return await apiRequest("PATCH", `/api/governance-documents/${documentId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/governance-documents/school/${id}`] });
      setEditingDocumentId(null);
      toast({
        title: "Success",
        description: "Governance document updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update governance document",
        variant: "destructive",
      });
    },
  });

  const deleteGovernanceDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      return await apiRequest("DELETE", `/api/governance-documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/governance-documents/school/${id}`] });
      setDocumentDeleteModalOpen(false);
      setDeletingDocumentId(null);
      toast({
        title: "Success",
        description: "Governance document deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete governance document",
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-slate-200 overflow-x-auto">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-wildflower-blue px-3 py-3 flex-shrink-0">
                    {school.name}
                  </h1>
                  <TabsList className="flex bg-transparent h-auto p-0 w-max">
                  <TabsTrigger value="summary" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="tls" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    TLs
                  </TabsTrigger>
                  <TabsTrigger value="locations" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Locations
                  </TabsTrigger>
                  <TabsTrigger value="governance" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Governance
                  </TabsTrigger>
                  <TabsTrigger value="guides" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Guides
                  </TabsTrigger>
                  <TabsTrigger value="support" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Support
                  </TabsTrigger>
                  <TabsTrigger value="grants" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Grants/Loans
                  </TabsTrigger>
                  <TabsTrigger value="membership" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Membership Fees
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Notes/Actions
                  </TabsTrigger>
                  <TabsTrigger value="linked" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Linked Email/Meetings
                  </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="p-6">
                <TabsContent value="summary" className="mt-0">
                  <div className="space-y-8">
                    {/* Basic School Information */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center mr-4">
                          {school.logo ? (
                            <img 
                              src={school.logo} 
                              alt={`${school.name} logo`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-center">
                              <svg className="w-6 h-6 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-xs text-slate-400 mt-1">Logo</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-wildflower-blue font-medium">{school.name || '-'}</p>
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
                        <div>
                          <label className="text-sm font-medium text-slate-600">Instagram</label>
                          <p className="text-sm text-slate-900">{school.instagram || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Facebook</label>
                          <p className="text-sm text-slate-900">{school.facebook || '-'}</p>
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
                              <TableHead className="w-[200px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {associations.map((association) => {
                              const teacher = teachers?.find(t => t.id === association.educatorId);
                              return (
                                <TeacherAssociationRow
                                  key={association.id}
                                  association={association}
                                  teacher={teacher}
                                  isEditing={editingAssociationId === association.id}
                                  onEdit={() => setEditingAssociationId(association.id)}
                                  onSave={(data) => updateAssociationMutation.mutate({ associationId: association.id, data })}
                                  onCancel={() => setEditingAssociationId(null)}
                                  onDelete={() => {
                                    setDeletingAssociationId(association.id);
                                    setAssociationDeleteModalOpen(true);
                                  }}
                                  onEndStint={() => endStintMutation.mutate(association.id)}
                                  isSaving={updateAssociationMutation.isPending}
                                />
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <p>No teachers found for this school.</p>
                        <p className="text-sm mt-2">Use the buttons above to create educators or associate existing educators with this school.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="locations" className="mt-0">
                  <div className="space-y-4">
                    
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
                                  <input
                                    type="checkbox"
                                    checked={newLocation.currentPhysicalAddress}
                                    onChange={(e) => setNewLocation({...newLocation, currentPhysicalAddress: e.target.checked})}
                                    className="h-4 w-4"
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="checkbox"
                                    checked={newLocation.currentMailingAddress}
                                    onChange={(e) => setNewLocation({...newLocation, currentMailingAddress: e.target.checked})}
                                    className="h-4 w-4"
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
                                          currentPhysicalAddress: false,
                                          currentMailingAddress: false,
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
                    
                    {documentsLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ) : governanceDocuments && governanceDocuments.length > 0 ? (
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Document Type</TableHead>
                              <TableHead>Document</TableHead>
                              <TableHead>Date Entered</TableHead>
                              <TableHead className="w-[120px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {isCreatingDocument && (
                              <TableRow>
                                <TableCell>
                                  <Input
                                    value={newDocument.docType}
                                    onChange={(e) => setNewDocument({...newDocument, docType: e.target.value})}
                                    placeholder="Document Type"
                                    className="h-8"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={newDocument.doc}
                                    onChange={(e) => setNewDocument({...newDocument, doc: e.target.value})}
                                    placeholder="Document"
                                    className="h-8"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="date"
                                    value={newDocument.dateEntered}
                                    onChange={(e) => setNewDocument({...newDocument, dateEntered: e.target.value})}
                                    className="h-8"
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      onClick={() => createGovernanceDocumentMutation.mutate(newDocument)}
                                      disabled={createGovernanceDocumentMutation.isPending}
                                      className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setIsCreatingDocument(false);
                                        setNewDocument({ docType: "", doc: "", dateEntered: "" });
                                      }}
                                      disabled={createGovernanceDocumentMutation.isPending}
                                      className="h-8 px-2"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                            {governanceDocuments.map((document) => (
                              <GovernanceDocumentRow
                                key={document.id}
                                document={document}
                                isEditing={editingDocumentId === document.id}
                                onEdit={() => setEditingDocumentId(document.id)}
                                onSave={(data) => updateGovernanceDocumentMutation.mutate({ documentId: document.id, data })}
                                onCancel={() => setEditingDocumentId(null)}
                                onDelete={() => {
                                  setDeletingDocumentId(document.id);
                                  setDocumentDeleteModalOpen(true);
                                }}
                                isSaving={updateGovernanceDocumentMutation.isPending}
                              />
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <p>No governance documents found for this school.</p>
                        <p className="text-sm mt-2">Use the "Add Document" button above to create governance documents.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="guides" className="mt-0">
                  <div className="space-y-4">
                    
                    {guidesLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ) : guideAssignments && guideAssignments.length > 0 ? (
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Guide Short Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Start Date</TableHead>
                              <TableHead>End Date</TableHead>
                              <TableHead>Currently Active</TableHead>
                              <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {guideAssignments.map((assignment) => (
                              <GuideAssignmentRow
                                key={assignment.id}
                                assignment={assignment}
                                isEditing={editingGuideId === assignment.id}
                                onEdit={() => setEditingGuideId(assignment.id)}
                                onSave={(data) => updateGuideAssignmentMutation.mutate({ guideId: assignment.id, data })}
                                onCancel={() => setEditingGuideId(null)}
                                onDelete={() => {
                                  setDeletingGuideId(assignment.id);
                                  setGuideDeleteModalOpen(true);
                                }}
                                isSaving={updateGuideAssignmentMutation.isPending}
                              />
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <p>No guide assignments found for this school.</p>
                        <p className="text-sm mt-2">Click "Assign Guide" to create the first guide assignment.</p>
                      </div>
                    )}
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
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Grants Table */}
                      <div className="space-y-4">
                        
                        {grantsLoading ? (
                          <div className="space-y-3">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        ) : grants && grants.length > 0 || isCreatingGrant ? (
                          <div className="border rounded-lg">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Grant Amount</TableHead>
                                  <TableHead>Issued Date</TableHead>
                                  <TableHead>Issued By</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {isCreatingGrant && (
                                  <TableRow>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        value={newGrant.amount}
                                        onChange={(e) => setNewGrant({...newGrant, amount: parseFloat(e.target.value) || 0})}
                                        placeholder="Grant amount"
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="date"
                                        value={newGrant.issuedDate}
                                        onChange={(e) => setNewGrant({...newGrant, issuedDate: e.target.value})}
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        value={newGrant.issuedBy}
                                        onChange={(e) => setNewGrant({...newGrant, issuedBy: e.target.value})}
                                        placeholder="Issued By"
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        value={newGrant.status}
                                        onChange={(e) => setNewGrant({...newGrant, status: e.target.value})}
                                        placeholder="Status"
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          onClick={() => {/* grant mutation here */}}
                                          className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
                                        >
                                          Save
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setIsCreatingGrant(false);
                                            setNewGrant({ amount: 0, issuedDate: "", issuedBy: "", status: "" });
                                          }}
                                          className="h-8 px-2"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                                {grants?.map((grant) => (
                                  <GrantRow
                                    key={grant.id}
                                    grant={grant}
                                    isEditing={editingGrantId === grant.id}
                                    onEdit={() => setEditingGrantId(grant.id)}
                                    onSave={(data) => {/* grant update mutation */}}
                                    onCancel={() => setEditingGrantId(null)}
                                    onDelete={() => {
                                      setDeletingGrantId(grant.id);
                                      setGrantDeleteModalOpen(true);
                                    }}
                                    isSaving={false}
                                  />
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <p>No grants found for this school.</p>
                            <p className="text-sm mt-2">Use the "Add Grant" button above to create grants.</p>
                          </div>
                        )}
                      </div>

                      {/* Loans Table */}
                      <div className="space-y-4">
                        
                        {loansLoading ? (
                          <div className="space-y-3">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        ) : loans && loans.length > 0 || isCreatingLoan ? (
                          <div className="border rounded-lg">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Loan Amount</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Interest Rate</TableHead>
                                  <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {isCreatingLoan && (
                                  <TableRow>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        value={newLoan.amount}
                                        onChange={(e) => setNewLoan({...newLoan, amount: parseFloat(e.target.value) || 0})}
                                        placeholder="Loan amount"
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        value={newLoan.status}
                                        onChange={(e) => setNewLoan({...newLoan, status: e.target.value})}
                                        placeholder="Status"
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={newLoan.interestRate}
                                        onChange={(e) => setNewLoan({...newLoan, interestRate: parseFloat(e.target.value) || 0})}
                                        placeholder="Interest Rate"
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          onClick={() => {/* loan mutation here */}}
                                          className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
                                        >
                                          Save
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setIsCreatingLoan(false);
                                            setNewLoan({ amount: 0, status: "", interestRate: 0 });
                                          }}
                                          className="h-8 px-2"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                                {loans?.map((loan) => (
                                  <LoanRow
                                    key={loan.id}
                                    loan={loan}
                                    isEditing={editingLoanId === loan.id}
                                    onEdit={() => setEditingLoanId(loan.id)}
                                    onSave={(data) => {/* loan update mutation */}}
                                    onCancel={() => setEditingLoanId(null)}
                                    onDelete={() => {
                                      setDeletingLoanId(loan.id);
                                      setLoanDeleteModalOpen(true);
                                    }}
                                    isSaving={false}
                                  />
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <p>No loans found for this school.</p>
                            <p className="text-sm mt-2">Use the "Add Loan" button above to create loans.</p>
                          </div>
                        )}
                      </div>
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
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* School Notes Table */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-900">School Notes</h4>
                        {notesLoading ? (
                          <div className="space-y-3">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        ) : schoolNotes && schoolNotes.length > 0 || isCreatingNote ? (
                          <div className="border rounded-lg">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Created By</TableHead>
                                  <TableHead>Notes</TableHead>
                                  <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {isCreatingNote && (
                                  <TableRow>
                                    <TableCell>
                                      <Input
                                        type="date"
                                        value={newNote.dateCreated}
                                        onChange={(e) => setNewNote({...newNote, dateCreated: e.target.value})}
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        value={newNote.createdBy}
                                        onChange={(e) => setNewNote({...newNote, createdBy: e.target.value})}
                                        placeholder="Created by"
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        value={newNote.notes}
                                        onChange={(e) => setNewNote({...newNote, notes: e.target.value})}
                                        placeholder="Note content"
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          onClick={() => {/* note creation mutation */}}
                                          className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
                                        >
                                          Save
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setIsCreatingNote(false);
                                            setNewNote({ dateCreated: "", createdBy: "", notes: "" });
                                          }}
                                          className="h-8 px-2"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                                {schoolNotes?.map((note) => (
                                  <TableRow key={note.id}>
                                    <TableCell>{note.dateCreated || '-'}</TableCell>
                                    <TableCell>{note.createdBy || '-'}</TableCell>
                                    <TableCell>{note.notes || '-'}</TableCell>
                                    <TableCell>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => setEditingNoteId(note.id)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setDeletingNoteId(note.id);
                                            setNoteDeleteModalOpen(true);
                                          }}
                                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <p>No notes found for this school.</p>
                            <p className="text-sm mt-2">Use the "Add Note" button above to create notes.</p>
                          </div>
                        )}
                      </div>

                      {/* Action Steps Table */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-900">Action Steps</h4>
                        <div className="text-center py-8 text-slate-500">
                          <p>Action steps will be displayed here.</p>
                          <p className="text-sm mt-2">Future implementation for action items.</p>
                        </div>
                      </div>
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

      <DeleteConfirmationModal
        open={associationDeleteModalOpen}
        onOpenChange={setAssociationDeleteModalOpen}
        onConfirm={() => {
          if (deletingAssociationId) {
            deleteAssociationMutation.mutate(deletingAssociationId);
          }
        }}
        title="Delete Teacher Stint"
        description="Are you sure you want to delete this teacher stint? This action cannot be undone."
        isLoading={deleteAssociationMutation.isPending}
      />

      <DeleteConfirmationModal
        open={guideDeleteModalOpen}
        onOpenChange={setGuideDeleteModalOpen}
        onConfirm={() => {
          if (deletingGuideId) {
            deleteGuideAssignmentMutation.mutate(deletingGuideId);
          }
        }}
        title="Delete Guide Assignment"
        description="Are you sure you want to delete this guide assignment? This action cannot be undone."
        isLoading={deleteGuideAssignmentMutation.isPending}
      />

      <DeleteConfirmationModal
        open={documentDeleteModalOpen}
        onOpenChange={setDocumentDeleteModalOpen}
        onConfirm={() => {
          if (deletingDocumentId) {
            deleteGovernanceDocumentMutation.mutate(deletingDocumentId);
          }
        }}
        title="Delete Governance Document"
        description="Are you sure you want to delete this governance document? This action cannot be undone."
        isLoading={deleteGovernanceDocumentMutation.isPending}
      />
    </>
  );
}
