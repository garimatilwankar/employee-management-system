import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/dashboard");

    } catch (error) {
      console.error(error);

      alert("Login Failed");
    }
  };

  return (
  <div
    style={{
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
    }}
  >
    <div
      style={{
        width: "400px",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.8)",
        borderRadius: "24px",
        padding: "44px 40px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          background: "#0071e3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px"
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
      </div>

      <h1
        style={{
          fontSize: "26px",
          fontWeight: "600",
          color: "#1d1d1f",
          textAlign: "center",
          margin: "0 0 8px"
        }}
      >
        Employee Management
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#6e6e73",
          fontSize: "14px",
          margin: "0 0 32px"
        }}
      >
        Manage employees, departments and skills
      </p>

      <div
        style={{
          position: "relative",
          marginBottom: "14px"
        }}
      >
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "14px 16px",
            borderRadius: "14px",
            border: "1px solid #d2d2d7",
            background: "#f9fafb",
            fontSize: "15px",
            outline: "none"
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          marginBottom: "24px"
        }}
      >
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "14px 16px",
            borderRadius: "14px",
            border: "1px solid #d2d2d7",
            background: "#f9fafb",
            fontSize: "15px",
            outline: "none"
          }}
        />
      </div>

      <button
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "14px",
          border: "none",
          background: "#0071e3",
          color: "white",
          fontSize: "15px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "0.2s"
        }}
      >
        Login
      </button>
    </div>
  </div>
);
}

export default Login;