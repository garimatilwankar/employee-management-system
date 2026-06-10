import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiLayers, FiTool, FiBriefcase, FiCalendar } from "react-icons/fi";
import api from "../services/api";
import StatCard from "../components/StatCard";
import AnalyticsChart from "../components/AnalyticsChart";
import DataTable from "../components/DataTable";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    skills: 0,
    total_assets: 0,
    leave_requests: 0
  });
  const [departmentCounts, setDepartmentCounts] = useState([]);
  const [leaveStatusData, setLeaveStatusData] = useState([]);
  const [assetAllocationData, setAssetAllocationData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const results = await Promise.allSettled([
          api.get("/dashboard/stats"),
          api.get("/dashboard/department-counts"),
          api.get("/dashboard/leave-status"),
          api.get("/dashboard/asset-allocation"),
          api.get("/audit")
        ]);

        const [statsRes, deptRes, leaveRes, assetRes, auditRes] = results;

        if (statsRes.status === "fulfilled") {
          setStats(statsRes.value.data || {
            employees: 0,
            departments: 0,
            skills: 0,
            total_assets: 0,
            leave_requests: 0
          });
        }

        if (deptRes.status === "fulfilled") {
          setDepartmentCounts(deptRes.value.data || []);
        }

        if (leaveRes.status === "fulfilled") {
          setLeaveStatusData(leaveRes.value.data || []);
        }

        if (assetRes.status === "fulfilled") {
          setAssetAllocationData(assetRes.value.data || []);
        }

        if (auditRes.status === "fulfilled") {
          const auditData = auditRes.value.data;
          setRecentActivity(auditData?.rows ? auditData.rows.slice(0, 5) : auditData?.slice?.(0, 5) || []);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadDashboard();
  }, []);

  const activityColumns = [
    { label: "ID", key: "id", sortable: true },
    { label: "Action", key: "action", sortable: true },
    { label: "Entity", key: "entity_type", sortable: true },
    { label: "User", key: "user_name" },
    {
      label: "Date",
      key: "created_at",
      sortable: true,
      render: (row) => (row.created_at ? new Date(row.created_at).toLocaleString() : "-")
    }
  ];

  return (
    <div className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Enterprise Dashboard</p>
          <h2>Operational Insights</h2>
          <p className="page-description">Monitor people, leave workflow, assets, and audit events from a single executive view.</p>
        </div>
        <div className="page-header__actions">
          <button className="button button--primary" onClick={() => navigate("/leave")}>Review leave</button>
          <button className="button button--secondary" onClick={() => navigate("/assets")}>Manage assets</button>
        </div>
      </div>

      <div className="grid-3">
        <StatCard icon={<FiUsers />} title="Employees Count" value={stats.employees} />
        <StatCard icon={<FiLayers />} title="Departments Count" value={stats.departments} />
        <StatCard icon={<FiTool />} title="Skills Count" value={stats.skills} />
        <StatCard icon={<FiBriefcase />} title="Assets Count" value={stats.total_assets} />
        <StatCard icon={<FiCalendar />} title="Leave Requests" value={stats.leave_requests} />
      </div>

      <div className="grid-3">
        <AnalyticsChart
          title="Department Wise Employee Count"
          subtitle="Headcount by department"
          chartType="bar"
          data={departmentCounts}
          nameKey="name"
          dataKey="value"
        />
        <AnalyticsChart
          title="Leave Status Distribution"
          subtitle="Pending, approved and rejected requests"
          chartType="pie"
          data={leaveStatusData}
          nameKey="name"
          dataKey="value"
        />
        <AnalyticsChart
          title="Asset Allocation Distribution"
          subtitle="Assigned vs available assets"
          chartType="pie"
          data={assetAllocationData}
          nameKey="name"
          dataKey="value"
        />
      </div>

      <div className="panel-card">
        <div className="panel-card__header">
          <h3>Recent activity</h3>
          <p>Latest audit events and workflow updates.</p>
        </div>
        <DataTable columns={activityColumns} rows={recentActivity} pageSize={5} />
      </div>
    </div>
  );
}

export default Dashboard;
