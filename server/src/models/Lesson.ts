import mongoose, { Document, Schema, Types } from "mongoose";

export interface ILesson extends Document {
  title: string;
  content: string;
  quiz: Array<{
    question: string;
    options: [string, string, string, string];
    answer: string;
  }>;
  topic: string;
  category: Types.ObjectId;
  user_id: Types.ObjectId;
}

const LessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    quiz: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        answer: { type: String, required: true },
      },
    ],
    topic: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILesson>("Lesson", LessonSchema);
