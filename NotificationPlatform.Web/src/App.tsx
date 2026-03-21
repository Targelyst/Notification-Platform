import { BrowserRouter as Router } from "react-router-dom";
import "./i18n";
import Dashboard from "./components/Dashboard";
import { ApiProvider } from "./components/ApiProvider";
import { AuthGuard, AuthProvider } from "./components/AuthProvider";
import { MantineProvider } from "@mantine/core";

const App = () => {
	return (
		<AuthProvider>
			<MantineProvider >
			<div className="h-full  bg-impolar-bg overflow-auto">
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
			</MantineProvider > 
		</AuthProvider>
	);
};

export default App;
