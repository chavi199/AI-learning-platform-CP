import { useState, useEffect } from "react";
import { Clock, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../api/axios";
import type { Lesson } from "../types";

export default function HistoryPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/lessons/user")
      .then((res) => setLessons(res.data))
      .catch((err) => {
        console.error("History fetch error:", err.response ?? err.message);
        setError("Failed to load history. Please make sure you are logged in.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await api.delete(`/lessons/${id}`);
      setLessons((prev) => prev.filter((lesson) => lesson._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete lesson");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Clock className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Learning History</h1>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {!loading && !error && lessons.length === 0 && (
          <p className="text-gray-500">No lessons yet. Go generate your first lesson!</p>
        )}

        <div className="space-y-4">
          {lessons.map((lesson) => {
            const isExpanded = expandedId === lesson._id;
            return (
              <div key={lesson._id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header with Toggle */}
                <div className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex-1 cursor-pointer" onClick={() => toggleExpand(lesson._id)}>
                    <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Topic: {lesson.topic}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExpand(lesson._id)}
                      className="p-2 rounded-md hover:bg-purple-100 transition text-purple-600"
                      title={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6" />
                      ) : (
                        <ChevronDown className="w-6 h-6" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(lesson._id);
                      }}
                      className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 transition"
                      title="Delete lesson"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="bg-white border-t">
                    <div className="p-6">
                      <div className="prose max-w-none mb-6 rtl text-right">
                        <ReactMarkdown>{lesson.content}</ReactMarkdown>
                      </div>

                      {/* Quiz Section */}
                      {lesson.quiz && lesson.quiz.length > 0 && (
                        <div className="mt-6 pt-6 border-t">
                          <h4 className="text-lg font-bold text-gray-900 mb-4">Quiz</h4>
                          <div className="space-y-4">
                            {lesson.quiz.map((q, idx) => (
                              <div key={idx} className="bg-gray-50 p-4 rounded-md">
                                <p className="font-medium text-gray-800 mb-2">
                                  {idx + 1}. {q.question}
                                </p>
                                <ul className="space-y-1 ml-4">
                                  {q.options.map((opt, optIdx) => (
                                    <li
                                      key={optIdx}
                                      className={`text-sm ${
                                        opt === q.answer
                                          ? "text-green-700 font-semibold"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {opt === q.answer ? "✓ " : "• "}
                                      {opt}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Close Button */}
                    <div className="border-t bg-gray-50 p-4 flex justify-center">
                      <button
                        onClick={() => toggleExpand(lesson._id)}
                        className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                      >
                        <ChevronUp className="w-5 h-5" />
                        Close Lesson
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
