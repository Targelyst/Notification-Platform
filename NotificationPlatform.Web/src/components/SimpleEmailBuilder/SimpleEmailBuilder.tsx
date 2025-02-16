// components/SimpleEmailBuilder/SimpleEmailBuilder.tsx
import React, { useState, useCallback, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import mjml2html from "mjml-browser";
import { Block, BlockType } from "./types";
import ColumnComponent from "./Components/ColumnComponent";
import ImageComponent from "./Components/ImageComponent";
import TextComponent from "./Components/TextComponent";

const SimpleEmailBuilder: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [jsonInput, setJsonInput] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [error, setError] = useState("");

  const generateFullMJML = useCallback((blocks: Block[]) => {
    const bodyContent = blocks.length === 0
      ? '<mj-section><mj-column><mj-text>Add content to preview</mj-text></mj-column></mj-section>'
      : blocks.map(block => {
        if (block.type === 'columns' && block.children) {
          return `<mj-section>${block.children.map(column =>
            `<mj-column>${column.map(child => child.mjml).join('')}</mj-column>`
          ).join('')}</mj-section>`;
        } else {
          // Ensure non-column blocks are wrapped in section/column
          const wrappedMjml = block.mjml.startsWith('<mj-section')
            ? block.mjml
            : `<mj-section><mj-column>${block.mjml}</mj-column></mj-section>`;
          return wrappedMjml;
        }
      }).join("");

    return `<mjml>
      <mj-head>
        <mj-attributes>
          <mj-all font-family="Arial, sans-serif" line-height="1.5" />
          <mj-text padding="0" />
          <mj-image padding="0" />
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
        validationLevel: 'soft',
        fonts: {}
      });

      if (result.errors.length > 0) {
        throw new Error(result.errors.map(e => e.formattedMessage).join('\n'));
      }

      setPreviewHtml(result.html);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid MJML structure");
      setPreviewHtml('<div class="text-red-500 p-4">Error rendering template</div>');
    }
  }, [blocks, generateFullMJML]);

  const moveBlock = useCallback((dragIndex: number, hoverIndex: number) => {
    setBlocks(prev => {
      // Boundary checks
      if (dragIndex < 0 || dragIndex >= prev.length ||
        hoverIndex < 0 || hoverIndex >= prev.length) {
        return prev;
      }

      const newBlocks = [...prev];
      const [removed] = newBlocks.splice(dragIndex, 1);
      newBlocks.splice(hoverIndex, 0, removed);
      return newBlocks.filter(block => !!block);
    });
  }, []);

  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setBlocks(prev =>
      prev.map(block => {
        if (block?.id === id) {
          const updated = { ...block, ...updates };
          if (updated.type === 'columns' && updated.children) {
            return {
              ...updated,
              mjml: `<mj-section>${updated.children.map(column =>
                `<mj-column>${column.map(child => child?.mjml || '').join('')}</mj-column>`
              ).join('')}</mj-section>`
            };
          }
          return updated;
        }
        return block;
      }).filter(block => !!block)
    );
  }, []);

  const addBlockBelow = (index: number, type: BlockType) => {
    let newBlock: Block;

    if (type === 'columns') {
      newBlock = {
        id: Date.now().toString(),
        type: 'columns',
        content: '',
        mjml: '<mj-section><mj-column></mj-column><mj-column></mj-column></mj-section>',
        styles: {},
        children: [[], []]
      };
    } else {
      const defaultStyles = type === "text"
        ? { fontSize: "14px", color: "#000000" }
        : { width: "100%" };

      newBlock = {
        id: Date.now().toString(),
        type,
        content: type === "text" ? "New text" : "https://via.placeholder.com/350x150",
        mjml: type === "text"
          ? `<mj-section><mj-column><mj-text font-size="${defaultStyles.fontSize}" color="${defaultStyles.color}">New text</mj-text></mj-column></mj-section>`
          : `<mj-section padding="10px 0"><mj-column><mj-image src="https://via.placeholder.com/350x150" width="${defaultStyles.width}" /></mj-column></mj-section>`,
        styles: defaultStyles
      };
    }

    setBlocks(prev => [
      ...prev.slice(0, index + 1),
      newBlock,
      ...prev.slice(index + 1)
    ].filter(block => !!block));
  };

  const addBlockToColumn = useCallback((parentId: string, columnIndex: number, type: BlockType) => {
    setBlocks(prev => prev.map(block => {
      if (block?.id === parentId && block.children) {
        const newChildBlock: Block = {
          id: Date.now().toString(),
          type,
          content: type === 'text' ? 'New text' : 'https://via.placeholder.com/350x150',
          styles: type === 'text' ? { fontSize: '14px', color: '#000000' } : { width: '100%' },
          mjml: type === 'text' ?
            '<mj-text>New text</mj-text>' :
            '<mj-image src="https://via.placeholder.com/350x150" />'
        };

        const newChildren = block.children.map((col, idx) =>
          idx === columnIndex ? [...col, newChildBlock] : col
        );

        return {
          ...block,
          children: newChildren,
          mjml: `<mj-section>${newChildren.map(column =>
            `<mj-column>${column.map(child => child.mjml).join('')}</mj-column>`
          ).join('')}</mj-section>`
        };
      }
      return block;
    }).filter(block => !!block));
  }, []);

  const handleExport = () => {
    const jsonString = JSON.stringify(blocks, null, 2);
    navigator.clipboard.writeText(jsonString);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed) && parsed.every(isValidBlock)) {
        setBlocks(parsed.filter(block => !!block));
        setJsonInput("");
      }
    } catch (e) {
      alert("Invalid JSON structure");
    }
  };

  const isValidBlock = (block: any): block is Block => {
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

    if (block.type === 'columns' && block.children) {
      const isValidColumns = Array.isArray(block.children) &&
        block.children.every((column: any) =>
          Array.isArray(column) &&
          column.every((child: any) => isValidBlock(child))
        );
      if (!isValidColumns) return false;
    }

    return true;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex justify-center">
        <div className="p-8 m-4 bg-white">
          <div className="flex gap-4 mb-12">
            <button className="border p-2" onClick={handleImport}>
              Import JSON
            </button>
            <button className="border p-2" onClick={handleExport}>
              Export JSON
            </button>
            <textarea
              className="flex-1 border p-2"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste JSON here"
            />
          </div>

          <div className="flex gap-4 flex-col max-w[800px]">
            <div className="flex-1 max-w-[600px] border p-4" >
              {blocks
                .filter(block => !!block)
                .map((block, index) => (
                  !block ? null : (
                    block.type === "columns" ? (
                      <ColumnComponent
                        key={block.id}
                        block={block}
                        index={index}
                        moveBlock={moveBlock}
                        updateBlock={updateBlock}
                        deleteBlock={(id) => setBlocks(prev => prev.filter(b => b?.id !== id))}
                        addBlockToColumn={addBlockToColumn}
                      />
                    ) : block.type === "text" ? (
                      <TextComponent
                        key={block.id}
                        block={block}
                        index={index}
                        moveBlock={moveBlock}
                        updateBlock={updateBlock}
                        deleteBlock={(id) => setBlocks(prev => prev.filter(b => b?.id !== id))}
                        addBlockBelow={addBlockBelow}
                      />
                    ) : (
                      <ImageComponent
                        key={block.id}
                        block={block}
                        index={index}
                        moveBlock={moveBlock}
                        updateBlock={updateBlock}
                        deleteBlock={(id) => setBlocks(prev => prev.filter(b => b?.id !== id))}
                        addBlockBelow={addBlockBelow}
                      />
                    )
                  )
                ))}
              <div className="mt-4 space-x-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => addBlockBelow(blocks.length, "text")}
                >
                  + Add Text
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={() => addBlockBelow(blocks.length, "columns")}
                >
                  + Add Columns
                </button>
              </div>
            </div>

            <div className="flex-1">
              {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                  <h3 className="font-bold mb-2">MJML Errors:</h3>
                  <pre className="text-xs whitespace-pre-wrap">{error}</pre>
                </div>
              )}

              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />

              <div className="mt-4 p-4 bg-gray-100">
                <h3 className="font-bold mb-2">Generated MJML:</h3>
                <pre className="text-xs whitespace-pre-wrap">
                  {generateFullMJML(blocks)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default SimpleEmailBuilder;