import mongoose from 'mongoose';

export interface ReportedJob {
  jobId: string;
  reportType: 'Spam' | 'Inappropriate' | 'Misleading' | 'Other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  userId: string;
  createdAt: Date;
}

const ReportedJobSchema = new mongoose.Schema<ReportedJob>({
  jobId: { type: String, required: true },
  reportType: { 
    type: String, 
    enum: ['Spam', 'Inappropriate', 'Misleading', 'Other'], 
    required: true 
  },
  description: { type: String },
  status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const ReportedJobModel = mongoose.model<ReportedJob>('ReportedJob', ReportedJobSchema);