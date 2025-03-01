// components/SimpleEmailBuilder/ComponentRegistry.tsx
import React from 'react';
import { Block, BlockType, BaseComponentProps, DraggableComponentProps } from './types';

// Define registry entry structure
interface ComponentRegistryEntry {
  component: React.FC<any>;
  generateMjml: (content: string, styles: Record<string, string>) => string;
  defaultStyles: Record<string, string>;
  defaultContent: string;
  containerType?: boolean;
}

// Initialize registry
const componentRegistry: Record<string, ComponentRegistryEntry> = {};

// Register a component
export function registerComponent(
  type: BlockType,
  component: React.FC<any>,
  generateMjml: (content: string, styles: Record<string, string>) => string,
  defaultStyles: Record<string, string>,
  defaultContent: string,
  containerType: boolean = false
) {
  componentRegistry[type] = {
    component,
    generateMjml,
    defaultStyles,
    defaultContent,
    containerType
  };
}

// Get a component by type
export function getComponent(type: BlockType): React.FC<any> | null {
  return componentRegistry[type]?.component || null;
}

// Generate MJML for a block
export function generateMjmlForBlock(block: Block): string {
  const generator = componentRegistry[block.type]?.generateMjml;
  if (!generator) return '';
  return generator(block.content, block.styles);
}

// Create a new block of a specific type
export function createNewBlock(type: BlockType): Block {
    const entry = componentRegistry[type];
    if (!entry) {
      throw new Error(`Component type ${type} is not registered`);
    }
  
    const id = Date.now().toString();
    const content = entry.defaultContent;
    const styles = { ...entry.defaultStyles };
    
    // Initialize children based on component type
    let children;
    if (entry.containerType) {
      if (type === 'columns') {
        children = [[], []]; // Two empty columns by default
      } else {
        children = [[]]; // Single container for section
      }
    }
    
    const mjml = entry.generateMjml(content, styles);
  
    return {
      id,
      type,
      content,
      mjml,
      styles,
      ...(children ? { children } : {})
    };
  }

// Dynamic component renderer
export const DynamicBlockComponent: React.FC<any> = (props) => {
  const Component = getComponent(props.block.type);
  if (!Component) {
    return <div>Unknown component type: {props.block.type}</div>;
  }
  return <Component {...props} />;
};