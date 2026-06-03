import { useEffect, useState } from "react";
import axios from "axios";

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
    axios
      .get("http://localhost:5000/api/departments")
      .then((res) => {
        setDepartments(res.data);
      });
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
      await axios.post(
        "http://localhost:5000/api/employees",
        formData
      );

      alert("Employee Created");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Create Employee</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="number"
          name="user_id"
          placeholder="User ID"
          onChange={handleChange}
        />

        <br /><br />

        <select
          name="department_id"
          onChange={handleChange}
        >
          <option value="">
            Select Department
          </option>

          {departments.map((dept) => (
            <option
              key={dept.id}
              value={dept.id}
            >
              {dept.department_name}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="designation"
          placeholder="Designation"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Create Employee
        </button>

      </form>
    </div>
  );
}

export default CreateEmployee;