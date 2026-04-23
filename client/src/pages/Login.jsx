import { useState } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../redux/userSlice";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await API.post("/api/auth/login", form);
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || "Login failed"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="email" type="email" placeholder="Email" onChange={handleChange}
            className="bg-gray-700 text-white p-3 rounded-lg outline-none" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange}
            className="bg-gray-700 text-white p-3 rounded-lg outline-none" />
          <button type="submit"
            className="bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700">
            Login
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Don't have an account? <Link to="/register" className="text-red-500">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;