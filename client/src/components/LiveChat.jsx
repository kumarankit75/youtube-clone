import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const LiveChat = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to socket
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      setIsConnected(true);

      // Join video room
      socket.emit("joinRoom", {
        videoId,
        username: currentUser?.username || "Guest",
        avatar: currentUser?.avatar || "",
      });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Receive chat history
    socket.on("chatHistory", (history) => {
      setMessages(history);
    });

    // Receive new message
    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // User joined
    socket.on("userJoined", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // User left
    socket.on("userLeft", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [videoId, currentUser]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    if (!currentUser) {
      alert("Please login to chat!");
      return;
    }

    socketRef.current.emit("sendMessage", {
      videoId,
      message: inputMessage,
      username: currentUser.username,
      avatar: currentUser.avatar || "",
    });

    setInputMessage("");
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden h-[500px]">

      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-200 dark:bg-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-gray-900 dark:text-white font-semibold text-sm">
            💬 Live Chat
          </span>
          <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {isConnected ? "Connected" : "Connecting..."}
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition">
          {isOpen ? "▼ Hide" : "▲ Show"}
        </button>
      </div>

      {isOpen && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 dark:text-gray-500 text-sm mt-8">
                <p className="text-2xl mb-2">💬</p>
                <p>No messages yet.</p>
                <p>Be the first to chat!</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={msg.id || index}>

                {/* System message */}
                {msg.type === "system" && (
                  <div className="text-center">
                    <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
                      {msg.message}
                    </span>
                  </div>
                )}

                {/* Chat message */}
                {msg.type === "message" && (
                  <div className={`flex items-start gap-2 ${msg.username === currentUser?.username ? "flex-row-reverse" : ""}`}>
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-full bg-red-600 overflow-hidden flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {msg.avatar
                        ? <img src={msg.avatar} alt={msg.username} className="w-full h-full object-cover" />
                        : msg.username?.[0]?.toUpperCase()
                      }
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[75%] ${msg.username === currentUser?.username ? "items-end" : "items-start"} flex flex-col`}>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-1">
                        {msg.username === currentUser?.username ? "You" : msg.username}
                        {" · "}
                        {formatTime(msg.timestamp)}
                      </span>
                      <div className={`px-3 py-2 rounded-2xl text-sm break-words
                        ${msg.username === currentUser?.username
                          ? "bg-red-600 text-white rounded-tr-sm"
                          : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-sm"}`}>
                        {msg.message}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            {currentUser ? (
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Say something..."
                  maxLength={200}
                  className="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm p-2 rounded-lg outline-none border border-gray-300 dark:border-transparent placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition">
                  Send
                </button>
              </form>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-2">
                <a href="/login" className="text-red-500 hover:text-red-400">Login</a> to join the chat
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LiveChat;