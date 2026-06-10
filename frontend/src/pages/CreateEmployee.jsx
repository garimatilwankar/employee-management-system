import { useEffect, useState } from "react";
import api from "../services/api";

function CreateEmployee() {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    user_id: "",
    department_id: "",
    phone: "",
    address: "",
    designation: "",
    salary: ""
  });

  useEffect(() => {
    api.get("/departments")
      .then((res) => setDepartments(res.data || []))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/employees", formData);
      alert("Employee Created");
      setFormData({ user_id: "", department_id: "", phone: "", address: "", designation: "", salary: "" });
    } catch (error) {
      console.error(error);
      alert("Error creating employee");
    }
  };

  return (
    <div className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Employee Operations</p>
          <h2>Create Employee</h2>
          <p className="page-description">Add a new employee record and assign them to the correct department.</p>
        </div>
      </div>

      <div className="panel-card">
        <form className="asset-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>User ID</label>
            <input type="number" name="user_id" value={formData.user_id} onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label>Department</label>
            <select name="department_id" value={formData.department_id} onChange={handleChange} required>
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.department_name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label>Designation</label>
            <input type="text" name="designation" value={formData.designation} onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label>Salary</label>
            <input type="number" name="salary" value={formData.salary} onChange={handleChange} required />
          </div>
          <button className="button button--primary" type="submit">Create Employee</button>
        </form>
      </div>
    </div>
  );
}

export default CreateEmployee;
