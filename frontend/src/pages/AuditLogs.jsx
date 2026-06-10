import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../components/DataTable";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [actionFilter, setActionFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [totalLogs, setTotalLogs] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get("/audit", {
          params: {
            action: actionFilter || undefined,
            search: search || undefined,
            sortBy: sortKey,
            sortOrder,
            page,
            limit: pageSize
          }
        });
        setLogs(response.data.rows || []);
        setTotalLogs(response.data.total || 0);
      } catch (error) {
        console.error(error);
        setLogs([]);
        setTotalLogs(0);
        alert(error?.response?.data?.message || "Error Loading Audit Logs");
      }
    };

    fetchLogs();
  }, [actionFilter, search, sortKey, sortOrder, page]);




  const columns = [
    { label: "ID", key: "id", sortable: true },
    { label: "Action", key: "action", sortable: true },
    { label: "Entity", key: "entity_type", sortable: true },
    { label: "User", key: "user_name", sortable: true },
    {
      label: "Old Value",
      key: "old_value",
      render: (row) => row.old_value ? JSON.stringify(row.old_value) : "-"
    },
    {
      label: "New Value",
      key: "new_value",
      render: (row) => row.new_value ? JSON.stringify(row.new_value) : "-"
    },
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
          <p className="eyebrow">Audit Logs</p>
          <h2>Action History</h2>
          <p className="page-description">Track security, compliance and operational actions across leave and asset workflows.</p>
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-card__header">
          <h3>Filter events</h3>
          <p>Search audit events by action type to narrow down activity.</p>
        </div>
        <div className="form-field">
          <select value={actionFilter} onChange={(e) => {
            setActionFilter(e.target.value);
            setPage(1);
          }}>
            <option value="">All actions</option>
            <option value="Leave Approved">Leave Approved</option>
            <option value="Leave Rejected">Leave Rejected</option>
            <option value="Asset Assigned">Asset Assigned</option>
            <option value="Asset Returned">Asset Returned</option>
          </select>
        </div>
      </div>

      <div className="panel-card">
        <DataTable
          columns={columns}
          rows={logs}
          serverSide
          search={search}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          page={page}
          onPageChange={setPage}
          totalRows={totalLogs}
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

export default AuditLogs;
