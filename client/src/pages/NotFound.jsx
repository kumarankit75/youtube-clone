import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center transition-colors duration-300">
      <span className="text-8xl mb-6">▶</span>
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-gray-500 dark:text-gray-400 text-xl mb-8">Oops! This page doesn't exist.</p>
      <Link to="/"
        className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;