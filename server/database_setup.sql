-- Database Setup Script for proyecto_final_db
-- Run this script to set up the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS proyecto_final_db;
USE proyecto_final_db;

-- Create ArchiveItem table
CREATE TABLE IF NOT EXISTS ArchiveItem (
  id INT PRIMARY KEY AUTO_INCREMENT,
  topic VARCHAR(255) NOT NULL,
  subCategory VARCHAR(255) NOT NULL,
  featuredFile VARCHAR(255) NOT NULL,
  fileType VARCHAR(100),
  fileContent TEXT,
  ownerId VARCHAR(100) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ownerId (ownerId),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create ArchiveFile table
CREATE TABLE IF NOT EXISTS ArchiveFile (
  id INT PRIMARY KEY AUTO_INCREMENT,
  archiveItemId INT NOT NULL,
  fileUrl TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (archiveItemId) REFERENCES ArchiveItem(id) ON DELETE CASCADE,
  INDEX idx_archiveItemId (archiveItemId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Display table structures
DESCRIBE ArchiveItem;
DESCRIBE ArchiveFile;

SELECT 'Database setup completed successfully!' AS Status;
