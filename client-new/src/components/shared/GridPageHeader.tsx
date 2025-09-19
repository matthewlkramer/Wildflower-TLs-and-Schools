import React, { useState, useEffect } from 'react';
import { Button as MButton, Menu, MenuItem } from '@mui/material';
import { cn } from '@/lib/utils';
import { controlVariants } from '@/components/ui/control';
import { Input } from '@/components/ui/input';
import { Select as MSelect, FormControl, SelectChangeEvent } from '@mui/material';
import { SavedViewsManager } from './SavedViewsManager';
import type { SavedView } from '@/hooks/useSavedViews';

type EntityType = 'educator' | 'school' | 'charter';

interface GridPageHeaderProps {
  entityType: EntityType;
  quickFilter: string;
  onQuickFilterChange: (value: string) => void;
  onAddNew?: () => void;
  currentViewMode?: 'table' | 'kanban' | 'split';
  onViewModeChange?: (viewMode: string) => void;
  onApplySavedView?: (view: SavedView) => void;
  onSaveCurrentView?: () => {
    filters: Record<string, any>;
    sortModel: Array<{ colId: string; sort: 'asc' | 'desc' }>;
    columnState: Array<{ colId: string; hide?: boolean; width?: number; pinned?: 'left' | 'right' | null }>;
    quickFilter: string;
  };
}

const ENTITY_LABELS: Record<EntityType, string> = {
  educator: 'educator',
  school: 'school', 
  charter: 'charter'
};

const ENTITY_ROUTES: Record<EntityType, string> = {
  educator: '/educators',
  school: '/schools',
  charter: '/charters'
};

export function GridPageHeader({ 
  entityType, 
  quickFilter, 
  onQuickFilterChange, 
  onAddNew,
  currentViewMode = 'table',
  onViewModeChange,
  onApplySavedView,
  onSaveCurrentView
}: GridPageHeaderProps) {
  const [viewMode, setViewMode] = useState(currentViewMode);

  // Update viewMode when currentViewMode prop changes
  useEffect(() => {
    setViewMode(currentViewMode);
  }, [currentViewMode]);

  // Unify sizing/typography across header controls
  const CONTROL_FONT_SIZE = 14;
  const CONTROL_HEIGHT = 36;
  const CONTROL_RADIUS = 6;

  const handleViewModeChange = (value: 'table' | 'kanban' | 'split') => {
    setViewMode(value);
    if (onViewModeChange) onViewModeChange(value);
  };

  const [vmAnchor, setVmAnchor] = useState<null | HTMLElement>(null);
  const openVm = Boolean(vmAnchor);
  const openVmMenu = (e: React.MouseEvent<HTMLButtonElement>) => setVmAnchor(e.currentTarget);
  const closeVmMenu = () => setVmAnchor(null);
  const selectVm = (val: 'table' | 'kanban' | 'split') => { handleViewModeChange(val); closeVmMenu(); };

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew();
    } else {
      console.log(`Add new ${ENTITY_LABELS[entityType]}`);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
      <Input
        type="text"
        placeholder="Quick filter..."
        value={quickFilter}
        onChange={(e) => onQuickFilterChange(e.target.value)}
        className={cn('flex-none w-[320px] rounded-[6px] text-[14px] border border-slate-300', controlVariants({ size: 'sm' }), 'py-0 pl-4')}
        style={{ height: 36, minHeight: 36 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <MButton 
          onClick={handleAddNew}
          variant="contained"
          size="small"
          sx={{
            height: CONTROL_HEIGHT,
            minHeight: CONTROL_HEIGHT,
            textTransform: 'none',
            fontSize: CONTROL_FONT_SIZE,
            fontFamily: 'inherit',
            fontWeight: 500,
            borderRadius: `${CONTROL_RADIUS}px`,
            px: 1.5,
            boxShadow: 'none',
            backgroundColor: '#0f8a8d',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#0b6e71' },
          }}
        >
          Add new {ENTITY_LABELS[entityType]}
        </MButton>
        <FormControl size="small" sx={{ m: 0, alignSelf: 'center' }}>
          <MButton
            variant="contained"
            size="small"
            onClick={openVmMenu}
            data-testid="view-mode-select"
            sx={{
              height: CONTROL_HEIGHT,
              minHeight: CONTROL_HEIGHT,
              textTransform: 'none',
              fontSize: CONTROL_FONT_SIZE,
              fontFamily: 'inherit',
              fontWeight: 500,
              borderRadius: `${CONTROL_RADIUS}px`,
              px: 1.5,
              boxShadow: 'none',
              backgroundColor: '#0f8a8d',
              color: '#ffffff',
              '&:hover': { backgroundColor: '#0b6e71' },
            }}
            aria-controls={openVm ? 'viewmode-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openVm ? 'true' : undefined}
          >
            {viewMode === 'table' ? 'Table' : viewMode === 'kanban' ? 'Kanban' : 'Split'}
            <span style={{ marginLeft: 8, opacity: 0.9 }}>▾</span>
          </MButton>
          <Menu id="viewmode-menu" anchorEl={vmAnchor} open={openVm} onClose={closeVmMenu} elevation={2}
            MenuListProps={{ dense: true }}
            PaperProps={{ sx: { borderRadius: 1, mt: 0.5 } }}
          >
            <MenuItem sx={{ fontSize: 12, py: 0.5, minHeight: 'auto' }} onClick={() => selectVm('table')}>Table</MenuItem>
            <MenuItem sx={{ fontSize: 12, py: 0.5, minHeight: 'auto' }} onClick={() => selectVm('kanban')}>Kanban</MenuItem>
            <MenuItem sx={{ fontSize: 12, py: 0.5, minHeight: 'auto' }} onClick={() => selectVm('split')}>Split</MenuItem>
          </Menu>
        </FormControl>
      </div>
      {(onApplySavedView && onSaveCurrentView) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <SavedViewsManager
            entityType={entityType}
            onApplyView={onApplySavedView}
            onSaveCurrentView={onSaveCurrentView}
          />
        </div>
      )}
    </div>
  );
}
