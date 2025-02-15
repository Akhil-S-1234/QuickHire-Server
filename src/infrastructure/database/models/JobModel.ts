import { Schema, model, Document } from 'mongoose';

// Define the schema for the job posting
interface Job extends Document {
  title: string;
  description: string;
  company: {
    name: string;
    logo: string;
  };
  location: string;
  type: string; //  "Full-time", "Part-time", "Contract"
  salary: {
    min: number;
    max: number;
  };
  experience: {
    minYears: number;
    maxYears?: number;
  };
  requirements: {
    education: string;
    skills: string[];
    certifications: string[];
  };
  postedBy: string; // Reference to recruiter ID
  createdAt: Date;
  updatedAt: Date;
  isActive: Boolean; // e.g., "active", "closed"
}

// Create a Mongoose schema based on the interface
const jobSchema = new Schema<Job>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: {
      name: { type: String, required: true },
      logo: { type: String, required: true },
    },
    location: { type: String, required: true },
    type: { type: String, required: true },
    salary: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    experience: {
      minYears: { type: Number, required: true },
      maxYears: { type: Number, required: false },
    },
    requirements: {
      education: { type: String, required: true },
      skills: { type: [String], required: true },
      certifications: { type: [String], required: false },
    },
    postedBy: { type: String, required: true }, // Changed to ObjectId reference
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

// Create and export the model
const JobModel = model<Job>('Job', jobSchema);

export default JobModel;
