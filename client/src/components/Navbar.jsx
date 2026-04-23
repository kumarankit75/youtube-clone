// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../redux/userSlice";

// const Navbar = () => {
//   const { currentUser } = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [query, setQuery] = useState("");

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (query.trim()) {
//       navigate(`/search?q=${query}`);
//       setQuery("");
//     }
//   };

//   return (
//     <nav className="bg-gray-900 border-b border-gray-700 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
//       {/* Logo */}
//       <Link to="/" className="text-white text-xl font-bold flex items-center gap-2">
//         <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">▶</span>
//         MyTube
//       </Link>

//       {/* Search Bar */}
//       <form onSubmit={handleSearch} className="flex items-center bg-gray-800 rounded-full px-4 py-2 w-1/3">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search videos..."
//           className="bg-transparent text-white outline-none w-full text-sm"
//         />
//         <button type="submit" className="text-gray-400 hover:text-white ml-2">🔍</button>
//       </form>

//       {/* Right Side */}
//       <div className="flex items-center gap-4">
//         {/* Trending Link */}
//         <Link to="/trending"
//           className="text-gray-300 text-sm hover:text-white hidden md:block">
//           🔥 Trending
//         </Link>

//         {currentUser ? (
//           <>
//             <Link to="/upload"
//               className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700">
//               + Upload
//             </Link>
//             <span className="text-gray-300 text-sm hidden md:block">
//               {currentUser.username}
//             </span>
//             <button onClick={handleLogout}
//               className="text-gray-400 text-sm hover:text-white">
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link to="/login"
//               className="text-gray-300 text-sm hover:text-white">
//               Sign In
//             </Link>
//             <Link to="/register"
//               className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700">
//               Register
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;







import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
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
    <nav className="bg-gray-900 border-b border-gray-700 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="text-white text-xl font-bold flex items-center gap-2">
        <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">▶</span>
        MyTube
      </Link>

      {/* Search Bar */}
      <form onSubmit={handleSearch}
        className="flex items-center bg-gray-800 rounded-full px-4 py-2 w-1/3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos..."
          className="bg-transparent text-white outline-none w-full text-sm"
        />
        <button type="submit" className="text-gray-400 hover:text-white ml-2">🔍</button>
      </form>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <Link to="/trending" className="text-gray-300 text-sm hover:text-white hidden md:block">
          🔥 Trending
        </Link>

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
                <div className="w-8 h-8 rounded-full bg-red-600 overflow-hidden flex items-center justify-center font-bold text-sm">
                  {currentUser.avatar
                    ? <img src={currentUser.avatar} alt="avatar"
                        className="w-full h-full object-cover" />
                    : currentUser.username?.[0]?.toUpperCase()
                  }
                </div>
                <span className="text-gray-300 text-sm hidden md:block">
                  {currentUser.username}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden z-50">
                  <Link to="/profile"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition">
                    👤 Edit Profile
                  </Link>
                  <Link to={`/channel/${currentUser._id}`}
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition">
                    📺 My Channel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 text-sm hover:text-white">
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