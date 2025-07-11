import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Edit, Trash2, Plus, X, ExternalLink, UserMinus, Calendar, School2, User, Edit2, Eye, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Link } from "wouter";
import { useState, useEffect } from "react";
import { insertSchoolSchema, type School, type Teacher, type TeacherSchoolAssociation, type Location, type GuideAssignment, type GovernanceDocument, type SchoolNote, type Grant, type Loan, type MembershipFeeByYear, type MembershipFeeUpdate, type ActionStep, type Tax990 } from "@shared/schema";
import { getInitials, getStatusColor } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAddNew } from "@/App";

import DeleteConfirmationModal from "@/components/delete-confirmation-modal";
import { GoogleMap } from "@/components/google-map";

// TeacherAssociationRow component for inline editing
function TeacherAssociationRow({ 
  association, 
  teacher,
  school,
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
  school: School;
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
              {teacher.fullName || teacher.firstName + ' ' + teacher.lastName}
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
          <Badge 
            variant={association.role?.toString().includes('Founder') ? "default" : "secondary"}
            className={association.role?.toString().includes('Founder') ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
          >
            {association.role?.toString().includes('Founder') ? 'Yes' : 'No'}
          </Badge>
        </TableCell>
        <TableCell>
          <Input
            value={school.email || ''}
            disabled
            placeholder="Email"
            className="h-8 bg-gray-50"
          />
        </TableCell>
        <TableCell>
          <Input
            value={school.phone || ''}
            disabled
            placeholder="Phone"
            className="h-8 bg-gray-50"
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
      <TableCell>
        {association.role ? (
          <div className="flex flex-wrap gap-1">
            {Array.isArray(association.role) ? (
              association.role.flatMap((roleString, arrayIndex) => 
                roleString.split(',').map((role, roleIndex) => {
                  const trimmedRole = role.trim();
                  // Filter out Founder role from display
                  if (trimmedRole === 'Founder') return null;
                  return (
                    <Badge key={`${arrayIndex}-${roleIndex}`} variant="secondary" className="text-xs">
                      {trimmedRole}
                    </Badge>
                  );
                }).filter(Boolean)
              )
            ) : typeof association.role === 'string' ? (
              association.role.split(',').map((role, index) => {
                const trimmedRole = role.trim();
                // Filter out Founder role from display
                if (trimmedRole === 'Founder') return null;
                return (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {trimmedRole}
                  </Badge>
                );
              }).filter(Boolean)
            ) : (
              // Handle non-string roles, but still check if it's Founder
              (String(association.role) !== 'Founder' ? (<Badge variant="secondary" className="text-xs">
                {String(association.role)}
              </Badge>) : null)
            )}
          </div>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell>
        {/* Check if roles include Founder and display as badge */}
        <Badge 
          variant={
            association.role ? (
              Array.isArray(association.role) 
                ? association.role.some(roleStr => roleStr.includes('Founder'))
                : association.role.toString().includes('Founder')
            ) ? "default" : "secondary" : "secondary"
          }
          className={
            association.role ? (
              Array.isArray(association.role) 
                ? association.role.some(roleStr => roleStr.includes('Founder'))
                : association.role.toString().includes('Founder')
            ) ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800" : "bg-gray-100 text-gray-800"
          }
        >
          {association.role ? (
            Array.isArray(association.role) 
              ? association.role.some(roleStr => roleStr.includes('Founder')) 
                ? 'Yes' 
                : 'No'
              : association.role.toString().includes('Founder') 
                ? 'Yes' 
                : 'No'
          ) : 'No'}
        </Badge>
      </TableCell>
      <TableCell>
        {school.email || '-'}
      </TableCell>
      <TableCell>
        {school.phone || '-'}
      </TableCell>
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
            className="h-8 w-8 p-0"
            onClick={() => {
              if (teacher) {
                window.open(`/teachers/${teacher.id}`, '_blank');
              }
            }}
            disabled={!teacher}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
            onClick={onEndStint}
            title="End stint"
          >
            <UserMinus className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            onClick={onDelete}
            title="Delete stint"
          >
            <Trash2 className="h-4 w-4" />
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
    dateEntered: document.dateEntered || "",
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        docType: document.docType || "",
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
    <TableRow className="h-8">
      <TableCell className="py-1">
        {document.docUrl ? (
          <a 
            href={document.docUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
          >
            {document.docType || '-'}
          </a>
        ) : (
          document.docType || '-'
        )}
      </TableCell>
      <TableCell className="py-1">{document.dateEntered || '-'}</TableCell>
      <TableCell className="py-1">
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

// Tax990Row component for inline editing
function Tax990Row({ 
  tax990, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  isSaving 
}: {
  tax990: Tax990;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({
    year: tax990.year || "",
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        year: tax990.year || "",
      });
    }
  }, [isEditing, tax990]);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <TableRow className="h-8">
        <TableCell>
          <Input
            value={editData.year}
            onChange={(e) => setEditData({...editData, year: e.target.value})}
            placeholder="Year"
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
    <TableRow className="h-8">
      <TableCell className="py-1 text-sm">
        {tax990.attachmentUrl ? (
          <a 
            href={tax990.attachmentUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
          >
            {tax990.year || '-'}
          </a>
        ) : (
          tax990.year || '-'
        )}
      </TableCell>
      <TableCell className="py-1">
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
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
            title="Open"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
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
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
            title="Open"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
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
  
  // Edit states for different sections
  const [editingSupport, setEditingSupport] = useState(false);
  const [editingSystems, setEditingSystems] = useState(false);
  const [editingSystemsComm, setEditingSystemsComm] = useState(false);
  const [editingSystemsFinance, setEditingSystemsFinance] = useState(false);
  const [editingSystemsBranding, setEditingSystemsBranding] = useState(false);
  const [editingSupportOverview, setEditingSupportOverview] = useState(false);
  const [editingSupportTimeline, setEditingSupportTimeline] = useState(false);
  const [editingSupportFacility, setEditingSupportFacility] = useState(false);
  const [editingSupportFunding, setEditingSupportFunding] = useState(false);
  const [editingDetailsProgram, setEditingDetailsProgram] = useState(false);
  const [editingDetailsLegal, setEditingDetailsLegal] = useState(false);
  const [editingDetailsContact, setEditingDetailsContact] = useState(false);
  
  // Form data for editing
  const [editFormData, setEditFormData] = useState<any>({});
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);
  const [deletingGuideId, setDeletingGuideId] = useState<string | null>(null);
  const [guideDeleteModalOpen, setGuideDeleteModalOpen] = useState(false);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(null);
  const [documentDeleteModalOpen, setDocumentDeleteModalOpen] = useState(false);
  
  // Tax 990s state
  const [editingTax990Id, setEditingTax990Id] = useState<string | null>(null);
  const [deletingTax990Id, setDeletingTax990Id] = useState<string | null>(null);
  const [tax990DeleteModalOpen, setTax990DeleteModalOpen] = useState(false);
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [isCreating990, setIsCreating990] = useState(false);
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
  const [new990, setNew990] = useState({
    year: "",
    attachment: "",
    attachmentUrl: "",
  });
  const [newNote, setNewNote] = useState({
    dateCreated: "",
    createdBy: "",
    notes: "",
  });
  const [selectedNote, setSelectedNote] = useState<SchoolNote | null>(null);
  const [selectedActionStep, setSelectedActionStep] = useState<ActionStep | null>(null);
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
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editedDetails, setEditedDetails] = useState<any>(null);

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
          return [
            { label: "Add Governance Document", onClick: () => setIsCreatingDocument(true) },
            { label: "Add 990", onClick: () => setIsCreating990(true) }
          ];
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
        case "membership":
          return []; // No add functionality on this tab
        case "summary":
        case "details":
        case "support":
        case "systems":
          return []; // These tabs have no add functionality
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

  // Membership Fees data
  const { data: membershipFeesByYear, isLoading: feesLoading } = useQuery<MembershipFeeByYear[]>({
    queryKey: [`/api/membership-fees-by-year/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/membership-fees-by-year/school/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch membership fees");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: membershipFeeUpdates, isLoading: updatesLoading } = useQuery<MembershipFeeUpdate[]>({
    queryKey: [`/api/membership-fee-updates/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/membership-fee-updates/school/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch membership fee updates");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: actionSteps, isLoading: actionStepsLoading } = useQuery<ActionStep[]>({
    queryKey: [`/api/action-steps/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/action-steps/school/${id}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch action steps");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: tax990s, isLoading: tax990sLoading } = useQuery<Tax990[]>({
    queryKey: [`/api/tax-990s/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/tax-990s/school/${id}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch 990s");
      return response.json();
    },
    enabled: !!id,
  });

  // Metadata for dropdown options
  const { data: fieldOptions } = useQuery<any>({
    queryKey: ["/api/metadata/school-field-options"],
    queryFn: async () => {
      const response = await fetch("/api/metadata/school-field-options", { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch field options");
      return response.json();
    },
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

  const updateSchoolDetailsMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", `/api/schools/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schools"] });
      queryClient.invalidateQueries({ queryKey: ["/api/schools", id] });
      setIsEditingDetails(false);
      setEditedDetails(null);
      toast({
        title: "Success",
        description: "School details updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update school details",
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

  // Tax 990s mutations
  const updateTax990Mutation = useMutation({
    mutationFn: async ({ tax990Id, data }: { tax990Id: string; data: any }) => {
      return await apiRequest("PATCH", `/api/tax-990s/${tax990Id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tax-990s/school/${id}`] });
      setEditingTax990Id(null);
      toast({
        title: "Success",
        description: "990 updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update 990",
        variant: "destructive",
      });
    },
  });

  const deleteTax990Mutation = useMutation({
    mutationFn: async (tax990Id: string) => {
      return await apiRequest("DELETE", `/api/tax-990s/${tax990Id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tax-990s/school/${id}`] });
      setTax990DeleteModalOpen(false);
      setDeletingTax990Id(null);
      toast({
        title: "Success",
        description: "990 deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete 990",
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

  // Helper function to handle section editing
  const handleEditSection = (section: string) => {
    if (!school) return;
    
    switch (section) {
      case 'program':
        setEditingDetailsProgram(true);
        setEditFormData({
          programFocus: school.programFocus || '',
          schoolCalendar: school.schoolCalendar || '',
          schoolSchedule: school.schoolSchedule || '',
          agesServed: school.agesServed || [],
          numberOfClassrooms: school.numberOfClassrooms || '',
          enrollmentCap: school.enrollmentCap || ''
        });
        break;
      case 'legal':
        setEditingDetailsLegal(true);
        setEditFormData({
          legalStructure: school.legalStructure || '',
          currentFYEnd: school.currentFYEnd || '',
          governanceModel: school.governanceModel || '',
          groupExemptionStatus: school.groupExemptionStatus || '',
          groupExemptionDateGranted: school.groupExemptionDateGranted || '',
          groupExemptionDateWithdrawn: school.groupExemptionDateWithdrawn || ''
        });
        break;
      case 'contact':
        setEditingDetailsContact(true);
        setEditFormData({
          primaryContactName: school.primaryContactName || '',
          primaryContactEmail: school.primaryContactEmail || '',
          primaryContactPhone: school.primaryContactPhone || '',
          website: school.website || '',
          facebook: school.facebook || '',
          instagram: school.instagram || ''
        });
        break;
      case 'support':
        setEditingSupport(true);
        setEditFormData({
          ssjTool: school.ssjTool || '',
          ssjStage: school.ssjStage || '',
          ssjOpsGuideTrack: school.ssjOpsGuideTrack || [],
          ssjReadinessRating: school.ssjReadinessRating || '',
          ssjOriginalProjectedOpenDate: school.ssjOriginalProjectedOpenDate || '',
          ssjProjOpenSchoolYear: school.ssjProjOpenSchoolYear || '',
          ssjProjectedOpen: school.ssjProjectedOpen || ''
        });
        break;
      case 'systems':
        setEditingSystems(true);
        setEditFormData({
          googleVoice: school.googleVoice || '',
          googleEmail: school.googleEmail || '',
          googleDrive: school.googleDrive || '',
          quickBooks: school.quickBooks || '',
          mailchimp: school.mailchimp || '',
          website: school.website || ''
        });
        break;
    }
  };

  const handleSaveSection = () => {
    updateSchoolMutation.mutate(editFormData);
  };

  const handleCancelEdit = () => {
    setEditingSupport(false);
    setEditingSystems(false);
    setEditingSystemsComm(false);
    setEditingSystemsFinance(false);
    setEditingSystemsBranding(false);
    setEditingSupportOverview(false);
    setEditingSupportTimeline(false);
    setEditingSupportFacility(false);
    setEditingSupportFunding(false);
    setEditingDetailsProgram(false);
    setEditingDetailsLegal(false);
    setEditingDetailsContact(false);
    setEditFormData({});
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
                    Docs
                  </TabsTrigger>
                  <TabsTrigger value="guides" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Guides
                  </TabsTrigger>
                  <TabsTrigger value="support" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    SSJ
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
                  <div className="space-y-6">
                    {/* Header Section with Logo and Key Info */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 bg-white rounded-2xl shadow-md overflow-hidden flex items-center justify-center">
                            {(school.logoMainRectangle || school.logoMainSquare || school.logo) ? (
                              <img 
                                src={school.logoMainRectangle || school.logoMainSquare || school.logo} 
                                alt={`${school.name} logo`}
                                className="w-full h-full object-contain p-2"
                              />
                            ) : (
                              <div className="text-center">
                                <svg className="w-10 h-10 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h2 className="text-2xl font-semibold text-gray-900">{school.name}</h2>
                              <p className="text-lg text-gray-600 mt-1">{school.shortName}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider">Governance</p>
                              <p className="text-sm font-medium text-gray-900 mt-1">{school.governanceModel || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider">Ages Served</p>
                              <p className="text-sm font-medium text-gray-900 mt-1">{school.agesServed?.join(', ') || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider">Open Date</p>
                              <p className="text-sm font-medium text-gray-900 mt-1">{school.openDate || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider">Membership</p>
                              <p className="text-sm font-medium text-gray-900 mt-1">{school.membershipStatus || 'Not specified'}</p>
                            </div>
                          </div>
                          {school.about && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">About</p>
                              <p className="text-sm text-gray-700 leading-relaxed">{school.about}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Map, Support, and Contact Info Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="overflow-hidden shadow-sm">
                        <GoogleMap 
                          latitude={school.activeLatitude} 
                          longitude={school.activeLongitude} 
                          schoolName={school.name}
                          shortName={school.shortName}
                          fallbackAddress={school.activePhysicalAddress}
                          schoolLogo={school.logoFlowerOnly || school.logoMainSquare || school.logo}
                        />
                      </Card>
                      <Card className="shadow-sm">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Support</CardTitle>
                            <div className="flex gap-2 text-sm">
                              <span className={school.status && ['planning', 'startup', 'visioning'].includes(school.status.toLowerCase()) ? 'font-bold text-gray-900' : 'text-gray-400'}>
                                SSJ
                              </span>
                              <span className={school.status && ['open', 'year 1'].includes(school.status.toLowerCase()) ? 'font-bold text-gray-900' : 'text-gray-400'}>
                                Open
                              </span>
                              <span className={school.status && ['disaffiliated', 'permanently closed'].includes(school.status.toLowerCase()) ? 'font-bold text-gray-900' : 'text-gray-400'}>
                                Closed
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* SSJ status fields */}
                          {school.status && ['planning', 'startup', 'visioning'].includes(school.status.toLowerCase()) && (
                            <>
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">SSJ Stage</h4>
                                <p className="text-base text-gray-900">{school.ssjStage || school.status || 'Not specified'}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Current Guides</h4>
                                <p className="text-base text-gray-900">
                                  {school.currentGuides && school.currentGuides.length > 0 
                                    ? school.currentGuides.join(', ')
                                    : 'None assigned'
                                  }
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">SSJ Projected Open</h4>
                                <p className="text-base text-gray-900">{school.ssjProjectedOpen || 'Not specified'}</p>
                              </div>
                            </>
                          )}
                          
                          {/* Closed/Disaffiliated status fields */}
                          {school.status && (
                            school.status.toLowerCase() === 'disaffiliated' || 
                            school.status.toLowerCase() === 'permanently closed'
                          ) && (
                            <>
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Left Network Date</h4>
                                <p className="text-base text-gray-900">{school.leftNetworkDate || 'Not specified'}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Left Network Reason</h4>
                                <p className="text-base text-gray-900">{school.leftNetworkReason || 'Not specified'}</p>
                              </div>
                            </>
                          )}
                          
                          {/* Open or Year 1 status - blank for now */}
                          {school.status && ['open', 'year 1'].includes(school.status.toLowerCase()) && (
                            <div className="text-center py-4">
                              <p className="text-sm text-gray-400">No support information to display</p>
                            </div>
                          )}
                          
                          {/* No status */}
                          {!school.status && (
                            <div className="text-center py-4">
                              <p className="text-sm text-gray-400">No support information to display</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      
                      {/* Contact Info Card */}
                      <Card className="shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg">School General Contact Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Email</h4>
                            {school.email ? (
                              <a href={`mailto:${school.email}`} className="text-base text-blue-600 hover:underline">
                                {school.email}
                              </a>
                            ) : (
                              <p className="text-base text-gray-400">Not specified</p>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Phone</h4>
                            {school.phone ? (
                              <a href={`tel:${school.phone}`} className="text-base text-blue-600 hover:underline">
                                {school.phone}
                              </a>
                            ) : (
                              <p className="text-base text-gray-400">Not specified</p>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Website</h4>
                            {school.website ? (
                              <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-base text-blue-600 hover:underline">
                                {school.website}
                              </a>
                            ) : (
                              <p className="text-base text-gray-400">Not specified</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Key Information Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Leadership Card */}
                      <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            Leadership
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Founders</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              {school.founders && school.founders.length > 0 
                                ? school.founders.join(', ')
                                : 'Not specified'
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Current TLs</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              {typeof school.currentTLs === 'string' 
                                ? school.currentTLs
                                : school.currentTLs && Array.isArray(school.currentTLs) && school.currentTLs.length > 0 
                                  ? school.currentTLs.join(', ')
                                  : 'None assigned'
                              }
                            </p>
                          </div>

                        </CardContent>
                      </Card>

                      {/* School Details Card */}
                      <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <School2 className="w-4 h-4 text-green-600" />
                            School Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Enrollment Capacity</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{school.enrollmentCap || 'Not set'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Number of Classrooms</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{school.numberOfClassrooms || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Program Focus</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{school.programFocus || 'Not specified'}</p>
                          </div>

                        </CardContent>
                      </Card>

                      {/* Status & Monitoring Card */}
                      <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Status & Monitoring
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Risk Factors</p>
                            {school.riskFactors && school.riskFactors.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {school.riskFactors.map((factor, idx) => (
                                  <Badge key={idx} variant="destructive" className="text-xs">
                                    {factor}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-400 mt-1">None</p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Watchlist</p>
                            {school.watchlist && school.watchlist.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {school.watchlist.map((item, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs border-orange-300 text-orange-700">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-400 mt-1">None</p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Errors</p>
                            {school.errors && school.errors.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {school.errors.map((error, idx) => (
                                  <Badge key={idx} variant="destructive" className="text-xs">
                                    {error}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-400 mt-1">None</p>
                            )}
                          </div>
                          {school.leftNetworkDate && (
                            <div className="border-t pt-3">
                              <p className="text-xs text-red-600 uppercase tracking-wider">Left Network</p>
                              <p className="text-sm font-medium text-gray-900 mt-1">{school.leftNetworkDate}</p>
                              {school.leftNetworkReason && (
                                <p className="text-xs text-gray-600 mt-1">Reason: {school.leftNetworkReason}</p>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-0">
                  <div className="space-y-6">
                    {/* Edit Button for Details Tab */}
                    <div className="flex justify-end gap-2">
                      {isEditingDetails ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => {
                              // Convert numeric fields to numbers
                            const formattedData = {
                              ...editedDetails,
                              enrollmentCap: editedDetails.enrollmentCap && editedDetails.enrollmentCap !== '' ? Number(editedDetails.enrollmentCap) : undefined
                            };
                            updateSchoolDetailsMutation.mutate(formattedData);
                            }}
                            disabled={updateSchoolDetailsMutation.isPending}
                          >
                            Save Changes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setIsEditingDetails(false);
                              setEditedDetails(null);
                            }}
                            disabled={updateSchoolDetailsMutation.isPending}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsEditingDetails(true);
                            setEditedDetails({
                              programFocus: school?.programFocus || '',
                              agesServed: school?.agesServed || [],
                              numberOfClassrooms: school?.numberOfClassrooms || '',
                              enrollmentCap: school?.enrollmentCap || '',
                              membershipStatus: school?.membershipStatus || '',
                              legalStructure: school?.legalStructure || '',
                              currentFYEnd: school?.currentFYEnd || '',
                              governanceModel: school?.governanceModel || '',
                              groupExemptionStatus: school?.groupExemptionStatus || '',
                              groupExemptionDateGranted: school?.groupExemptionDateGranted || '',
                              groupExemptionDateWithdrawn: school?.groupExemptionDateWithdrawn || '',
                              businessInsurance: school?.businessInsurance || '',
                              billComAccount: school?.billComAccount || '',
                              email: school?.email || '',
                              phone: school?.phone || '',
                              website: school?.website || '',
                              instagram: school?.instagram || '',
                              facebook: school?.facebook || '',
                            });
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Details
                        </Button>
                      )}
                    </div>

                    {/* Program Details Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Program Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Program Focus</label>
                          {isEditingDetails ? (
                            <Input
                              type="text"
                              className="mt-1"
                              value={editedDetails?.programFocus || ''}
                              onChange={(e) => setEditedDetails({ ...editedDetails, programFocus: e.target.value })}
                            />
                          ) : (
                            <p className="text-sm text-slate-900 mt-1">{school.programFocus || '-'}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Ages Served</label>
                          {isEditingDetails ? (
                            <Select
                              value={editedDetails?.agesServed?.[0] || ''}
                              onValueChange={(value) => setEditedDetails({ 
                                ...editedDetails, 
                                agesServed: value ? [value] : [] 
                              })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select age range" />
                              </SelectTrigger>
                              <SelectContent>
                                {fieldOptions?.agesServed?.filter((option: string) => option && option.trim() !== '').map((option: string) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="mt-1">
                              {school.agesServed && school.agesServed.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {school.agesServed.map((age, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {age}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-slate-400">-</p>
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Number of Classrooms</label>
                          {isEditingDetails ? (
                            <Input
                              type="text"
                              className="mt-1"
                              value={editedDetails?.numberOfClassrooms || ''}
                              onChange={(e) => setEditedDetails({ ...editedDetails, numberOfClassrooms: e.target.value })}
                            />
                          ) : (
                            <p className="text-sm text-slate-900 mt-1">{school.numberOfClassrooms || '-'}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Enrollment Capacity</label>
                          {isEditingDetails ? (
                            <Input
                              type="text"
                              className="mt-1"
                              value={editedDetails?.enrollmentCap || ''}
                              onChange={(e) => setEditedDetails({ ...editedDetails, enrollmentCap: e.target.value })}
                            />
                          ) : (
                            <p className="text-sm text-slate-900 mt-1">{school.enrollmentCap || '-'}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Membership Status</label>
                          {isEditingDetails ? (
                            <Select
                              value={editedDetails?.membershipStatus || ''}
                              onValueChange={(value) => setEditedDetails({ ...editedDetails, membershipStatus: value })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select membership status" />
                              </SelectTrigger>
                              <SelectContent>
                                {fieldOptions?.membershipStatus?.filter((option: string) => option && option.trim() !== '').map((option: string) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-slate-900 mt-1">{school.membershipStatus || '-'}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Legal Entity Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Legal Entity</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">EIN</label>
                          <p className="text-sm text-slate-900 mt-1">-</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Legal Name</label>
                          <p className="text-sm text-slate-900 mt-1">{school.name || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Legal Structure</label>
                          {isEditingDetails ? (
                            <Input
                              type="text"
                              className="mt-1"
                              value={editedDetails?.legalStructure || ''}
                              onChange={(e) => setEditedDetails({ ...editedDetails, legalStructure: e.target.value })}
                            />
                          ) : (
                            <p className="text-sm text-slate-900 mt-1">{school.legalStructure || '-'}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Incorporation Date</label>
                          <p className="text-sm text-slate-900 mt-1">-</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nonprofit Status</label>
                          <p className="text-sm text-slate-900 mt-1">-</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Current FY End</label>
                          {isEditingDetails ? (
                            <Input
                              type="text"
                              className="mt-1"
                              value={editedDetails?.currentFYEnd || ''}
                              onChange={(e) => setEditedDetails({ ...editedDetails, currentFYEnd: e.target.value })}
                            />
                          ) : (
                            <p className="text-sm text-slate-900 mt-1">{school.currentFYEnd || '-'}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Governance Model</label>
                          {isEditingDetails ? (
                            <Select
                              value={editedDetails?.governanceModel || ''}
                              onValueChange={(value) => setEditedDetails({ ...editedDetails, governanceModel: value })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select governance model" />
                              </SelectTrigger>
                              <SelectContent>
                                {fieldOptions?.governanceModel?.filter((option: string) => option && option.trim() !== '').map((option: string) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-slate-900 mt-1">{school.governanceModel || '-'}</p>
                          )}
                        </div>
                      </div>
                      {/* Group Exemption Fields - Always show */}
                      <div className="border-t border-gray-200 mt-4 pt-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Group Exemption Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Group Exemption Status</label>
                            {isEditingDetails ? (
                              <Input
                                type="text"
                                className="mt-1"
                                value={editedDetails?.groupExemptionStatus || ''}
                                onChange={(e) => setEditedDetails({ ...editedDetails, groupExemptionStatus: e.target.value })}
                              />
                            ) : (
                              <p className="text-sm text-slate-900 mt-1">{school.groupExemptionStatus || '-'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Date Granted</label>
                            {isEditingDetails ? (
                              <Input
                                type="date"
                                className="mt-1"
                                value={editedDetails?.groupExemptionDateGranted || ''}
                                onChange={(e) => setEditedDetails({ ...editedDetails, groupExemptionDateGranted: e.target.value })}
                              />
                            ) : (
                              <p className="text-sm text-slate-900 mt-1">{school.groupExemptionDateGranted || '-'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Date Withdrawn</label>
                            {isEditingDetails ? (
                              <Input
                                type="date"
                                className="mt-1"
                                value={editedDetails?.groupExemptionDateWithdrawn || ''}
                                onChange={(e) => setEditedDetails({ ...editedDetails, groupExemptionDateWithdrawn: e.target.value })}
                              />
                            ) : (
                              <p className="text-sm text-slate-900 mt-1">{school.groupExemptionDateWithdrawn || '-'}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Business & Financial Systems Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Business & Financial Systems</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Business Insurance</label>
                          {isEditingDetails ? (
                            <Input
                              type="text"
                              className="mt-1"
                              value={editedDetails?.businessInsurance || ''}
                              onChange={(e) => setEditedDetails({ ...editedDetails, businessInsurance: e.target.value })}
                            />
                          ) : (
                            <p className="text-sm text-slate-900 mt-1">{school.businessInsurance || '-'}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">BillCom Account</label>
                          {isEditingDetails ? (
                            <Input
                              type="text"
                              className="mt-1"
                              value={editedDetails?.billComAccount || ''}
                              onChange={(e) => setEditedDetails({ ...editedDetails, billComAccount: e.target.value })}
                            />
                          ) : (
                            <p className="text-sm text-slate-900 mt-1">{school.billComAccount || '-'}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Information & Communications Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">School Contact Information & Communications</h3>
                      
                      {/* Primary Contact */}
                      <div className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">General School Email</label>
                            {isEditingDetails ? (
                              <Input
                                type="email"
                                className="mt-1"
                                value={editedDetails?.email || ''}
                                onChange={(e) => setEditedDetails({ ...editedDetails, email: e.target.value })}
                              />
                            ) : (
                              <p className="text-sm text-slate-900 mt-1">{school.email || '-'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</label>
                            {isEditingDetails ? (
                              <Input
                                type="tel"
                                className="mt-1"
                                value={editedDetails?.phone || ''}
                                onChange={(e) => setEditedDetails({ ...editedDetails, phone: e.target.value })}
                              />
                            ) : (
                              <p className="text-sm text-slate-900 mt-1">{school.phone || '-'}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Online Presence */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Online Presence</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                              <svg className="inline-block w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                              </svg>
                              Website
                            </label>
                            {isEditingDetails ? (
                              <Input
                                type="url"
                                className="mt-1"
                                value={editedDetails?.website || ''}
                                onChange={(e) => setEditedDetails({ ...editedDetails, website: e.target.value })}
                                placeholder="https://example.com"
                              />
                            ) : (
                              school.website ? (
                                <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 underline block mt-1">
                                  {school.website}
                                </a>
                              ) : (
                                <p className="text-sm text-slate-400 mt-1">-</p>
                              )
                            )}
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                              <svg className="inline-block w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                              Facebook
                            </label>
                            {isEditingDetails ? (
                              <Input
                                type="text"
                                className="mt-1"
                                value={editedDetails?.facebook || ''}
                                onChange={(e) => setEditedDetails({ ...editedDetails, facebook: e.target.value })}
                                placeholder="facebook.com/yourpage"
                              />
                            ) : (
                              school.facebook ? (
                                <a href={school.facebook.startsWith('http') ? school.facebook : `https://facebook.com/${school.facebook}`} 
                                   target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 underline block mt-1">
                                  {school.facebook}
                                </a>
                              ) : (
                                <p className="text-sm text-slate-400 mt-1">-</p>
                              )
                            )}
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                              <svg className="inline-block w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                              </svg>
                              Instagram
                            </label>
                            {isEditingDetails ? (
                              <Input
                                type="text"
                                className="mt-1"
                                value={editedDetails?.instagram || ''}
                                onChange={(e) => setEditedDetails({ ...editedDetails, instagram: e.target.value })}
                                placeholder="@yourhandle"
                              />
                            ) : (
                              school.instagram ? (
                                <a href={school.instagram.startsWith('http') ? school.instagram : `https://instagram.com/${school.instagram}`} 
                                   target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 underline block mt-1">
                                  {school.instagram}
                                </a>
                              ) : (
                                <p className="text-sm text-slate-400 mt-1">-</p>
                              )
                            )}
                          </div>
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
                              <TableHead>Name</TableHead>
                              <TableHead>Role(s)</TableHead>
                              <TableHead>Founder</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Phone</TableHead>
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
                                  school={school}
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Governance Documents - Left Column */}
                    <div className="space-y-4">
                      {documentsLoading ? (
                        <div className="space-y-3">
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                        </div>
                      ) : (
                        <>
                          <div className="border rounded-lg">
                            <Table>
                              <TableHeader>
                                <TableRow className="h-8">
                                  <TableHead className="h-8 py-1">Governance documents</TableHead>
                                  <TableHead className="h-8 py-1">Date</TableHead>
                                  <TableHead className="h-8 py-1 w-16">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {isCreatingDocument && (
                                  <TableRow className="h-8">
                                    <TableCell className="py-1">
                                      <Input
                                        value={newDocument.docType}
                                        onChange={(e) => setNewDocument({...newDocument, docType: e.target.value})}
                                        placeholder="Document Type"
                                        className="h-7 text-sm"
                                      />
                                    </TableCell>
                                    <TableCell className="py-1">
                                      <Input
                                        type="date"
                                        value={newDocument.dateEntered}
                                        onChange={(e) => setNewDocument({...newDocument, dateEntered: e.target.value})}
                                        className="h-7 text-sm"
                                      />
                                    </TableCell>
                                    <TableCell className="py-1">
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          onClick={() => createGovernanceDocumentMutation.mutate(newDocument)}
                                          disabled={createGovernanceDocumentMutation.isPending}
                                          className="h-6 px-2 bg-green-600 hover:bg-green-700 text-white text-xs"
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
                                          className="h-6 px-2 text-xs"
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                                {governanceDocuments && governanceDocuments.length > 0 ? (
                                  governanceDocuments
                                    .sort((a, b) => {
                                      // Sort by document type alphabetically
                                      const typeA = (a.docType || '').toLowerCase();
                                      const typeB = (b.docType || '').toLowerCase();
                                      return typeA.localeCompare(typeB);
                                    })
                                    .map((document) => (
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
                                  ))
                                ) : (
                                  <TableRow className="h-8">
                                    <TableCell colSpan={3} className="text-center text-gray-500 py-4 text-sm">
                                      No governance documents found
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </>
                      )}
                    </div>

                    {/* 990s - Right Column */}
                    <div className="space-y-4">
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow className="h-8">
                              <TableHead className="h-8 py-1">990 year</TableHead>
                              <TableHead className="h-8 py-1 w-16">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {isCreating990 && (
                              <TableRow className="h-8">
                                <TableCell className="py-1">
                                  <Input
                                    value={new990.year}
                                    onChange={(e) => setNew990({...new990, year: e.target.value})}
                                    placeholder="Year"
                                    className="h-7 text-sm"
                                  />
                                </TableCell>
                                <TableCell className="py-1">
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        // TODO: Implement create 990 API call
                                        console.log("Creating 990:", new990);
                                        setIsCreating990(false);
                                        setNew990({ year: "", attachment: "", attachmentUrl: "" });
                                      }}
                                      className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setIsCreating990(false);
                                        setNew990({ year: "", attachment: "", attachmentUrl: "" });
                                      }}
                                      className="h-7 px-2"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                            {tax990sLoading ? (
                              <TableRow className="h-8">
                                <TableCell colSpan={2} className="text-center py-2">
                                  Loading 990s...
                                </TableCell>
                              </TableRow>
                            ) : tax990s && tax990s.length > 0 ? (
                              tax990s
                                .sort((a, b) => {
                                  // Sort by year descending (most recent first)
                                  const yearA = parseInt(a.year || '0');
                                  const yearB = parseInt(b.year || '0');
                                  return yearB - yearA;
                                })
                                .map((tax990) => (
                                <Tax990Row
                                  key={tax990.id}
                                  tax990={tax990}
                                  isEditing={editingTax990Id === tax990.id}
                                  onEdit={() => setEditingTax990Id(tax990.id)}
                                  onSave={(data) => updateTax990Mutation.mutate({ tax990Id: tax990.id, data })}
                                  onCancel={() => setEditingTax990Id(null)}
                                  onDelete={() => {
                                    setDeletingTax990Id(tax990.id);
                                    setTax990DeleteModalOpen(true);
                                  }}
                                  isSaving={updateTax990Mutation.isPending}
                                />
                              ))
                            ) : isCreating990 ? null : (
                              <TableRow className="h-8">
                                <TableCell colSpan={2} className="text-center text-gray-500 py-4 text-sm">
                                  No 990s found
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
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
                              <TableHead>Name</TableHead>
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
                  <div className="space-y-6">
                    {/* Timeline & Milestones */}

                    {/* Timeline & Milestones */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Timeline & Milestones
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Original Projected Open Date</label>
                          <p className="text-sm text-slate-900 mt-1">{school.ssjOriginalProjectedOpenDate || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Projected Open School Year</label>
                          <p className="text-sm text-slate-900 mt-1">{school.ssjProjOpenSchoolYear || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Projected Open Date</label>
                          <p className="text-sm text-slate-900 mt-1">{school.ssjProjectedOpen || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Entered Visioning Date</label>
                          <p className="text-sm text-slate-900 mt-1">{school.enteredVisioningDate || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Entered Planning Date</label>
                          <p className="text-sm text-slate-900 mt-1">{school.enteredPlanningDate || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Entered Startup Date</label>
                          <p className="text-sm text-slate-900 mt-1">{school.enteredStartupDate || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Open Date</label>
                          <p className="text-sm text-slate-900 mt-1">{school.openDate || '-'}</p>
                        </div>
                      </div>
                    </div>

                    

                    {/* Funding & Financial */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Funding & Financial Planning
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Budget Link</label>
                          {school.budgetLink ? (
                            <a href={school.budgetLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 underline mt-1 block">
                              {school.budgetLink}
                            </a>
                          ) : (
                            <p className="text-sm text-slate-900 mt-1">-</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Albums */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Albums
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Planning Album</label>
                          <p className="text-sm text-slate-900 mt-1">{school.planningAlbum || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Visioning Album</label>
                          <p className="text-sm text-slate-900 mt-1">{school.visioningAlbum || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Cohorts */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Cohorts
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Stage</label>
                          <p className="text-sm text-slate-900 mt-1">{school.ssjStage || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Ops Guide Track</label>
                          <p className="text-sm text-slate-900 mt-1">{school.opsGuideTrack || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Readiness Rating</label>
                          <p className="text-sm text-slate-900 mt-1">{school.readinessRating || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cohorts</label>
                          <div className="mt-1">
                            {school.cohorts && school.cohorts.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {school.cohorts.map((cohort, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {cohort}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-slate-400">-</p>
                            )}
                          </div>
                        </div>
                      </div>
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
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Column 1: Membership Fee by Year Table */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-900">Membership Fee by Year</h4>
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>School Year</TableHead>
                                <TableHead>Fee Amount</TableHead>
                                <TableHead>Exempt?</TableHead>
                                <TableHead>Likelihood of paying</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {feesLoading ? (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center">
                                    Loading membership fees...
                                  </TableCell>
                                </TableRow>
                              ) : membershipFeesByYear && membershipFeesByYear.length > 0 ? (
                                membershipFeesByYear.map((fee) => (
                                  <TableRow 
                                    key={fee.id}
                                    className="cursor-pointer hover:bg-slate-50"
                                    onClick={() => console.log("Row selected", fee)}
                                  >
                                    <TableCell>{fee.schoolYear || '-'}</TableCell>
                                    <TableCell>{fee.feeAmount ? `$${fee.feeAmount.toLocaleString()}` : '-'}</TableCell>
                                    <TableCell>
                                      {fee.status && (
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          fee.status.toLowerCase().includes('exempt') 
                                            ? fee.status.toLowerCase().includes('non-exempt')
                                              ? 'bg-red-100 text-red-800'
                                              : 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                          {fee.status}
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {fee.likelihoodOfPaying ? (
                                        <span className="text-slate-900">
                                          {typeof fee.likelihoodOfPaying === 'number' 
                                            ? `${(fee.likelihoodOfPaying * 100).toFixed(0)}%`
                                            : fee.likelihoodOfPaying
                                          }
                                        </span>
                                      ) : '-'}
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center text-gray-500">
                                    No membership fees found
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      {/* Column 2: Membership Fee Updates Table */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-900">Membership Fee Updates</h4>
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Update Type</TableHead>
                                <TableHead>Attachment</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {updatesLoading ? (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-center">
                                    Loading membership fee updates...
                                  </TableCell>
                                </TableRow>
                              ) : membershipFeeUpdates && membershipFeeUpdates.length > 0 ? (
                                membershipFeeUpdates.map((update) => (
                                  <TableRow key={update.id}>
                                    <TableCell>{update.updateDate || '-'}</TableCell>
                                    <TableCell>{update.updateType || '-'}</TableCell>
                                    <TableCell>
                                      {update.attachment ? (
                                        <a 
                                          href={update.attachment} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:text-blue-800 underline"
                                        >
                                          View Attachment
                                        </a>
                                      ) : '-'}
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-center text-gray-500">
                                    No membership fee updates found
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      {/* Column 3: Calculated Fields */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-900">Calculated Fields</h4>
                        <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Total Fees Paid</label>
                            <p className="text-lg font-semibold text-slate-900">$9,800</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Outstanding Balance</label>
                            <p className="text-lg font-semibold text-slate-900">$0</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Average Annual Fee</label>
                            <p className="text-lg font-semibold text-slate-900">$4,900</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Payment History</label>
                            <p className="text-sm text-slate-900">2 years on record</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Next Due Date</label>
                            <p className="text-sm text-slate-900">2025-08-31</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-0">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* School Notes Table */}
                      <div className="space-y-4">
                        {notesLoading ? (
                          <div className="space-y-3">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        ) : schoolNotes && schoolNotes.length > 0 || isCreatingNote ? (
                          <div className="border rounded-lg overflow-hidden">
                            <Table className="table-fixed w-full">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[15%]">Date</TableHead>
                                  <TableHead className="w-[15%]">Created By</TableHead>
                                  <TableHead className="w-[45%]">Headline</TableHead>
                                  <TableHead className="w-[25%]">Actions</TableHead>
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
                                    <TableCell className="py-1 text-sm">{String(note.dateCreated || '-')}</TableCell>
                                    <TableCell className="py-1 text-sm">{String(note.createdBy || '-')}</TableCell>
                                    <TableCell className="py-1 max-w-0">
                                      <button 
                                        className="text-sm block truncate pr-2 text-left hover:text-blue-600 hover:underline cursor-pointer w-full" 
                                        title={String(note.headline || note.notes || '-')}
                                        onClick={() => setSelectedNote(note)}
                                      >
                                        {String(note.headline || note.notes || '-')}
                                      </button>
                                    </TableCell>
                                    <TableCell className="py-1">
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 w-6 p-0"
                                          onClick={() => setEditingNoteId(note.id)}
                                          title="Edit note"
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 w-6 p-0 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                          onClick={() => {/* Mark private */}}
                                          title="Mark as private"
                                        >
                                          <Eye className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                                          onClick={() => {
                                            setDeletingNoteId(note.id);
                                            setNoteDeleteModalOpen(true);
                                          }}
                                          title="Delete note"
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
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <p>No notes found for this school.</p>
                            <p className="text-sm mt-2">Use the "Add Note" button above to create notes.</p>
                          </div>
                        )}
                      </div>

                      {/* Action Steps Table */}
                      <div className="space-y-4">
                        {actionStepsLoading ? (
                          <div className="space-y-3">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        ) : actionSteps && actionSteps.length > 0 ? (
                          <div className="border rounded-lg overflow-hidden">
                            <Table className="table-fixed w-full">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[35%]">Action item</TableHead>
                                  <TableHead className="w-[15%]">Assignee</TableHead>
                                  <TableHead className="w-[15%]">Due Date</TableHead>
                                  <TableHead className="w-[15%]">Status</TableHead>
                                  <TableHead className="w-[20%]">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {actionSteps
                                  .sort((a, b) => {
                                    // Sort by status (incomplete first) then by due date
                                    if (a.isCompleted !== b.isCompleted) {
                                      return a.isCompleted ? 1 : -1;
                                    }
                                    return (a.dueDate || '').localeCompare(b.dueDate || '');
                                  })
                                  .map((step) => (
                                  <TableRow key={step.id} className="h-8">
                                    <TableCell className="py-1 max-w-0">
                                      <span className="text-sm block truncate pr-2" title={step.item || '-'}>
                                        {step.item || '-'}
                                      </span>
                                    </TableCell>
                                    <TableCell className="py-1 text-sm">{step.assignee || '-'}</TableCell>
                                    <TableCell className="py-1 text-sm">
                                      {step.dueDate ? new Date(step.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                                    </TableCell>
                                    <TableCell className="py-1">
                                      <span className={`inline-flex items-center px-1 py-1 rounded-full text-xs font-medium ${
                                        step.isCompleted 
                                          ? 'bg-green-100 text-green-800' 
                                          : step.status === 'In Progress'
                                          ? 'bg-blue-100 text-blue-800'
                                          : step.status === 'Overdue'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        {step.status || 'Pending'}
                                      </span>
                                    </TableCell>
                                    <TableCell className="py-1">
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 w-6 p-0"
                                          onClick={() => setSelectedActionStep(step)}
                                          title="Open action item details"
                                        >
                                          <ExternalLink className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 w-6 p-0"
                                          onClick={() => {/* Edit action step */}}
                                          title="Edit action item"
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className={`h-6 w-6 p-0 ${
                                            step.isCompleted 
                                              ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' 
                                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                                          }`}
                                          onClick={() => {/* Toggle complete status */}}
                                          title={step.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                                        >
                                          {step.isCompleted ? <RotateCcw className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                                          onClick={() => {/* Delete action step */}}
                                          title="Delete action item"
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
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <p>No action steps found for this school.</p>
                            <p className="text-sm mt-2">Action items will appear here when assigned.</p>
                          </div>
                        )}
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
      <DeleteConfirmationModal
        open={tax990DeleteModalOpen}
        onOpenChange={setTax990DeleteModalOpen}
        onConfirm={() => {
          if (deletingTax990Id) {
            deleteTax990Mutation.mutate(deletingTax990Id);
          }
        }}
        title="Delete 990"
        description="Are you sure you want to delete this 990 record? This action cannot be undone."
        isLoading={deleteTax990Mutation.isPending}
      />
      {/* Note View Modal */}
      {selectedNote && (
        <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Note Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Date Created</Label>
                  <p className="text-sm text-slate-900">{selectedNote.dateCreated || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Created By</Label>
                  <p className="text-sm text-slate-900">{selectedNote.createdBy || '-'}</p>
                </div>
              </div>
              {selectedNote.headline && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">Headline</Label>
                  <p className="text-sm text-slate-900">{selectedNote.headline}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium text-slate-600">Full Note</Label>
                <div className="p-3 bg-slate-50 rounded-md border">
                  <p className="text-sm text-slate-900 whitespace-pre-wrap">{selectedNote.notes || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Record ID</Label>
                  <p className="text-xs text-slate-500 font-mono">{selectedNote.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Last Modified</Label>
                  <p className="text-xs text-slate-500">{selectedNote.lastModified || '-'}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedNote(null)}>
                Close
              </Button>
              <Button onClick={() => {
                setSelectedNote(null);
                setEditingNoteId(selectedNote.id);
              }}>
                Edit Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {/* Action Step View Modal */}
      {selectedActionStep && (
        <Dialog open={!!selectedActionStep} onOpenChange={() => setSelectedActionStep(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Action Step Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Assignee</Label>
                  <p className="text-sm text-slate-900">{selectedActionStep.assignee || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Status</Label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    selectedActionStep.isCompleted 
                      ? 'bg-green-100 text-green-800' 
                      : selectedActionStep.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : selectedActionStep.status === 'Overdue'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedActionStep.status || 'Pending'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Assigned Date</Label>
                  <p className="text-sm text-slate-900">{selectedActionStep.assignedDate ? new Date(selectedActionStep.assignedDate).toLocaleDateString() : '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Due Date</Label>
                  <p className="text-sm text-slate-900">{selectedActionStep.dueDate ? new Date(selectedActionStep.dueDate).toLocaleDateString() : '-'}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">Action Item Description</Label>
                <div className="p-3 bg-slate-50 rounded-md border">
                  <p className="text-sm text-slate-900 whitespace-pre-wrap">{selectedActionStep.item || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Record ID</Label>
                  <p className="text-xs text-slate-500 font-mono">{selectedActionStep.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">School ID</Label>
                  <p className="text-xs text-slate-500 font-mono">{selectedActionStep.schoolId}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedActionStep(null)}>
                Close
              </Button>
              <Button onClick={() => {
                setSelectedActionStep(null);
                // Could add edit functionality here
              }}>
                Edit Action Step
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
