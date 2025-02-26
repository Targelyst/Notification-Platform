// components/SimpleEmailBuilder/TextComponent.tsx
import React, { useState } from "react";

import ContextMenu from "../ContextMenu";
import { TrashIcon, DragHandleIcon, AddButton } from "../SharedIcons";
import { Block, BlockType, useDraggableBlock } from "./ColumnComponent";

interface TextComponentProps {
  block: Block;
  index: number;
  moveBlock?: (dragIndex: number, hoverIndex: number) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  addBlockBelow?: (index: number, type: BlockType) => void;
}

const TextComponent: React.FC<TextComponentProps> = ({
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

  const generateMjml = (content: string, styles: Record<string, string>) => {
    const sanitized = content.trim() || "&nbsp;";
    return `
      <mj-text 
        line-height="1.5" 
        padding="0"
        font-size="${styles.fontSize || "14px"}"
        color="${styles.color || "#000000"}"
      >${sanitized}</mj-text>
    `;
  };

  const handleContentUpdate = (newContent: string) => {
    updateBlock(block.id, {
      content: newContent,
      mjml: generateMjml(newContent, block.styles),
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
        <div
          className="flex-1 outline-none"
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: block.content }}
          onInput={(e) =>
            handleContentUpdate((e.target as HTMLDivElement).innerHTML)
          }
          style={{
            fontSize: block.styles.fontSize,
            color: block.styles.color,
          }}
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

export default TextComponent;