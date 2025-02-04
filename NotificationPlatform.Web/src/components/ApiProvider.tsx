import type { PropsWithChildren } from "react";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";

const client = new Client({
  url: import.meta.env.VITE_API_URL,
  exchanges: [cacheExchange, fetchExchange],
});

export const ApiProvider = ({ children }: PropsWithChildren) => (
  <Provider value={client}>{children}</Provider>
);
