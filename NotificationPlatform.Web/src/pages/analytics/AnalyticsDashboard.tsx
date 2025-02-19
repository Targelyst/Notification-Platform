import React, {
  useState,
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent
} from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import type { Layouts } from "react-grid-layout";
import { FaChartBar, FaTools, FaExpand, FaCompress } from "react-icons/fa";
import { HiOutlinePlus } from "react-icons/hi";

// DnD Kit imports
import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Wrap the Responsive component once
const ResponsiveGridLayout = WidthProvider(Responsive);

// ----------------------------------------------------------------------------
export interface SidebarItemMeta {
  componentKey: string;
  type: "widget" | "area";
  label: string;
  iconName: string;
  layouts: Layouts;
}

export interface DashboardWidget {
  id: string;
  componentKey: string;
  minimized?: boolean;
  title?: string;
  layouts: Layouts; // RGL layout definitions by breakpoint
}

/** Each Area (full-width container) at the top level */
export interface DashboardArea {
  id: string;
  componentKey: string;
  minimized?: boolean;
  title: string;
  height: number;
  widgets: DashboardWidget[];
}

// Props for any widget component
interface DashboardWidgetProps {
  widget: DashboardWidget;
  onToggleMinimize?: () => void;
  onChangeTitle?: (newTitle: string) => void;
}

// Props for any area component
interface DashboardAreaProps {
  area: DashboardArea;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>; // from useSortable
  onChangeAreaTitle?: (newTitle: string) => void;
  onToggleMinimize?: () => void;
  onResizeArea?: (newHeight: number) => void;
  children?: React.ReactNode;
}

// -----------------------------------------------------------------------------
// 2) Example Area & Widget Components with .meta
// -----------------------------------------------------------------------------

/** Full-Width Area */
const FullWidthArea: React.FC<DashboardAreaProps> & { meta: SidebarItemMeta } = ({
  area,
  dragHandleProps,
  onChangeAreaTitle,
  onToggleMinimize,
  onResizeArea,
  children
}) => {
  // We'll implement a manual vertical resize
  const isResizingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(area.height);

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    // Stop dndKit from interpreting as a drag
    e.stopPropagation();
    e.preventDefault();

    isResizingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = area.height;

    // Add pure DOM events for resizing
    document.addEventListener("mousemove", onDocumentMouseMove as EventListener);
    document.addEventListener("mouseup", onDocumentMouseUp as EventListener);
  };

  const onDocumentMouseMove = (e: globalThis.MouseEvent) => {
    if (!isResizingRef.current) return;
    const delta = e.clientY - startYRef.current;
    let newHeight = startHeightRef.current + delta;
    if (newHeight < 50) {
      newHeight = 50;
    }
    onResizeArea?.(newHeight);
  };

  const onDocumentMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", onDocumentMouseMove as EventListener);
    document.removeEventListener("mouseup", onDocumentMouseUp as EventListener);
  };

  return (
    <div
      className="w-full border border-gray-300 rounded bg-white mb-4 relative"
      style={{
        height: area.minimized ? 50 : area.height,
        transition: "height 0.2s ease"
      }}
    >
      {/* Top bar (drag handle) */}
      {/* NOTE: we apply .area-drag-handle here so that only this triggers DnDKit */}
      <div
        className="area-drag-handle flex items-center justify-between bg-gray-100 p-2"
        style={{ cursor: "move" }}
        {...dragHandleProps}
      >
        <input
          className="bg-transparent outline-none text-sm font-medium"
          value={area.title || ""}
          onChange={(ev) => onChangeAreaTitle?.(ev.target.value)}
        />
        <button
          type="button"
          onClick={() => onToggleMinimize?.()}
          className="text-gray-600 hover:text-gray-900"
        >
          {area.minimized ? <FaExpand /> : <FaCompress />}
        </button>
      </div>

      {/* The interior (children = nested RGL), if not minimized */}
      {!area.minimized && (
        <div className="p-2" style={{ height: "100%", position: "relative" }}>
          {children}
        </div>
      )}

      {/* Bottom resize handle (if not minimized) */}
      {!area.minimized && (
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "8px",
            backgroundColor: "rgba(128,128,128,0.2)",
            cursor: "ns-resize",
            borderTop: "1px solid #ccc"
          }}
        />
      )}
    </div>
  );
};

