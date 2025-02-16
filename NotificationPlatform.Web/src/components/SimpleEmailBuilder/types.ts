// components/SimpleEmailBuilder/types.ts
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
}
