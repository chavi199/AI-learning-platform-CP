# AI Learning Platform - MERN Stack

A professional learning platform that generates educational content using OpenAI's GPT models. Built as part of a Full-Stack development assessment.

## 🚀 Features
- **AI-Powered Lessons**: Generate structured lessons in Hebrew/English based on any topic.
- **NetFree Proxy Support**: Custom implementation to support OpenAI API through NetFree web filtering.
- **Admin Dashboard**: Manage Categories and Sub-Categories with full Database Relationships.
- **Lesson History**: Save and retrieve previously generated lessons from MongoDB.
- **Dockerized**: Fully containerized environment for easy deployment.

## 🛠 Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS.
- **Backend**: Node.js, Express, TypeScript.
- **Database**: MongoDB (Mongoose).
- **AI**: OpenAI API (via Axios for proxy compatibility).
- **DevOps**: Docker, Docker Compose.

## 📦 Installation & Setup

### Prerequisites
- Docker Desktop installed.
- OpenAI API Key.

### Steps
1. **Clone the project**
2. **Configure Environment Variables**:
   Create a `.env` file in the `server` folder:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://mongodb:27017/ai_learning_platform
   OPENAI_API_KEY=your_key_here
   NODE_TLS_REJECT_UNAUTHORIZED=0