import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import { createServer } from 'http';
import { createLoggingMiddleware } from './api/middlewares/logging';
import { connectToDatabase } from './infrastructure/database/database';
import { initSocketService } from './infrastructure/services/SocketService';

// Routes
import userRoutes from './api/routes/userRoutes';
import recruiterRoutes from './api/routes/recruiterRoutes';
import adminRoutes from './api/routes/adminRoutes';
// import notificationRoutes from './api/routes/notificationRoutes';

// Load environment variables before anything else
dotenv.config();

// Constants
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Initialize express app
const app = express();
const httpServer = createServer(app);

// Apply middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(createLoggingMiddleware());

// Configure CORS based on environment
app.use(cors({
  origin: isProduction ? process.env.FRONTEND_URL : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Session configuration with better security
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false, // Don't create session until something stored
  cookie: {
    secure: isProduction, // Use secure cookies in production
    httpOnly: true,       // Prevent client-side JS from reading
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: isProduction ? 'none' : 'lax',
  }
}));

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: isProduction ? 'Internal Server Error' : err.message,
    stack: isProduction ? undefined : err.stack,
  });
});

// Server startup function
const startServer = async () => {
  try {
    await connectToDatabase();
    console.log('Database connection established');
    
    // Initialize Socket.IO service
    const socketService = initSocketService(httpServer);
    console.log('Socket.IO service initialized');
    
    // Start HTTP server with Socket.IO attached
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      httpServer.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
import "express-session";

declare module "express-session" {
    interface SessionData {
      user?: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        email: string;
        password: string;
      };
      recruiter?: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
        mobile: string;
        currentLocation: string;
        currentCompany: string;
        currentDesignation: string;
        fromDate: string;
        toDate: string;
        addressLine1: string;
        addressLine2: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
        profilePicture: string;
      };
    }
  }