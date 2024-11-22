import express from 'express'
import userRoutes from './api/routes/userRoutes'
import recruiterRoutes from './api/routes/recruiterRoutes'
import adminRoutes from './api/routes/adminRoutes'
import { connectToDatabase } from './infrastructure/database/database'
import dotenv from 'dotenv'
import session from 'express-session'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser';



dotenv.config()

const app = express()

app.use(cookieParser())
app.use(morgan('dev'))
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
      name: string;
      email: string;
      phone: string;
      position: string;
      companyName: string;
      password: string;
    };
  }
}

app.use('/api/users', userRoutes)
app.use('/api/recruiter', recruiterRoutes)
app.use('/api/admin', adminRoutes)

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
