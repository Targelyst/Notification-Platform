import { useState, useMemo, useEffect, useCallback } from 'react';
import { CSVLink } from 'react-csv';
import { Resizable, ResizableBox } from 'react-resizable';
import Button from './Button';
import 'react-resizable/css/styles.css';

interface ColumnType<T = unknown> {
  field: string;
  sticky?: boolean;
  component?: React.ComponentType<T>;
  width?: number;
}

interface DataGridProps<T extends { id: string }> {
  columns: ColumnType<T>[];
  rows: T[];
  selectable?: boolean;
  exportable?: boolean;
  defaultPageSize?: number;
}

const DataGrid = <T extends { id: string }>({
  columns,
  rows,
  selectable = false,
  exportable = false,
  defaultPageSize = 25
}: DataGridProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{ field: string | null; direction: 'asc' | 'desc' }>({ 
    field: null, 
    direction: 'asc' 
  });
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map(col => col.field));
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [stickyEnabled, setStickyEnabled] = useState(true);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    columns.reduce((acc, col) => Object.assign(acc, { [col.field]: col.width || 180 }), {})
  );
  const [tableSize, setTableSize] = useState({ width: 1000, height: 600 });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.columns-menu')) {
        setShowColumnsMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const processedColumns = useMemo(() => 
    columns.filter(col => visibleColumns.includes(col.field)),
    [columns, visibleColumns]
  );

  const sortedRows = useMemo(() => {
    if (!sortConfig.field) return rows;
    return [...rows].sort((a: T, b: T) => {
      const aValue = a[sortConfig.field as keyof T];
      const bValue = b[sortConfig.field as keyof T];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedRows.length / pageSize);

  const handleResize = useCallback((field: string) => (_e: unknown, { size }: { size: { width: number } }) => {
    setColumnWidths(prev => ({ ...prev, [field]: size.width }));
  }, []);

  const toggleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleColumn = (field: string) => {
    setVisibleColumns(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field) 
        : [...prev, field]
    );
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <ResizableBox 
      width={tableSize.width} 
      height={tableSize.height} 
      onResize={(e, { size }) => setTableSize(size)}
      axis="both"
      minConstraints={[600, 400]}
      className="rounded-lg border border-impolar-bg-highlight bg-impolar-bg-surface"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between p-4">
          <div className="flex gap-2">
            <Button 
              buttonType="primary"
              onClick={() => setStickyEnabled(!stickyEnabled)}
            >
              {stickyEnabled ? 'Disable Sticky' : 'Enable Sticky'}
            </Button>
            
            <div className="relative columns-menu">
              <Button
                buttonType="secondary"
                onClick={() => setShowColumnsMenu(!showColumnsMenu)}
              >
                Columns ▼
              </Button>
              {showColumnsMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-impolar-bg-surface rounded-lg shadow-lg p-2 z-50">
                  {columns.map(col => (
                    <label key={col.field} className="flex items-center space-x-2 p-2 hover:bg-impolar-bg-highlight">
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col.field)}
                        onChange={() => toggleColumn(col.field)}
                        className="text-impolar-primary"
                      />
                      <span className="text-impolar-bg-surface-text">{col.field}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {exportable && (
            <CSVLink 
              data={sortedRows} 
              filename="data.csv"
            >
              <Button buttonType="primary">
                Export CSV
              </Button>
            </CSVLink>
          )}
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full bg-impolar-bg-surface" style={{ tableLayout: 'fixed' }}>
            <thead className="bg-impolar-bg-highlight">
              <tr>
                {selectable && (
                  <th className="sticky left-0 z-20 p-4" style={{ width: 50 }}>
                    <input
                      type="checkbox"
                      onChange={e => {
                        const ids = sortedRows.map(row => row.id);
                        setSelectedRows(e.target.checked ? new Set(ids) : new Set());
                      }}
                    />
                  </th>
                )}
                
                {processedColumns.map(col => (
                  <Resizable
                    key={col.field}
                    width={columnWidths[col.field]}
                    height={40}
                    onResize={handleResize(col.field)}
                    draggableOpts={{ enableUserSelectHack: false }}
                  >
                    <th
                      className={`p-4 text-left relative ${col.sticky && stickyEnabled ? 'sticky right-0 z-10' : ''}`}
                      style={{ 
                        width: columnWidths[col.field],
                        ...(col.sticky && stickyEnabled ? { right: 0 } : {})
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(col.field)}
                        className="flex items-center gap-2 text-impolar-bg-surface-text w-full"
                      >
                        {col.field}
                        {sortConfig.field === col.field && (
                          <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                  </Resizable>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedRows.map(row => (
                <tr
                  key={row.id}
                  className="border-t border-impolar-bg-highlight hover:bg-impolar-bg-highlight"
                >
                  {selectable && (
                    <td className="sticky left-0 z-20 p-4 bg-impolar-bg-surface" style={{ width: 50 }}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={() => toggleRowSelection(row.id)}
                      />
                    </td>
                  )}

                  {processedColumns.map(col => (
                    <td
                      key={col.field}
                      className={`p-4 ${col.sticky && stickyEnabled ? 'sticky right-0 z-10' : ''}`}
                      style={{ 
                        width: columnWidths[col.field],
                        ...(col.sticky && stickyEnabled ? { right: 0 } : {})
                      }}
                    >
                      {col.component ? (
                        <col.component {...row} />
                      ) : (
                        <span className="text-impolar-bg-surface-text">
                          {(row[col.field as keyof T] ?? '-') as React.ReactNode}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedRows.length > 25 && (
          <div className="flex justify-between items-center p-4 bg-impolar-bg-highlight">
            <div className="flex gap-2">
              <Button
                buttonType="primary"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                buttonType="primary"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span>Show:</span>
              <select 
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-impolar-bg-surface px-2 py-1 rounded"
              >
                {[25, 50, 100].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}

        {selectable && selectedRows.size > 0 && (
          <div className="sticky bottom-0 p-4 bg-impolar-primary flex gap-4">
            <span className="text-impolar-primary-text">
              {selectedRows.size} selected
            </span>
            <Button buttonType="secondary">
              Delete Selected
            </Button>
            <Button buttonType="secondary">
              Export Selected
            </Button>
          </div>
        )}
      </div>
    </ResizableBox>
  );
};

export default DataGrid;
