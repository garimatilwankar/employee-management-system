import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import api from "../services/api";

export default function Topbar() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((item) => item.id === id ? { ...item, is_read: true } : item));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar__search">
        <input
          type="text"
          placeholder="Search employees, assets, reports..."
        />
      </div>

      <div className="topbar__actions">
        <button className="button button--ghost" onClick={() => navigate("/reports")}>Create report</button>

        <div className="notification-menu">
          <button className="notification-button" onClick={toggleDropdown}>
            <FiBell className="notification-icon" />
            {unreadCount > 0 && (
              <span className="badge badge--notification">{unreadCount}</span>
            )}
          </button>
          {dropdownOpen && (
            <div className="notification-dropdown">
              <div className="notification-dropdown__header">
                <span>Notifications</span>
                <button className="notification-dropdown__refresh" onClick={fetchNotifications}>Refresh</button>
              </div>
              {notifications.length === 0 ? (
                <div className="notification-empty">No notifications available.</div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`notification-item ${item.is_read ? "notification-item--read" : "notification-item--unread"}`}
                  >
                    <div>
                      <div className="notification-item__title">{item.title}</div>
                      <div className="notification-item__message">{item.message}</div>
                      <div className="notification-item__time">{new Date(item.created_at).toLocaleString()}</div>
                    </div>
                    {!item.is_read && (
                      <button
                        className="button button--small button--ghost notification-item__action"
                        onClick={() => markAsRead(item.id)}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="topbar__profile">
          <div>
            <span className="topbar__profile-name">Admin User</span>
            <span className="topbar__profile-role">Operations</span>
          </div>
          <button className="button button--small button--secondary" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </header>
  );
}
