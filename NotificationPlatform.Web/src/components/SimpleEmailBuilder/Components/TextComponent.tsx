// components/SimpleEmailBuilder/Components/TextComponent.tsx
import React, { useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Block, BlockType, DraggableComponentProps, DragItem } from "../types";
import { registerComponent } from "../ComponentRegistry";
import ContextMenu from "../ContextMenu";
import { TrashIcon, DragHandleIcon } from "../SharedIcons";

const TextComponent: React.FC<DraggableComponentProps> = ({
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
  const ref = useRef<HTMLDivElement>(null);

  // Set up drag and drop
  const [{ isDragging }, drag] = useDrag({
    type: block.type,
    item: { id: block.id, index, type: block.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem>({
    accept: block.type,
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;

      // Time to actually perform the action
      if (moveBlock) {
        moveBlock(dragIndex, hoverIndex);
      }

      // Note: we're mutating the monitor item here!
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  // Generate MJML for the text component
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
              mjml: generateMjml(block.content, newStyles),
            });
            setContextMenuPos(null);
          }}
        />
      )}

    </div>
  );
};

// Register the component with the ComponentRegistry
registerComponent(
  'text',
  TextComponent,
  (content, styles) => {
    const sanitized = content.trim() || "&nbsp;";
    return `
      <mj-text 
        line-height="1.5" 
        padding="0"
        font-size="${styles.fontSize || "14px"}"
        color="${styles.color || "#000000"}"
      >${sanitized}</mj-text>
    `;
  },
  { fontSize: "14px", color: "#000000", width: "100%" },
  "New text"
);

export default TextComponent;