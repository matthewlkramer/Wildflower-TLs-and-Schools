import { useState, useEffect } from 'react';

export interface SavedView {
  id: string;
  name: string;
  entityType: 'educator' | 'school' | 'charter';
  filters: Record<string, any>;
  sortModel: Array<{ colId: string; sort: 'asc' | 'desc' }>;
  columnState: Array<{ colId: string; hide?: boolean; width?: number; pinned?: 'left' | 'right' | null }>;
  quickFilter: string;
  createdAt: string;
}

const STORAGE_KEY = 'wildflower_saved_views';

export function useSavedViews(entityType: 'educator' | 'school' | 'charter') {
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);

  // Load saved views from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const allViews: SavedView[] = JSON.parse(stored);
        setSavedViews(allViews.filter(view => view.entityType === entityType));
      } catch (error) {
        console.error('Failed to parse saved views:', error);
      }
    }
  }, [entityType]);

  const saveView = (
    name: string,
    filters: Record<string, any>,
    sortModel: Array<{ colId: string; sort: 'asc' | 'desc' }>,
    columnState: Array<{ colId: string; hide?: boolean; width?: number; pinned?: 'left' | 'right' | null }>,
    quickFilter: string
  ) => {
    const newView: SavedView = {
      id: `${entityType}_${Date.now()}`,
      name,
      entityType,
      filters,
      sortModel,
      columnState,
      quickFilter,
      createdAt: new Date().toISOString()
    };

    // Get all saved views from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    let allViews: SavedView[] = [];
    if (stored) {
      try {
        allViews = JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse saved views:', error);
      }
    }

    // Add the new view
    allViews.push(newView);
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allViews));
    
    // Update local state
    setSavedViews(prev => [...prev, newView]);
    
    return newView;
  };

  const deleteView = (viewId: string) => {
    // Get all saved views from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        let allViews: SavedView[] = JSON.parse(stored);
        allViews = allViews.filter(view => view.id !== viewId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allViews));
        setSavedViews(prev => prev.filter(view => view.id !== viewId));
      } catch (error) {
        console.error('Failed to delete saved view:', error);
      }
    }
  };

  const renameView = (viewId: string, newName: string) => {
    // Get all saved views from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        let allViews: SavedView[] = JSON.parse(stored);
        const viewIndex = allViews.findIndex(view => view.id === viewId);
        if (viewIndex !== -1) {
          allViews[viewIndex].name = newName;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(allViews));
          setSavedViews(prev => prev.map(view => 
            view.id === viewId ? { ...view, name: newName } : view
          ));
        }
      } catch (error) {
        console.error('Failed to rename saved view:', error);
      }
    }
  };

  return {
    savedViews,
    saveView,
    deleteView,
    renameView
  };
}