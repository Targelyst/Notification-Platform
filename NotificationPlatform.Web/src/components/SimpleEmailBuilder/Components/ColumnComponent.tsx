// components/SimpleEmailBuilder/ColumnComponent.tsx
import React, { useRef, useState } from "react";
import ContextMenu from "../ContextMenu";
import { TrashIcon, DragHandleIcon, AddButton } from "../SharedIcons";
import TextComponent from "./TextComponent";
import ImageComponent from "./ImageComponent";
import { useDrag, useDrop } from "react-dnd";

export type BlockType = "text" | "image" | "columns";

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  mjml: string;
  styles: Record<string, string>;
  children?: Block[][];
}

export interface DragItem {
  id: string;
  index: number;
  parentId?: string;
  columnIndex?: number;
  type?: BlockType;
}

export const useDraggableBlock = (
  blockId: string,
  index: number,
  moveBlock: (dragIndex: number, hoverIndex: number) => void,
  blockType: BlockType
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: blockType,
    item: { id: blockId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem>({
    accept: blockType,
    hover(item) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveBlock(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return { ref, isDragging };
};


export const useDraggableChildBlock = (
  parentId: string,
  columnIndex: number,
  blockId: string,
  index: number,
  moveChildBlock: (
    columnIndex: number,
    dragIndex: number,
    hoverIndex: number
  ) => void,
  moveChildBlockBetweenColumns: ( // Make sure this parameter is properly passed
    sourceParentId: string,
    sourceColumnIndex: number,
    blockId: string,
    targetParentId: string,
    targetColumnIndex: number,
    insertIndex: number
  ) => void
) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: "child-block",
    item: { id: blockId, index, parentId, columnIndex, type: "child-block" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem>({
    accept: "child-block",
    hover(item, monitor) {
      if (!ref.current || item.id === blockId) return;

      // Get mouse position relative to the drop target
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Determine if we should place before or after the hovered item
      const isBeforeHovered = hoverClientY < hoverMiddleY;
      const targetIndex = isBeforeHovered ? index : index + 1;

      // If from same column
      if (item.columnIndex === columnIndex && item.parentId === parentId) {
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) return;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex && item.columnIndex === columnIndex) return;

        // Only perform the move when cursor crosses half of the item
        if (dragIndex < hoverIndex && !isBeforeHovered) return; // Dragging downward
        if (dragIndex > hoverIndex && isBeforeHovered) return; // Dragging upward

        moveChildBlock(columnIndex, dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
      // If from different column - directly rearrange here instead of waiting for drop
      else {
        moveChildBlockBetweenColumns(
          item.parentId!,
          item.columnIndex!,
          item.id,
          parentId,
          columnIndex,
          targetIndex
        );

        // Update item's position information
        item.parentId = parentId;
        item.columnIndex = columnIndex;
        item.index = targetIndex;
      }
    },
  });

  drag(drop(ref));
  return { ref, isDragging };
};

interface ColumnComponentProps {
  block: Block;
  index: number;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  addBlockToColumn: (
    parentId: string,
    columnIndex: number,
    type: BlockType
  ) => void;
  moveBlockToColumn: (blockId: string, parentId: string, columnIndex: number) => void;
  moveChildBlockBetweenColumns: (
    sourceParentId: string,
    sourceColumnIndex: number,
    blockId: string,
    targetParentId: string,
    targetColumnIndex: number
  ) => void;
}

const ColumnComponent: React.FC<ColumnComponentProps> = ({
  block,
  index,
  moveBlock,
  updateBlock,
  deleteBlock,
  addBlockToColumn,
  moveBlockToColumn,
  moveChildBlockBetweenColumns,
}) => {
  const { ref, isDragging } = useDraggableBlock(block.id, index, moveBlock, block.type);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);

  const moveChildBlock = (
    columnIndex: number,
    dragIndex: number,
    hoverIndex: number
  ) => {
    const newChildren = [...(block.children || [])];
    const columnChildren = [...newChildren[columnIndex]];
    const [draggedItem] = columnChildren.splice(dragIndex, 1);
    columnChildren.splice(hoverIndex, 0, draggedItem);
    newChildren[columnIndex] = columnChildren;
    updateBlock(block.id, { children: newChildren });
  };

  const updateChildBlock = (id: string, updates: Partial<Block>) => {
    const newChildren = (block.children || []).map((col) =>
      col.map((child) => (child.id === id ? { ...child, ...updates } : child))
    );
    updateBlock(block.id, { children: newChildren });
  };

  const deleteChildBlock = (id: string) => {
    const newChildren = (block.children || []).map((col) =>
      col.filter((child) => child.id !== id)
    );
    updateBlock(block.id, { children: newChildren });
  };

  return (
    <div
      ref={ref}
      className="relative"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex gap-4 ">
        {(block.children || []).map((column, colIndex) => {
          const [{ isOver }, drop] = useDrop({
            accept: ["text", "image", "child-block"],
            hover(item, monitor) {
              // Only process if this is the direct hover target
              if (!monitor.isOver({ shallow: true })) return;

              // For child-block items
              if (item.type === "child-block") {
                // IMPORTANT: Don't call moveChildBlockBetweenColumns here!
                // Only perform visual feedback during hover, not actual movement

                // If from the same column, handle visual positioning
                if (item.columnIndex === colIndex && item.parentId === block.id) {
                  // Handle same-column hovering (already implemented elsewhere)
                }
                // Save target information for the drop handler
                // but don't perform actual movement here
              }
            },
            drop: (item, monitor) => {
              // Only process if this is the direct drop target
              if (!monitor.isOver({ shallow: true })) return undefined;

              const itemType = monitor.getItemType();
              if (itemType === "child-block") {
                // Only perform actual movement during drop
                if (item.parentId !== block.id || item.columnIndex !== colIndex) {
                  moveChildBlockBetweenColumns(
                    item.parentId!,
                    item.columnIndex!,
                    item.id,
                    block.id,
                    colIndex
                  );
                  return { handled: true };
                }
              } else {
                moveBlockToColumn(item.id, block.id, colIndex);
                return { handled: true };
              }
            },
            collect: (monitor) => ({
              isOver: monitor.isOver({ shallow: true }),
            }),
          });

          return (
            <div
              key={colIndex}
              ref={drop}
              className="flex-1 relative min-h-[100px] border-2 border-transparent hover:border-blue-500"
              style={{ backgroundColor: isOver ? "lightyellow" : "transparent" }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColumn(colIndex);
              }}
            >
              {column?.map((child, childIndex) => (
                <DraggableChildBlock
                  key={child.id}
                  child={child}
                  childIndex={childIndex}
                  columnIndex={colIndex}
                  parentId={block.id}
                  moveChildBlock={moveChildBlock}
                  updateChildBlock={updateChildBlock}
                  deleteChildBlock={deleteChildBlock}
                  moveChildBlockBetweenColumns={moveChildBlockBetweenColumns}
                />
              ))}

              <AddButton
                className="absolute"
                onClick={(e) => {
                  e.stopPropagation();
                  addBlockToColumn(block.id, colIndex, "text");
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="absolute top-1 -right-16 flex gap-1">
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

interface DraggableChildBlockProps {
  child: Block;
  childIndex: number;
  columnIndex: number;
  parentId: string;
  moveChildBlock: (
    columnIndex: number,
    dragIndex: number,
    hoverIndex: number
  ) => void;
  updateChildBlock: (id: string, updates: Partial<Block>) => void;
  deleteChildBlock: (id: string) => void;
  moveChildBlockBetweenColumns: ( // Add this prop
    sourceParentId: string,
    sourceColumnIndex: number,
    blockId: string,
    targetParentId: string,
    targetColumnIndex: number,
    insertIndex: number
  ) => void;
}

const DraggableChildBlock: React.FC<DraggableChildBlockProps> = ({
  child,
  childIndex,
  columnIndex,
  parentId,
  moveChildBlock,
  updateChildBlock,
  deleteChildBlock,
  moveChildBlockBetweenColumns, // Make sure this prop is passed
}) => {
  const { ref, isDragging } = useDraggableChildBlock(
    parentId,
    columnIndex,
    child.id,
    childIndex,
    moveChildBlock,
    moveChildBlockBetweenColumns // Pass it to the hook
  );

  const commonProps = {
    block: child,
    index: childIndex,
    updateBlock: updateChildBlock,
    deleteBlock: deleteChildBlock,
    addBlockBelow: () => { },
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        border: '1px solid blue',  // Debug outline
        margin: '4px'
      }}
    >
      <small style={{ color: 'green' }}>
        ID: {child.id.substring(0, 4)}... Col: {columnIndex}, Idx: {childIndex}
      </small>
      {child.type === "text" ? (
        <TextComponent {...commonProps} />
      ) : (
        <ImageComponent {...commonProps} />
      )}
    </div>
  );
};

export default ColumnComponent;