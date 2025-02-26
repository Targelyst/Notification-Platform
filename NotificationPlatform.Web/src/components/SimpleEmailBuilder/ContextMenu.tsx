// components/SimpleEmailBuilder/ContextMenu.tsx
import React, { useState, useEffect, useRef } from "react";
import { BlockType } from "./Components/ColumnComponent";

interface ContextMenuProps {
  x: number;
  y: number;
  blockType: BlockType;
  currentStyles: Record<string, string>;
  onClose: () => void;
  onStyleChange: (styles: Record<string, string>) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  blockType,
  currentStyles,
  onClose,
  onStyleChange,
}) => {
  const [localStyles, setLocalStyles] = useState(currentStyles);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleChange = (key: string, value: string) => {
    setLocalStyles((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setLocalStyles(currentStyles);
  }, [currentStyles]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-white shadow-lg p-4 rounded z-50"
      style={{
        left: x,
        top: y - 20, // Position 20px above
      }}
      onKeyDown={(e) => e.stopPropagation()} // Prevent event propagation
    >
      <>
        {blockType === "text" && (
          <>
            <div className="mb-2">
              <label className="block text-sm font-medium">Font Size</label>
              <input
                type="text"
                className="border p-1 w-full"
                value={localStyles.fontSize || ""}
                onChange={(e) => handleChange("fontSize", e.target.value)}
                placeholder="14px"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Text Color</label>
              <input
                type="color"
                className="w-full"
                value={localStyles.color || "#000000"}
                onChange={(e) => handleChange("color", e.target.value)}
              />
            </div>
          </>
        )}
        {blockType === "image" && (
          <div className="mb-2">
            <label className="block text-sm font-medium">Width</label>
            <input
              type="text"
              className="border p-1 w-full"
              value={localStyles.width || ""}
              onChange={(e) => handleChange("width", e.target.value)}
              placeholder="100%"
            />
          </div>
        )}
      </>

      <div className="flex gap-2 mt-2">
        <button
          className="px-2 py-1 bg-blue-500 text-white rounded"
          onClick={() => onStyleChange(localStyles)}
        >
          Apply
        </button>
        <button className="px-2 py-1 bg-gray-200 rounded" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ContextMenu;