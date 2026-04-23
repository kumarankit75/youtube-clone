import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../utils/api";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/api/videos/search?q=${query}`);
        setVideos(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    if (query) fetchResults();
  }, [query]);

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-white text-xl">Searching...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h2 className="text-white text-xl font-bold mb-6">
        Search results for: <span className="text-red-500">"{query}"</span>
      </h2>
      {videos.length === 0 ? (
        <p className="text-gray-400 text-center mt-20 text-xl">No videos found for "{query}"</p>
      ) : (
        <div className="flex flex-col gap-4">
          {videos.map((video) => (
            <Link to={`/video/${video._id}`} key={video._id}
              className="flex gap-4 bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition p-3">
              <img src={video.thumbnailUrl} alt={video.title}
                className="w-48 h-28 object-cover rounded-lg flex-shrink-0" />
              <div className="flex flex-col justify-center">
                <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">{video.title}</h3>
                <p className="text-gray-400 text-sm mb-2">
                  {video.views} views • {new Date(video.createdAt).toDateString()}
                </p>
                <p className="text-gray-500 text-sm line-clamp-2">{video.description}</p>
                <div className="flex gap-2 flex-wrap mt-2">
                  {video.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;