// components/SimpleEmailBuilder/Components/ColumnComponent.tsx
import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Block, BlockType, ContainerComponentProps, DragItem } from "../types";
import { registerComponent } from "../ComponentRegistry";
import { TrashIcon, DragHandleIcon, AddButton } from "../SharedIcons";
import TextComponent from "./TextComponent";
import ImageComponent from "./ImageComponent";

const useDraggableChildBlock = (
  parentId: string,
  containerIndex: number,
  blockId: string,
  index: number,
  moveChildBlock: (
    containerIndex: number,
    dragIndex: number,
    hoverIndex: number
  ) => void,
  moveChildBlockBetweenContainers: (
    sourceParentId: string,
    sourceContainerIndex: number,
    blockId: string,
    targetParentId: string,
    targetContainerIndex: number,
    insertIndex?: number
  ) => void
) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: "child-block",
    item: { id: blockId, index, parentId, containerIndex, type: "child-block" },
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
      if (item.containerIndex === containerIndex && item.parentId === parentId) {
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) return;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex && item.containerIndex === containerIndex) return;

        // Only perform the move when cursor crosses half of the item
        if (dragIndex < hoverIndex && !isBeforeHovered) return; // Dragging downward
        if (dragIndex > hoverIndex && isBeforeHovered) return; // Dragging upward

        moveChildBlock(containerIndex, dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
      // If from different column - directly rearrange here instead of waiting for drop
      else {
        moveChildBlockBetweenContainers(
          item.parentId!,
          item.containerIndex!,
          item.id,
          parentId,
          containerIndex,
          targetIndex
        );

        // Update item's position information
        item.parentId = parentId;
        item.containerIndex = containerIndex;
        item.index = targetIndex;
      }
    },
  });

  drag(drop(ref));
  return { ref, isDragging };
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
  moveChildBlockBetweenContainers: (
    sourceParentId: string,
    sourceContainerIndex: number,
    blockId: string,
    targetParentId: string,
    targetContainerIndex: number,
    insertIndex?: number
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
  moveChildBlockBetweenContainers,
}) => {
  const { ref, isDragging } = useDraggableChildBlock(
    parentId,
    columnIndex,
    child.id,
    childIndex,
    moveChildBlock,
    moveChildBlockBetweenContainers
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

const ColumnComponent: React.FC<ContainerComponentProps> = ({
  block,
  index,
  moveBlock,
  updateBlock,
  deleteBlock,
  addBlockToContainer,
  moveBlockToContainer,
  moveChildBlockBetweenContainers,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);

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

  const moveChildBlock = (
    containerIndex: number,
    dragIndex: number,
    hoverIndex: number
  ) => {
    const newChildren = [...(block.children || [])];
    const columnChildren = [...newChildren[containerIndex]];
    const [draggedItem] = columnChildren.splice(dragIndex, 1);
    columnChildren.splice(hoverIndex, 0, draggedItem);
    newChildren[containerIndex] = columnChildren;
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
                // Only perform visual feedback during hover, not actual movement
                if (item.containerIndex === colIndex && item.parentId === block.id) {
                  // Handle same-column hovering (already implemented elsewhere)
                }
              }
            },
            drop: (item, monitor) => {
              // Only process if this is the direct drop target
              if (!monitor.isOver({ shallow: true })) return undefined;

              const itemType = monitor.getItemType();
              if (itemType === "child-block") {
                // Only perform actual movement during drop
                if (item.parentId !== block.id || item.containerIndex !== colIndex) {
                  moveChildBlockBetweenContainers(
                    item.parentId!,
                    item.containerIndex!,
                    item.id,
                    block.id,
                    colIndex
                  );
                  return { handled: true };
                }
              } else {
                moveBlockToContainer(item.id, block.id, colIndex);
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
                  moveChildBlockBetweenContainers={moveChildBlockBetweenContainers}
                />
              ))}

              <AddButton
                className="absolute"
                onClick={(e) => {
                  e.stopPropagation();
                  addBlockToContainer(block.id, colIndex, "text");
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

// Register the component with the ComponentRegistry
registerComponent(
  'columns',
  ColumnComponent,
  (content, styles) => {
    return `<mj-section>
      <mj-column></mj-column>
      <mj-column></mj-column>
    </mj-section>`;
  },
  { width: "100%" },
  "Column Layout",
  true // This is a container component
);

export default ColumnComponent;