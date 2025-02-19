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
        {
            field: 'SegmentName',
            sticky: true
        },
        { field: 'createdAt' },
        { field: 'lastRun' },
        { field: 'openRate' },
        { field: 'clickRate' },
        {
            field: 'actions',
            component: (row: Segment) => (
                <select
                    className="bg-impolar-bg-surface text-impolar-bg-text rounded-md px-2 py-1 text-sm border border-impolar-bg-highlight"
                    value=""
                    onChange={(e) => {
                        const action = e.target.value;
                        if (action === "edit") onEdit(row);
                        if (action === "duplicate") onDuplicate(row);
                        if (action === "delete") onDelete(row.id);
                    }}
                >
                    <option value="" disabled>Actions</option>
                    <option value="edit">Edit</option>
                    <option value="duplicate">Duplicate</option>
                    <option value="delete">Delete</option>
                </select>
            )
        }
    ];

    return (
        <div className="p-4 flex-1">
            <DataGrid<Segment>
                columns={columns}
                rows={segments}
                selectable={true}
                exportable={true}
            />
        </div>
    );
};

export default SegmentList;