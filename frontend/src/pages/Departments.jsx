import { useEffect, useState } from "react";
import axios from "axios";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");

  const loadDepartments = () => {
    axios
      .get("http://localhost:5000/api/departments")
      .then((res) => {
        setDepartments(res.data);
      });
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const addDepartment = async () => {
    await axios.post(
      "http://localhost:5000/api/departments",
      {
        department_name: departmentName
      }
    );

    setDepartmentName("");
    loadDepartments();
  };

  return (
    <div>
      <h2>Department Master</h2>

      <input
        type="text"
        placeholder="Department Name"
        value={departmentName}
        onChange={(e) =>
          setDepartmentName(e.target.value)
        }
      />

      <button onClick={addDepartment}>
        Add Department
      </button>

      <ul>
        {departments.map((dept) => (
          <li key={dept.id}>
            {dept.department_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Departments;