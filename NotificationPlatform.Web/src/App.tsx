import { BrowserRouter as Router } from "react-router-dom";
import "./i18n";
import Dashboard from "./components/Dashboard";
import { ApiProvider } from "./components/ApiProvider";
import { AuthGuard, AuthProvider } from "./components/AuthProvider";
import { MantineProvider } from "@mantine/core";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App = () => {
	return (
		<AuthProvider>
				<div className="h-full  bg-impolar-bg overflow-auto">
					<div className="relative flex ">
						<ApiProvider>
							<Router>
								<div className="relative z-10 flex-1 flex">
									<AuthGuard>
										<DndProvider backend={HTML5Backend}>
											<MantineProvider>
											<Dashboard />
											</MantineProvider>
										</DndProvider>
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
