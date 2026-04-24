import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../utils/api";

const TagVideos = () => {
  const [searchParams] = useSearchParams();
  const tag = searchParams.get("tag");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchByTag = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/api/videos/tags?tags=${tag}`);
        setVideos(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    if (tag) fetchByTag();
  }, [tag]);

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <p className="text-gray-900 dark:text-white text-xl">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6 transition-colors duration-300">
      <h2 className="text-gray-900 dark:text-white text-xl font-bold mb-6">
        Videos tagged: <span className="text-red-500">#{tag}</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <Link to={`/video/${video._id}`} key={video._id}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-transform">
            <img src={video.thumbnailUrl} alt={video.title}
              className="w-full h-48 object-cover" />
            <div className="p-3">
              <h3 className="text-gray-900 dark:text-white font-semibold text-sm line-clamp-2">{video.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{video.views} views</p>
            </div>
          </Link>
        ))}
        {videos.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 col-span-4 text-center mt-20 text-xl">
            No videos found for #{tag}
          </p>
        )}
      </div>
    </div>
  );
};

export default TagVideos;