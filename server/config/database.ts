import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'alm2018@cc', // Update with your MySQL password
  database: 'proyecto_final_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

export const pool = mysql.createPool(dbConfig);

export async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS proyecto_final_db`);
    await connection.query(`USE proyecto_final_db`);
    
    // Create Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(500) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Create ArchiveItem table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ArchiveItem (
        id INT PRIMARY KEY AUTO_INCREMENT,
        topic VARCHAR(255) NOT NULL,
        subCategory VARCHAR(255) NOT NULL,
        featuredFile VARCHAR(255) NOT NULL,
        fileType VARCHAR(100),
        fileContent TEXT,
        ownerId VARCHAR(100) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ownerId (ownerId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Create ArchiveFile table with LONGTEXT for large files
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ArchiveFile (
        id INT PRIMARY KEY AUTO_INCREMENT,
        archiveItemId INT NOT NULL,
        fileUrl LONGTEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (archiveItemId) REFERENCES ArchiveItem(id) ON DELETE CASCADE,
        INDEX idx_archiveItemId (archiveItemId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    connection.release();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}
