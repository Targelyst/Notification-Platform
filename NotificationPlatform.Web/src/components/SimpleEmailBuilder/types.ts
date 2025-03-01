// components/SimpleEmailBuilder/types.ts
export type BlockType =
	| "text"
	| "image"
	| "columns"
	| "section"
	| "group"
	| "wrapper";

export interface Block {
	id: string;
	type: BlockType;
	content: string;
	mjml: string;
	styles: Record<string, string>;
	children?: Block[][]; // For container components
}

export interface DragItem {
	id: string;
	index: number;
	parentId?: string;
	containerIndex?: number; // Renamed from columnIndex for better semantics
	type?: BlockType | "child-block";
}

// Base props for all components
export interface BaseComponentProps {
	block: Block;
	index: number;
	updateBlock: (id: string, updates: Partial<Block>) => void;
	deleteBlock: (id: string) => void;
}

// Props for draggable components
export interface DraggableComponentProps extends BaseComponentProps {
	moveBlock?: (dragIndex: number, hoverIndex: number) => void;
	addBlockBelow?: (index: number, type: BlockType) => void;
}

// Props for container components
export interface ContainerComponentProps extends DraggableComponentProps {
	addBlockToContainer: (
		parentId: string,
		containerIndex: number,
		type: BlockType,
	) => void;
	moveBlockToContainer: (
		blockId: string,
		parentId: string,
		containerIndex: number,
		insertIndex?: number,
	) => void;
	moveChildBlockBetweenContainers: (
		sourceParentId: string,
		sourceContainerIndex: number,
		blockId: string,
		targetParentId: string,
		targetContainerIndex: number,
		insertIndex?: number,
	) => void;
}
