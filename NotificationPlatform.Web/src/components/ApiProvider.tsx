import { useMemo, type PropsWithChildren } from "react";
import { useAuth } from "react-oidc-context";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";

export const ApiProvider = ({ children }: PropsWithChildren) => {
	const auth = useAuth();

	const client = useMemo(
		() =>
			new Client({
				url: import.meta.env.VITE_API_URL,
				exchanges: [cacheExchange, fetchExchange],
				fetchOptions: {
					headers: {
						Authorization: `Bearer ${auth.user?.access_token}`,
					},
				},
			}),
		[auth.user?.access_token],
	);

	return <Provider value={client}>{children}</Provider>;
};
