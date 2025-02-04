import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "http://localhost:5062/graphql",
	documents: ["src/**/*.{ts,tsx}"],
	ignoreNoDocuments: true,
	emitLegacyCommonJSImports: false,
	generates: {
		"./src/gql/": {
			preset: "client",
			plugins: [],
		},
	},
};

export default config;
