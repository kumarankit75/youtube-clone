import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { updateUser, logout } from "../redux/userSlice";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
  });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(currentUser?.avatar || null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      if (avatar) formData.append("avatar", avatar);
      const res = await API.put("/api/users/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(updateUser({
        username: res.data.username,
        email: res.data.email,
        avatar: res.data.avatar,
      }));
      setSuccess("Profile updated successfully! ✅");
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Edit Profile</h1>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 md:p-8">

          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-red-600 flex items-center justify-center text-4xl md:text-5xl font-bold border-4 border-gray-200 dark:border-gray-700">
                {preview
                  ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                  : currentUser.username?.[0]?.toUpperCase()
                }
              </div>
              <button onClick={() => fileRef.current.click()}
                className="absolute bottom-0 right-0 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition">
                📷
              </button>
            </div>
            <input type="file" accept="image/*" ref={fileRef}
              onChange={handleAvatarChange} className="hidden" />
            <button onClick={() => fileRef.current.click()}
              className="mt-3 text-red-500 text-sm hover:text-red-400 transition">
              Change Avatar
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-gray-500 dark:text-gray-400 text-sm mb-1 block">Username</label>
              <input name="username" value={form.username} onChange={handleChange}
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg outline-none border border-gray-300 dark:border-transparent focus:ring-2 focus:ring-red-600" />
            </div>
            <div>
              <label className="text-gray-500 dark:text-gray-400 text-sm mb-1 block">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg outline-none border border-gray-300 dark:border-transparent focus:ring-2 focus:ring-red-600" />
            </div>

            {success && (
              <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 p-3 rounded-lg text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>

          <div className="border-t border-gray-200 dark:border-gray-700 my-6" />

          <div className="flex flex-col gap-3 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <div className="flex justify-between">
              <span>Subscribers</span>
              <span className="text-gray-900 dark:text-white font-semibold">{currentUser.subscribers}</span>
            </div>
            <div className="flex justify-between">
              <span>Member since</span>
              <span className="text-gray-900 dark:text-white font-semibold">
                {new Date(currentUser.createdAt).toDateString()}
              </span>
            </div>
          </div>

          <button onClick={() => navigate(`/channel/${currentUser._id}`)}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition mb-3">
            📺 View My Channel
          </button>

          <button onClick={handleLogout}
            className="w-full bg-transparent border border-red-500 text-red-500 p-3 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;