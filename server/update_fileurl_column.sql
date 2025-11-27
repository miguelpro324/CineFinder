-- Migration script to increase fileUrl column size
-- This allows storing large base64-encoded files

USE proyecto_final_db;

-- Change fileUrl column from TEXT to LONGTEXT to support larger files
ALTER TABLE ArchiveFile MODIFY COLUMN fileUrl LONGTEXT NOT NULL;

-- Verify the change
DESCRIBE ArchiveFile;

SELECT 'Column fileUrl updated successfully to LONGTEXT!' AS Status;
