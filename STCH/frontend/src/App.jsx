import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RFQList from "./pages/RFQ/RFQList";
import CreateRFQ from "./pages/RFQ/CreateRFQ";
import RFQDetails from "./pages/RFQ/RFQDetails";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
  path="/rfqs"
  element={<RFQList />}
/>
 <Route
        path="/rfqs/create"
        element={<CreateRFQ />}
      />

<Route
  path="/rfqs/:rfqId"
  element={<RFQDetails />}
/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;