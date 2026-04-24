return (
  <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 transition-colors duration-300">
    <div className="max-w-7xl mx-auto flex gap-6">
      <div className="flex-1">
        <video src={video.videoUrl} controls autoPlay
          className="w-full rounded-xl mb-4 max-h-[500px] bg-black" />

        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>

        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
            <span>{video.views} views</span>
            <span>•</span>
            <span>{new Date(video.createdAt).toDateString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleLike}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition
                ${video.likes.includes(currentUser?._id)
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}`}>
              👍 {video.likes.length}
            </button>
            <button onClick={handleDislike}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition
                ${video.dislikes.includes(currentUser?._id)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}`}>
              👎 {video.dislikes.length}
            </button>
          </div>
        </div>

        {channel && (
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-4">
            <Link to={`/channel/${channel._id}`} className="flex items-center gap-3 hover:opacity-80 transition">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-lg text-white">
                {channel.avatar
                  ? <img src={channel.avatar} alt={channel.username} className="w-full h-full rounded-full object-cover" />
                  : channel.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{channel.username}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{channel.subscribers} subscribers</p>
              </div>
            </Link>
            {currentUser?._id !== channel._id && (
              <button onClick={handleSubscribe}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition
                  ${subscribed
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white"
                    : "bg-red-600 text-white hover:bg-red-700"}`}>
                {subscribed ? "Subscribed ✓" : "Subscribe"}
              </button>
            )}
          </div>
        )}

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-6">
          <p className="text-gray-700 dark:text-gray-300">{video.description}</p>
          <div className="flex gap-2 flex-wrap mt-3">
            {video.tags.map((tag, i) => (
              <Link to={`/tags?tag=${tag}`} key={i}
                className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs hover:bg-red-600 hover:text-white transition">
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">{comments.length} Comments</h2>
          {currentUser && (
            <form onSubmit={handleComment} className="flex gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold text-white flex-shrink-0">
                {currentUser.username?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 flex gap-2">
                <input value={commentText} onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-lg outline-none text-sm border border-gray-300 dark:border-transparent" />
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
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white flex-shrink-0">
                  {comment.username?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">{comment.username}</span>
                    <span className="text-gray-400 dark:text-gray-500 text-xs">
                      {new Date(comment.createdAt).toDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{comment.content}</p>
                </div>
                {currentUser?._id === comment.userId && (
                  <button onClick={() => handleDeleteComment(comment._id)}
                    className="text-gray-400 hover:text-red-500 text-xs self-start mt-1">
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-80 flex-shrink-0 hidden lg:block">
        <Recommended tags={video.tags} currentVideoId={video._id} />
      </div>
    </div>
  </div>
);