import { useState } from 'react';
import { SegmentBuilder } from '../../components/SegmentBuilder';
import SegmentList, { Segment } from '../../components/SegmentList';
import { RightSidebar } from '../../components/RightSidebar';

const initialSegments: Segment[] = [
    {
        id: '1',
        SegmentName: 'High Value Customers',
        createdAt: '2024-01-15',
        lastRun: '2024-03-20',
        openRate: 42.5,
        clickRate: 8.2,
        query: '(firstName = "John")'
    }
];

export default function Segments() {
    const [segments, setSegments] = useState<Segment[]>(initialSegments);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editedSegment, setEditedSegment] = useState<Segment | null>(null);
    const [isDuplicating, setIsDuplicating] = useState(false);

    const handleSaveSegment = (newSegment: Omit<Segment, 'id' | 'createdAt' | 'lastRun' | 'openRate' | 'clickRate'>) => {
        if (editedSegment) {
            const updated = segments.map(s => 
                s.id === editedSegment.id ? { ...s, ...newSegment } : s
            );
            setSegments(updated);
        } else {
            const newId = Date.now().toString();
            setSegments(prev => [...prev, {
                ...newSegment,
                id: newId,
                createdAt: new Date().toISOString(),
                lastRun: new Date().toISOString(),
                openRate: 0,
                clickRate: 0
            }]);
        }
        setIsSidebarOpen(false);
    };

    const handleEdit = (segment: Segment) => {
        setEditedSegment(segment);
        setIsDuplicating(false);
        setIsSidebarOpen(true);
    };

    const handleDuplicate = (segment: Segment) => {
        setEditedSegment({ ...segment, id: '', SegmentName: `${segment.SegmentName} Copy` });
        setIsDuplicating(true);
        setIsSidebarOpen(true);
    };

    const handleDelete = (id: string) => {
        setSegments(prev => prev.filter(s => s.id !== id));
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            <div className="flex gap-8">
                <SegmentList 
                    segments={segments}
                    onEdit={handleEdit}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                />
                
                {isSidebarOpen && (
                    <RightSidebar
                    width={400}
                        title={isDuplicating ? 'Duplicate Segment' : 'Edit Segment'}
                        onClose={() => setIsSidebarOpen(false)}
                    >
                        <SegmentBuilder 
                            initialQuery={editedSegment?.query}
                            onSave={(query) => handleSaveSegment({
                                ...editedSegment!,
                                SegmentName: editedSegment!.SegmentName,
                                query
                            })}
                            onClose={() => setIsSidebarOpen(false)}
                        />
                    </RightSidebar>
                )}
            </div>
        </div>
    );
}