import mongoose, { Schema, Document } from 'mongoose';

interface ISubscription extends Document {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: { id: string; name: string }[];
  userType: 'job_seeker' | 'recruiter';
}

const SubscriptionSchema = new Schema<ISubscription>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  interval: { type: String, enum: ['monthly', 'yearly'], required: true },
  features: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
  userType: { type: String, enum: ['job_seeker', 'recruiter'], required: true },
});

const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;
