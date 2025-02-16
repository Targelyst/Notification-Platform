// components/SimpleEmailBuilder/TextComponent.tsx
import React, { useState, useRef } from "react";
import { useDraggableBlock } from "../hooks";
import { Block, BlockType } from "../types";
import ContextMenu from "../ContextMenu";
import { TrashIcon, DragHandleIcon, AddButton } from "../SharedIcons";

interface TextComponentProps {
  block: Block;
  index: number;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  addBlockBelow: (index: number, type: BlockType) => void;
}

const TextStyleProperties = ({
  localStyles,
  onChange
}: {
  localStyles: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) => (
  <>
    <div className="mb-2">
      <label className="block text-sm font-medium">Font Size</label>
      <input
        type="text"
        className="border p-1 w-full"
        value={localStyles.fontSize || ""}
        onChange={(e) => onChange("fontSize", e.target.value)}
        placeholder="14px"
      />
    </div>
    <div className="mb-2">
      <label className="block text-sm font-medium">Text Color</label>
      <input
        type="color"
        className="w-full"
        value={localStyles.color || "#000000"}
        onChange={(e) => onChange("color", e.target.value)}
      />
    </div>
  </>
);

const TextComponent: React.FC<TextComponentProps> = ({
  block,
  index,
  moveBlock,
  updateBlock,
  deleteBlock,
  addBlockBelow,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<{x: number; y: number} | null>(null);
  const { ref, isDragging } = useDraggableBlock(block.id, index, moveBlock);

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
      mjml: generateMjml(newContent, block.styles)
    });
  };

  return (
    <div 
      ref={ref} 
      className="group relative" 
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={(e) => {
        setContextMenuPos({ x: e.clientX, y: e.clientY });
      }}
    >
      <AddButton onClick={() => setShowMenu(true)} />
      
      {showMenu && (
        <div className="absolute left-0 -ml-24 w-20 bg-white shadow-lg p-2 z-10">
          <button className="block w-full text-left p-1" onClick={() => { addBlockBelow(index, "text"); setShowMenu(false); }}>
            Text
          </button>
          <button className="block w-full text-left p-1" onClick={() => { addBlockBelow(index, "image"); setShowMenu(false); }}>
            Image
          </button>
        </div>
      )}

      <div className="flex items-center">
        <div
          className="flex-1 outline-none"
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: block.content }}
          onInput={(e) => handleContentUpdate((e.target as HTMLDivElement).innerHTML)}
          style={{
            fontSize: block.styles.fontSize,
            color: block.styles.color
          }}
        />
        
        <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
          <button className="cursor-move" onClick={(e) => e.preventDefault()}>
            <DragHandleIcon />
          </button>
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
              mjml: generateMjml(block.content, newStyles)
            });
            setContextMenuPos(null);
          }}
        >
          <TextStyleProperties 
            localStyles={block.styles}
            onChange={(key, value) => updateBlock(block.id, {
              styles: { ...block.styles, [key]: value }
            })}
          />
        </ContextMenu>
      )}
    </div>
  );
};

export default TextComponent;
