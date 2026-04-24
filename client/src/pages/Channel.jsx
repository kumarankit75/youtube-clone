import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { useSelector } from "react-redux";

const Channel = () => {
  const { channelId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("videos");

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const channelRes = await API.get(`/api/users/channel/${channelId}`);
        setChannel(channelRes.data);
        const videosRes = await API.get(`/api/videos/user/${channelId}`);
        setVideos(videosRes.data);
        if (currentUser) {
          setSubscribed(channelRes.data.subscribedUsers?.includes(currentUser._id));
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchChannel();
  }, [channelId, currentUser]);

  const handleSubscribe = async () => {
    if (!currentUser) return navigate("/login");
    if (subscribed) {
      await API.put(`/api/users/unsubscribe/${channelId}`);
      setSubscribed(false);
      setChannel((prev) => ({ ...prev, subscribers: prev.subscribers - 1 }));
    } else {
      await API.put(`/api/users/subscribe/${channelId}`);
      setSubscribed(true);
      setChannel((prev) => ({ ...prev, subscribers: prev.subscribers + 1 }));
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <p className="text-gray-900 dark:text-white text-xl">Loading...</p>
    </div>
  );

  if (!channel) return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <p className="text-gray-900 dark:text-white text-xl">Channel not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">

      {/* Banner */}
      <div className="w-full h-32 md:h-40 bg-gradient-to-r from-red-900 via-red-700 to-red-500" />

      {/* Channel Info */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-10 mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-red-600 overflow-hidden flex items-center justify-center text-3xl md:text-4xl font-bold text-white border-4 border-white dark:border-gray-900">
              {channel.avatar
                ? <img src={channel.avatar} alt={channel.username}
                    className="w-full h-full object-cover" />
                : channel.username?.[0]?.toUpperCase()
              }
            </div>
            <div className="mb-0 sm:mb-2">
              <h1 className="text-xl md:text-2xl font-bold">{channel.username}</h1>
              <div className="flex flex-wrap items-center gap-2 text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-1">
                <span>{channel.subscribers} subscribers</span>
                <span>•</span>
                <span>{channel.videoCount} videos</span>
                <span>•</span>
                <span>Joined {new Date(channel.createdAt).toDateString()}</span>
              </div>
            </div>
          </div>

          {currentUser?._id !== channel._id && (
            <button onClick={handleSubscribe}
              className={`px-6 py-2 rounded-full font-semibold transition self-start sm:mb-2
                ${subscribed
                  ? "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white"
                  : "bg-red-600 text-white hover:bg-red-700"}`}>
              {subscribed ? "Subscribed ✓" : "Subscribe"}
            </button>
          )}
          {currentUser?._id === channel._id && (
            <Link to="/profile"
              className="px-6 py-2 rounded-full font-semibold bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition self-start sm:mb-2">
              ✏️ Edit Profile
            </Link>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700 mb-6">
          {["videos", "about"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold capitalize transition border-b-2
                ${activeTab === tab
                  ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div>
            {videos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400 text-xl">No videos yet.</p>
                {currentUser?._id === channel._id && (
                  <Link to="/upload"
                    className="mt-4 inline-block bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition">
                    + Upload Your First Video
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
                {videos.map((video) => (
                  <Link to={`/video/${video._id}`} key={video._id}
                    className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-transform">
                    <img src={video.thumbnailUrl} alt={video.title}
                      className="w-full h-48 object-cover" />
                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">{video.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">{video.views} views</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs">
                        {new Date(video.createdAt).toDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 mb-10">
            <h2 className="text-lg font-bold mb-4">About</h2>
            <div className="flex flex-col gap-3 text-gray-600 dark:text-gray-300">
              <p>👤 Username: <span className="text-gray-900 dark:text-white">{channel.username}</span></p>
              <p>📧 Email: <span className="text-gray-900 dark:text-white">{channel.email}</span></p>
              <p>📅 Joined: <span className="text-gray-900 dark:text-white">{new Date(channel.createdAt).toDateString()}</span></p>
              <p>🎬 Total Videos: <span className="text-gray-900 dark:text-white">{channel.videoCount}</span></p>
              <p>👥 Subscribers: <span className="text-gray-900 dark:text-white">{channel.subscribers}</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;