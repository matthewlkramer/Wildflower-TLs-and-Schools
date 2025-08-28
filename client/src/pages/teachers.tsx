import TeachersGrid from "@/components/teachers-grid";
import { type Teacher } from "@shared/schema";
import { useSearch } from "@/App";
import { useCachedEducators } from "@/hooks/use-cached-data";
import { useUserFilter } from "@/contexts/user-filter-context";
import { useEffect, useState } from "react";
import { addNewEmitter } from "@/lib/add-new-emitter";
import AddEducatorModal from "@/components/add-teacher-modal";

export default function Teachers() {
  const { searchTerm } = useSearch();
  const { showOnlyMyRecords, currentUser } = useUserFilter();
  const [showAddEducatorModal, setShowAddEducatorModal] = useState(false);

  const { data: teachers, isLoading, prefetchEducator } = useCachedEducators();
  
  // Set up Add New options for teachers page
  useEffect(() => {
    const options = [
      { label: "Create New Teacher", onClick: () => setShowAddEducatorModal(true) }
    ];
    
    addNewEmitter.setOptions(options);
    
    return () => {
      addNewEmitter.setOptions([]);
    };
  }, []);

  const filteredTeachers = (teachers || []).filter((teacher: Teacher) => {
    if (!teacher) return false;
    
    // Build searchable text from teacher properties
    const fullName = teacher.fullName || `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim();
    const phone = teacher.primaryPhone || '';
    const roles = teacher.currentRole ? teacher.currentRole.join(' ') : '';
    
    // Check if search term matches any searchable field
    const searchText = searchTerm.toLowerCase();
    const matchesSearch = fullName.toLowerCase().includes(searchText) ||
                         phone.toLowerCase().includes(searchText) ||
                         roles.toLowerCase().includes(searchText);
    
    if (!matchesSearch) return false;
    
    // Apply user filter if enabled
    if (showOnlyMyRecords && currentUser) {
      // Check if current user is an assigned partner
      // For demo purposes, we'll check if any assigned partner contains 'demo'
      // In a real app, this would be based on proper user authentication
      const isMyRecord = teacher.assignedPartner && teacher.assignedPartner.length > 0 && 
                        teacher.assignedPartner.some(partner => 
                          partner && partner.toLowerCase().includes('demo')
                        );
      
      return isMyRecord;
    }
    
    return true;
  });

  return (
    <>
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <TeachersGrid 
            teachers={filteredTeachers || []} 
            isLoading={isLoading}
          />
        </div>
      </main>
      
      <AddEducatorModal 
        open={showAddEducatorModal} 
        onOpenChange={setShowAddEducatorModal} 
      />
    </>
  );
}
