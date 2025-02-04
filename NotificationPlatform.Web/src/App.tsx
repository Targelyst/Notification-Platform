import { BrowserRouter as Router } from "react-router-dom";
import "./i18n";
import { Navigation } from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import { ApiProvider } from "./components/ApiProvider";

const App = () => {
  return (
    <ApiProvider>
      <div className="relative h-screen flex bg-impolar-bg">
        <Router>
          <div className="relative z-10 flex-1 flex">
            <Navigation />
            <Dashboard />
          </div>
        </Router>
      </div>
    </ApiProvider>
  );
};

export default App;
