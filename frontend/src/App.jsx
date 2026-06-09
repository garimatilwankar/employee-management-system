import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Leave from "./pages/Leave";
import Assets from "./pages/Assets";
import AuditLogs from "./pages/AuditLogs";
import Employees from "./pages/Employees";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import CreateEmployee from "./pages/CreateEmployee";
import EmployeeList from "./pages/EmployeeList";
import Departments from "./pages/Departments";
import Skills from "./pages/Skills";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/create" element={<CreateEmployee />} />
          <Route path="employees/list" element={<EmployeeList />} />
          <Route path="departments" element={<Departments />} />
          <Route path="skills" element={<Skills />} />
          <Route path="leave" element={<Leave />} />
          <Route path="assets" element={<Assets />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;