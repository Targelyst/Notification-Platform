// components/SimpleEmailBuilder/hooks.ts
import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import { DragItem } from "./types";

export const useDraggableBlock = (
  blockId: string,
  index: number,
  moveBlock: (dragIndex: number, hoverIndex: number) => void
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: "block",
    item: { id: blockId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem>({
    accept: "block",
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