FullWidthArea.meta = {
  componentKey: "FullWidthArea",
  type: "area",
  label: "Full-Width Area",
  iconName: "",
  layouts: {
    lg: [{ i: "", w: 12, h: 2, x: 0, y: 0 }],
    md: [{ i: "", w: 10, h: 2, x: 0, y: 0 }],
    sm: [{ i: "", w: 6, h: 2, x: 0, y: 0 }],
    xs: [{ i: "", w: 4, h: 2, x: 0, y: 0 }],
    xxs: [{ i: "", w: 2, h: 2, x: 0, y: 0 }]
  }
};

/** Widget #1 */
const Widget1: React.FC<DashboardWidgetProps> & { meta: SidebarItemMeta } = ({
  widget,
  onToggleMinimize
}) => {
  return (
    <div className="h-full w-full flex flex-col border border-blue-300 rounded bg-white">
      <div className="grid-item__title flex items-center justify-between bg-blue-50 p-2 cursor-move">
        <div className="flex items-center space-x-2">
          <FaChartBar />
          <span className="text-sm font-medium">
            {widget.title || "Widget #1"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onToggleMinimize?.()}
          className="text-gray-600 hover:text-gray-900"
        >
          {widget.minimized ? <FaExpand /> : <FaCompress />}
        </button>
      </div>
      <div className="p-2 flex-1 text-gray-700 text-sm">
        <p>Widget #1 content goes here.</p>
      </div>
    </div>
  );
};

Widget1.meta = {
  componentKey: "Widget1",
  type: "widget",
  label: "Widget #1",
  iconName: "FaChartBar",
  layouts: {
    lg: [{ i: "", w: 6, h: 2, x: 0, y: 0 }],
    md: [{ i: "", w: 5, h: 2, x: 0, y: 0 }],
    sm: [{ i: "", w: 3, h: 2, x: 0, y: 0 }],
    xs: [{ i: "", w: 4, h: 2, x: 0, y: 0 }],
    xxs: [{ i: "", w: 2, h: 2, x: 0, y: 0 }]
  }
};

/** Widget #2 */
const Widget2: React.FC<DashboardWidgetProps> & { meta: SidebarItemMeta } = ({
  widget,
  onToggleMinimize
}) => {
  return (
    <div className="h-full w-full flex flex-col border border-blue-300 rounded bg-white">
      <div className="grid-item__title flex items-center justify-between bg-blue-50 p-2 cursor-move">
        <div className="flex items-center space-x-2">
          <FaTools />
          <span className="text-sm font-medium">
            {widget.title || "Widget #2"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onToggleMinimize?.()}
          className="text-gray-600 hover:text-gray-900"
        >
          {widget.minimized ? <FaExpand /> : <FaCompress />}
        </button>
      </div>
      <div className="p-2 flex-1 text-gray-700 text-sm">
        <p>Widget #2 content goes here.</p>
      </div>
    </div>
  );
};

Widget2.meta = {
  componentKey: "Widget2",
  type: "widget",
  label: "Widget #2",
  iconName: "FaTools",
  layouts: {
    lg: [{ i: "", w: 4, h: 2, x: 0, y: 0 }],
    md: [{ i: "", w: 4, h: 2, x: 0, y: 0 }],
    sm: [{ i: "", w: 3, h: 2, x: 0, y: 0 }],
    xs: [{ i: "", w: 2, h: 2, x: 0, y: 0 }],
    xxs: [{ i: "", w: 2, h: 2, x: 0, y: 0 }]
  }
};

// -----------------------------------------------------------------------------
// 3) Registries for components
// -----------------------------------------------------------------------------

const widgetComponentMap: Record<string, React.FC<DashboardWidgetProps>> = {
  Widget1,
  Widget2
};

