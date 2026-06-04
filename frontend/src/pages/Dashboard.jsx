import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    skills: 0,
    images: 0
  });

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard/stats")
      .then((res) => {
        setStats(res.data);
      });
      axios
  .get("http://localhost:5000/api/auth/profile")
  .then((res) => {
    setProfile(res.data);
  });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
  <div
    style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      padding: "40px",
      fontFamily: "Arial, sans-serif"
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px"
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: "42px"
          }}
        >
          Employee Management System
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginTop: "10px"
          }}
        >
          Manage employees, departments and skills
        </p>
      </div>

      <button
        onClick={handleLogout}
        style={{
          background: "#ef4444",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Logout
      </button>
    </div>

    {profile && (
      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "16px",
          marginBottom: "30px"
        }}
      >
        <h2 style={{ margin: 0 }}>
          👋 Welcome, {profile.name}
        </h2>

        <p
          style={{
            color: "#cbd5e1",
            marginTop: "8px"
          }}
        >
          {profile.email}
        </p>
      </div>
    )}

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: "20px"
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "25px",
          borderRadius: "16px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
        }}
      >
        <h3>👨‍💼 Employees</h3>
        <h1>{stats.employees}</h1>
      </div>

      <div
        style={{
          background: "#1e293b",
          padding: "25px",
          borderRadius: "16px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
        }}
      >
        <h3>🏢 Departments</h3>
        <h1>{stats.departments}</h1>
      </div>

      <div
        style={{
          background: "#1e293b",
          padding: "25px",
          borderRadius: "16px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
        }}
      >
        <h3>🛠 Skills</h3>
        <h1>{stats.skills}</h1>
      </div>
    </div>
  </div>
);
}

export default Dashboard;