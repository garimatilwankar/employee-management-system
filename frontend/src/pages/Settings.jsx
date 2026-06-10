export default function Settings() {
  return (
    <div className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">System Settings</p>
          <h2>Configuration Center</h2>
          <p className="page-description">Manage authentication, notifications, and user preferences for the portal.</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel-card panel-card--compact">
          <h3>Security & Access</h3>
          <p>Update password policies, session timeouts and access controls.</p>
          <button className="button button--secondary">Configure security</button>
        </div>
        <div className="panel-card panel-card--compact">
          <h3>Notification Settings</h3>
          <p>Enable email alerts for approvals, audit events, and workflow updates.</p>
          <button className="button button--secondary">Manage notifications</button>
        </div>
      </div>

      <div className="panel-card">
        <h3>Theme & interface</h3>
        <p>Adjust branding, workspace layout and display settings to match your company style.</p>
        <div className="setting-grid">
          <div>
            <strong>Theme</strong>
            <p>Light enterprise mode with clear spacing and soft shadows.</p>
          </div>
          <div>
            <strong>Workspace</strong>
            <p>Fixed sidebar navigation, top action bar, responsive design.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
