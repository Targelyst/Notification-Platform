// components/SimpleEmailBuilder/Components/BaseContainerComponent.tsx
import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Block, BlockType, ContainerComponentProps, DragItem } from "../types";

// Hook for making block draggable in the main builder
export const useDraggableBlock = (
  blockId: string,
  index: number,
  moveBlock: (dragIndex: number, hoverIndex: number) => void,
  blockType: BlockType
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: blockType,
    item: { id: blockId, index, type: blockType },
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
    item: { 
      id: blockId, 
      index, 
      parentId, 
      containerIndex, 
      type: "child-block",
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem>({
    accept: "child-block",
    hover(item, monitor) {
      if (!ref.current || item.id === blockId) return;

      // Determine position calculations for drag and drop
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const isBeforeHovered = hoverClientY < hoverMiddleY;
      const targetIndex = isBeforeHovered ? index : index + 1;

      // If from same container
      if (item.containerIndex === containerIndex && item.parentId === parentId) {
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) return;
        
        // Movement logic for same container
        if (dragIndex < hoverIndex && !isBeforeHovered) return; // Dragging downward
        if (dragIndex > hoverIndex && isBeforeHovered) return; // Dragging upward

        moveChildBlock(containerIndex, dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
      // If from different container - process immediately in hover
      else {
        moveChildBlockBetweenContainers(
          item.parentId!,
          item.containerIndex!,
          item.id,
          parentId,
          containerIndex,
          targetIndex
        );

        item.parentId = parentId;
        item.containerIndex = containerIndex;
        item.index = targetIndex;
      }
    },
  });

  drag(drop(ref));
  return { ref, isDragging };
};

// Base class for all container components
export const BaseContainerComponent: React.FC<ContainerComponentProps & {
  renderContainerContent: (props: {
    children: Block[][];
    selectedContainer: number | null;
    setSelectedContainer: (index: number | null) => void;
    moveChildBlock: (containerIndex: number, dragIndex: number, hoverIndex: number) => void;
    updateChildBlock: (id: string, updates: Partial<Block>) => void;
    deleteChildBlock: (id: string) => void;
    moveChildBlockBetweenContainers: any;
    renderChildComponent: (child: Block, childIndex: number, containerIndex: number) => React.ReactNode;
  }) => React.ReactNode;
  generateContainerMjml: (children: Block[][]) => string;
}> = ({
  block,
  index,
  moveBlock,
  updateBlock,
  deleteBlock,
  addBlockToContainer,
  moveBlockToContainer,
  moveChildBlockBetweenContainers,
  renderContainerContent,
  generateContainerMjml
}) => {
  const { ref, isDragging } = useDraggableBlock(block.id, index, moveBlock!, block.type);
  const [selectedContainer, setSelectedContainer] = useState<number | null>(null);

  // Function to move child blocks within the same container
  const moveChildBlock = (
    containerIndex: number,
    dragIndex: number,
    hoverIndex: number
  ) => {
    const newChildren = [...(block.children || [])];
    const containerChildren = [...newChildren[containerIndex]];
    const [draggedItem] = containerChildren.splice(dragIndex, 1);
    containerChildren.splice(hoverIndex, 0, draggedItem);
    newChildren[containerIndex] = containerChildren;
    
    updateBlock(block.id, { 
      children: newChildren,
      mjml: generateContainerMjml(newChildren)
    });
  };

  // Update a child block
  const updateChildBlock = (id: string, updates: Partial<Block>) => {
    const newChildren = [...(block.children || [])];
    
    // Find the child block in any column and update it
    const updatedChildren = newChildren.map(column => 
      column.map(child => 
        child.id === id ? { ...child, ...updates } : child
      )
    );
    
    // Update parent block with new children structure
    updateBlock(block.id, { 
      children: updatedChildren,
      // Optionally update MJML if needed
      mjml: `<mj-section>${updatedChildren
        .map(column => 
          `<mj-column>${column.map(c => c?.mjml || '').join('')}</mj-column>`
        )
        .join('')}</mj-section>`
    });
  };

  // Delete a child block
  const deleteChildBlock = (id: string) => {
    const newChildren = (block.children || []).map((container) =>
      container.filter((child) => child.id !== id)
    );
    
    updateBlock(block.id, { 
      children: newChildren,
      mjml: generateContainerMjml(newChildren)
    });
  };

  // Render a child component based on its type
  const renderChildComponent = (child: Block, childIndex: number, containerIndex: number) => {
    // This is a placeholder - will be implemented in the component registry
    return <div>Child Component: {child.type}</div>;
  };

  return (
    <div
      ref={ref}
      className="relative"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {renderContainerContent({
        children: block.children || [],
        selectedContainer,
        setSelectedContainer,
        moveChildBlock,
        updateChildBlock,
        deleteChildBlock,
        moveChildBlockBetweenContainers,
        renderChildComponent
      })}

      <div className="absolute top-1 -right-16 flex gap-1">
        <button className="cursor-move">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M19 12L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
        <button onClick={() => deleteBlock(block.id)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};