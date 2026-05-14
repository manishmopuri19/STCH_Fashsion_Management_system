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
import UserManagement from "./pages/userManagement";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route

          path="/login"
          element={
          
          <Login />
          }
        />
         <Route
          path="/"
          element={
          <Login />}
        />

        <Route
          path="/dashboard"
          element={
          <ProtectedRoute>
          <Dashboard />
          </ProtectedRoute>
          }
        />
        <Route
        path="/rfqs"
  element={
    <ProtectedRoute>
  <RFQList />
</ProtectedRoute>
  }
/>
 <Route
        path="/rfqs/create"
        element={
        <ProtectedRoute>
        <CreateRFQ />
        </ProtectedRoute>
        }
      />

<Route
  path="/rfqs/:rfqId"
  element={
  <ProtectedRoute>
  <RFQDetails />
  </ProtectedRoute>
}
/>

<Route
path="/users"
element={

<ProtectedRoute>
<UserManagement />
</ProtectedRoute>
}
/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;