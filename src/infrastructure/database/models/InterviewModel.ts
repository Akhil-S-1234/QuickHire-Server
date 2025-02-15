import mongoose, { Document, Schema } from "mongoose";

// Define Interview Interface
interface Interview extends Document {
  jobSeekerId: mongoose.Types.ObjectId; // Reference to Job Seeker (User)
  recruiterId: mongoose.Types.ObjectId; // Reference to Recruiter (User)
  jobApplicationId: mongoose.Types.ObjectId; // Reference to Job Application
  scheduledDate: Date; // Date of interview
  scheduledTime: string; // Time of interview (HH:mm format)
  duration: number; // Duration in minutes
  status: "Scheduled" | "Completed" | "Cancelled" | "Rescheduled"; // Interview status
  meetingLink: string; // Meeting link (dummy for now)
  notes?: string; // Optional notes
  feedback?: string; // Recruiter's feedback (optional)
  result: "Pending" | "Passed" | "Failed"; // Interview result
  createdAt?: Date;
  updatedAt?: Date;
}

// Define Mongoose Schema
const InterviewSchema = new Schema<Interview>(
  {
    jobSeekerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Recruiter",
    },
    jobApplicationId: { // Now referencing JobApplication instead of Job
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "JobApplication",
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    scheduledTime: {
      type: String, 
      required: true,
    },
    duration: {
      type: Number, 
      required: false,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "Rescheduled"],
      default: "Scheduled",
    },
    meetingLink: {
      type: String,
      default: "https://quickhire.com/dummy-meeting", // Placeholder meeting link
    },
    notes: {
      type: String,
    },
    feedback: {
      type: String,
    },
    result: {
      type: String,
      enum: ["Pending", "Passed", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt fields
);

// Creating the Model
const InterviewModel = mongoose.model<Interview>("Interview", InterviewSchema);

export default InterviewModel;
