export interface User {
  _id: string;
  name: string;
  phone: string;
  role?: "user" | "admin";
}

export interface Category {
  _id: string;
  name: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  category_id: string;
}

export interface QuizQuestion {
  question: string;
  options: [string, string, string, string];
  answer: string;
}

export interface Lesson {
  _id: string;
  title: string;
  content: string;
  quiz: QuizQuestion[];
  topic: string;
  category: string;
}
