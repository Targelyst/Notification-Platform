import { useState } from 'react';
import type { Segment } from '../../components/SegmentList';
import BasicLayout from '../../components/BasicLayot';
import Area from '../../components/Area';
import { Bottombar } from '../../components/BottomBar';
import Example from '../../components/Datagrid';

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
    const [dockState, setDockState] = useState(false);


    return (

        <div>
            <BasicLayout title='Segments' description='Manage your audienceManage your audience'>
                <Area title='Segment List'>
                    <div className="flex gap-8">
                        <Bottombar initialHeight={1200} isDocked={dockState} onDockChange={setDockState} >
                            <div className="p-4">
                                <h3 className="text-lg font-medium mb-4">Bottombar Content</h3>
                                <p>Custom content goes here...</p>
                            </div>
                        </Bottombar>
                    </div>
                </Area>
            </BasicLayout>
            <div className='w-full bg-impolar-bg-surface flex flex-wrap '><div className='flex gap-4 space-x-12 space-y-12'>
                <div className="overflow-hidden max-w-full">
                    <Example />
                </div>
            </div>
            </div>
        </div>

    );
}