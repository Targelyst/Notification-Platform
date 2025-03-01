// components/SimpleEmailBuilder/Components/SectionComponent.tsx
import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { Block, ContainerComponentProps, DragItem } from "../types";
import { BaseContainerComponent, useDraggableChildBlock } from "./BaseContainerComponent";
import { registerComponent, DynamicBlockComponent } from "../ComponentRegistry";
import { AddButton } from "../SharedIcons";

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

const SectionComponent: React.FC<ContainerComponentProps> = (props) => {
  // Generate MJML for the section container
  const generateSectionMjml = (children: Block[][]) => {
    // Support for multiple columns within a section
    if (children.length > 1) {
      return `<mj-section background-color="${props.block.styles.backgroundColor || '#ffffff'}" 
                      padding="${props.block.styles.padding || '10px'}">
              ${children.map(column => 
                `<mj-column>${column.map(child => child.mjml).join("")}</mj-column>`
              ).join("")}
            </mj-section>`;
    } else {
      // Standard single-column section
      return `<mj-section background-color="${props.block.styles.backgroundColor || '#ffffff'}" 
                      padding="${props.block.styles.padding || '10px'}">
              ${children[0]?.map(child => child.mjml).join("") || ""}
            </mj-section>`;
    }
  };

  // Render the section container content
  const renderSectionContent = ({
    children,
    selectedContainer,
    setSelectedContainer,
    moveChildBlock,
    updateChildBlock,
    deleteChildBlock,
    moveChildBlockBetweenContainers,
    renderChildComponent
  }) => {
    // Define a reusable container component to avoid duplicating hook usage
    const Container = ({ containerIndex }) => {
      const [{ isOver }, drop] = useDrop({
        accept: ["text", "image", "child-block"],
        drop: (item: DragItem, monitor) => {
          if (!monitor.isOver({ shallow: true })) return undefined;

          const itemType = monitor.getItemType();
          if (itemType === "child-block") {
            if (item.parentId !== props.block.id || item.containerIndex !== containerIndex) {
              props.moveChildBlockBetweenContainers(
                item.parentId!,
                item.containerIndex!,
                item.id,
                props.block.id,
                containerIndex
              );
              return { handled: true };
            }
          } else {
            props.moveBlockToContainer(item.id, props.block.id, containerIndex);
            return { handled: true };
          }
        },
        collect: (monitor) => ({
          isOver: monitor.isOver({ shallow: true }),
        }),
      });

      return (
        <div
          ref={drop}
          className="relative min-h-[100px] border-2 border-transparent hover:border-blue-500 flex-1"
          style={{ 
            backgroundColor: isOver ? "lightyellow" : "transparent",
            padding: props.block.styles.padding || "10px",
            border: "1px dashed #ccc"
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedContainer(containerIndex);
          }}
        >
          {(children[containerIndex] || []).map((child, childIndex) => (
            <DraggableChildBlock
              key={child.id}
              child={child}
              childIndex={childIndex}
              containerIndex={containerIndex}
              parentId={props.block.id}
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
              props.addBlockToContainer(props.block.id, containerIndex, "text");
            }}
          />
        </div>
      );
    };

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
              // Add a new column to the section
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
          {children.map((_, containerIndex) => (
            <Container key={containerIndex} containerIndex={containerIndex} />
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