const areaComponentMap: Record<string, React.FC<DashboardAreaProps>> = {
  FullWidthArea
};

// -----------------------------------------------------------------------------
// 4) Our default sidebar items
// -----------------------------------------------------------------------------

const defaultSidebarItems: SidebarItemMeta[] = [
  Widget1.meta,
  Widget2.meta
];

// React-Grid-Layout breakpoints
const breakpoints = { lg: 1280, md: 992, sm: 767, xs: 480, xxs: 0 };
const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// -----------------------------------------------------------------------------
// 5) Sortable Wrapper for each Area
// -----------------------------------------------------------------------------

interface SortableAreaItemProps {
  area: DashboardArea;
  children: React.ReactNode;
}

const SortableAreaItem: React.FC<SortableAreaItemProps> = ({ area, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    active
  } = useSortable({ id: area.id });

  // Only apply the transform if this area is the one being dragged by DnD Kit
  const style: React.CSSProperties = {
    transform: active?.id === area.id ? CSS.Translate.toString(transform) : undefined,
    transition: active?.id === area.id ? transition : undefined
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* 
        We still pass attributes and listeners down to the child's drag handle 
        so that only the handle can start dragging the Area
      */}
      {React.cloneElement(children as React.ReactElement, {
        dragHandleProps: { ...attributes, ...listeners }
      })}
    </div>
  );
};

// -----------------------------------------------------------------------------
// 6) Custom MouseSensor that only activates on .area-drag-handle
// -----------------------------------------------------------------------------

// Helper to see if the user clicked within an .area-drag-handle
function isOnAreaDragHandle(event: MouseEvent | TouchEvent) {
  const target = event.target as HTMLElement | null;
  if (!target) return false;
  return !!target.closest(".area-drag-handle");
}

/**
 * Extend MouseSensor so that we only activate if user clicks on an element
 * that is (or is inside) .area-drag-handle
 */
class AreasOnlyMouseSensor extends MouseSensor {
  static activators = [
    {
      eventName: "onMouseDown" as const,
      handler: ({ nativeEvent: event }: any) => {
        // Return true if within .area-drag-handle
        return isOnAreaDragHandle(event);
      }
    }
  ];
}

// -----------------------------------------------------------------------------
// 7) Main Dashboard
// -----------------------------------------------------------------------------

