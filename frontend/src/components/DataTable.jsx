import { useMemo, useState } from "react";
import Pagination from "./Pagination";

function formatCell(value) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "object") return JSON.stringify(value, null, 0);
  return String(value);
}

export default function DataTable({
  columns,
  rows = [],
  searchPlaceholder = "Search records...",
  pageSize = 10,
  serverSide = false,
  search = "",
  onSearch,
  page = 1,
  onPageChange,
  totalRows,
  sortKey,
  sortOrder,
  onSort
}) {
  const [localSearch, setLocalSearch] = useState("");
  const [localPage, setLocalPage] = useState(1);
  const [localSortKey, setLocalSortKey] = useState(null);
  const [localSortOrder, setLocalSortOrder] = useState("asc");

  const effectiveSearch = serverSide ? search : localSearch;
  const effectivePage = serverSide ? page : localPage;
  const effectiveSortKey = serverSide ? sortKey : localSortKey;
  const effectiveSortOrder = serverSide ? sortOrder : localSortOrder;

  const filteredRows = useMemo(() => {
    if (serverSide) return rows;
    if (!effectiveSearch.trim()) return rows;

    const query = effectiveSearch.toLowerCase();
    return rows.filter((row) =>
      columns.some((column) =>
        formatCell(column.render ? column.render(row) : row[column.key])
          .toLowerCase()
          .includes(query)
      )
    );
  }, [rows, effectiveSearch, columns, serverSide]);

  const sortedRows = useMemo(() => {
    if (serverSide || !effectiveSortKey) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const valueA = a[effectiveSortKey];
      const valueB = b[effectiveSortKey];
      if (valueA === valueB) return 0;
      const direction = effectiveSortOrder === "asc" ? 1 : -1;
      if (valueA === null || valueA === undefined) return 1 * direction;
      if (valueB === null || valueB === undefined) return -1 * direction;
      return String(valueA).localeCompare(String(valueB), undefined, { numeric: true }) * direction;
    });
  }, [filteredRows, effectiveSortKey, effectiveSortOrder, serverSide]);

  const totalCount = serverSide ? totalRows ?? rows.length : sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const pageRows = serverSide ? rows : sortedRows.slice((effectivePage - 1) * pageSize, effectivePage * pageSize);

  const handleLocalSort = (key) => {
    if (serverSide) {
      onSort?.(key);
      return;
    }

    if (localSortKey === key) {
      setLocalSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setLocalSortKey(key);
    setLocalSortOrder("asc");
  };

  const handleSearch = (value) => {
    if (serverSide) {
      onSearch?.(value);
      return;
    }

    setLocalSearch(value);
    setLocalPage(1);
  };

  const handlePageChange = (newPage) => {
    if (serverSide) {
      onPageChange?.(newPage);
      return;
    }

    setLocalPage(newPage);
  };

  return (
    <div className="table-shell">
      <div className="table-shell__header">
        <div className="table-shell__search">
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={effectiveSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="table-shell__meta">
          <span>{totalCount} records found</span>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={column.sortable ? "data-table__sortable" : undefined}
                  onClick={column.sortable ? () => handleLocalSort(column.key) : undefined}
                >
                  {column.label}
                  {column.sortable && (
                    <span className="data-table__sort-indicator">
                      {effectiveSortKey === column.key ? (effectiveSortOrder === "asc" ? "▲" : "▼") : "↕"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length > 0 ? (
              pageRows.map((row) => (
                <tr key={row.id || JSON.stringify(row)}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render ? column.render(row) : formatCell(row[column.key])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="data-table__empty">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={effectivePage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
