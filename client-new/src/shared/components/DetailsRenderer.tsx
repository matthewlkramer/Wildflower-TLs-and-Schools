import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { TableRenderer } from './TableRenderer';
import { ListRenderer } from './ListRenderer';
import { CardRenderer } from './CardRenderer';
import { tableService, type RenderableTableData } from '../services/table-service';
import { cardService, type RenderableCard } from '../services/card-service';
import type { DetailTabSpec, DetailBlock, DetailTableBlock, DetailListBlock, DetailCardBlock } from '../types/detail-types';
import type { TablePresetId } from '../config/table-list-presets';

export type DetailsRendererProps = {
  tabs: DetailTabSpec[];
  entityId: string;
  className?: string;
};

export const DetailsRenderer: React.FC<DetailsRendererProps> = ({
  tabs,
  entityId,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={`details-renderer ${className}`}>
      {tabs.length === 1 ? (
        // Single tab - render directly without tab headers
        <TabContent tab={tabs[0]} entityId={entityId} />
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
                <TabContent tab={tab} entityId={entityId} />
              )}
            </div>
          ))}
        </Box>
      )}
    </div>
  );
};

type TabContentProps = {
  tab: DetailTabSpec;
  entityId: string;
};

const TabContent: React.FC<TabContentProps> = ({ tab, entityId }) => {
  return (
    <div className="space-y-6">
      {tab.blocks.map((block, index) => (
        <BlockRenderer
          key={index}
          block={block}
          entityId={entityId}
          saveTarget={tab.writeTo}
        />
      ))}
    </div>
  );
};

type BlockRendererProps = {
  block: DetailBlock;
  entityId: string;
  saveTarget?: any;
};

const BlockRenderer: React.FC<BlockRendererProps> = ({ block, entityId, saveTarget }) => {
  const [isVisible, setIsVisible] = useState(true);

  // TODO: Implement visibility logic based on block.visibleIf

  if (!isVisible) return null;

  return (
    <div className={`block-renderer ${block.width === 'half' ? 'w-1/2' : 'w-full'}`}>
      {block.title && (
        <h3 className="text-lg font-semibold mb-4">{block.title}</h3>
      )}

      {block.kind === 'table' && (
        <TableBlockRenderer
          block={block as DetailTableBlock}
          entityId={entityId}
        />
      )}

      {block.kind === 'list' && (
        <ListBlockRenderer
          block={block as DetailListBlock}
          entityId={entityId}
        />
      )}

      {block.kind === 'card' && (
        <CardBlockRenderer
          block={block as DetailCardBlock}
          entityId={entityId}
          saveTarget={saveTarget}
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
  block: DetailTableBlock;
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
        (block as any).module
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
  block: DetailListBlock;
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
        (block as any).module
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

  return (
    <ListRenderer
      data={tableData}
      layout={block.listLayout}
      onRowAction={handleRowAction}
      onTableAction={handleTableAction}
    />
  );
};

// Card Block Renderer
const CardBlockRenderer: React.FC<{
  block: DetailCardBlock;
  entityId: string;
  saveTarget?: any;
}> = ({ block, entityId, saveTarget }) => {
  const [cardData, setCardData] = useState<RenderableCard | null>(null);

  useEffect(() => {
    loadCardData();
  }, [block.fields, entityId]);

  const loadCardData = async () => {
    try {
      setCardData({ ...cardData!, loading: true });
      const data = await cardService.loadCardData(block, entityId);
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