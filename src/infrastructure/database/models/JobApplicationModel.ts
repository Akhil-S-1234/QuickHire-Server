import mongoose, { Document, Schema } from 'mongoose';

interface JobApplication extends Document {
  jobId: mongoose.Types.ObjectId;  // Reference to the Job being applied to
  userId: mongoose.Types.ObjectId;  // Reference to the User who is applying
  status: string; // Status of the application (e.g., "Pending", "Interview Scheduled", "Accepted", "Rejected")
  dateApplied: Date; // Date when the application was submitted
}

const JobApplicationSchema = new Schema<JobApplication>({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Job', // Assuming you have a Job model
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Assuming you have a User model
  },
  status: {
    type: String,
    enum: ['Pending', 'Interview_Scheduled', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
  dateApplied: {
    type: Date,
    default: Date.now,
  }

});

// Creating the Model from the Schema
const JobApplicationModel = mongoose.model<JobApplication>('JobApplication', JobApplicationSchema);

export default JobApplicationModel;
