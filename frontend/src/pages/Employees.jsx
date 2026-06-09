import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiLayers, FiTool } from "react-icons/fi";
import api from "../services/api";
import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    api.get("/employees").then((res) => setEmployees(res.data.rows ?? res.data ?? [])).catch(console.error);
    api.get("/departments").then((res) => setDepartments(res.data)).catch(console.error);
    api.get("/skills").then((res) => setSkills(res.data)).catch(console.error);
  }, []);

  const employeeColumns = [
    { label: "Name", key: "name", sortable: true },
    { label: "Department", key: "department_name", sortable: true },
    { label: "Phone", key: "phone" },
    { label: "Designation", key: "designation", sortable: true },
    { label: "Salary", key: "salary", sortable: true }
  ];

  return (
    <div className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Employee Management</p>
          <h2>Team Directory</h2>
          <p className="page-description">Manage employee data, core departments and skill catalogs from a centralized workspace.</p>
        </div>
        <div className="page-header__actions">
          <button className="button button--primary" onClick={() => navigate("/employees/create")}>Create Employee</button>
          <button className="button button--secondary" onClick={() => navigate("/departments")}>Departments</button>
        </div>
      </div>

      <div className="grid-3">
        <StatCard icon={<FiUsers />} title="Total Employees" value={employees.length || 0} />
        <StatCard icon={<FiLayers />} title="Departments" value={departments.length || 0} />
        <StatCard icon={<FiTool />} title="Skills" value={skills.length || 0} />
      </div>

      <div className="panel-card">
        <div className="panel-card__header">
          <h3>Employee Directory</h3>
          <p>Quickly browse and filter your employee records.</p>
        </div>
        <DataTable columns={employeeColumns} rows={employees} />
      </div>
    </div>
  );
}
