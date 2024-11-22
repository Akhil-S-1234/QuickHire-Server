import mongoose, { Schema, Document } from 'mongoose';

interface Recruiter extends Document {
  name: string;
  email: string;
  phone: string;
  position: string;
  companyName: string;
  password: string;
  profilePicture: string;
  isBlocked: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecruiterSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profilePicture: {
      type: String,
      default: 'https://i.pinimg.com/564x/47/09/80/470980b112a44064cd88290ac0edf6a6.jpg'
    },
    isBlocked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,  // This adds createdAt and updatedAt fields automatically
  }
);

const RecruiterModel = mongoose.model<Recruiter>('Recruiter', RecruiterSchema);

export default RecruiterModel;
