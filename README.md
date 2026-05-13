# AI Learning Platform - MERN Stack

> A professional learning platform that generates educational content using OpenAI's GPT models. Built as part of a Full-Stack development assessment.

## Features

- **AI-Powered Lessons**: Generate structured lessons in Hebrew/English based on any topic
- **Multi-Language Support**: Automatic detection of Hebrew and English content
- **Admin Dashboard**: Manage Categories and Sub-Categories with full database relationships
- **Lesson History**: Save and retrieve previously generated lessons from MongoDB
- **User Authentication**: JWT-based authentication with role-based access control
- **Fully Dockerized**: Complete containerized environment for easy deployment
- **Modern UI**: Built with React, Tailwind CSS, and TypeScript
- **RESTful API**: Comprehensive backend APIs for all operations

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for fast development
- Axios for API calls
- React Router for navigation

### Backend
- Node.js with Express
- TypeScript for type safety
- MongoDB with Mongoose ODM
- JWT for authentication
- OpenAI API (GPT-4o) for AI-powered lessons

### DevOps & Tools
- Docker & Docker Compose for containerization
- MongoDB as the database service
- Nodemon for development auto-reload

## Installation & Setup

### Prerequisites

- Docker Desktop installed and running
- OpenAI API Key (with access to GPT-4o model)
- Git for cloning the repository

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI-learning-platform-CP
   ```

2. **Configure Environment Variables**
   
   Create a `.env` file in the `server` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb://mongodb:27017/ai_learning_platform
   JWT_SECRET=your_super_secret_key
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_TLS_REJECT_UNAUTHORIZED=0
   ```

3. **Build and start the application**
   ```bash
   docker-compose up -d --build
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - MongoDB: mongodb://localhost:27017

## Running the Project

### Development Mode (with Docker)

```bash
# Start all services
docker-compose up -d --build

# View logs
docker-compose logs -f server
docker-compose logs -f frontend

# Stop all services
docker-compose down
```

### Local Development (without Docker)

Backend:
```bash
cd server
npm install
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
AI-learning-platform-CP/
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # State management
│   │   ├── api/            # API integration
│   │   └── types/          # TypeScript types
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   └── app.ts          # Express setup
│   └── package.json
│
└── docker-compose.yml
```

## API Documentation

### Lesson Endpoints
- `GET /api/lessons` - Get all lessons
- `POST /api/lessons/generate` - Generate AI lesson
- `GET /api/lessons/:id` - Get lesson details

### Category Endpoints
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### SubCategory Endpoints
- `GET /api/subCategories` - Get all sub-categories
- `POST /api/subCategories` - Create sub-category (Admin)

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `GET /api/users/profile` - Get user profile

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  role: String ('user' | 'admin'),
  createdAt: Date
}
```

### Category Model
```javascript
{
  _id: ObjectId,
  name: String (unique),
  description: String,
  createdAt: Date
}
```

### Lesson Model
```javascript
{
  _id: ObjectId,
  topic: String,
  category_id: ObjectId (ref: Category),
  sub_category_id: ObjectId (ref: SubCategory),
  user_id: ObjectId (ref: User),
  title: String,
  content: String (Markdown),
  quiz: Array of QuizQuestion,
  createdAt: Date
}
```

## User Roles

### Regular User
- Generate lessons
- View lesson history
- Attempt quizzes

### Admin User
- Manage categories & sub-categories
- View platform statistics
- All regular user permissions

## Troubleshooting

### OpenAI API Error (403)
- Ensure your API key has access to `gpt-4o` model
- Check: https://platform.openai.com/account/api-keys

### MongoDB Connection Failed
- Verify MongoDB container is running
- Command: `docker-compose logs mongodb`

### Port Already in Use
- Change port in `.env` file
- Or kill process: `netstat -ano | findstr :5000`

### Frontend Cannot Connect to Backend
- Check URL in `frontend/src/api/axios.ts`
- Ensure backend is running on port 5000

## License

This project is provided for educational purposes.

---

**Status**: Active Development  
**Last Updated**: May 2026
