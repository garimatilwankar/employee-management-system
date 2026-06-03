import { useEffect, useState } from "react";
import axios from "axios";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/employees")
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h2>Employee List</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Designation</th>
            <th>Salary</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.department_name}</td>
              <td>{emp.phone}</td>
              <td>{emp.designation}</td>
              <td>{emp.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;