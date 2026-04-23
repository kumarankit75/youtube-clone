import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";
import { useSelector } from "react-redux";
import Recommended from "../components/Recommended";

const VideoPage = () => {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const videoRes = await API.get(`/api/videos/${id}`);
        setVideo(videoRes.data);

        const channelRes = await API.get(`/api/users/channel/${videoRes.data.userId}`);
        setChannel(channelRes.data);

        const commentRes = await API.get(`/api/comments/${id}`);
        setComments(commentRes.data);

        if (currentUser) {
          setSubscribed(channelRes.data.subscribedUsers?.includes(currentUser._id));
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, currentUser]);

  const handleLike = async () => {
    if (!currentUser) return alert("Please login to like videos");
    await API.put(`/api/videos/like/${id}`);
    const res = await API.get(`/api/videos/${id}`);
    setVideo(res.data);
  };

  const handleDislike = async () => {
    if (!currentUser) return alert("Please login to dislike videos");
    await API.put(`/api/videos/dislike/${id}`);
    const res = await API.get(`/api/videos/${id}`);
    setVideo(res.data);
  };

  const handleSubscribe = async () => {
    if (!currentUser) return alert("Please login to subscribe");
    if (subscribed) {
      await API.put(`/api/users/unsubscribe/${channel._id}`);
      setSubscribed(false);
      setChannel((prev) => ({ ...prev, subscribers: prev.subscribers - 1 }));
    } else {
      await API.put(`/api/users/subscribe/${channel._id}`);
      setSubscribed(true);
      setChannel((prev) => ({ ...prev, subscribers: prev.subscribers + 1 }));
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("Please login to comment");
    if (!commentText.trim()) return;
    const res = await API.post(`/api/comments/${id}`, { content: commentText });
    setComments([res.data, ...comments]);
    setCommentText("");
  };

  const handleDeleteComment = async (commentId) => {
    await API.delete(`/api/comments/${commentId}`);
    setComments(comments.filter((c) => c._id !== commentId));
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  );

  if (!video) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-white text-xl">Video not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto flex gap-6">

        {/* Left - Main Video */}
        <div className="flex-1">
          <video src={video.videoUrl} controls autoPlay
            className="w-full rounded-xl mb-4 max-h-[500px] bg-black" />

          <h1 className="text-2xl font-bold mb-2">{video.title}</h1>

          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span>{video.views} views</span>
              <span>•</span>
              <span>{new Date(video.createdAt).toDateString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleLike}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition
                  ${video.likes.includes(currentUser?._id)
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
                👍 {video.likes.length}
              </button>
              <button onClick={handleDislike}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition
                  ${video.dislikes.includes(currentUser?._id)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
                👎 {video.dislikes.length}
              </button>
            </div>
          </div>

          {channel && (
            <div className="flex items-center justify-between bg-gray-800 p-4 rounded-xl mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-lg">
                  {channel.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{channel.username}</p>
                  <p className="text-gray-400 text-sm">{channel.subscribers} subscribers</p>
                </div>
              </div>
              {currentUser?._id !== channel._id && (
                <button onClick={handleSubscribe}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition
                    ${subscribed
                      ? "bg-gray-600 text-white hover:bg-gray-500"
                      : "bg-red-600 text-white hover:bg-red-700"}`}>
                  {subscribed ? "Subscribed ✓" : "Subscribe"}
                </button>
              )}
            </div>
          )}

          <div className="bg-gray-800 p-4 rounded-xl mb-6">
            <p className="text-gray-300">{video.description}</p>
            <div className="flex gap-2 flex-wrap mt-3">
              {video.tags.map((tag, i) => (
                <Link to={`/tags?tag=${tag}`} key={i}
                  className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs hover:bg-red-600 hover:text-white transition">
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">{comments.length} Comments</h2>
            {currentUser && (
              <form onSubmit={handleComment} className="flex gap-3 mb-6">
                <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold flex-shrink-0">
                  {currentUser.username?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 flex gap-2">
                  <input value={commentText} onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-gray-800 text-white p-3 rounded-lg outline-none text-sm" />
                  <button type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700">
                    Post
                  </button>
                </div>
              </form>
            )}
            <div className="flex flex-col gap-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                    {comment.username?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">{comment.username}</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(comment.createdAt).toDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{comment.content}</p>
                  </div>
                  {currentUser?._id === comment.userId && (
                    <button onClick={() => handleDeleteComment(comment._id)}
                      className="text-gray-500 hover:text-red-500 text-xs self-start mt-1">
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Recommended Sidebar */}
        <div className="w-80 flex-shrink-0 hidden lg:block">
          <Recommended tags={video.tags} currentVideoId={video._id} />
        </div>

      </div>
    </div>
  );
};

export default VideoPage;