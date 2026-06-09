import { FiActivity, FiBarChart2, FiClipboard } from "react-icons/fi";
import api from "../services/api";
import StatCard from "../components/StatCard";

export default function Reports() {
  const downloadCsv = async (endpoint, filename) => {
    try {
      const response = await api.get(endpoint, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CSV export failed", error);
      alert("Unable to download report. Please try again.");
    }
  };

  return (
    <div className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Reporting Center</p>
          <h2>Operational Insights</h2>
          <p className="page-description">Review system performance, audit trends, and employee analytics in one place.</p>
        </div>
      </div>

      <div className="grid-3">
        <StatCard icon={<FiBarChart2 />} title="Monthly Trends" value="Live" subtitle="Updated hourly" />
        <StatCard icon={<FiClipboard />} title="Audit Coverage" value="100%" subtitle="Compliance-ready events" />
        <StatCard icon={<FiActivity />} title="Active Workflows" value="5" subtitle="Leave and asset approvals" />
      </div>

      <div className="panel-card">
        <div className="panel-card__header">
          <h3>Reports Hub</h3>
          <p>Generate team and asset intelligence reports with ready-to-use templates.</p>
        </div>
        <div className="report-grid">
          <div className="report-card">
            <h4>Employee Report Export</h4>
            <p>Download a full employee list with department, designation and contact details.</p>
            <button
              className="button button--primary"
              onClick={() => downloadCsv("/reports/export/employees", "employee-report.csv")}
            >
              Export CSV
            </button>
          </div>
          <div className="report-card">
            <h4>Leave Report Export</h4>
            <p>Download a complete leave request dataset including status and request dates.</p>
            <button
              className="button button--primary"
              onClick={() => downloadCsv("/reports/export/leaves", "leave-report.csv")}
            >
              Export CSV
            </button>
          </div>
          <div className="report-card">
            <h4>Asset Report Export</h4>
            <p>Download asset assignments, status and serial number details for audit use.</p>
            <button
              className="button button--primary"
              onClick={() => downloadCsv("/reports/export/assets", "asset-report.csv")}
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
