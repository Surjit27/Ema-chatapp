# Chat App Backend

Node.js backend for the chat application using Express and PostgreSQL.

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory with your PostgreSQL credentials:
```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=chatapp_db
DB_USER=postgres
DB_PASSWORD=2005

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:3000
```

### 3. Create Database and Run Migrations (Automated)
Run the seed script to automatically create the database and set up all tables:
```bash
npm run db:seed
```

This script will:
- ✅ Connect to PostgreSQL server
- ✅ Create the `chatapp_db` database (drops if exists)
- ✅ Run all migrations to create tables, indexes, and triggers

**Note:** Make sure PostgreSQL is running and accessible with the credentials in your `.env` file.

### Alternative: Manual Database Creation
If you prefer to create the database manually:
1. Create database in pgAdmin or psql:
   ```sql
   CREATE DATABASE chatapp_db;
   ```
2. Run migrations only:
   ```bash
   npm run db:migrate
   ```

### 5. Start the Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## 📁 Project Structure

- `config/` - Database configuration
- `models/` - Database models (to be created)
- `routes/` - API routes (to be created)
- `controllers/` - Business logic (to be created)
- `middleware/` - Custom middleware (to be created)
- `migrations/` - Database schema and migrations
- `utils/` - Utility functions (to be created)

## 🗄️ Database Schema

See `BACKEND_ARCHITECTURE.md` for detailed schema information.

## 📝 API Endpoints

Currently available:
- `GET /` - API info
- `GET /api/health` - Health check

More endpoints will be added step by step.

