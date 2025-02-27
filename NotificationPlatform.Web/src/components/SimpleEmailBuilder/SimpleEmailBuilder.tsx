// components/SimpleEmailBuilder/SimpleEmailBuilder.tsx
import { useState, useCallback, useEffect, useRef } from "react";
import type { FC } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import mjml2html from "mjml-browser";
import ColumnComponent, { Block, BlockType, DragItem } from "./Components/ColumnComponent";
import ImageComponent from "./Components/ImageComponent";
import TextComponent from "./Components/TextComponent";

const SimpleEmailBuilder: FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [jsonInput, setJsonInput] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [error, setError] = useState("");

  const generateFullMJML = useCallback((blocks: Block[]) => {
    const bodyContent =
      blocks.length === 0
        ? '<mj-section><mj-column><mj-text>Add content to preview</mj-text></mj-column></mj-section>'
        : blocks
            .map((block) => {
              if (block.type === "columns" && block.children) {
                return `<mj-section>${block.children
                  .map(
                    (column) =>
                      `<mj-column>${column.map((child) => child.mjml).join("")}</mj-column>`
                  )
                  .join("")}</mj-section>`;
              }

              const wrappedMjml = block.mjml.startsWith("<mj-section")
                ? block.mjml
                : `<mj-section><mj-column>${block.mjml}</mj-column></mj-section>`;
              return wrappedMjml;
            })
            .join("");

    return `<mjml>
      <mj-head>
        <mj-attributes>
          <mj-all font-family="Arial, sans-serif" line-height="1.5" />
          <mj-text padding="0" font-size="14px" />
          <mj-image padding="0" />
          <mj-section padding="0" />
        </mj-attributes>
      </mj-head>
      <mj-body>${bodyContent}</mj-body>
    </mjml>`;
  }, []);

  useEffect(() => {
    try {
      const fullMJML = generateFullMJML(blocks);
      const result = mjml2html(fullMJML, {
        minify: false,
        validationLevel: "soft",
        fonts: {},
      });

      if (result.errors.length > 0) {
        throw new Error(result.errors.map((e) => e.formattedMessage).join("\n"));
      }

      setPreviewHtml(result.html);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid MJML structure");
      setPreviewHtml('<div class="text-red-500 p-4">Error rendering template</div>');
    }
  }, [blocks, generateFullMJML]);

  const moveChildBlockToMainBlocks = useCallback(
    (parentId: string, columnIndex: number, blockId: string) => {
      setBlocks((prevBlocks) => {
        const newBlocks = [...prevBlocks];

        // Find the parent block
        const parentBlockIndex = newBlocks.findIndex((b) => b.id === parentId);
        if (parentBlockIndex === -1) return prevBlocks;

        const parentBlock = newBlocks[parentBlockIndex];

        if (!parentBlock.children) return prevBlocks;

        // Remove the block from its column
        const columnChildren = [...parentBlock.children[columnIndex]];
        const blockIndex = columnChildren.findIndex((b) => b.id === blockId);
        if (blockIndex === -1) return prevBlocks;

        const [movedBlock] = columnChildren.splice(blockIndex, 1);

        // Update parent's children
        parentBlock.children[columnIndex] = columnChildren;

        // Update parent's MJML
        parentBlock.mjml = `<mj-section>${parentBlock.children
          .map(
            (column) => `<mj-column>${column.map((c) => c.mjml).join("")}</mj-column>`
          )
          .join("")}</mj-section>`;

        // Wrap the moved block's MJML appropriately
        const wrappedMjml = `<mj-section><mj-column>${movedBlock.mjml}</mj-column></mj-section>`;

        // Create a new block with updated MJML
        const newMovedBlock: Block = {
          ...movedBlock,
          mjml: wrappedMjml,
        };

        // Add the block to the end of main blocks list
        newBlocks.push(newMovedBlock);

        return newBlocks;
      });
    },
    []
  );

  const moveChildBlockBetweenColumns = useCallback(
    (
      sourceParentId: string,
      sourceColumnIndex: number,
      blockId: string,
      targetParentId: string,
      targetColumnIndex: number,
      insertIndex: number = -1 // New parameter
    ) => {
      setBlocks((prevBlocks) => {
        const newBlocks = [...prevBlocks];
        
        // Find source parent and remove the block
        const sourceParent = newBlocks.find((b) => b.id === sourceParentId);
        if (!sourceParent?.children) return prevBlocks;
        
        const sourceColumn = [...sourceParent.children[sourceColumnIndex]];
        const blockIndex = sourceColumn.findIndex((b) => b.id === blockId);
        if (blockIndex === -1) return prevBlocks;
        
        const [movedBlock] = sourceColumn.splice(blockIndex, 1);
        sourceParent.children[sourceColumnIndex] = sourceColumn;
        
        // Update source parent MJML
        sourceParent.mjml = `<mj-section>${sourceParent.children
          .map((col) => `<mj-column>${col.map((c) => c.mjml).join("")}</mj-column>`)
          .join("")}</mj-section>`;
        
        // Find target parent and add the block
        const targetParent = newBlocks.find((b) => b.id === targetParentId);
        if (!targetParent?.children) return prevBlocks;
        
        const targetColumn = [...(targetParent.children[targetColumnIndex] || [])];
        
        // Add at specific position if provided, otherwise append to end
        if (insertIndex >= 0 && insertIndex <= targetColumn.length) {
          targetColumn.splice(insertIndex, 0, movedBlock);
        } else {
          targetColumn.push(movedBlock);
        }
        
        targetParent.children[targetColumnIndex] = targetColumn;
        
        // Update target parent MJML
        targetParent.mjml = `<mj-section>${targetParent.children
          .map((col) => `<mj-column>${col.map((c) => c.mjml).join("")}</mj-column>`)
          .join("")}</mj-section>`;
        
        return newBlocks;
      });
    },
    []
  );

  const moveBlock = useCallback((dragIndex: number, hoverIndex: number) => {
    setBlocks((prev) => {
      if (
        dragIndex < 0 ||
        dragIndex >= prev.length ||
        hoverIndex < 0 ||
        hoverIndex >= prev.length
      ) {
        return prev;
      }

      const newBlocks = [...prev];
      const [removed] = newBlocks.splice(dragIndex, 1);
      newBlocks.splice(hoverIndex, 0, removed);
      return newBlocks.filter((block) => !!block);
    });
  }, []);

  const moveBlockToColumn = useCallback(
    (blockId: string, parentId: string, columnIndex: number, insertIndex: number = -1) => {
      setBlocks((prev) => {
        // Find the block to move
        const blockIndex = prev.findIndex((b) => b.id === blockId);
        if (blockIndex === -1) return prev;
  
        const blockToMove = prev[blockIndex];
  
        // Remove the block from the blocks array
        const newBlocks = [...prev];
        newBlocks.splice(blockIndex, 1);
  
        // Now add the block to the specified column in the specified parent block
        newBlocks.forEach((block) => {
          if (block.id === parentId && block.children) {
            // Remove wrapping from blockToMove
            const unwrappedBlock = {
              ...blockToMove,
              mjml: stripMjmlWrapping(blockToMove.mjml),
            };
  
            const newChildren = block.children.map((col, idx) => {
              if (idx === columnIndex) {
                if (insertIndex >= 0 && insertIndex <= col.length) {
                  // Insert at specific position
                  return [
                    ...col.slice(0, insertIndex),
                    unwrappedBlock,
                    ...col.slice(insertIndex)
                  ];
                } else {
                  // Default behavior - append to end
                  return [...col, unwrappedBlock];
                }
              } else {
                return col;
              }
            });
  
            // Update the block's mjml
            const updatedBlock = {
              ...block,
              children: newChildren,
              mjml: `<mj-section>${newChildren
                .map(
                  (column) =>
                    `<mj-column>${column.map((child) => child.mjml).join("")}</mj-column>`
                )
                .join("")}</mj-section>`,
            };
  
            // Replace the block
            const blockIdx = newBlocks.findIndex((b) => b.id === block.id);
            newBlocks[blockIdx] = updatedBlock;
          }
        });
  
        return newBlocks;
      });
    },
    []
  );
  // Helper function to remove wrapping
  function stripMjmlWrapping(mjml: string): string {
    // Remove '<mj-section><mj-column>' and '</mj-column></mj-section>' from the mjml
    const pattern = /^<mj-section[^>]*>\s*<mj-column[^>]*>([\s\S]*)<\/mj-column>\s*<\/mj-section>$/;
    const match = mjml.trim().match(pattern);
    if (match) {
      return match[1];
    }
    return mjml;
  }

  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setBlocks((prev) =>
      prev
        .map((block) => {
          if (block?.id === id) {
            const updated = { ...block, ...updates };
            if (updated.type === "columns" && updated.children) {
              return {
                ...updated,
                mjml: `<mj-section>${updated.children
                  .map(
                    (column) =>
                      `<mj-column>${column.map((child) => child?.mjml || "").join("")}</mj-column>`
                  )
                  .join("")}</mj-section>`,
              };
            }
            return updated;
          }
          return block;
        })
        .filter((block) => !!block)
    );
  }, []);

  const addBlockBelow = (index: number, type: BlockType) => {
    let newBlock: Block;

    if (type === "columns") {
      newBlock = {
        id: Date.now().toString(),
        type: "columns",
        content: "",
        mjml:
          "<mj-section><mj-column></mj-column><mj-column></mj-column></mj-section>",
        styles: {},
        children: [[], []],
      };
    } else {
      const defaultStyles: Record<string, string> =
        type === "text"
          ? { fontSize: "14px", color: "#000000", width: "100%" }
          : { width: "100%", fontSize: "14px", color: "#000000" };

      newBlock = {
        id: Date.now().toString(),
        type,
        content:
          type === "text" ? "New text" : "https://via.placeholder.com/350x150",
        mjml:
          type === "text"
            ? `<mj-section><mj-column><mj-text font-size="${defaultStyles.fontSize}" color="${defaultStyles.color}">New text</mj-text></mj-column></mj-section>`
            : `<mj-section padding="10px 0"><mj-column><mj-image src="https://via.placeholder.com/350x150" width="${defaultStyles.width}" /></mj-column></mj-section>`,
        styles: defaultStyles,
      };
    }

    setBlocks((prev) =>
      [
        ...prev.slice(0, index + 1),
        newBlock,
        ...prev.slice(index + 1),
      ].filter((block) => !!block)
    );
  };

  const addBlockToColumn = useCallback(
    (parentId: string, columnIndex: number, type: BlockType) => {
      setBlocks((prev) =>
        prev
          .map((block) => {
            if (block?.id === parentId && block.children) {
              const newChildBlock: Block = {
                id: Date.now().toString(),
                type,
                content:
                  type === "text"
                    ? "New text"
                    : "https://via.placeholder.com/350x150",
                styles:
                  type === "text"
                    ? { fontSize: "14px", color: "#000000", width: "100%" }
                    : { width: "100%", fontSize: "14px", color: "#000000" },
                mjml:
                  type === "text"
                    ? '<mj-text>New text</mj-text>'
                    : '<mj-image src="https://via.placeholder.com/350x150" />',
              };

              const newChildren = block.children.map((col, idx) =>
                idx === columnIndex ? [...col, newChildBlock] : col
              );

              return {
                ...block,
                children: newChildren,
                mjml: `<mj-section>${newChildren
                  .map(
                    (column) =>
                      `<mj-column>${column.map((child) => child.mjml).join("")}</mj-column>`
                  )
                  .join("")}</mj-section>`,
              };
            }
            return block;
          })
          .filter((block) => !!block)
      );
    },
    []
  );

  const handleExport = () => {
    const jsonString = JSON.stringify(blocks, null, 2);
    navigator.clipboard.writeText(jsonString);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed) && parsed.every(isValidBlock)) {
        setBlocks(parsed.filter((block) => !!block));
        setJsonInput("");
      }
    } catch (e) {
      alert("Invalid JSON structure");
    }
  };

  const isValidBlock = (block: Block) => {
    if (!block || typeof block !== "object") return false;

    if (
      typeof block.id !== "string" ||
      !["text", "image", "columns"].includes(block.type) ||
      typeof block.content !== "string" ||
      typeof block.mjml !== "string" ||
      typeof block.styles !== "object"
    ) {
      return false;
    }

    if (block.type === "columns" && block.children) {
      const isValidColumns =
        Array.isArray(block.children) &&
        block.children.every(
          (column: Block[]) =>
            Array.isArray(column) &&
            column.every((child: Block) => isValidBlock(child))
        );
      if (!isValidColumns) return false;
    }

    return true;
  };

  // Set up the main blocks area to accept dropped child blocks
  const [, drop] = useDrop<DragItem>({
    accept: ["child-block"],
    drop: (item: DragItem, monitor) => {
      // Check if the drop was already handled by a nested drop target
      const didDrop = monitor.didDrop();
      if (didDrop) return;
      
      if (item.type === "child-block") {
        moveChildBlockToMainBlocks(item.parentId!, item.columnIndex!, item.id);
      }
    },
  });

  return (
      <div className="flex justify-center">
        <div className="p-8 m-4 bg-white rounded-xl shadow-lg transition-all duration-300 ease-in-out">
          <div className="flex gap-4 mb-12">
            <button
              type="button"
              className="border p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
              onClick={handleImport}
            >
              Import JSON
            </button>
            <button
              type="button"
              className="border p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
              onClick={handleExport}
            >
              Export JSON
            </button>
            <textarea
              className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-200"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste JSON here"
            />
          </div>

          <div className="flex gap-6 flex-col max-w-[800px] p-7 bg-gray-50 rounded-xl shadow-inner transition-all duration-300">
            <div
              className="flex-1 m-4 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              ref={drop}
            >
              {blocks
                .filter((block) => !!block)
                .map((block, index) =>
                  !block ? null : (
                    <div
                      key={block.id}
                      className="transition-item animate-enter hover:bg-gray-50 rounded-lg relative"
                    >
                      {block.type === "columns" ? (
                        <ColumnComponent
                          block={block}
                          index={index}
                          moveBlock={moveBlock}
                          updateBlock={updateBlock}
                          deleteBlock={(id) => {
                            const deletedBlock = blocks.find((b) => b?.id === id);
                            if (deletedBlock) {
                              setBlocks((prev) => prev.filter((b) => b?.id !== id));
                            }
                          }}
                          addBlockToColumn={addBlockToColumn}
                          moveBlockToColumn={moveBlockToColumn}
                          moveChildBlockBetweenColumns={moveChildBlockBetweenColumns}
                        />
                      ) : block.type === "text" ? (
                        <TextComponent
                          block={block}
                          index={index}
                          moveBlock={moveBlock}
                          updateBlock={updateBlock}
                          deleteBlock={(id) => {
                            const deletedBlock = blocks.find((b) => b?.id === id);
                            if (deletedBlock) {
                              setBlocks((prev) => prev.filter((b) => b?.id !== id));
                            }
                          }}
                          addBlockBelow={addBlockBelow}
                        />
                      ) : (
                        <ImageComponent
                          block={block}
                          index={index}
                          moveBlock={moveBlock}
                          updateBlock={updateBlock}
                          deleteBlock={(id) => {
                            const deletedBlock = blocks.find((b) => b?.id === id);
                            if (deletedBlock) {
                              setBlocks((prev) => prev.filter((b) => b?.id !== id));
                            }
                          }}
                          addBlockBelow={addBlockBelow}
                        />
                      )}
                    </div>
                  )
                )}
              <div className="mt-4 space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm"
                  onClick={() => addBlockBelow(blocks.length, "text")}
                >
                  + Add Text
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm"
                  onClick={() => addBlockBelow(blocks.length, "columns")}
                >
                  + Add Columns
                </button>
              </div>
            </div>

            <div className="flex-1 transition-opacity duration-300">
              {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg animate-pulse">
                  <h3 className="font-bold mb-2">MJML Errors:</h3>
                  <pre className="text-xs whitespace-pre-wrap">{error}</pre>
                </div>
              )}

              <div
                className="border rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />

              <div className="mt-4 p-4 bg-white rounded-lg shadow-sm transition-all duration-300">
                <h3 className="font-bold mb-2">Generated MJML:</h3>
                <pre className="text-xs whitespace-pre-wrap">
                  {generateFullMJML(blocks)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SimpleEmailBuilder;