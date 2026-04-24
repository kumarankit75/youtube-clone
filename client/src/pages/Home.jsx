import { useEffect, useState } from "react";
import API from "../utils/api";
import { Link } from "react-router-dom";

const SkeletonCard = () => (
  <div className="bg-gray-800 rounded-xl overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-700" />
    <div className="p-3">
      <div className="h-4 bg-gray-700 rounded mb-2 w-3/4" />
      <div className="h-3 bg-gray-700 rounded w-1/2" />
    </div>
  </div>
);

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await API.get("/api/videos");
        setVideos(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

 return (
  <div className="min-h-screen bg-white dark:bg-gray-900 p-6 transition-colors duration-300">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {loading
        ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
        : videos.map((video) => (
          <Link to={`/video/${video._id}`} key={video._id}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-transform">
            <img src={video.thumbnailUrl} alt={video.title}
              className="w-full h-48 object-cover" />
            <div className="p-3">
              <h3 className="text-gray-900 dark:text-white font-semibold text-sm line-clamp-2">
                {video.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{video.views} views</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs">
                {new Date(video.createdAt).toDateString()}
              </p>
            </div>
          </Link>
        ))}
      {!loading && videos.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 col-span-4 text-center mt-20 text-xl">
          No videos yet. Be the first to upload!
        </p>
      )}
    </div>
  </div>
);
};

export default Home;