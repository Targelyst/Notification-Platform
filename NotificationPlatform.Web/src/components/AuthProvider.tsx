import {
	type OidcClientSettings,
	UserManager,
	WebStorageStateStore,
} from "oidc-client-ts";
import { useEffect, useState, type PropsWithChildren } from "react";
import {
	hasAuthParams,
	AuthProvider as OidcProvider,
	useAuth,
} from "react-oidc-context";

const userManager = new UserManager({
	authority: import.meta.env.VITE_AUTH_AUTHORITY,
	client_id: import.meta.env.VITE_AUTH_CLIENT_ID,
	redirect_uri: `${window.location.origin}${window.location.pathname}`,
	post_logout_redirect_uri: window.location.origin,
	userStore: new WebStorageStateStore({ store: window.sessionStorage }),
	monitorSession: true,
});

const onSigninCallback = () => {
	window.history.replaceState({}, document.title, window.location.pathname);
};

export function AuthProvider({ children }: PropsWithChildren) {
	return (
		<OidcProvider userManager={userManager} onSigninCallback={onSigninCallback}>
			{children}
		</OidcProvider>
	);
}

export function AuthGuard({ children }: PropsWithChildren) {
	const auth = useAuth();

	const [hasTriedSignin, setHasTriedSignin] = useState(false);

	useEffect(() => {
		if (
			!hasAuthParams() &&
			!auth.isAuthenticated &&
			!auth.activeNavigator &&
			!auth.isLoading &&
			!hasTriedSignin
		) {
			auth.signinRedirect();
			setHasTriedSignin(true);
		}
	}, [auth, hasTriedSignin]);

	return (
		<>
			{auth.error ? (
				<>
					<h1>Authentication Error</h1>
					<p>{auth.error.message}</p>
				</>
			) : auth.isLoading ? (
				<>
					<h1>Loading...</h1>
				</>
			) : auth.isAuthenticated ? (
				children
			) : (
				<>
					<h1>Authentication Error</h1>
					<p>Could not log in.</p>
				</>
			)}
		</>
	);
}
