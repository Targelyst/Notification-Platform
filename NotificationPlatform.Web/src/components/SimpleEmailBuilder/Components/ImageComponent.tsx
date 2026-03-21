// components/SimpleEmailBuilder/ImageComponent.tsx
import React, { useState } from "react";
import { useDraggableBlock } from "../hooks";
import { Block, BlockType } from "../types";
import ContextMenu from "../ContextMenu";
import { TrashIcon, DragHandleIcon, AddButton } from "../SharedIcons";

interface ImageComponentProps {
  block: Block;
  index: number;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  addBlockBelow: (index: number, type: BlockType) => void;
}

const ImageStyleProperties = ({
  localStyles,
  onChange
}: {
  localStyles: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) => (
  <div className="mb-2">
    <label className="block text-sm font-medium">Width</label>
    <input
      type="text"
      className="border p-1 w-full"
      value={localStyles.width || ""}
      onChange={(e) => onChange("width", e.target.value)}
      placeholder="100%"
    />
  </div>
);

const ImageComponent: React.FC<ImageComponentProps> = ({
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

  const generateMjml = (src: string, styles: Record<string, string>) => {
    const sanitized = src.trim() || "https://via.placeholder.com/350x150";
    return `
      <mj-section padding="0">
        <mj-column>
          <mj-image 
            src="${sanitized}" 
            padding="0" 
            width="${styles.width || "100px"}"
          />
        </mj-column>
      </mj-section>
    `;
  };

  const handleSrcUpdate = (newSrc: string) => {
    updateBlock(block.id, {
      content: newSrc,
      mjml: generateMjml(newSrc, block.styles)
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
          <ImageStyleProperties
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

export default ImageComponent;
