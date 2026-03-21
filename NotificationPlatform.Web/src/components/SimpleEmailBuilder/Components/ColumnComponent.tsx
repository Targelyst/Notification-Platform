// components/SimpleEmailBuilder/ColumnComponent.tsx
import React, { useState } from "react";
import { useDraggableBlock } from "../hooks";
import { Block, BlockType, DragItem } from "../types";
import ContextMenu from "../ContextMenu";
import { TrashIcon, DragHandleIcon, AddButton } from "../SharedIcons";
import TextComponent from "./TextComponent";
import ImageComponent from "./ImageComponent";

interface ColumnComponentProps {
  block: Block;
  index: number;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  addBlockToColumn: (parentId: string, columnIndex: number, type: BlockType) => void;
}

const ColumnComponent: React.FC<ColumnComponentProps> = ({
  block,
  index,
  moveBlock,
  updateBlock,
  deleteBlock,
  addBlockToColumn,
}) => {
  const { ref, isDragging } = useDraggableBlock(block.id, index, moveBlock);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);

  const generateMjml = () => {
    const columns = block.children?.map(column => `
      <mj-column>
        ${column?.map(child => child.mjml).join('') || ''}
      </mj-column>
    `) || [];
    
    return `<mj-section>${columns.join('')}</mj-section>`;
  };

  return (
    <div 
      ref={ref}
      className="group relative border-2 border-transparent hover:border-blue-500"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex gap-4 pt-7">
        {block.children?.map((column, colIndex) => (
          <div
            key={colIndex}
            className="flex-1 relative min-h-[100px] border-2 border-transparent hover:border-blue-500 p-2"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedColumn(colIndex);
            }}
          >
            {column?.map((child, childIndex) => (
              child.type === 'text' ? (
                <TextComponent
                  key={child.id}
                  block={child}
                  index={childIndex}
                  moveBlock={() => {}}
                  updateBlock={(id, updates) => {
                    const newChildren = [...block.children!];
                    newChildren[colIndex] = newChildren[colIndex].map(c => 
                      c.id === id ? { ...c, ...updates } : c
                    );
                    updateBlock(block.id, { children: newChildren });
                  }}
                  deleteBlock={(id) => {
                    const newChildren = [...block.children!];
                    newChildren[colIndex] = newChildren[colIndex].filter(c => c.id !== id);
                    updateBlock(block.id, { children: newChildren });
                  }}
                  addBlockBelow={() => {}}
                />
              ) : (
                <ImageComponent
                  key={child.id}
                  block={child}
                  index={childIndex}
                  moveBlock={() => {}}
                  updateBlock={(id, updates) => {
                    const newChildren = [...block.children!];
                    newChildren[colIndex] = newChildren[colIndex].map(c => 
                      c.id === id ? { ...c, ...updates } : c
                    );
                    updateBlock(block.id, { children: newChildren });
                  }}
                  deleteBlock={(id) => {
                    const newChildren = [...block.children!];
                    newChildren[colIndex] = newChildren[colIndex].filter(c => c.id !== id);
                    updateBlock(block.id, { children: newChildren });
                  }}
                  addBlockBelow={() => {}}
                />
              )
            ))}
            
            <AddButton
              className="absolute bottom-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                addBlockToColumn(block.id, colIndex, 'text');
              }}
            />
          </div>
        ))}
      </div>
      
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100">
        <button className="cursor-move">
          <DragHandleIcon />
        </button>
        <button onClick={() => deleteBlock(block.id)}>
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default ColumnComponent;
