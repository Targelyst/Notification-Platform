import { useAuth } from "react-oidc-context";
import SimpleEmailBuilder from "../../components/SimpleEmailBuilder/SimpleEmailBuilder";

export function UserPage() {
	const auth = useAuth();

	return (
		<div>
			<div className="impolar-bg">
				<h1>User Info</h1>
				<div className="grid grid-cols-2 gap-10">
					<div>Name</div>
					<div>{auth.user?.profile.name}</div>
					<div>E-mail</div>
					<div>{auth.user?.profile.email}</div>
				</div>
				<button type="button" onClick={() => auth.signoutRedirect()}>
					Sign out
				</button>
			</div>
			<SimpleEmailBuilder />
		</div>
	);
}
