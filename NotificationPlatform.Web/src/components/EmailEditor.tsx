import React, { useRef, useEffect, useState, useMemo } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Delimiter from "@editorjs/delimiter";

interface EditorProps {
  initialData?: OutputData;
}

const Editor: React.FC<EditorProps> = ({ initialData }) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const isInitializing = useRef(false);

  const handleSave = async () => {
    if (editorRef.current) {
      try {
        const outputData = await editorRef.current.save();
        console.log("Saved content:", outputData);
      } catch (error) {
        console.error("Save error:", error);
      }
    }
  };

  useEffect(() => {
    let editorInstance: EditorJS | null = null;

    const initializeEditor = async () => {
      if (isInitializing.current || editorRef.current) return;
      isInitializing.current = true;

      try {
        if (editorRef.current) {
          await editorRef.current.destroy();
          editorRef.current = null;
        }

        if (holderRef.current) {
          editorInstance = new EditorJS({
            holder: holderRef.current,
            data: initialData,
            tools: {
              header: {
                class: Header,
                config: {
                  placeholder: 'Enter a header',
                  levels: [2, 3, 4],
                  defaultLevel: 2
                }
              },
              list: {
                class: List,
                inlineToolbar: true
              },
              image: {
                class: ImageTool,
                config: {
                  uploader: {
                    uploadByFile(file: File) {
                      return {
                        success: 1,
                        file: {
                          url: URL.createObjectURL(file),
                        }
                      };
                    }
                  }
                }
              },
              quote: {
                class: Quote,
                inlineToolbar: true,
                config: {
                  quotePlaceholder: 'Enter a quote',
                  captionPlaceholder: 'Quote author',
                }
              },
              code: CodeTool,
              embed: {
                class: Embed,
                config: {
                  services: {
                    youtube: true,
                    coub: true,
                    twitter: true,
                    instagram: true,
                    facebook: true
                  }
                }
              },
              table: {
                class: Table,
                inlineToolbar: true
              },
              delimiter: Delimiter
            },
            autofocus: true,
            onReady: () => {
              setIsReady(true);
              console.log("Editor ready");
            },
          });

          await editorInstance.isReady;
          editorRef.current = editorInstance;
        }
      } catch (error) {
        console.error("Editor initialization failed:", error);
      } finally {
        isInitializing.current = false;
      }
    };

    initializeEditor();

    return () => {
      const cleanup = async () => {
        if (editorInstance) {
          try {
            await editorInstance.destroy();
            editorRef.current = null;
            setIsReady(false);
          } catch (error) {
            console.error("Destruction error:", error);
          }
        }
      };
      cleanup();
    };
  }, [initialData]);

  return (
    <div className="flex flex-col space-y-4">
      <div
        ref={holderRef}
        className="min-h-[300px] w-full p-4 border border-gray-300 rounded-lg bg-white"
      />
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        disabled={!isReady}
      >
        Save Content
      </button>
    </div>
  );
};

const EmailEditor: React.FC = () => {
  const initialData = useMemo(() => ({
    blocks: [
      {
        type: "header",
        data: {
          text: "Welcome to the Editor!",
          level: 2
        }
      },
      {
        type: "paragraph",
        data: { text: "Start writing your content here..." }
      },
      {
        type: "image",
        data: {
          file: {
            url: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
          },
          caption: "Example image",
          withBorder: true,
          stretched: false,
          withBackground: false
        }
      },
      {
        type: "delimiter",
        data: {}
      }
    ],
    version: "2.19.0"
  }), []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Advanced Email Editor</h1>
      <Editor initialData={initialData} />
    </div>
  );
};

export default EmailEditor;