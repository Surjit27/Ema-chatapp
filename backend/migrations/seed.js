const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database configuration
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '2005',
  database: 'postgres', // Connect to default postgres database first
};

const DB_NAME = process.env.DB_NAME || 'chatapp_db';

async function createDatabase() {
  // Connect to default postgres database to create our database
  const adminPool = new Pool({
    ...DB_CONFIG,
    database: 'postgres',
  });

  try {
    console.log('🔌 Connecting to PostgreSQL server...');
    
    // Check if database exists
    const dbCheck = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );

    if (dbCheck.rows.length > 0) {
      console.log(`⚠️  Database '${DB_NAME}' already exists.`);
      console.log('   Dropping existing database...');
      // Terminate existing connections
      await adminPool.query(
        `SELECT pg_terminate_backend(pid)
         FROM pg_stat_activity
         WHERE datname = $1 AND pid <> pg_backend_pid()`,
        [DB_NAME]
      );
      // Drop database
      await adminPool.query(`DROP DATABASE ${DB_NAME}`);
      console.log(`✅ Dropped existing database '${DB_NAME}'`);
    }

    // Create database
    console.log(`📦 Creating database '${DB_NAME}'...`);
    await adminPool.query(`CREATE DATABASE ${DB_NAME}`);
    console.log(`✅ Database '${DB_NAME}' created successfully!`);

    await adminPool.end();
    return true;
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    await adminPool.end();
    throw error;
  }
}

async function runMigrations() {
  // Connect to our newly created database
  const pool = new Pool({
    ...DB_CONFIG,
    database: DB_NAME,
  });

  try {
    console.log(`🔄 Running migrations on '${DB_NAME}'...`);
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL
    await pool.query(sql);
    
    console.log('✅ Database migrations completed successfully!');
    console.log('\n📊 Database Schema Created:');
    console.log('   ✓ users table');
    console.log('   ✓ chats table');
    console.log('   ✓ chat_participants table');
    console.log('   ✓ messages table');
    console.log('   ✓ message_reads table');
    console.log('   ✓ Indexes and triggers');
    
    await pool.end();
    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    await pool.end();
    throw error;
  }
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding process...\n');
    
    // Step 1: Create database
    await createDatabase();
    console.log('');
    
    // Step 2: Run migrations
    await runMigrations();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log(`\n📝 You can now connect to the database:`);
    console.log(`   Database: ${DB_NAME}`);
    console.log(`   User: ${DB_CONFIG.user}`);
    console.log(`   Host: ${DB_CONFIG.host}:${DB_CONFIG.port}`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seed script
seedDatabase();

