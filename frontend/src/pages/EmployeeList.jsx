import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../components/DataTable";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const pageSize = 10;

  useEffect(() => {
    async function loadEmployees() {
      try {
        const response = await api.get("/employees", {
          params: {
            search: search || undefined,
            sortBy: sortKey,
            sortOrder,
            page,
            limit: pageSize
          }
        });

        setEmployees(response.data.rows || []);
        setTotalEmployees(response.data.total || 0);
      } catch (error) {
        console.error(error);
      }
    }

    loadEmployees();
  }, [search, sortKey, sortOrder, page]);

  const columns = [
    { label: "Name", key: "name", sortable: true },
    { label: "Department", key: "department_name", sortable: true },
    { label: "Phone", key: "phone" },
    { label: "Designation", key: "designation", sortable: true },
    { label: "Salary", key: "salary", sortable: true }
  ];

  return (
    <div className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Employee Directory</p>
          <h2>Employee List</h2>
          <p className="page-description">Browse all employee records with department, role and contact details.</p>
        </div>
      </div>

      <div className="panel-card">
        <DataTable
          columns={columns}
          rows={employees}
          serverSide
          search={search}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          page={page}
          onPageChange={setPage}
          totalRows={totalEmployees}
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

export default EmployeeList;
