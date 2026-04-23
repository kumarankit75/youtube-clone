import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";

const Trending = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await API.get("/api/videos/trending");
        setVideos(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h2 className="text-white text-2xl font-bold mb-6">🔥 Trending Videos</h2>
      <div className="flex flex-col gap-4">
        {videos.map((video, index) => (
          <Link to={`/video/${video._id}`} key={video._id}
            className="flex gap-4 bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition p-3">
            <span className="text-gray-500 font-bold text-2xl w-8 flex items-center">{index + 1}</span>
            <img src={video.thumbnailUrl} alt={video.title}
              className="w-48 h-28 object-cover rounded-lg flex-shrink-0" />
            <div className="flex flex-col justify-center">
              <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">{video.title}</h3>
              <p className="text-gray-400 text-sm mb-1">👁 {video.views} views • 👍 {video.likes.length} likes</p>
              <p className="text-gray-500 text-sm line-clamp-2">{video.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Trending;