import DataGrid from "./Datagrid";

export interface Segment {
    id: string;
    SegmentName: string;
    createdAt: string;
    lastRun: string;
    openRate: number;
    clickRate: number;
    query?: string;
}

interface SegmentListProps {
    segments: Segment[];
    onEdit: (segment: Segment) => void;
    onDuplicate: (segment: Segment) => void;
    onDelete: (id: string) => void;
}

const SegmentList = ({ segments, onEdit, onDuplicate, onDelete }: SegmentListProps) => {
    const columns = [
        { id: 'id', label: 'ID', show: true },
        { id: 'name', label: 'Name', show: true },
        { id: 'email', label: 'Email', show: false },
        { id: 'role', label: 'Role' },
      ];
    
      const rows = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
      ];

    return (
        <div className="container mx-auto p-4">
        <DataGrid rows={rows} columns={columns} />
      </div>
    );
};

export default SegmentList;