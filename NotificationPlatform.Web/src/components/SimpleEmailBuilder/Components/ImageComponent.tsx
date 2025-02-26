// components/SimpleEmailBuilder/ImageComponent.tsx
import React, { useState } from "react";
import ContextMenu from "../ContextMenu";
import { TrashIcon, DragHandleIcon, AddButton } from "../SharedIcons";
import { Block, BlockType, useDraggableBlock } from "./ColumnComponent";

interface ImageComponentProps {
  block: Block;
  index: number;
  moveBlock?: (dragIndex: number, hoverIndex: number) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  addBlockBelow?: (index: number, type: BlockType) => void;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  block,
  index,
  moveBlock,
  updateBlock,
  deleteBlock,
  addBlockBelow,
}) => {
  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  let ref = React.useRef<HTMLDivElement>(null);
  let isDragging = false;

  if (moveBlock) {
    const draggable = useDraggableBlock(block.id, index, moveBlock, block.type); // Pass block.type
    ref = draggable.ref;
    isDragging = draggable.isDragging;
  }

  const generateMjml = (src: string, styles: Record<string, string>) => {
    const sanitized = src.trim() || "https://via.placeholder.com/350x150";
    return `
      <mj-section padding="0">
        <mj-column>
          <mj-image 
            src="${sanitized}" 
            padding="0" 
            width="${styles.width || "100%"}"
          />
        </mj-column>
      </mj-section>
    `;
  };

  const handleSrcUpdate = (newSrc: string) => {
    updateBlock(block.id, {
      content: newSrc,
      mjml: generateMjml(newSrc, block.styles),
    });
  };

  return (
    <div
      ref={ref}
      className="group relative"
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={(e) => {
        e.stopPropagation(); // Prevent event propagation
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        setContextMenuPos({ x: rect.left, y: rect.top });
      }}
    >
      <div className="flex items-center">
        <input
          type="text"
          value={block.content}
          onChange={(e) => handleSrcUpdate(e.target.value)}
          className="flex-1 border p-2 mr-2"
          placeholder="Image URL"
        />
        <img
          src={block.content}
          alt="Block"
          className="max-w-full h-20 object-contain"
          style={{ width: block.styles.width }}
        />

        <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
          {moveBlock && (
            <button className="cursor-move" onClick={(e) => e.preventDefault()}>
              <DragHandleIcon />
            </button>
          )}
          <button onClick={() => deleteBlock(block.id)}>
            <TrashIcon />
          </button>
        </div>
      </div>

      {contextMenuPos && (
        <ContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          blockType={block.type}
          currentStyles={block.styles}
          onClose={() => setContextMenuPos(null)}
          onStyleChange={(newStyles) => {
            updateBlock(block.id, {
              styles: newStyles,
              mjml: generateMjml(block.content, newStyles),
            });
            setContextMenuPos(null);
          }}
        />
      )}
    </div>
  );
};

export default ImageComponent;