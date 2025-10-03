import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { TableRenderer } from './TableRenderer';
import { ListRenderer } from './ListRenderer';
import { CardRenderer } from './CardRenderer';
import { tableService, type RenderableTableData } from '../services/table-service';
import { cardService, type RenderableCard } from '../services/card-service';
import type { ViewSpec, TabSpec, BlockSpec, CardSpec, TableSpec, ListSpec, MapSpec } from '../views/types';
import { TABLE_LIST_PRESETS } from '../config/table-list-presets';

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

  return (
    <div className={`details-renderer ${className}`}>
      {tabs.length === 1 ? (
        // Single tab - render directly without tab headers
        <TabContent tab={tabs[0]} entityId={entityId} viewId={view.id} />
      ) : (
        // Multiple tabs
        <Box>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
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
                <TabContent tab={tab} entityId={entityId} viewId={view.id} />
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
  viewId: string;
};

const TabContent: React.FC<TabContentProps> = ({ tab, entityId, viewId }) => {
  return (
    <div className="space-y-6">
      {tab.blocks.map((block, index) => (
        <BlockRenderer
          key={index}
          block={block}
          entityId={entityId}
          viewId={viewId}
        />
      ))}
    </div>
  );
};

type BlockRendererProps = {
  block: BlockSpec;
  entityId: string;
  viewId: string;
};

const BlockRenderer: React.FC<BlockRendererProps> = ({ block, entityId, viewId }) => {
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

  return (
    <div className={`block-renderer ${block.width === 'half' ? 'w-1/2' : 'w-full'}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}

      {block.kind === 'table' && (
        <TableBlockRenderer
          block={block as TableSpec}
          entityId={entityId}
        />
      )}

      {block.kind === 'list' && (
        <ListBlockRenderer
          block={block as ListSpec}
          entityId={entityId}
        />
      )}

      {block.kind === 'card' && (
        <CardBlockRenderer
          block={block as CardSpec}
          entityId={entityId}
          viewId={viewId}
        />
      )}

      {block.kind === 'map' && (
        <div className="p-4 bg-gray-100 rounded">
          Map rendering not yet implemented
        </div>
      )}
    </div>
  );
};

// Table Block Renderer
const TableBlockRenderer: React.FC<{
  block: TableSpec;
  entityId: string;
}> = ({ block, entityId }) => {
  const [tableData, setTableData] = useState<RenderableTableData | null>(null);

  useEffect(() => {
    loadTableData();
  }, [block.preset, entityId]);

  const loadTableData = async () => {
    if (!block.preset) return;

    try {
      setTableData({ ...tableData!, loading: true });
      const data = await tableService.loadTableData(
        block.preset,
        entityId,
        block.module
      );
      setTableData(data);
    } catch (error) {
      console.error('Failed to load table data:', error);
      setTableData({
        spec: { readSource: '', columns: [], rowActions: [] },
        rows: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleEdit = async (rowId: any, field: string, value: any) => {
    // TODO: Implement edit logic
    console.log('Edit:', rowId, field, value);
  };

  const handleRowAction = async (rowId: any, actionId: string) => {
    // TODO: Implement row action logic
    console.log('Row action:', rowId, actionId);
  };

  const handleTableAction = async (actionId: string) => {
    // TODO: Implement table action logic
    console.log('Table action:', actionId);
  };

  if (!tableData) {
    return <div>Loading table...</div>;
  }

  return (
    <TableRenderer
      data={tableData}
      onEdit={handleEdit}
      onRowAction={handleRowAction}
      onTableAction={handleTableAction}
    />
  );
};

// List Block Renderer
const ListBlockRenderer: React.FC<{
  block: ListSpec;
  entityId: string;
}> = ({ block, entityId }) => {
  const [tableData, setTableData] = useState<RenderableTableData | null>(null);

  useEffect(() => {
    loadTableData();
  }, [block.preset, entityId]);

  const loadTableData = async () => {
    if (!block.preset) return;

    try {
      setTableData({ ...tableData!, loading: true });
      const data = await tableService.loadTableData(
        block.preset,
        entityId,
        block.module
      );
      setTableData(data);
    } catch (error) {
      console.error('Failed to load list data:', error);
      setTableData({
        spec: { readSource: '', columns: [], rowActions: [] },
        rows: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleRowAction = async (rowId: any, actionId: string) => {
    // TODO: Implement row action logic
    console.log('Row action:', rowId, actionId);
  };

  const handleTableAction = async (actionId: string) => {
    // TODO: Implement table action logic
    console.log('Table action:', actionId);
  };

  if (!tableData) {
    return <div>Loading list...</div>;
  }

  // Generate list layout from preset
  const preset = TABLE_LIST_PRESETS[block.preset as keyof typeof TABLE_LIST_PRESETS];
  const listLayout = generateListLayoutFromPreset(preset);

  return (
    <ListRenderer
      data={tableData}
      layout={listLayout}
      onRowAction={handleRowAction}
      onTableAction={handleTableAction}
    />
  );
};

// Helper function to generate list layout from preset column listLayout values
function generateListLayoutFromPreset(preset: any) {
  if (!preset?.columns) return undefined;

  const layout = {
    titleField: undefined as string | undefined,
    subtitleFields: [] as string[],
    bodyFields: [] as string[],
    badgeFields: [] as string[],
    footerFields: [] as string[],
  };

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
          break;
        case 'badge':
          layout.badgeFields.push(column.field);
          break;
        case 'footer':
          layout.footerFields.push(column.field);
          break;
      }
    }
  }

  return layout;
}

// Card Block Renderer
const CardBlockRenderer: React.FC<{
  block: CardSpec;
  entityId: string;
  viewId: string;
}> = ({ block, entityId, viewId }) => {
  const [cardData, setCardData] = useState<RenderableCard | null>(null);

  useEffect(() => {
    loadCardData();
  }, [block.fields, entityId]);

  const loadCardData = async () => {
    try {
      setCardData({ ...cardData!, loading: true });
      const data = await cardService.loadCardData(block, entityId, viewId);
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