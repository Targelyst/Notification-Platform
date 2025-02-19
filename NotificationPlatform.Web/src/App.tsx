import { BrowserRouter as Router } from "react-router-dom";
import "./i18n";
import { Navigation } from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import { ApiProvider } from "./components/ApiProvider";
import { AuthGuard, AuthProvider } from "./components/AuthProvider";

const App = () => {
	return (
		<AuthProvider>
			<div className="h-full bg-impolar-bg">
				<div className="relative flex ">
					<ApiProvider>
						<Router>
							<div className="relative z-10 flex-1 flex">
								<AuthGuard>
									<Dashboard />
								</AuthGuard>
							</div>
						</Router>
					</ApiProvider>
				</div>
			</div>
		</AuthProvider>
	);
};

export default App;
