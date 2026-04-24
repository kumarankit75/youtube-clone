import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { toggleTheme } from "../redux/themeSlice";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
      setQuery("");
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300">

      {/* Logo */}
      <Link to="/" className="text-gray-900 dark:text-white text-xl font-bold flex items-center gap-2">
        <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">▶</span>
        MyTube
      </Link>

      {/* Search Bar */}
      <form onSubmit={handleSearch}
        className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 w-1/3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos..."
          className="bg-transparent text-gray-900 dark:text-white outline-none w-full text-sm placeholder-gray-500"
        />
        <button type="submit"
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white ml-2">
          🔍
        </button>
      </form>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        {/* Trending */}
        <Link to="/trending"
          className="text-gray-600 dark:text-gray-300 text-sm hover:text-gray-900 dark:hover:text-white hidden md:block">
          🔥 Trending
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          {mode === "dark" ? "☀️" : "🌙"}
        </button>

        {currentUser ? (
          <>
            <Link to="/upload"
              className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700">
              + Upload
            </Link>

            {/* Avatar + Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 hover:opacity-80 transition">
                <div className="w-8 h-8 rounded-full bg-red-600 overflow-hidden flex items-center justify-center font-bold text-sm text-white">
                  {currentUser.avatar
                    ? <img src={currentUser.avatar} alt="avatar"
                        className="w-full h-full object-cover" />
                    : currentUser.username?.[0]?.toUpperCase()
                  }
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm hidden md:block">
                  {currentUser.username}
                </span>
              </button>

              {/* Dropdown */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <Link to="/profile"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    👤 Edit Profile
                  </Link>
                  <Link to={`/channel/${currentUser._id}`}
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    📺 My Channel
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login"
              className="text-gray-600 dark:text-gray-300 text-sm hover:text-gray-900 dark:hover:text-white">
              Sign In
            </Link>
            <Link to="/register"
              className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;