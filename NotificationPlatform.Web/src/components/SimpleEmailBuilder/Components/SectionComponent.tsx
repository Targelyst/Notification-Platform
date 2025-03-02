// components/SimpleEmailBuilder/Components/SectionComponent.tsx
import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { Block, ContainerComponentProps, DragItem } from "../types";
import { BaseContainerComponent, useDraggableChildBlock } from "./BaseContainerComponent";
import { registerComponent, DynamicBlockComponent } from "../ComponentRegistry";
import { AddButton } from "../SharedIcons";
import ColumnComponent from "./ColumnComponent";

// Component for draggable child blocks
export const DraggableChildBlock: React.FC<{
  child: Block;
  childIndex: number;
  containerIndex: number;
  parentId: string;
  moveChildBlock: (
    containerIndex: number,
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
    insertIndex: number
  ) => void;
}> = ({
  child,
  childIndex,
  containerIndex,
  parentId,
  moveChildBlock,
  updateChildBlock,
  deleteChildBlock,
  moveChildBlockBetweenContainers,
}) => {
    const { ref, isDragging } = useDraggableChildBlock(
      parentId,
      containerIndex,
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
    };

    return (
      <div
        ref={ref}
        style={{
          opacity: isDragging ? 0.5 : 1,
          border: '1px solid #ddd',
          margin: '4px'
        }}
      >
        <DynamicBlockComponent {...commonProps} />
      </div>
    );
  };

  const SectionColumn = React.memo(({ 
    columnChildren, 
    columnIndex, 
    sectionId,
    moveChildBlock,
    updateChildBlock,
    deleteChildBlock,
    moveChildBlockBetweenContainers,
    addBlockToContainer,
    updateBlock,
    generateSectionMjml
  }) => {
    // Setup drop handlers for this column
    const [{ isOver }, drop] = useDrop({
      accept: ["text", "image", "child-block"],
      drop: (item, monitor) => {
        if (!monitor.isOver({ shallow: true })) return undefined;
  
        if (item.type === "child-block" && 
            (item.parentId !== sectionId || item.containerIndex !== columnIndex)) {
          moveChildBlockBetweenContainers(
            item.parentId,
            item.containerIndex,
            item.id,
            sectionId,
            columnIndex
          );
          return { handled: true };
        }
        return undefined;
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
      }),
    });
  
    return (
      <div
        ref={drop}
        className="flex-1 relative min-h-[100px] border-2 border-transparent hover:border-blue-500"
        style={{ backgroundColor: isOver ? "lightyellow" : "transparent" }}
      >
        {columnChildren?.filter(child => !!child).map((child, childIndex) => (
          <DraggableChildBlock
            key={child.id}
            child={child}
            childIndex={childIndex}
            containerIndex={columnIndex}
            parentId={sectionId}
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
            addBlockToContainer(sectionId, columnIndex, "text");
          }}
        />
      </div>
    );
  });

const SectionComponent: React.FC<ContainerComponentProps> = (props) => {
  // Generate MJML for the section container
  const generateSectionMjml = (children: Block[][]) => {
    if (!children || !Array.isArray(children)) {
      return `<mj-section background-color="${props.block.styles.backgroundColor || '#ffffff'}" 
                padding="${props.block.styles.padding || '10px'}">
                <mj-column></mj-column>
              </mj-section>`;
    }
    
    return `<mj-section background-color="${props.block.styles.backgroundColor || '#ffffff'}" 
                      padding="${props.block.styles.padding || '10px'}">
              ${children.map(column => {
                if (!column || !Array.isArray(column)) {
                  return `<mj-column></mj-column>`;
                }
                
                // Filter out any undefined values before mapping
                return `<mj-column>${column
                  .filter(child => !!child)
                  .map(child => child.mjml || '')
                  .join("")}</mj-column>`;
              }).join("")}
            </mj-section>`;
  };


  const renderSectionContent = ({
    children,
    selectedContainer,
    setSelectedContainer,
    moveChildBlock,
    updateChildBlock,
    deleteChildBlock,
    moveChildBlockBetweenContainers
  }) => {
    return (
      <div
        style={{
          backgroundColor: props.block.styles.backgroundColor || "#ffffff",
          padding: "10px"
        }}
      >
        <div className="text-xs text-gray-500 mb-2 flex justify-between">
          <span>Section</span>
          <button
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            onClick={() => {
              const newChildren = [...(props.block.children || [[]])];
              newChildren.push([]);
              props.updateBlock(props.block.id, {
                children: newChildren,
                mjml: generateSectionMjml(newChildren)
              });
            }}
          >
            + Add Column
          </button>
        </div>
  
        <div className="flex gap-2">
          {children.map((columnChildren, columnIndex) => (
            <SectionColumn
              key={`${props.block.id}-column-${columnIndex}`}
              columnChildren={columnChildren}
              columnIndex={columnIndex}
              sectionId={props.block.id}
              moveChildBlock={moveChildBlock}
              updateChildBlock={updateChildBlock}
              deleteChildBlock={deleteChildBlock}
              moveChildBlockBetweenContainers={moveChildBlockBetweenContainers}
              addBlockToContainer={props.addBlockToContainer}
              updateBlock={props.updateBlock}
              generateSectionMjml={generateSectionMjml}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <BaseContainerComponent
      {...props}
      renderContainerContent={renderSectionContent}
      generateContainerMjml={generateSectionMjml}
    />
  );
};

// Register the component in the registry
registerComponent(
  'section',
  SectionComponent,
  (content, styles) => {
    return `<mj-section background-color="${styles.backgroundColor || '#ffffff'}" padding="${styles.padding || '10px'}">${content}</mj-section>`;
  },
  { backgroundColor: "#ffffff", padding: "10px" },
  "",
  true // This is a container type
);

export default SectionComponent;