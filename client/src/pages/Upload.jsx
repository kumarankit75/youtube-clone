import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", tags: "" });
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video || !thumbnail) return alert("Please select video and thumbnail!");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("tags", form.tags);
    formData.append("video", video);
    formData.append("thumbnail", thumbnail);

    try {
      setLoading(true);
    //   const res = await axios.post("http://localhost:5000/api/videos", formData, {
    //     headers: {
    //       Authorization: `Bearer ${currentUser.token}`,
    //       "Content-Type": "multipart/form-data",
    //     },
    //     onUploadProgress: (e) => {
    //       setProgress(Math.round((e.loaded * 100) / e.total));
    //     },
    //   });


        const res = await axios.post("http://localhost:5000/api/videos", formData, {
  headers: {
    Authorization: `Bearer ${currentUser.token}`,
    "Content-Type": "multipart/form-data",
  },
  onUploadProgress: (e) => {
    setProgress(Math.round((e.loaded * 100) / e.total));
  },
});


      setLoading(false);
      navigate(`/video/${res.data._id}`);
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  if (!currentUser) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-white text-xl">Please login to upload videos.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-xl">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Upload Video</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="title" placeholder="Title" onChange={handleChange}
            className="bg-gray-700 text-white p-3 rounded-lg outline-none" required />
          <textarea name="description" placeholder="Description" onChange={handleChange} rows={3}
            className="bg-gray-700 text-white p-3 rounded-lg outline-none resize-none" required />
          <input name="tags" placeholder="Tags (comma separated)" onChange={handleChange}
            className="bg-gray-700 text-white p-3 rounded-lg outline-none" />

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Video File</label>
            <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])}
              className="text-gray-300 w-full" required />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Thumbnail</label>
            <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])}
              className="text-gray-300 w-full" required />
          </div>

          {loading && (
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className="bg-red-600 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }} />
              <p className="text-gray-400 text-sm mt-1 text-center">{progress}% uploaded</p>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50">
            {loading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;