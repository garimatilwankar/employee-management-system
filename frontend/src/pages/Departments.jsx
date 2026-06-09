import { useEffect, useState } from "react";
import api from "../services/api";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");

  useEffect(() => {
    api.get("/departments")
      .then((res) => setDepartments(res.data || []))
      .catch(console.error);
  }, []);

  const addDepartment = async () => {
    if (!departmentName.trim()) {
      return;
    }

    await api.post("/departments", { department_name: departmentName });
    setDepartmentName("");
    const res = await api.get("/departments");
    setDepartments(res.data || []);
  };

  return (
    <div className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Department Master</p>
          <h2>Departments</h2>
          <p className="page-description">Manage department names and view organizational structure.</p>
        </div>
      </div>

      <div className="panel-card">
        <div className="form-field">
          <label>Department Name</label>
          <input value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} placeholder="Add new department" />
        </div>
        <button className="button button--primary" onClick={addDepartment}>Add Department</button>
      </div>

      <div className="panel-card">
        <h3>Current Departments</h3>
        <ul className="simple-list">
          {departments.map((dept) => (
            <li key={dept.id}>{dept.department_name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Departments;
