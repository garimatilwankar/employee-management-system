export default function Pagination({ page, totalPages, onPageChange, className }) {
  return (
    <div className={`pagination ${className || ""}`}>
      <button
        className="button button--ghost"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(page - 1, 1))}
      >
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        className="button button--ghost"
        disabled={page >= totalPages}
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
      >
        Next
      </button>
    </div>
  );
}
