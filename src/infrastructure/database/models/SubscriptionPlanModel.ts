import mongoose, { Schema, Document } from "mongoose";

interface IFeature {
  featureId: string;
  name: string;
  value: any; // Allows boolean, number, or string values
}

interface ISubscriptionPlan extends Document {
  name: string;
  price: number;
  interval: number; // Stores duration in months (e.g., 1 for monthly, 12 for yearly)
  features: IFeature[];
  userType: "job_seeker" | "recruiter";
  razorpayPlanId: string;
  isActive: boolean;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    interval: { type: Number, required: true, min: 1 }, // Number of months (1 = monthly, 12 = yearly, etc.)
    features: [
      {
        featureId: { type: String, required: true },
        name: { type: String, required: true },
        value: { type: Schema.Types.Mixed, required: true }, // Can hold any type of value
      },
    ],
    userType: { type: String, enum: ["job_seeker", "recruiter"], required: true },
    razorpayPlanId: { type: String, required: true },
    isActive: { type: Boolean, default: true }, // Allows deactivating plans instead of hard delete
  },
  { timestamps: true }
);

const SubscriptionPlan = mongoose.model<ISubscriptionPlan>("SubscriptionPlan", SubscriptionPlanSchema);

export default SubscriptionPlan;
