import { useState, useEffect } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import api from "../api/axios";
import type { Category, SubCategory, Lesson } from "../types";
import LessonDisplay from "../components/LessonDisplay";

export default function Dashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setSelectedSubCategory("");
      api.get(`/subcategories/${selectedCategory}`).then((res) => setSubCategories(res.data));
    }
  }, [selectedCategory]);

  const handleGenerate = async () => {
    setLoading(true);
    setLesson(null);
    console.log("🚀 Sending request to backend...", { topic, category: selectedCategory, sub_category_id: selectedSubCategory });
    try {
      const { data } = await api.post("/lessons/generate", {
        topic,
        category: selectedCategory,
        sub_category_id: selectedSubCategory,
      });
      console.log("✅ Received lesson from backend:", data);
      setLesson(data);
    } catch (err: any) {
      console.error("❌ Frontend error:", err.response ?? err.message);
      alert("Failed to generate lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <BookOpen className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Generate Lesson</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {selectedCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Category</label>
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600"
              >
                <option value="">Select Sub-Category</option>
                {subCategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>{sub.name}</option>
                ))}
              </select>
            </div>
          )}

          {selectedSubCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What do you want to learn?
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={`e.g., Explain the basics of ${subCategories.find(s => s._id === selectedSubCategory)?.name ?? "this topic"}...`}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 resize-none"
              />
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!topic || !selectedCategory || !selectedSubCategory || loading}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition disabled:bg-gray-400 flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {loading ? "Generating..." : "Generate Lesson"}
          </button>
        </div>
      </div>

      {lesson && <LessonDisplay lesson={lesson} />}
    </div>
  );
}
