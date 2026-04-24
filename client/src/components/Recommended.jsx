import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";

const Recommended = ({ tags, currentVideoId }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        if (tags && tags.length > 0) {
          const res = await API.get(`/api/videos/tags?tags=${tags.join(",")}`);
          setVideos(res.data.filter((v) => v._id !== currentVideoId));
        } else {
          const res = await API.get("/api/videos/trending");
          setVideos(res.data.filter((v) => v._id !== currentVideoId));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecommended();
  }, [tags, currentVideoId]);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">Recommended</h3>
      {videos.length === 0 && (
        <p className="text-gray-500 dark:text-gray-500 text-sm">No recommendations yet.</p>
      )}
      {videos.map((video) => (
        <Link to={`/video/${video._id}`} key={video._id}
          className="flex gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition">
          <img src={video.thumbnailUrl} alt={video.title}
            className="w-40 h-24 object-cover rounded-lg flex-shrink-0" />
          <div>
            <h4 className="text-gray-900 dark:text-white text-sm font-semibold line-clamp-2 mb-1">
              {video.title}
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-xs">{video.views} views</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs">
              {new Date(video.createdAt).toDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Recommended;