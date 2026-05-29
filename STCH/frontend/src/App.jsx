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
import MiniMarkerPage from "./pages/RFQ/MiniMarkerPage";
import BOMPage from "./pages/RFQ/BOMPage";
import StyleSheetPage from "./pages/RFQ/StyleSheetPage";
import SamplingPage from "./pages/RFQ/SamplingPage";
import UserManagement from "./pages/userManagement";
import ProtectedRoute from "./utils/ProtectedRoute";
import SettingsPage from "./pages/SettingsPage";
import SuppliersPage from "./pages/SuppliersPage";
import SupplierDetailPage from "./pages/SupplierDetailPage";
import OrdersList from "./pages/Orders/OrdersList";
import OrderDetailPage from "./pages/Orders/OrderDetailsPage";
import CataloguePage from "./pages/CataloguePage";

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
        <ProtectedRoute allowedRoles={["ADMIN", "MERCHANDISER"]}>
      <CreateRFQ />
    </ProtectedRoute>
        }
      />

      <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      }
      />

 <Route
  path="/rfqs/:id"
  element={
  <ProtectedRoute>
  <RFQDetails />
  </ProtectedRoute>
}
/>

<Route
  path="/rfqs/:id/mini-marker"
  element={
  <ProtectedRoute allowedRoles={["ADMIN", "MERCHANDISER", "SUPPLIER"]}>
  <MiniMarkerPage />
  </ProtectedRoute>
}
/>

<Route
  path="/rfqs/:id/bom"
  element={
  <ProtectedRoute allowedRoles={["ADMIN", "MERCHANDISER", "SUPPLIER"]}>
  <BOMPage />
  </ProtectedRoute>
}
/>

<Route
  path="/rfqs/:id/style-sheet"
  element={
  <ProtectedRoute allowedRoles={["ADMIN", "MERCHANDISER", "SUPPLIER"]}>
  <StyleSheetPage />
  </ProtectedRoute>
}
/>

<Route
  path="/rfqs/:id/sampling"
  element={
  <ProtectedRoute allowedRoles={["ADMIN", "MERCHANDISER", "SUPPLIER"]}>
  <SamplingPage />
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
<Route
path="/suppliers"
element={

<ProtectedRoute>
<SuppliersPage />
</ProtectedRoute>
}
/>
<Route
path="/suppliers/:id"
element={

<ProtectedRoute>
<SupplierDetailPage />
</ProtectedRoute>
}
/>
<Route
path="/orders"
element={

<ProtectedRoute>
<OrdersList />
</ProtectedRoute>
}
/>

<Route
path="/orders/:id"
element={

<ProtectedRoute>
<OrderDetailPage />
</ProtectedRoute>
}
/>

{/* Public route — no ProtectedRoute wrapper; auth is checked inside the page */}
<Route
  path="/catalogs"
  element={<CataloguePage />}
/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;