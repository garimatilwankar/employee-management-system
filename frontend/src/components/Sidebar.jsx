import { NavLink } from "react-router-dom";
import {
  FiActivity,
  FiBarChart2,
  FiBriefcase,
  FiCalendar,
  FiClipboard,
  FiFolder,
  FiLayers,
  FiPlus,
  FiSettings,
  FiTool,
  FiUsers
} from "react-icons/fi";

const sections = [
  {
    title: "Core",
    links: [
      { label: "Dashboard", path: "/dashboard", icon: <FiBarChart2 /> },
      { label: "Employees", path: "/employees", icon: <FiUsers /> },
      { label: "Leave Management", path: "/leave", icon: <FiCalendar /> },
      { label: "Asset Management", path: "/assets", icon: <FiBriefcase /> },
      { label: "Audit Logs", path: "/audit", icon: <FiClipboard /> }
    ]
  },
  {
    title: "Administration",
    links: [
      { label: "Reports", path: "/reports", icon: <FiActivity /> },
      { label: "Settings", path: "/settings", icon: <FiSettings /> }
    ]
  }
];

const employeeTools = [
  { label: "Employee Directory", path: "/employees", icon: <FiFolder /> },
  { label: "Create Employee", path: "/employees/create", icon: <FiPlus /> },
  { label: "Departments", path: "/departments", icon: <FiLayers /> },
  { label: "Skills", path: "/skills", icon: <FiTool /> }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-logo">EMS</div>
        <div>
          <h1>EnterpriseHR</h1>
          <p>Admin Portal</p>
        </div>
      </div>

      <div className="sidebar__nav">
        {sections.map((section) => (
          <div key={section.title} className="sidebar__section">
            <div className="sidebar__section-title">{section.title}</div>
            {section.links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
                }
              >
                <span className="sidebar__link-icon">{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      <div className="sidebar__panel">
        <div className="sidebar__panel-title">Employee Tools</div>
        {employeeTools.map((tool) => (
          <NavLink
            key={tool.path}
            to={tool.path}
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            <span className="sidebar__link-icon">{tool.icon}</span>
            <span>{tool.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
