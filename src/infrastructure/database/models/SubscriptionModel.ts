import mongoose, { Document, Schema } from 'mongoose';

interface IFeature {
  featureId: string;
  name: string;
  value: any;
}

interface IPaymentMethod {
  id: string;
  last4: string;
  type: string;
}

interface IRenewalAttempt {
  date: Date;
  status: "success" | "failed";
  paymentId: string;
  amount: number;
  failureReason?: string;
}

interface ISubscription extends Document {
  // User and Plan References
  userId: mongoose.Schema.Types.ObjectId;
  planId: mongoose.Schema.Types.ObjectId;

  // Plan Details (stored at subscription time)
  name: string;
  price: number;
  interval: number;
  features: IFeature[];

  // Razorpay Details
  razorpaySubscriptionId: string;
  razorpayCustomerId: string;

  // Subscription Status
  status: "active" | "cancelled" | "expired" | "past_due";
  autoRenewal: boolean;
  
  // Period Tracking
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelledAt: Date | null;
  
  // Payment Tracking
  billingAttempts: number;
  failureReason: string;
  
  // Payment Method
  paymentMethod: IPaymentMethod;
  
  // History
  renewalHistory: IRenewalAttempt[];
  
  // Metadata
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    // User and Plan References
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    planId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Subscription", 
      required: true 
    },

    // Plan Details
    name: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    interval: { 
      type: Number, 
      required: true 
    },
    features: [{
      featureId: { type: String, required: true },
      name: { type: String, required: true },
      value: { type: Schema.Types.Mixed, required: true },
    }],

    // Razorpay Details
    razorpaySubscriptionId: { 
      type: String, 
      required: true,
      unique: true 
    },
    razorpayCustomerId: { 
      type: String, 
      required: true 
    },

    // Subscription Status
    status: { 
      type: String, 
      enum: ["active", "cancelled", "expired", "past_due"], 
      default: "active" 
    },
    autoRenewal: { 
      type: Boolean, 
      default: true 
    },

    // Period Tracking
    currentPeriodStart: { 
      type: Date, 
      required: true 
    },
    currentPeriodEnd: { 
      type: Date, 
      required: true 
    },
    cancelledAt: { 
      type: Date, 
      default: null 
    },

    // Payment Tracking
    billingAttempts: { 
      type: Number, 
      default: 0 
    },
    failureReason: { 
      type: String 
    },

    // Payment Method
    paymentMethod: {
      id: { type: String },
      last4: { type: String },
      type: { type: String }
    },

    // History
    renewalHistory: [{
      date: { type: Date, required: true },
      status: { 
        type: String, 
        enum: ["success", "failed"],
        required: true 
      },
      paymentId: { type: String, required: true },
      amount: { type: Number, required: true },
      failureReason: { type: String }
    }],

    // Metadata
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {}
    }
  },
  { 
    timestamps: true 
  }
);

// Indexes
SubscriptionSchema.index({ userId: 1, status: 1 });
SubscriptionSchema.index({ razorpaySubscriptionId: 1 }, { unique: true });
SubscriptionSchema.index({ razorpayCustomerId: 1 });
SubscriptionSchema.index({ currentPeriodEnd: 1, status: 1 });

const Subscription = mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export default Subscription;