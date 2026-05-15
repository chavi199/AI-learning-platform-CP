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
   
   Create a `.env` file in the `server` folder with these required variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://mongodb:27017/ai_learning_platform
   JWT_SECRET=your_super_secret_key
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_TLS_REJECT_UNAUTHORIZED=0
   ```
   
   **Environment Variables Explanation:**
   - `PORT`: Server port (default: 5000)
   - `MONGO_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT token signing (use a strong random string)
   - `OPENAI_API_KEY`: Your OpenAI API key (get it from https://platform.openai.com/account/api-keys)
   - `NODE_TLS_REJECT_UNAUTHORIZED`: Set to 0 for development (not for production)

3. **Build and start the application**
   ```bash
   docker-compose up -d --build
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - MongoDB: mongodb://localhost:27017

5. **Seed the Database with Categories**
   
   After containers are running, populate the database with educational categories:
   ```bash
   docker-compose exec -T server npm run seed-categories
   ```
   
   This will create:
   - 10 Categories: Software Development, Exact Sciences, Languages, Business, Cyber Security, Data Science, Psychology, History, Photography, Cooking
   - 25 Sub-Categories with proper relationships to their parent categories
   
   The seed script will:
   - Delete existing categories to avoid duplicates
   - Create all categories first
   - Link sub-categories with correct category IDs
   - Display a summary of created data

6. **Create an Admin User**
   
   To create your first admin user, run:
   ```bash
   docker-compose exec -T server npm run create-admin
   ```
   
   This will prompt you to enter:
   - Email address (for admin login)
   - Password (use a strong password)
   
   After creation, you can log in with these credentials at **http://localhost:5173**

## Running the Project

### Quick Start (5 minutes)

**For first-time setup, follow these steps in order:**

```bash
# 1. Clone and navigate to project
git clone <repository-url>
cd AI-learning-platform-CP

# 2. Create .env file in server folder (see step 2 in Installation & Setup)

# 3. Start all Docker containers
docker-compose up -d --build

# 4. Seed the database (wait ~30 seconds for MongoDB to be ready)
docker-compose exec -T server npm run seed-categories

# 5. Create your admin account
docker-compose exec -T server npm run create-admin

# 6. Open browser and access:
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

Now you're ready! Log in with your admin credentials and start managing categories.

### Development Mode (with Docker)

```bash
# Start all services
docker-compose up -d --build

# Seed the database with categories (run once after setup)
docker-compose exec -T server npm run seed-categories

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

# In another terminal, seed the database:
npm run seed-categories
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

**Note:** Requires MongoDB running locally on `mongodb://localhost:27017`

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
│   │   ├── scripts/        # Utility scripts (seeding, admin creation)
│   │   └── app.ts          # Express setup
│   └── package.json
│
└── docker-compose.yml
```

## Available Scripts

### Server Scripts (Backend)

```bash
cd server

# Start development server with auto-reload
npm run dev

# Seed database with categories and sub-categories
npm run seed-categories

# Create an admin user
npm run create-admin

# Run tests
npm test
```

### Frontend Scripts

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Docker Commands

```bash
# From project root

# Build and start all services
docker-compose up -d --build

# Stop all services
docker-compose down

# View logs for specific service
docker-compose logs -f server
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Execute command in running container
docker-compose exec -T server npm run seed-categories
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

## Admin Access

### Creating Admin Users

There are two ways to create an admin user:

**Option 1: Using the seed script (Recommended)**
```bash
docker-compose exec -T server npm run create-admin
```

This interactive script will:
1. Prompt for admin email
2. Prompt for admin password
3. Create the admin user in MongoDB

**Option 2: Direct MongoDB access**
Use MongoDB tools to insert a user document with `role: "admin"`

### Admin Dashboard Features

Once logged in as an admin, you can:

1. **Manage Categories**
   - View all categories
   - Create new categories
   - Update category details
   - Delete categories

2. **Manage Sub-Categories**
   - View/edit sub-categories
   - Assign sub-categories to categories
   - Delete sub-categories

3. **View Statistics**
   - Total users count
   - Total lessons generated
   - Platform usage metrics

### Admin Login

1. Go to **http://localhost:5173**
2. Click on "Login"
3. Enter your admin email and password
4. You'll be automatically redirected to the Admin Dashboard
5. You can now manage categories and view statistics

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

### Admin Creation Failed
- Verify MongoDB is running: `docker-compose logs mongodb`
- Check server logs: `docker-compose logs server`
- Ensure `.env` file exists with correct `MONGO_URI`

### Categories Not Showing
- Run: `docker-compose exec -T server npm run seed-categories`
- Wait a few seconds for the script to complete
- Refresh the browser

## FAQ

**Q: I forgot my admin password. What do I do?**
- Connect to MongoDB directly and delete the admin user
- Then run `npm run create-admin` again to create a new admin

**Q: Can I use a different database instead of MongoDB?**
- Currently, the project is configured for MongoDB with Mongoose
- To use another database, you would need to rewrite the models action logic

**Q: How do I deploy this to production?**
- Remove `NODE_TLS_REJECT_UNAUTHORIZED=0` from `.env`
- Use proper secrets management (avoid hardcoding API keys)
- Configure proper MongoDB Atlas connection string
- Deploy using services like Heroku, Railway, or AWS

## License

This project is provided for educational purposes.

---

**Status**: Active Development  
**Last Updated**: May 2026
