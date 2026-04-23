import { useState } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Create Account</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="username" placeholder="Username" onChange={handleChange}
            className="bg-gray-700 text-white p-3 rounded-lg outline-none" />
          <input name="email" type="email" placeholder="Email" onChange={handleChange}
            className="bg-gray-700 text-white p-3 rounded-lg outline-none" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange}
            className="bg-gray-700 text-white p-3 rounded-lg outline-none" />
          <button type="submit"
            className="bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700">
            Register
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Already have an account? <Link to="/login" className="text-red-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;