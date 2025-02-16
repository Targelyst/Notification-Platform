import DataGrid from "./Datagrid";


interface Segment {
    id: string;
    SegmentName: string;
    createdAt: string;
    lastRun: string;
    openRate: number;
    clickRate: number;
}

const SegmentList = () => {
    const segments: Segment[] = [
        {
            id: '1',
            SegmentName: 'High Value Customers',
            createdAt: '2024-01-15',
            lastRun: '2024-03-20',
            openRate: 42.5,
            clickRate: 8.2
        },
        {
            id: '2',
            SegmentName: 'Inactive Users',
            createdAt: '2024-02-01',
            lastRun: '2024-03-18',
            openRate: 18.3,
            clickRate: 1.4
        },
        {
            id: '3',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
        },
        {
            id: '4',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
        },
        {
            id: '5',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
        },
        {
            id: '6',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
        },
        {
            id: '7',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
        },
        {
            id: '8',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
        },
        {
            id: '9',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
        },
        {
            id: '10',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
        },
        {
            id: '11',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
        },
        {
            id: '12',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
        },
        {
            id: '13',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
        },
        {
            id: '14',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
        },
        {
            id: '15',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
        },
        {
            id: '16',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
        },
        {
            id: '17',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
        },
        {
            id: '18',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
        },
        {
            id: '19',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
        },
        {
            id: '22',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
          },
          {
            id: '322',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
          },
          {
            id: '331',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
          },
          {
            id: '3112',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
          },
          {
            id: '34141',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
          },
          {
            id: '3414',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
          },
          {
            id: '34141411',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
          },
          {
            id: '1233',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
          },
          {
            id: '5513',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
          },
          {
            id: '3621',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
          },
          {
            id: '4133',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
          },
          {
            id: '341421',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
          },
          {
            id: '3414122',
            SegmentName: 'Repeat Purchasers',
            createdAt: '2024-03-10',
            lastRun: '2024-03-22',
            openRate: 55.1,
            clickRate: 12.7
          },

    ];

    const columns = [
        {
            field: 'SegmentName',
            sticky: true
        },
        { field: 'createdAt', },
        { field: 'lastRun' },
        { field: 'openRate' },
        { field: 'clickRate' },
        {
            field: 'actions',
            component: ({ id }: Segment) => (
                <button
                    type="button"
                    onClick={() => handleEdit(id)}
                    className="px-2 py-1 bg-impolar-primary text-impolar-primary-text rounded"
                >
                    Edit
                </button>
            )
        }
    ];

    const handleEdit = (id: string) => {
        console.log('Editing segment:', id);
        // Add your edit logic here
    };

    return (
        <div className="p-4">
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
