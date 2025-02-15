import mongoose, { Schema, Document } from 'mongoose';

// Define the Recruiter interface
export interface Recruiter extends Document {
  _id: mongoose.Types.ObjectId; // explicitly set the _id type to ObjectId
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;
  currentLocation: string;
  profilePicture: string;
  professionalDetails: {
    currentCompany: string;
    currentDesignation: string;
    employmentPeriod: {
      from: string;
      to: string | null;
    };
    companyAddress: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };
  accountStatus: 'pending' | 'active' | 'suspended';
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecruiterSchema: Schema<Recruiter> = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters long'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      minlength: [10, 'Mobile number must be at least 10 characters long'],
    },
    currentLocation: {
      type: String,
      required: [true, 'Current location is required'],
      trim: true,
    },
    profilePicture: {
      type: String,
      required: [true, 'Profile picture is required'],
    },
    professionalDetails: {
      currentCompany: {
        type: String,
        required: [true, 'Current company name is required'],
        trim: true,
      },
      currentDesignation: {
        type: String,
        required: [true, 'Current designation is required'],
        trim: true,
      },
      employmentPeriod: {
        from: {
          type: String,
          required: [true, 'Employment start date is required'],
        },
        to: {
          type: String,
          default: null, // null indicates 'present'
        },
      },
      companyAddress: {
        addressLine1: {
          type: String,
          required: [true, 'Address line 1 is required'],
          trim: true,
        },
        addressLine2: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          required: [true, 'City is required'],
          trim: true,
        },
        state: {
          type: String,
          required: [true, 'State is required'],
          trim: true,
        },
        country: {
          type: String,
          required: [true, 'Country is required'],
          trim: true,
        },
        zipCode: {
          type: String,
          required: [true, 'Zip code is required'],
          trim: true,
        },
      },
    },
    accountStatus: {
      type: String,
      enum: ['pending', 'active', 'suspended'],
      default: 'pending',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Export the model
const RecruiterModel = mongoose.model<Recruiter>('Recruiter', RecruiterSchema);

export default RecruiterModel;
