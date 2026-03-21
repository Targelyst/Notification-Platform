import { useQuery } from "urql";
import { graphql } from "../gql";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { EmailSegmentFilterInput, Project } from "../gql/graphql";

const allSegmentsQuery = graphql(/* GraphQL */ `
  query allSegments(
    $emailConfigurationId: UUID!
    $first: Int!
    $after: String
    $where: EmailSegmentFilterInput
  ) {
    emailSegments(
      emailConfigurationId: $emailConfigurationId
      first: $first
      after: $after
      where: $where
    ) {
      nodes {
        id
        name
        expression
      }

      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);

export function useAllSegments(
	emailConfigurationId: string,
	pageSize: number,
	filter?: EmailSegmentFilterInput,
) {
	const [cursorCurrent, setCursorCurrent] = useState<string>();

	const query = useQuery({
		query: allSegmentsQuery,
		variables: {
			emailConfigurationId,
			first: pageSize,
			after: cursorCurrent,
			filter,
		},
	});

	const nextPage = query[0].data?.emailSegments?.pageInfo.endCursor;
	const hasNext = query[0].data?.emailSegments?.pageInfo.hasNextPage;

	const loadNext = useCallback(() => {
		if (nextPage) {
			setCursorCurrent(nextPage);
		}
	}, [nextPage]);

	return { query, loadNext, hasNext };
}
