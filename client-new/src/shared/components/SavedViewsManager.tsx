import React, { useState } from 'react';
import { Button as MButton, FormControl, Menu, MenuItem } from '@mui/material';
import { Button as UIButton } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useSavedViews, type SavedView } from '@/shared/hooks/useSavedViews';

interface SavedViewsManagerProps {
  entityType: 'educator' | 'school' | 'charter';
  onApplyView: (view: SavedView) => void;
  onSaveCurrentView: () => {
    filters: Record<string, any>;
    sortModel: Array<{ colId: string; sort: 'asc' | 'desc' }>;
    columnState: Array<{ colId: string; hide?: boolean; width?: number; pinned?: 'left' | 'right' | null }>;
    quickFilter: string;
  };
}

export function SavedViewsManager({ entityType, onApplyView, onSaveCurrentView }: SavedViewsManagerProps) {
  const { savedViews, saveView, deleteView, renameView } = useSavedViews(entityType);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [selectedView, setSelectedView] = useState<string>('');
  const [svAnchor, setSvAnchor] = useState<null | HTMLElement>(null);
  const openSv = Boolean(svAnchor);
  const openSvMenu = (e: React.MouseEvent<HTMLButtonElement>) => setSvAnchor(e.currentTarget);
  const closeSvMenu = () => setSvAnchor(null);
  const [showManageDialog, setShowManageDialog] = useState(false);

  const handleSaveView = () => {
    if (!newViewName.trim()) {
      alert('Please enter a name for the view');
      return;
    }

    // Check if name already exists
    if (savedViews.some(view => view.name.toLowerCase() === newViewName.toLowerCase())) {
      alert('A view with this name already exists');
      return;
    }

    const currentState = onSaveCurrentView();
    saveView(
      newViewName,
      currentState.filters,
      currentState.sortModel,
      currentState.columnState,
      currentState.quickFilter
    );
    
    setNewViewName('');
    setShowSaveDialog(false);
  };

  const handleApplyView = (viewId: string) => {
    const view = savedViews.find(v => v.id === viewId);
    if (view) {
      onApplyView(view);
      setSelectedView('');
    }
  };

  const handleDeleteView = (viewId: string) => {
    if (confirm('Are you sure you want to delete this saved view?')) {
      deleteView(viewId);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {/* Saved Views Dropdown */}
      <FormControl size="small" sx={{ m: 0, alignSelf: 'center' }}>
        <MButton
          variant="contained"
          size="small"
          onClick={openSvMenu}
          sx={{
            height: 36,
            minHeight: 36,
            textTransform: 'none',
            fontSize: 14,
            fontFamily: 'inherit',
            fontWeight: 500,
            borderRadius: '6px',
            px: 1.5,
            boxShadow: 'none',
            backgroundColor: '#0f8a8d',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#0b6e71' },
          }}
          aria-controls={openSv ? 'savedviews-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={openSv ? 'true' : undefined}
        >
          {selectedView ? (savedViews.find(v => v.id === selectedView)?.name ?? 'Saved views') : 'Saved views'}
          <span style={{ marginLeft: 8, opacity: 0.9 }}>▾</span>
        </MButton>
        <Menu id="savedviews-menu" anchorEl={svAnchor} open={openSv} onClose={closeSvMenu} elevation={2}
          MenuListProps={{ dense: true }}
          PaperProps={{ sx: { borderRadius: 1, mt: 0.5 } }}
        >
          {savedViews.length === 0 ? (
            <MenuItem disabled sx={{ fontSize: 12, py: 0.5, minHeight: 'auto' }}>No saved views</MenuItem>
          ) : (
            savedViews.map((view) => (
              <MenuItem key={view.id} sx={{ fontSize: 12, py: 0.5, minHeight: 'auto' }} onClick={() => { handleApplyView(view.id); setSelectedView(view.id); closeSvMenu(); }}>
                {view.name}
              </MenuItem>
            ))
          )}
        </Menu>
      </FormControl>

      {/* Save Current View Button */}
      <MButton
        variant="contained"
        size="small"
        onClick={() => setShowSaveDialog(true)}
        sx={{
          height: 36,
          minHeight: 36,
          textTransform: 'none',
          fontSize: 14,
          fontFamily: 'inherit',
          borderRadius: '6px',
          px: 1.5,
          boxShadow: 'none',
          backgroundColor: '#0f8a8d',
          color: '#ffffff',
          '&:hover': { backgroundColor: '#0b6e71' },
        }}
      >
        Save View
      </MButton>

      {/* Manage Views Button */}
      {savedViews.length > 0 && (
        <MButton
          variant="contained"
          size="small"
          onClick={() => setShowManageDialog(true)}
          sx={{
            height: 36,
            minHeight: 36,
            textTransform: 'none',
            fontSize: 14,
            fontFamily: 'inherit',
            borderRadius: '6px',
            px: 1.5,
            boxShadow: 'none',
            backgroundColor: '#0f8a8d',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#0b6e71' },
          }}
        >
          Manage
        </MButton>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={() => setShowSaveDialog(false)}
        >
          <div
            style={{
              minWidth: 400,
              maxWidth: '90vw',
              background: '#ffffff',
              borderRadius: 8,
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.2)',
              overflow: 'hidden',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                fontWeight: 600,
              }}
            >
              <span>Save Current View</span>
              <button 
                type="button" 
                onClick={() => setShowSaveDialog(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  View Name
                </label>
                <Input
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  placeholder="Enter a name for this view..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveView();
                    } else if (e.key === 'Escape') {
                      setShowSaveDialog(false);
                    }
                  }}
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <UIButton variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </UIButton>
                <UIButton variant="primary" onClick={handleSaveView}>
                  Save View
                </UIButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Dialog */}
      {showManageDialog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={() => setShowManageDialog(false)}
        >
          <div
            style={{
              minWidth: 500,
              maxWidth: '90vw',
              background: '#ffffff',
              borderRadius: 8,
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.2)',
              overflow: 'hidden',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                fontWeight: 600,
              }}
            >
              <span>Manage Saved Views</span>
              <button 
                type="button" 
                onClick={() => setShowManageDialog(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              {savedViews.map((view) => (
                <div
                  key={view.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>{view.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Created {new Date(view.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <UIButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleApplyView(view.id)}
                      style={{ fontSize: '12px' }}
                    >
                      Apply
                    </UIButton>
                    <UIButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteView(view.id)}
                      style={{ fontSize: '12px', color: '#dc2626' }}
                    >
                      Delete
                    </UIButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
