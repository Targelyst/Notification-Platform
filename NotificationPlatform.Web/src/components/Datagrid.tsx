import { useMemo } from "react";
import {
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef,
} from "mantine-react-table";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";
import { useAllSegments } from "../api/segments";
import type { EmailSegment } from "../gql/graphql";

// type Person = {
// 	name: {
// 		firstName: string;
// 		lastName: string;
// 	};
// 	address: string;
// 	city: string;
// 	state: string;
// };

// const data: Person[] = [
// 	{
// 		name: {
// 			firstName: "Zachary",
// 			lastName: "Davis",
// 		},
// 		address: "261 Battle Ford",
// 		city: "Columbus",
// 		state: "Ohio",
// 	},
// 	{
// 		name: {
// 			firstName: "Robert",
// 			lastName: "Smith",
// 		},
// 		address: "566 Brakus Inlet",
// 		city: "Westerville",
// 		state: "West Virginia",
// 	},
// 	{
// 		name: {
// 			firstName: "Kevin",
// 			lastName: "Yan",
// 		},
// 		address: "7777 Kuhic Knoll",
// 		city: "South Linda",
// 		state: "West Virginia",
// 	},
// 	{
// 		name: {
// 			firstName: "John",
// 			lastName: "Upton",
// 		},
// 		address: "722 Emie Stream",
// 		city: "Huntington",
// 		state: "Washington",
// 	},
// 	{
// 		name: {
// 			firstName: "Nathan",
// 			lastName: "Harris",
// 		},
// 		address: "1 Kuhic Knoll",
// 		city: "Ohiowa",
// 		state: "Nebraska",
// 	},
// ];

type EmailSegmentTableType = Pick<EmailSegment, "id" | "name" | "expression">;

const Example = () => {
	const { query, hasNext, loadNext } = useAllSegments(
		"01954c38-ec53-71e8-ac57-e33cd97d0117",
		10,
	);

	const [{ data: segmentData }] = query;

	console.log("test");

	const columns = useMemo<MRT_ColumnDef<EmailSegmentTableType>[]>(
		// () => [
		// 	{
		// 		accessorKey: "name.firstName",
		// 		header: "First Name",
		// 	},
		// 	{
		// 		accessorKey: "name.lastName",
		// 		header: "Last Name",
		// 	},
		// 	{
		// 		accessorKey: "address",
		// 		header: "Address",
		// 	},
		// 	{
		// 		accessorKey: "city",
		// 		header: "City",
		// 	},
		// 	{
		// 		accessorKey: "state",
		// 		header: "State",
		// 	},
		// ],
		// [],
		() => [
			{
				accessorKey: "id",
				header: "ID",
			},
			{
				accessorKey: "name",
				header: "Name",
			},
			{
				accessorFn: (es) => JSON.stringify(es.expression),
				header: "Expression",
			},
		],
		[],
	);

	const table = useMantineReactTable({
		columns,
		data: segmentData?.emailSegments?.nodes ?? [],
	});

	return (
		<div className="overflow-x-auto w-full">
			<MantineReactTable table={table} />
		</div>
	);
};

export default Example;
