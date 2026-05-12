import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import type { Lesson } from "../types";

interface Props {
  lesson: Lesson;
}

export default function LessonDisplay({ lesson }: Props) {
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIndex: number, option: string) => {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [qIndex]: option }));
  };

  const score = lesson.quiz.filter((q, i) => selected[i] === q.answer).length;

  return (
    <div className="mt-8 space-y-8">
      {/* Lesson Content */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{lesson.title}</h2>
        <div className="prose max-w-none text-gray-700 whitespace-pre-line rtl text-right">
          {lesson.content}
        </div>
      </div>

      {/* Quiz */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quiz</h3>
        <div className="space-y-6">
          {lesson.quiz.map((q, qIndex) => (
            <div key={qIndex}>
              <p className="font-medium text-gray-800 mb-3">
                {qIndex + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((option) => {
                  const isSelected = selected[qIndex] === option;
                  const isCorrect = option === q.answer;
                  let style = "border-gray-200 hover:border-purple-400 cursor-pointer";
                  if (submitted) {
                    if (isCorrect) style = "border-green-500 bg-green-50";
                    else if (isSelected) style = "border-red-500 bg-red-50";
                    else style = "border-gray-200";
                  } else if (isSelected) {
                    style = "border-purple-600 bg-purple-50";
                  }

                  return (
                    <div
                      key={option}
                      onClick={() => handleSelect(qIndex, option)}
                      className={`flex items-center justify-between px-4 py-3 border-2 rounded-md transition ${style}`}
                    >
                      <span className="text-gray-700">{option}</span>
                      {submitted && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {submitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(selected).length < lesson.quiz.length}
            className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition disabled:bg-gray-400"
          >
            Submit Quiz
          </button>
        ) : (
          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-md text-center">
            <p className="text-lg font-bold text-purple-700">
              Score: {score} / {lesson.quiz.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
