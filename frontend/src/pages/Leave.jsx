import { useCallback, useEffect, useState } from "react";
import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import api from "../services/api";
import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";

function Leave() {
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  const pageSize = 10;

  const fetchLeaves = useCallback(async () => {
    try {
      const res = await api.get("/leave", {
        params: {
          search: search || undefined,
          sortBy: sortKey,
          sortOrder,
          page,
          limit: pageSize
        }
      });

      setLeaves(res.data.rows || []);
      setTotalLeaves(res.data.total || 0);
    } catch (error) {
      console.error(error);
    }
  }, [search, sortKey, sortOrder, page]);

  const fetchLeaveSummary = useCallback(async () => {
    try {
      const res = await api.get("/leave/summary");
      setLeaveSummary(res.data || { pending: 0, approved: 0, rejected: 0 });
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    async function load() {
      await fetchLeaves();
    }
    load();
  }, [fetchLeaves]);

  useEffect(() => {
    async function loadSummary() {
      await fetchLeaveSummary();
    }
    loadSummary();
  }, [fetchLeaveSummary]);

  const handleSubmit = async () => {
    if (!leaveType || !fromDate || !toDate || !reason) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.post("/leave/apply", {
        employee_id: 1,
        leave_type: leaveType,
        from_date: fromDate,
        to_date: toDate,
        reason
      });

      alert("Leave Applied Successfully");
      setLeaveType("");
      setFromDate("");
      setToDate("");
      setReason("");
      setPage(1);
      fetchLeaves();
      fetchLeaveSummary();
    } catch (error) {
      console.error(error);
      alert("Error Applying Leave");
    }
  };

  const updateLeave = async (id, action) => {
    try {
      await api.put(`/leave/${id}/${action}`);
      fetchLeaves();
      fetchLeaveSummary();
    } catch (error) {
      console.error(error);
      alert("Unable to update leave status");
    }
  };

  const leaveColumns = [
    { label: "ID", key: "id", sortable: true },
    { label: "Type", key: "leave_type", sortable: true },
    {
      label: "From",
      key: "from_date",
      sortable: true,
      render: (row) => row.from_date?.split("T")[0] || "-"
    },
    {
      label: "To",
      key: "to_date",
      sortable: true,
      render: (row) => row.to_date?.split("T")[0] || "-"
    },
    { label: "Reason", key: "reason" },
    {
      label: "Status",
      key: "status",
      sortable: true,
      render: (row) => <span className={`badge badge--${row.status?.toLowerCase()}`}>{row.status || "Pending"}</span>
    },
    {
      label: "Actions",
      key: "actions",
      render: (row) => (
        <div className="table-action-row">
          {row.status?.toLowerCase() !== "approved" && row.status?.toLowerCase() !== "rejected" ? (
            <>
              <button className="button button--secondary" onClick={() => updateLeave(row.id, "approve")}>Approve</button>
              <button className="button button--ghost" onClick={() => updateLeave(row.id, "reject")}>Reject</button>
            </>
          ) : (
            <span>{row.status}</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Leave Management</p>
          <h2>Leave Workflow</h2>
          <p className="page-description">Approve requests, review remaining balance, and monitor leave activity across teams.</p>
        </div>
      </div>

      <div className="grid-3">
        <StatCard icon={<FiClock />} title="Pending" value={leaveSummary.pending} />
        <StatCard icon={<FiCheckCircle />} title="Approved" value={leaveSummary.approved} />
        <StatCard icon={<FiXCircle />} title="Rejected" value={leaveSummary.rejected} />
      </div>

      <div className="panel-card">
        <div className="panel-card__header">
          <h3>Apply for leave</h3>
          <p>Submit a new leave request for your team or yourself.</p>
        </div>

        <div className="asset-form">
          <div className="form-field">
            <label>Leave Type</label>
            <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
              <option value="">Select leave type</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Earned Leave">Earned Leave</option>
              <option value="Maternity Leave">Maternity Leave</option>
            </select>
          </div>

          <div className="form-field">
            <label>Start Date</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>

          <div className="form-field">
            <label>End Date</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Reason</label>
            <textarea rows="4" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>

          <button className="button button--primary" onClick={handleSubmit}>Submit Request</button>
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-card__header">
          <h3>Leave Requests</h3>
          <p>Review and approve outstanding leave applications.</p>
        </div>
        <DataTable
          columns={leaveColumns}
          rows={leaves}
          serverSide
          search={search}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          page={page}
          onPageChange={setPage}
          totalRows={totalLeaves}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={(key) => {
            if (sortKey === key) {
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            } else {
              setSortKey(key);
              setSortOrder("asc");
            }
            setPage(1);
          }}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}

export default Leave;
