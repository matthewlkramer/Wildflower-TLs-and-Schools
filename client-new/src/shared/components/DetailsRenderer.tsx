import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useLocation } from 'wouter';
import { ListRenderer } from './ListRenderer';
import { CardRenderer } from './CardRenderer';
import { BannerRenderer } from './BannerRenderer';
import { MapRenderer } from './MapRenderer';
import { cardService, type RenderableCard } from '../services/card-service';
import type { ViewSpec, TabSpec, BlockSpec, CardSpec, ListSpec, MapSpec } from '../views/types';
import { TABLE_LIST_PRESETS } from '../config/table-list-presets';
import { getViewSourceTable } from '../views/view-table-mapping';
import { useDialog } from '@/shared/components/ConfirmDialog';
import { supabase } from '@/core/supabase/client';
import { handleListRowAction } from './list-row-actions';
import { InitiateAdviceModal } from './InitiateAdviceModal';
import { ConcludeAdviceModal } from './ConcludeAdviceModal';

export type DetailsRendererProps = {
  view: ViewSpec;
  entityId: string;
  className?: string;
};

export const DetailsRenderer: React.FC<DetailsRendererProps> = ({
  view,
  entityId,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = view.tabs;
  const sourceTable = getViewSourceTable(view.id);

  return (
    <div className={`details-renderer ${className}`}>
      {/* Banner (if specified) */}
      {view.banner && (
        <BannerRenderer
          banner={view.banner}
          entityId={entityId}
          sourceTable={sourceTable}
          fieldMetadata={view.fieldMetadata}
        />
      )}

      {/* Tabs */}
      {tabs.length === 1 ? (
        // Single tab - render directly without tab headers
        <TabContent tab={tabs[0]} entityId={entityId} sourceTable={sourceTable} fieldMetadata={view.fieldMetadata} />
      ) : (
        // Multiple tabs
        <Box>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={tab.id} label={tab.label} />
            ))}
          </Tabs>
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              role="tabpanel"
              hidden={activeTab !== index}
              className="mt-4"
            >
              {activeTab === index && (
                <TabContent tab={tab} entityId={entityId} sourceTable={sourceTable} fieldMetadata={view.fieldMetadata} />
              )}
            </div>
          ))}
        </Box>
      )}
    </div>
  );
};

type TabContentProps = {
  tab: TabSpec;
  entityId: string;
  sourceTable: string;
  fieldMetadata?: import('../types/detail-types').FieldMetadataMap;
};

const TabContent: React.FC<TabContentProps> = ({ tab, entityId, sourceTable, fieldMetadata }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {tab.blocks.map((block, index) => (
        <BlockRenderer
          key={index}
          block={block}
          entityId={entityId}
          sourceTable={sourceTable}
          fieldMetadata={fieldMetadata}
        />
      ))}
    </div>
  );
};

type BlockRendererProps = {
  block: BlockSpec;
  entityId: string;
  sourceTable: string;
  fieldMetadata?: import('../types/detail-types').FieldMetadataMap;
};

const BlockRenderer: React.FC<BlockRendererProps> = ({ block, entityId, sourceTable, fieldMetadata }) => {
  const [isVisible, setIsVisible] = useState(true);

  // TODO: Implement visibility logic

  if (!isVisible) return null;

  // Get title from preset for table/list blocks
  let title: string | undefined;
  if (block.kind === 'table' || block.kind === 'list') {
    const preset = TABLE_LIST_PRESETS[block.preset as keyof typeof TABLE_LIST_PRESETS];
    title = preset?.title;
  } else {
    title = block.title;
  }

  // Determine width - default is 'half' for cards, 'full' for tables
  const width = block.width ?? (block.kind === 'table' ? 'full' : 'half');

  const containerStyle: React.CSSProperties = {
    flex: width === 'full' ? '1 1 100%' : '1 1 calc(50% - 12px)',
    minWidth: width === 'full' ? '100%' : '260px',
  };

  return (
    <div style={containerStyle}>
      {/* Title is now handled inside each renderer component */}

      {block.kind === 'list' && (
        <ListBlockRenderer
          block={block as ListSpec}
          entityId={entityId}
          fieldMetadata={fieldMetadata}
        />
      )}

      {block.kind === 'card' && (
        <CardBlockRenderer
          block={block as CardSpec}
          entityId={entityId}
          sourceTable={sourceTable}
          fieldMetadata={fieldMetadata}
        />
      )}

      {block.kind === 'map' && (
        <MapBlockRenderer
          block={block as MapSpec}
          entityId={entityId}
          sourceTable={sourceTable}
          fieldMetadata={fieldMetadata}
        />
      )}
    </div>
  );
};

