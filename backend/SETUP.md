# Quick Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env` File
Create a `.env` file in the `backend` directory with these contents:

```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chatapp_db
DB_USER=postgres
DB_PASSWORD=2005

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. Run Database Seed Script
This will automatically create the database and all tables:

```bash
npm run db:seed
```

**What it does:**
- ✅ Connects to PostgreSQL (user: postgres, password: 2005)
- ✅ Creates `chatapp_db` database (drops if exists)
- ✅ Creates all tables: users, chats, chat_participants, messages, message_reads
- ✅ Sets up indexes and triggers

### 4. Start the Server
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## 📝 Available Scripts

- `npm run db:seed` - Create database and run all migrations
- `npm run db:migrate` - Run migrations only (database must exist)
- `npm run dev` - Start server in development mode (with nodemon)
- `npm start` - Start server in production mode

## ✅ Verification

After running `npm run db:seed`, you should see:
- Database `chatapp_db` created in pgAdmin
- All 5 tables created with proper relationships
- Indexes and triggers set up

You can verify in pgAdmin by:
1. Expanding `chatapp_db` database
2. Checking `Schemas` → `public` → `Tables`
3. You should see: users, chats, chat_participants, messages, message_reads