const AnalyticsDashboard: React.FC = () => {
  // Use null to avoid overwriting localStorage on the first load
  const [areas, setAreas] = useState<DashboardArea[] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // We only want to reorder "Areas" (top-level), so we use the custom sensor
  const sensors = useSensors(
    useSensor(AreasOnlyMouseSensor),
    useSensor(TouchSensor)
  );

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("my-dashboard-areas");
      if (saved) {
        setAreas(JSON.parse(saved));
      } else {
        setAreas([]); // No saved data, start empty
      }
    } catch (err) {
      console.error("Failed to parse saved areas", err);
      setAreas([]);
    }
  }, []);

  // Save to localStorage whenever areas changes (and we actually have an array)
  useEffect(() => {
    if (areas !== null) {
      localStorage.setItem("my-dashboard-areas", JSON.stringify(areas));
    }
  }, [areas]);

  // If areas is null, we haven't finished loading yet
  if (areas === null) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  // Add item from sidebar
  function handleAddItem(meta: SidebarItemMeta) {
    if (meta.type === "area") {
      setAreas((prev) => [
        ...prev,
        {
          id: generateId(),
          componentKey: meta.componentKey,
          minimized: false,
          title: "Untitled Area",
          height: 300,
          widgets: []
        }
      ]);
    } else {
      // It's a widget
      if (areas.length === 0) {
        alert("No areas available! Please add an Area first.");
        return;
      }
      const areaList = areas.map((a) => `${a.id} => ${a.title}`).join("\n");
      const areaId = prompt(
        `Enter the Area ID to add widget "${meta.label}"\n\nCurrent Areas:\n${areaList}`
      );
      if (!areaId) return;
      const idx = areas.findIndex((a) => a.id === areaId);
      if (idx === -1) {
        alert("Invalid area ID.");
        return;
      }

      const newId = generateId();
      const newLayouts: Layouts = {};
      for (const bp of Object.keys(meta.layouts)) {
        newLayouts[bp] = [];
        for (const layoutItem of meta.layouts[bp]) {
          newLayouts[bp].push({
            ...layoutItem,
            i: newId
          });
        }
      }

      const newWidget: DashboardWidget = {
        id: newId,
        componentKey: meta.componentKey,
        minimized: false,
        layouts: newLayouts
      };

      const newAreas = [...areas];
      newAreas[idx] = {
        ...newAreas[idx],
        widgets: [...newAreas[idx].widgets, newWidget]
      };
      setAreas(newAreas);
    }
    setSidebarOpen(false);
  }

  // Toggle sidebar
  function toggleSidebar() {
    setSidebarOpen((p) => !p);
  }

  // Reorder areas
  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = areas.findIndex((a) => a.id === active.id);
      const newIndex = areas.findIndex((a) => a.id === over.id);
      setAreas((items) => arrayMove(items, oldIndex, newIndex));
    }
  }

  // Minimize area
  function handleToggleMinimizeArea(areaId: string) {
    setAreas((prev) =>
      prev.map((a) =>
        a.id === areaId ? { ...a, minimized: !a.minimized } : a
      )
    );
  }

  // Change area title
  function handleChangeAreaTitle(areaId: string, newTitle: string) {
    setAreas((prev) =>
      prev.map((a) => (a.id === areaId ? { ...a, title: newTitle } : a))
    );
  }

  // Resize area
  function handleResizeArea(areaId: string, newHeight: number) {
    setAreas((prev) =>
      prev.map((a) => (a.id === areaId ? { ...a, height: newHeight } : a))
    );
  }

  // Minimize a widget
  function handleToggleMinimizeWidget(areaId: string, widgetId: string) {
    setAreas((prev) =>
      prev.map((area) => {
        if (area.id !== areaId) return area;
        const updatedWidgets: DashboardWidget[] = [];
        for (const w of area.widgets) {
          if (w.id === widgetId) {
            const minimized = !w.minimized;
            const newLayouts: Layouts = {};
            for (const bp of Object.keys(w.layouts)) {
              newLayouts[bp] = [];
              for (const l of w.layouts[bp]) {
                newLayouts[bp].push({
                  ...l,
                  w: minimized ? 1 : l.w,
                  h: minimized ? 1 : l.h
                });
              }
            }
            updatedWidgets.push({ ...w, minimized, layouts: newLayouts });
          } else {
            updatedWidgets.push(w);
          }
        }
        return { ...area, widgets: updatedWidgets };
      })
    );
  }

  // Change widget title
  function handleChangeWidgetTitle(
    areaId: string,
    widgetId: string,
    newTitle: string
  ) {
    setAreas((prev) =>
      prev.map((area) => {
        if (area.id !== areaId) return area;
        const updatedWidgets = [];
        for (const w of area.widgets) {
          if (w.id === widgetId) {
            updatedWidgets.push({ ...w, title: newTitle });
          } else {
            updatedWidgets.push(w);
          }
        }
        return { ...area, widgets: updatedWidgets };
      })
    );
  }

  // Merge each widget's layouts for a single RGL "layouts" object
  function combineAreaWidgetLayouts(widgets: DashboardWidget[]): Layouts {
    const layoutMap: Layouts = { lg: [], md: [], sm: [], xs: [], xxs: [] };
    for (const w of widgets) {
      for (const bp of Object.keys(w.layouts)) {
        const layoutItems = w.layouts[bp];
        for (const item of layoutItems) {
          layoutMap[bp].push({ ...item, i: w.id });
        }
      }
    }
    return layoutMap;
  }

  // Render a widget
  function renderWidget(areaId: string, widget: DashboardWidget) {
    const Cmp = widgetComponentMap[widget.componentKey];
    if (!Cmp) {
      return <div className="p-4">Unknown widget: {widget.componentKey}</div>;
    }
    return (
      <Cmp
        widget={widget}
        onToggleMinimize={() => handleToggleMinimizeWidget(areaId, widget.id)}
        onChangeTitle={(t) => handleChangeWidgetTitle(areaId, widget.id, t)}
      />
    );
  }

  // Render an area, including its nested RGL
  function renderArea(area: DashboardArea, dragHandleProps?: React.HTMLAttributes<HTMLDivElement>) {
    const A = areaComponentMap[area.componentKey];
    if (!A) {
      return <div>Unknown Area: {area.componentKey}</div>;
    }
    return (
      <A
        area={area}
        dragHandleProps={dragHandleProps}
        onToggleMinimize={() => handleToggleMinimizeArea(area.id)}
        onChangeAreaTitle={(t) => handleChangeAreaTitle(area.id, t)}
        onResizeArea={(h) => handleResizeArea(area.id, h)}
      >
        <div className="border-2">
        {!area.minimized && (
          <ResponsiveGridLayout
            breakpoints={breakpoints}
            cols={cols}
            layouts={combineAreaWidgetLayouts(area.widgets)}
            onLayoutChange={(_, all) => {
              // Update each widget's x,y,w,h
              setAreas((prev) =>
                prev.map((testArea) => {
                  if (testArea.id !== area.id) return testArea;

                  const updatedWidgets: DashboardWidget[] = [];
                  for (const w of testArea.widgets) {
                    const newLayouts: Layouts = {};
                    for (const bp of Object.keys(all)) {
                      const found = all[bp].find((l) => l.i === w.id);
                      if (found) {
                        newLayouts[bp] = [
                          {
                            i: w.id,
                            x: found.x,
                            y: found.y,
                            w: w.minimized ? 1 : found.w,
                            h: w.minimized ? 1 : found.h
                          }
                        ];
                      } else {
                        // If not found (rare), just preserve existing
                        newLayouts[bp] = w.layouts[bp];
                      }
                    }
                    updatedWidgets.push({ ...w, layouts: newLayouts });
                  }
                  return { ...testArea, widgets: updatedWidgets };
                })
              );
            }}
            isDraggable
            isResizable
            draggableHandle=".grid-item__title"
            draggableCancel=".grid-item__title button, .grid-item__title input"
            rowHeight={50}
            margin={[10, 10]}
            className="layout"
            style={{ minHeight: "100px", width: "100%" }}
          >
            {area.widgets.map((w) => (
              <div key={w.id}>{renderWidget(area.id, w)}</div>
            ))}
          </ResponsiveGridLayout>
        )}
        </div>
      </A>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed md:static z-10 top-0 left-0 h-full bg-gray-100 p-4 border-r border-gray-300 transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:w-64 w-64`}
      >
        <h2 className="text-lg font-bold mb-4">Add Items</h2>
        <ul className="space-y-2">
          {defaultSidebarItems.map((meta) => (
            <li key={meta.componentKey}>
              <button
                type="button"
                onClick={() => handleAddItem(meta)}
                className="bg-blue-600 text-white px-3 py-2 rounded flex items-center space-x-2 w-full"
              >
                <HiOutlinePlus />
                <span>{meta.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <button
          type="button"
          onClick={toggleSidebar}
          className="md:hidden m-2 px-3 py-2 bg-gray-200 rounded"
        >
          Toggle Sidebar
        </button>
        
        {/* Add Area button container */}
        <div className="p-2 border-b">
          <button
            type="button"
            onClick={() => handleAddItem(FullWidthArea.meta)}
            className="bg-blue-600 text-white px-3 py-2 rounded flex items-center space-x-2 w-full"
          >
            <HiOutlinePlus />
            <span>Add Area</span>
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={areas.map((a) => a.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="p-2">
              {areas.map((area) => (
                <SortableAreaItem key={area.id} area={area}>
                  {renderArea(area)}
                </SortableAreaItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
