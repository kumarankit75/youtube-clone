import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/videos");
        setVideos(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <Link to={`/video/${video._id}`} key={video._id}
            className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-transform">
            <img src={video.thumbnailUrl} alt={video.title}
              className="w-full h-48 object-cover" />
            <div className="p-3">
              <h3 className="text-white font-semibold text-sm line-clamp-2">{video.title}</h3>
              <p className="text-gray-400 text-xs mt-1">{video.views} views</p>
              <p className="text-gray-500 text-xs">{new Date(video.createdAt).toDateString()}</p>
            </div>
          </Link>
        ))}
        {videos.length === 0 && (
          <p className="text-gray-400 col-span-4 text-center mt-20 text-xl">
            No videos yet. Be the first to upload!
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;