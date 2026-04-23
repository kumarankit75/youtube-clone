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

      // Update Redux + localStorage
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

        <div className="bg-gray-800 rounded-2xl p-8">

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-red-600 flex items-center justify-center text-5xl font-bold border-4 border-gray-700">
                {preview
                  ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                  : currentUser.username?.[0]?.toUpperCase()
                }
              </div>
              {/* Camera Icon */}
              <button
                onClick={() => fileRef.current.click()}
                className="absolute bottom-0 right-0 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition">
                📷
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={handleAvatarChange}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current.click()}
              className="mt-3 text-red-500 text-sm hover:text-red-400 transition">
              Change Avatar
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Username */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Success / Error */}
            {success && (
              <div className="bg-green-900 border border-green-600 text-green-300 p-3 rounded-lg text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-900 border border-red-600 text-red-300 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition">
              {loading ? "Saving..." : "Save Changes"}
            </button>

          </form>

          {/* Divider */}
          <div className="border-t border-gray-700 my-6" />

          {/* Account Info */}
          <div className="flex flex-col gap-3 text-sm text-gray-400 mb-6">
            <div className="flex justify-between">
              <span>Subscribers</span>
              <span className="text-white font-semibold">{currentUser.subscribers}</span>
            </div>
            <div className="flex justify-between">
              <span>Member since</span>
              <span className="text-white font-semibold">
                {new Date(currentUser.createdAt).toDateString()}
              </span>
            </div>
          </div>

          {/* My Channel Button */}
          <button
            onClick={() => navigate(`/channel/${currentUser._id}`)}
            className="w-full bg-gray-700 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 transition mb-3">
            📺 View My Channel
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-transparent border border-red-600 text-red-500 p-3 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition">
            Logout
          </button>

        </div>
      </div>
    </div>
  );
};

export default Profile;