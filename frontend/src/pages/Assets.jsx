import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../components/DataTable";

function Assets() {
  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assignTo, setAssignTo] = useState({});
  const [totalAssets, setTotalAssets] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("asset_name");
  const [sortOrder, setSortOrder] = useState("asc");

  const pageSize = 10;

  const loadAssets = async () => {
    try {
      const res = await api.get("/assets", {
        params: {
          search: search || undefined,
          sortBy: sortKey,
          sortOrder,
          page,
          limit: pageSize
        }
      });

      setAssets(res.data.rows || []);
      setTotalAssets(res.data.total || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await api.get("/employees", {
        params: { limit: 100, page: 1 }
      });
      setEmployees(res.data.rows || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAssets();
  }, [search, sortKey, sortOrder, page]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleAddAsset = async () => {
    if (!assetName || !assetType || !serialNumber) {
      alert("Please fill all asset fields");
      return;
    }

    try {
      await api.post("/assets", {
        asset_name: assetName,
        asset_type: assetType,
        serial_number: serialNumber
      });

      setAssetName("");
      setAssetType("");
      setSerialNumber("");
      setPage(1);
      loadAssets();
      alert("Asset added successfully");
    } catch (error) {
      console.error(error);
      alert("Error adding asset");
    }
  };

  const handleAssignAsset = async (assetId) => {
    const employeeId = assignTo[assetId];
    if (!employeeId) {
      alert("Select an employee before assigning");
      return;
    }

    try {
      await api.put(`/assets/${assetId}/assign`, { employee_id: employeeId });
      setAssignTo((prev) => ({ ...prev, [assetId]: "" }));
      loadAssets();
    } catch (error) {
      console.error(error);
      alert("Error assigning asset");
    }
  };

  const handleReturnAsset = async (assetId) => {
    try {
      await api.put(`/assets/${assetId}/return`);
      loadAssets();
    } catch (error) {
      console.error(error);
      alert("Error returning asset");
    }
  };

  const assetColumns = [
    { label: "Asset", key: "asset_name", sortable: true },
    { label: "Type", key: "asset_type", sortable: true },
    { label: "Serial", key: "serial_number", sortable: true },
    { label: "Status", key: "status", sortable: true },
    { label: "Assigned To", key: "assigned_to_name", render: (row) => row.assigned_to_name || "Unassigned", sortable: true },
    {
      label: "Action",
      key: "action",
      render: (row) => (
        <div className="table-action-row">
          {row.status === "Assigned" ? (
            <button className="button button--secondary" onClick={() => handleReturnAsset(row.id)}>Return</button>
          ) : (
            <>
              <select
                value={assignTo[row.id] || ""}
                onChange={(e) => setAssignTo((prev) => ({ ...prev, [row.id]: e.target.value }))}
              >
                <option value="">Assign employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
              <button className="button button--primary" onClick={() => handleAssignAsset(row.id)}>Assign</button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Asset Management</p>
          <h2>Inventory Operations</h2>
          <p className="page-description">Control asset lifecycle, assignment and returns from a unified asset management page.</p>
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-card__header">
          <h3>Add new asset</h3>
          <p>Register devices, equipment, or other company assets into the system.</p>
        </div>

        <div className="asset-form">
          <div className="form-field">
            <label>Asset Name</label>
            <input value={assetName} onChange={(e) => setAssetName(e.target.value)} placeholder="Enter asset name" />
          </div>
          <div className="form-field">
            <label>Asset Type</label>
            <select value={assetType} onChange={(e) => setAssetType(e.target.value)}>
              <option value="">Select asset type</option>
              <option value="Laptop">Laptop</option>
              <option value="Monitor">Monitor</option>
              <option value="Keyboard">Keyboard</option>
              <option value="Mouse">Mouse</option>
              <option value="ID Card">ID Card</option>
            </select>
          </div>
          <div className="form-field">
            <label>Serial Number</label>
            <input value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="Enter serial number" />
          </div>
          <button className="button button--primary" onClick={handleAddAsset}>Create Asset</button>
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-card__header">
          <h3>Asset Catalog</h3>
          <p>Review current inventory and take action on asset assignments.</p>
        </div>
        <DataTable
          columns={assetColumns}
          rows={assets}
          serverSide
          search={search}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          page={page}
          onPageChange={setPage}
          totalRows={totalAssets}
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

export default Assets;
