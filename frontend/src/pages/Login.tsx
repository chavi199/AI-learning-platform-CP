import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const { data } = await api.post("/users", { name, phone });
      login(data.user, data.token);
      setSuccess(data.message || "Success!");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Authentication failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <UserCircle className="w-16 h-16 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Welcome to AI Learning Platform
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Enter your details to login or sign up
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {success}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
