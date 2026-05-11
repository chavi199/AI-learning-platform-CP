import { useState, useEffect } from "react";
import { Shield, Users, BookOpen, FolderPlus, Plus, Trash2, BarChart3 } from "lucide-react";
import api from "../api/axios";
import type { Category } from "../types";

interface Stats {
  totalUsers: number;
  totalLessons: number;
  categories: Category[];
}

interface User {
  _id: string;
  name: string;
  phone: string;
  role: string;
  createdAt: string;
}

interface AdminLesson {
  _id: string;
  title: string;
  topic: string;
  user_id: { name: string };
  category: { name: string };
  createdAt: string;
}

type TabType = "overview" | "categories" | "users" | "lessons";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/users"),
      api.get("/admin/lessons"),
    ])
      .then(([statsRes, usersRes, lessonsRes]) => {
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setLessons(lessonsRes.data);
      })
      .catch((err) => {
        console.error("Admin data error:", err.response ?? err.message);
        setError("Access denied or failed to load data. Make sure you are an admin.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await api.post("/admin/categories", { name: newCategory });
      setNewCategory("");
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create category");
    }
  };

  const handleAddSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCategory.trim() || !selectedCategoryForSub) return;

    try {
      await api.post("/admin/subcategories", {
        name: newSubCategory,
        category_id: selectedCategoryForSub,
      });
      setNewSubCategory("");
      setSelectedCategoryForSub("");
      alert("Sub-category created successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create sub-category");
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await api.delete(`/admin/lessons/${id}`);
      setLessons((prev) => prev.filter((lesson) => lesson._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete lesson");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: BarChart3 },
    { id: "categories" as TabType, label: "Categories", icon: FolderPlus },
    { id: "users" as TabType, label: "Users", icon: Users },
    { id: "lessons" as TabType, label: "Lessons", icon: BookOpen },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <Shield className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
                  activeTab === tab.id
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center">
                  <Users className="w-10 h-10 text-blue-600 mr-4" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Users</p>
                    <p className="text-3xl font-bold text-blue-900">{stats?.totalUsers ?? 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center">
                  <BookOpen className="w-10 h-10 text-green-600 mr-4" />
                  <div>
                    <p className="text-sm text-green-600 font-medium">Total Lessons</p>
                    <p className="text-3xl font-bold text-green-900">{stats?.totalLessons ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Categories</h2>

            {/* Add Category */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Add New Category</h3>
              <form onSubmit={handleAddCategory} className="flex gap-4">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Category name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600"
                />
                <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition">
                  Add
                </button>
              </form>
            </div>

            {/* Add SubCategory */}
            <div className="mb-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Add New Sub-Category</h3>
              <form onSubmit={handleAddSubCategory} className="space-y-4">
                <select
                  value={selectedCategoryForSub}
                  onChange={(e) => setSelectedCategoryForSub(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600"
                  required
                >
                  <option value="">Select a category</option>
                  {stats?.categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    placeholder="Sub-category name"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600"
                    required
                  />
                  <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition">
                    Add
                  </button>
                </div>
              </form>
            </div>

            {/* Categories List */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Existing Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {stats?.categories.map((cat) => (
                  <div key={cat._id} className="bg-gray-50 border border-gray-200 rounded-md px-4 py-2">
                    <p className="text-gray-800 font-medium">{cat.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="text-left p-3 font-semibold text-gray-700">Name</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Phone</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Role</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.phone}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Lessons Tab */}
        {activeTab === "lessons" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Lessons</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="text-left p-3 font-semibold text-gray-700">Title</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Category</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Created By</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((lesson) => (
                    <tr key={lesson._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{lesson.title}</td>
                      <td className="p-3">{lesson.category?.name || 'N/A'}</td>
                      <td className="p-3">{lesson.user_id?.name || 'Unknown'}</td>
                      <td className="p-3 text-sm text-gray-600">{new Date(lesson.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteLesson(lesson._id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 transition"
                          title="Delete lesson"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
