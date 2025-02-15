import express from 'express'
import userRoutes from './api/routes/userRoutes'
import recruiterRoutes from './api/routes/recruiterRoutes'
import adminRoutes from './api/routes/adminRoutes'
import jobRoutes from './api/routes/build'
import { connectToDatabase } from './infrastructure/database/database'
import dotenv from 'dotenv'
import session from 'express-session'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser';
import { createLoggingMiddleware } from '../src/api/middlewares/logging'



dotenv.config()

const app = express()

app.use(cookieParser())

// app.use(morgan('dev'))
// app.use(addRequestId)

// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: "http://localhost:3000", // Replace with your frontend URL
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   // Listen for events
//   socket.on("message", (data) => {
//     console.log(`Message received: ${data}`);
//     io.emit("message", data); // Broadcast the message
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });

app.use(createLoggingMiddleware())

app.use(cors({
  origin: 'http://localhost:3000', // Frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow required methods
  credentials: true, 
}));
const PORT = process.env.PORT || 4000

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: true,
}));


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

app.use('/api/users', userRoutes)
app.use('/api/recruiter', recruiterRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/job', jobRoutes)

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
