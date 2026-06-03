import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeList from "./pages/EmployeeList";
import CreateEmployee from "./pages/CreateEmployee";
import Departments from "./pages/Departments";
import Skills from "./pages/Skills";
function App() {
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    skills: 0,
    images: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard/stats")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h1>Employee Management System</h1>
      <h2>Dashboard</h2>

      <h3>Total Employees: {stats.employees}</h3>
      <h3>Total Departments: {stats.departments}</h3>
      <h3>Total Skills: {stats.skills}</h3>
      <h3>Total Images: {stats.images}</h3>
      <EmployeeList />
      <CreateEmployee />
      <Departments />
      <Skills />
    </div>
  );
}

export default App;