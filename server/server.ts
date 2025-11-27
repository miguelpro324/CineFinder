// Basic TypeScript Express Server for React Application Backend
// This file uses full ES Module syntax to comply with strict 'nodenext' and 'verbatimModuleSyntax' rules.

// Standard ES Module imports for all dependencies
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/database.js';
import archiveRoutes from './routes/archiveRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Initialize the Express application
const app = express();
const PORT: number = 5000;

// --- Middleware Configuration ---

// 1. CORS Configuration: Allows requests from the React frontend development server
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allow localhost and Tailscale IPs
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      /^http:\/\/100\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$/, // Tailscale network (100.x.x.x)
      /^https?:\/\/[a-zA-Z0-9-]+\.wyrm-ruler\.ts\.net(:\d+)?$/, // Tailscale MagicDNS
      /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d+$/, // Local network
      /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$/, // Local network
    ];
    
    const isAllowed = allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') {
        return origin === pattern;
      } else {
        return pattern.test(origin);
      }
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('Origin blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

// 2. Body Parser: Middleware to parse incoming JSON payloads
app.use(express.json({ limit: '50mb' })); // Increased limit for file uploads


// --- API Routes ---

// Authentication routes
app.use('/api', authRoutes);

// Archive API routes
app.use('/api', archiveRoutes);

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Archive API is running',
    timestamp: new Date().toISOString() 
  });
});


// --- Server Startup ---

async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Start server on all network interfaces (0.0.0.0)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n✅ Archive API server is running on port ${PORT}`);
      console.log(`📊 Local API: http://localhost:${PORT}/api`);
      console.log(`📱 Tailscale API: http://100.99.70.31:${PORT}/api`);
      console.log(`🔧 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
