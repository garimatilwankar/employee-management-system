export default function StatCard({ icon, title, value, subtitle, accent }) {
  return (
    <div className={`stat-card ${accent ? "stat-card--accent" : ""}`}>
      <div className="stat-card__icon">{icon}</div>
      <div>
        <span className="stat-card__label">{title}</span>
        <h3 className="stat-card__value">{value}</h3>
        {subtitle ? <span className="stat-card__subtitle">{subtitle}</span> : null}
      </div>
    </div>
  );
}
