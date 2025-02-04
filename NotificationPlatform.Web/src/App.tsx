import { BrowserRouter as Router } from "react-router-dom";
import "./i18n";
import { Navigation } from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import { ApiProvider } from "./components/ApiProvider";
import { AuthGuard, AuthProvider } from "./components/AuthProvider";

const App = () => {
	return (
		<AuthProvider>
			<div className="relative h-screen flex bg-impolar-bg">
				<ApiProvider>
					<Router>
						<div className="relative z-10 flex-1 flex">
							<AuthGuard>
								<Navigation />
								<Dashboard />
							</AuthGuard>
						</div>
					</Router>
				</ApiProvider>
			</div>
		</AuthProvider>
	);
};

export default App;
