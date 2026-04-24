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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setShowMenu(false);
    setShowMobileMenu(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
      setQuery("");
      setShowSearch(false);
    }
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300">

        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-gray-700 dark:text-gray-300 text-xl">
            {showMobileMenu ? "✕" : "☰"}
          </button>
          <Link to="/" className="text-gray-900 dark:text-white text-xl font-bold flex items-center gap-2">
            <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">▶</span>
            <span className="hidden sm:block">MyTube</span>
          </Link>
        </div>

        {/* Center - Search (desktop) */}
        <form onSubmit={handleSearch}
          className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 w-1/3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos..."
            className="bg-transparent text-gray-900 dark:text-white outline-none w-full text-sm placeholder-gray-500"
          />
          <button type="submit"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white ml-2">
            🔍
          </button>
        </form>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden text-gray-700 dark:text-gray-300 text-xl p-1">
            🔍
          </button>

          {/* Trending - desktop only */}
          <Link to="/trending"
            className="text-gray-600 dark:text-gray-300 text-sm hover:text-gray-900 dark:hover:text-white hidden lg:block">
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
                className="hidden sm:block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700">
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

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                    <Link to="/upload"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition sm:hidden">
                      📤 Upload Video
                    </Link>
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
                className="bg-red-600 text-white px-3 py-2 rounded-full text-sm font-semibold hover:bg-red-700">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {showSearch && (
        <form onSubmit={handleSearch}
          className="md:hidden flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos..."
            autoFocus
            className="bg-transparent text-gray-900 dark:text-white outline-none w-full text-sm placeholder-gray-500"
          />
          <button type="submit" className="text-gray-500 ml-2">🔍</button>
        </form>
      )}

      {/* Mobile Side Menu */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileMenu(false)} />
          <div className="relative w-64 bg-white dark:bg-gray-900 h-full shadow-xl z-50 flex flex-col p-6">
            <div className="flex items-center gap-2 mb-8">
              <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">▶</span>
              <span className="text-gray-900 dark:text-white text-xl font-bold">MyTube</span>
            </div>

            <nav className="flex flex-col gap-2">
              <Link to="/" onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                🏠 Home
              </Link>
              <Link to="/trending" onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                🔥 Trending
              </Link>
              {currentUser && (
                <>
                  <Link to="/upload" onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    📤 Upload Video
                  </Link>
                  <Link to={`/channel/${currentUser._id}`} onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    📺 My Channel
                  </Link>
                  <Link to="/profile" onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    👤 Edit Profile
                  </Link>
                </>
              )}
            </nav>

            <div className="mt-auto">
              {currentUser ? (
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  🚪 Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setShowMobileMenu(false)}
                    className="w-full text-center py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setShowMobileMenu(false)}
                    className="w-full text-center py-3 rounded-lg bg-red-600 text-white font-semibold">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;