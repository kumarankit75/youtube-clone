import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const iconMap = {
  upload: "🎬",
  like: "👍",
  comment: "💬",
  subscribe: "🔔",
};

const Notifications = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return navigate("/login");
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/api/notifications");
        setNotifications(res.data);
        setLoading(false);
        // Mark all as read when page opens
        await API.put("/api/notifications/mark-all-read");
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [currentUser]);

  const handleDelete = async (id) => {
    await API.delete(`/api/notifications/${id}`);
    setNotifications(notifications.filter((n) => n._id !== id));
  };

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <p className="text-gray-900 dark:text-white text-xl">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">🔔 Notifications</h1>
          {notifications.length > 0 && (
            <button
              onClick={async () => {
                await API.put("/api/notifications/mark-all-read");
                setNotifications(notifications.map(n => ({ ...n, read: true })));
              }}
              className="text-sm text-red-500 hover:text-red-400 transition">
              Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔕</p>
            <p className="text-gray-500 dark:text-gray-400 text-xl">No notifications yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              You'll see notifications when someone likes, comments or subscribes
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((notification) => (
              <div key={notification._id}
                className={`flex items-start gap-4 p-4 rounded-xl transition
                  ${notification.read
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "bg-red-50 dark:bg-gray-800 border-l-4 border-red-500"}`}>

                {/* Icon */}
                <div className="text-2xl flex-shrink-0">
                  {iconMap[notification.type] || "🔔"}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toDateString()}
                  </p>
                  {notification.videoId && (
                    <Link
                      to={`/video/${notification.videoId}`}
                      className="text-xs text-red-500 hover:text-red-400 mt-1 inline-block">
                      Watch video →
                    </Link>
                  )}
                </div>

                {/* Unread dot */}
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-2" />
                )}

                {/* Delete */}
                <button
                  onClick={() => handleDelete(notification._id)}
                  className="text-gray-400 hover:text-red-500 text-lg flex-shrink-0 transition">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;