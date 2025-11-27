import { type Request, type Response } from 'express';
import { pool } from '../config/database.js';
import { type RowDataPacket, type ResultSetHeader } from 'mysql2';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'ucsm-archive-secret-key-2024';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Encrypt password
const encryptPassword = (password: string): string => {
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};

// Decrypt password
const decryptPassword = (encryptedPassword: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const authController = {
  // Register new user
  async register(req: Request, res: Response) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: username, email, password' 
      });
    }

    try {
      // Check if username exists
      const [usernameCheck] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM Users WHERE username = ?',
        [username]
      );

      if (usernameCheck.length > 0) {
        return res.status(409).json({ 
          success: false,
          message: 'Username already exists' 
        });
      }

      // Check if email exists
      const [emailCheck] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM Users WHERE email = ?',
        [email]
      );

      if (emailCheck.length > 0) {
        return res.status(409).json({ 
          success: false,
          message: 'Email already exists' 
        });
      }

      // Encrypt password
      const encryptedPassword = encryptPassword(password);

      // Insert new user
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
        [username, email, encryptedPassword]
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        userId: result.insertId
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to register user' 
      });
    }
  },

  // Login user
  async login(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: username, password' 
      });
    }

    try {
      // Find user by username
      const [rows] = await pool.query<(User & RowDataPacket)[]>(
        'SELECT id, username, email, password FROM Users WHERE username = ?',
        [username]
      );

      if (rows.length === 0) {
        return res.status(401).json({ 
          success: false,
          message: 'Username not found' 
        });
      }

      const user = rows[0];

      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      // Decrypt and verify password
      try {
        const decryptedPassword = decryptPassword(user.password);
        
        if (decryptedPassword !== password) {
          return res.status(401).json({ 
            success: false,
            message: 'Incorrect password' 
          });
        }
      } catch {
        return res.status(401).json({ 
          success: false,
          message: 'Incorrect password' 
        });
      }

      // Return user data (without password)
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to login' 
      });
    }
  },

  // Check if username exists
  async checkUsername(req: Request, res: Response) {
    const { username } = req.params;

    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM Users WHERE username = ?',
        [username]
      );

      res.json({
        success: true,
        exists: rows.length > 0
      });
    } catch (error) {
      console.error('Error checking username:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to check username' 
      });
    }
  },

  // Check if email exists
  async checkEmail(req: Request, res: Response) {
    const { email } = req.params;

    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM Users WHERE email = ?',
        [email]
      );

      res.json({
        success: true,
        exists: rows.length > 0
      });
    } catch (error) {
      console.error('Error checking email:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to check email' 
      });
    }
  }
};