// List Block Renderer
const ListBlockRenderer: React.FC<{
  block: ListSpec;
  entityId: string;
  fieldMetadata?: import('../types/detail-types').FieldMetadataMap;
}> = ({ block, entityId, fieldMetadata }) => {
  const [listData, setListData] = useState<import('../services/card-service').RenderableListData | null>(null);
  const [showAdviceModal, setShowAdviceModal] = useState<{stage: 'Visioning' | 'Planning', type: 'initiate' | 'conclude' | 'reopen'} | null>(null);

  useEffect(() => {
    loadListData();
  }, [block.preset, entityId]);

  const loadListData = async () => {
    if (!block.preset) return;

    try {
      setListData({ ...listData!, loading: true, rows: [], preset: block.preset });
      const data = await cardService.loadListData(
        block.preset,
        entityId,
        block.module,
        block.activeFilter,
        fieldMetadata
      );
      setListData(data);
    } catch (error) {
      console.error('Failed to load list data:', error);
      setListData({
        preset: block.preset,
        rows: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const dialog = useDialog();
  const [, setLocation] = useLocation();

  const handleRowAction = async (rowId: any, actionId: string) => {
    await handleListRowAction(rowId, actionId, listData!, block.preset!, dialog, setLocation, loadListData);
  };

  const handleTableAction = async (actionId: string) => {
    // Handle advice-specific table actions
    if (actionId === 'initiateVisioningAdvice') {
      setShowAdviceModal({ stage: 'Visioning', type: 'initiate' });
    } else if (actionId === 'initiatePlanningAdvice') {
      setShowAdviceModal({ stage: 'Planning', type: 'initiate' });
    } else if (actionId === 'concludeVisioningAdvice') {
      setShowAdviceModal({ stage: 'Visioning', type: 'conclude' });
    } else if (actionId === 'concludePlanningAdvice') {
      setShowAdviceModal({ stage: 'Planning', type: 'conclude' });
    } else if (actionId === 'reopenVisioningAdvice') {
      await handleReopenAdvice('Visioning');
    } else if (actionId === 'reopenPlanningAdvice') {
      await handleReopenAdvice('Planning');
    } else if (actionId === 'abandonVisioningAdvice') {
      await handleAbandonAdvice('Visioning');
    } else if (actionId === 'abandonPlanningAdvice') {
      await handleAbandonAdvice('Planning');
    } else {
      console.log('Unknown table action:', actionId);
    }
  };

  const handleReopenAdvice = async (stage: 'Visioning' | 'Planning') => {
    const confirmed = await dialog.confirm(
      `Are you sure you want to reopen the ${stage} advice process?`,
      { title: 'Reopen Advice', variant: 'warning' }
    );

    if (!confirmed) return;

    try {
      const statusField = stage === 'Visioning' ? 'visioning_advice_loop_status' : 'planning_advice_loop_status';
      const { error } = await supabase
        .from('school_ssj_data')
        .update({ [statusField]: 'Open' })
        .eq('school_id', entityId);

      if (error) throw error;

      await loadListData();
    } catch (error) {
      console.error('Error reopening advice:', error);
      await dialog.alert('Failed to reopen advice process.', { title: 'Error', variant: 'error' });
    }
  };

  const handleAbandonAdvice = async (stage: 'Visioning' | 'Planning') => {
    const confirmed = await dialog.confirm(
      `Are you sure you want to abandon the ${stage} advice process? This will set the advice status to 'Abandoned', the SSJ stage to 'Paused', and the school status to 'Paused'.`,
      { title: 'Abandon Advice', variant: 'warning' }
    );

    if (!confirmed) return;

    try {
      // Update advice loop status
      const statusField = stage === 'Visioning' ? 'visioning_advice_loop_status' : 'planning_advice_loop_status';
      const { error: ssjError } = await supabase
        .from('school_ssj_data')
        .update({
          [statusField]: 'Abandoned',
          ssj_stage: 'Paused'
        })
        .eq('school_id', entityId);

      if (ssjError) throw ssjError;

      // Update school status
      const { error: schoolError } = await supabase
        .from('schools')
        .update({ status: 'Paused' })
        .eq('id', entityId);

      if (schoolError) throw schoolError;

      await loadListData();
      await dialog.alert(`${stage} advice process has been abandoned and the school has been paused.`, { title: 'Success' });
    } catch (error) {
      console.error('Error abandoning advice:', error);
      await dialog.alert('Failed to abandon advice process.', { title: 'Error', variant: 'error' });
    }
  };

  if (!listData) {
    return <div>Loading list...</div>;
  }

  // Generate list layout from preset
  const preset = TABLE_LIST_PRESETS[block.preset as keyof typeof TABLE_LIST_PRESETS];
  const listLayout = generateListLayoutFromPreset(preset, block.width);

  return (
    <>
      <ListRenderer
        data={listData}
        layout={listLayout}
        onRowAction={handleRowAction}
        onTableAction={handleTableAction}
      />

      {/* Advice Modals */}
      {showAdviceModal?.type === 'initiate' && (
        <InitiateAdviceModal
          schoolId={entityId}
          stage={showAdviceModal.stage}
          onClose={() => setShowAdviceModal(null)}
          onSuccess={() => {
            loadListData();
            setShowAdviceModal(null);
          }}
        />
      )}

      {showAdviceModal?.type === 'conclude' && (
        <ConcludeAdviceModal
          schoolId={entityId}
          stage={showAdviceModal.stage}
          onClose={() => setShowAdviceModal(null)}
          onSuccess={() => {
            loadListData();
            setShowAdviceModal(null);
          }}
        />
      )}
    </>
  );
};

// Helper function to generate list layout from preset column listLayout values
function generateListLayoutFromPreset(preset: any, containerWidth?: 'half' | 'full') {
  if (!preset?.columns) return undefined;

  const layout = {
    titleField: undefined as string | undefined,
    subtitleFields: [] as string[],
    bodyFields: [] as string[],
    badgeFields: [] as string[],
    footerFields: [] as string[],
    attachmentFields: [] as string[],
    hideLabelsForFields: [] as string[],
    logoField: undefined as string | undefined,
    bodyFieldFullWidth: false,
    containerWidth: containerWidth || 'half',
  } as any;

  for (const column of preset.columns) {
    if (typeof column === 'object' && column.listLayout) {
      switch (column.listLayout) {
        case 'title':
          layout.titleField = column.field;
          break;
        case 'subtitle':
          layout.subtitleFields.push(column.field);
          break;
        case 'body':
          layout.bodyFields.push(column.field);
          // If this field has listFieldFullWidth, add it to hideLabelsForFields
          if (column.listFieldFullWidth) {
            layout.hideLabelsForFields.push(column.field);
          }
          break;
        case 'badge':
          layout.badgeFields.push(column.field);
          break;
        case 'footer':
          layout.footerFields.push(column.field);
          break;
        case 'attachment':
          layout.attachmentFields.push(column.field);
          break;
        case 'logo':
          layout.logoField = column.field;
          break;
      }
    }
  }

  return layout;
}

// Map Block Renderer
const MapBlockRenderer: React.FC<{
  block: MapSpec;
  entityId: string;
  sourceTable: string;
  fieldMetadata?: import('../types/detail-types').FieldMetadataMap;
}> = ({ block, entityId, sourceTable, fieldMetadata }) => {
  return (
    <MapRenderer
      map={block}
      entityId={entityId}
      sourceTable={sourceTable}
      fieldMetadata={fieldMetadata}
    />
  );
};

// Card Block Renderer
const CardBlockRenderer: React.FC<{
  block: CardSpec;
  entityId: string;
  sourceTable: string;
  fieldMetadata?: import('../types/detail-types').FieldMetadataMap;
}> = ({ block, entityId, sourceTable, fieldMetadata }) => {
  const [cardData, setCardData] = useState<RenderableCard | null>(null);

  useEffect(() => {
    loadCardData();
  }, [block.fields, entityId]);

  const loadCardData = async () => {
    try {
      setCardData({ ...cardData!, loading: true });
      const data = await cardService.loadCardData(block, entityId, sourceTable, fieldMetadata);
      setCardData(data);
    } catch (error) {
      console.error('Failed to load card data:', error);
      setCardData({
        entityId,
        title: block.title,
        fields: [],
        editable: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleSave = async (changedValues: Record<string, any>) => {
    if (!cardData) return;

    try {
      await cardService.saveCardData(cardData, changedValues);
      // Reload the card data to reflect changes
      await loadCardData();
    } catch (error) {
      console.error('Failed to save card data:', error);
      throw error;
    }
  };

  if (!cardData) {
    return <div>Loading card...</div>;
  }

  return (
    <CardRenderer
      card={cardData}
      onSave={block.editable ? handleSave : undefined}
      layout="single-column"
    />
  );
};