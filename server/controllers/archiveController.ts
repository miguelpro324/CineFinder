import { type Request, type Response } from 'express';
import { pool } from '../config/database.js';
import { type RowDataPacket, type ResultSetHeader } from 'mysql2';

interface ArchiveItem {
  id: number;
  topic: string;
  subCategory: string;
  featuredFile: string;
  fileType?: string;
  fileContent?: string;
  ownerId: string;
  createdAt: Date;
}

interface ArchiveFile {
  id: number;
  archiveItemId: number;
  fileUrl: string;
  createdAt: Date;
}

export const archiveController = {
  // Create new archive item
  async createArchiveItem(req: Request, res: Response) {
    const { topic, subCategory, featuredFile, fileType, fileContent, ownerId, fileUrl } = req.body;

    if (!topic || !subCategory || !featuredFile || !ownerId) {
      return res.status(400).json({ 
        error: 'Missing required fields: topic, subCategory, featuredFile, ownerId' 
      });
    }

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Insert archive item
      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO ArchiveItem (topic, subCategory, featuredFile, fileType, fileContent, ownerId) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [topic, subCategory, featuredFile, fileType || null, fileContent || null, ownerId]
      );

      const archiveItemId = result.insertId;

      // Insert file if fileUrl provided
      if (fileUrl) {
        await connection.query(
          `INSERT INTO ArchiveFile (archiveItemId, fileUrl) VALUES (?, ?)`,
          [archiveItemId, fileUrl]
        );
      }

      await connection.commit();

      res.status(201).json({
        success: true,
        id: archiveItemId,
        message: 'Archive item created successfully'
      });
    } catch (error) {
      await connection.rollback();
      console.error('Error creating archive item:', error);
      res.status(500).json({ error: 'Failed to create archive item' });
    } finally {
      connection.release();
    }
  },

  // Get all archive items (with fileUrl)
  async getAllArchiveItems(req: Request, res: Response) {
    try {
      const [rows] = await pool.query<(ArchiveItem & RowDataPacket)[]>(
        `SELECT 
          ai.id, ai.topic, ai.subCategory, ai.featuredFile, ai.fileType, 
          ai.fileContent, ai.ownerId, ai.createdAt,
          af.fileUrl
         FROM ArchiveItem ai
         LEFT JOIN ArchiveFile af ON ai.id = af.archiveItemId
         ORDER BY ai.createdAt DESC`
      );

      res.json({ success: true, data: rows });
    } catch (error) {
      console.error('Error fetching archive items:', error);
      res.status(500).json({ error: 'Failed to fetch archive items' });
    }
  },

  // Get archive item by ID (with fileUrl)
  async getArchiveItemById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const [rows] = await pool.query<(ArchiveItem & RowDataPacket)[]>(
        `SELECT 
          ai.id, ai.topic, ai.subCategory, ai.featuredFile, ai.fileType, 
          ai.fileContent, ai.ownerId, ai.createdAt,
          af.fileUrl
         FROM ArchiveItem ai
         LEFT JOIN ArchiveFile af ON ai.id = af.archiveItemId
         WHERE ai.id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Archive item not found' });
      }

      res.json({ success: true, data: rows[0] });
    } catch (error) {
      console.error('Error fetching archive item:', error);
      res.status(500).json({ error: 'Failed to fetch archive item' });
    }
  },

  // Get file URL for specific archive item
  async getArchiveItemFile(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const [rows] = await pool.query<(ArchiveFile & RowDataPacket)[]>(
        `SELECT id, archiveItemId, fileUrl, createdAt 
         FROM ArchiveFile 
         WHERE archiveItemId = ?`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'File not found for this archive item' });
      }

      res.json({ success: true, data: rows[0] });
    } catch (error) {
      console.error('Error fetching archive file:', error);
      res.status(500).json({ error: 'Failed to fetch archive file' });
    }
  },

  // Update archive item
  async updateArchiveItem(req: Request, res: Response) {
    const { id } = req.params;
    const { topic, subCategory, featuredFile, fileType, fileContent } = req.body;

    try {
      const [result] = await pool.query<ResultSetHeader>(
        `UPDATE ArchiveItem 
         SET topic = COALESCE(?, topic),
             subCategory = COALESCE(?, subCategory),
             featuredFile = COALESCE(?, featuredFile),
             fileType = COALESCE(?, fileType),
             fileContent = COALESCE(?, fileContent)
         WHERE id = ?`,
        [topic, subCategory, featuredFile, fileType, fileContent, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Archive item not found' });
      }

      res.json({ success: true, message: 'Archive item updated successfully' });
    } catch (error) {
      console.error('Error updating archive item:', error);
      res.status(500).json({ error: 'Failed to update archive item' });
    }
  },

  // Delete archive item
  async deleteArchiveItem(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const [result] = await pool.query<ResultSetHeader>(
        `DELETE FROM ArchiveItem WHERE id = ?`,
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Archive item not found' });
      }

      res.json({ success: true, message: 'Archive item deleted successfully' });
    } catch (error) {
      console.error('Error deleting archive item:', error);
      res.status(500).json({ error: 'Failed to delete archive item' });
    }
  }
};
