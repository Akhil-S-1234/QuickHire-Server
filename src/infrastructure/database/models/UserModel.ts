// import mongoose, {Schema, Document } from 'mongoose'

// interface UserDocument extends Document {

//     firstName: string
//     lastName: string
//     phoneNumber: string
//     email: string
//     password: string
//     createdAt: Date

// }

// const UserSchema: Schema = new Schema({

//     firstName : {
//         type: String,
//         required: true
//     },
//     lastName : {
//         type: String,
//         required: true
//     },
//     phoneNumber : {
//         type: String,
//         required: true
//     },
//     email : {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password : {
//         type: String,
//         required: true
//     },
//     createdAt : {
//         type: Date,
//         default: Date.now
//     }

// })

// const UserModel = mongoose.model<UserDocument>('User',UserSchema)
// export default UserModel

import mongoose, { Schema, Document } from 'mongoose';

interface UserDocument extends Document {
    firstName: string;
    lastName?: string;
    phoneNumber?: string;
    email: string;
    password?: string;
    profilePicture?: string;
    isFresher: boolean;
    resume?: string;  
    skills?: string[]; 
    experience?: Array<{
        jobTitle: string;
        companyName: string;
        startDate: Date;
        endDate?: Date;
        description?: string;
    }>;
    education?: Array<{
        institution: string;
        degree: string;
        fieldOfStudy?: string;
        startDate: Date;
        endDate?: Date;
    }>;
    city?: string;
    state?: string;
    createdAt: Date;
    updatedAt?: Date;
    isBlocked: Boolean;

}

const UserSchema: Schema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    profilePicture: {
        type: String,
        default: 'https://i.pinimg.com/564x/47/09/80/470980b112a44064cd88290ac0edf6a6.jpg'
    },
    isFresher: {
        type: Boolean,
        required: true,
        default: true 
    },
    resume: {
        type: String
    },
    skills: {
        type: [String]
    },
    experience: [{
        jobTitle: { type: String, required: true },
        companyName: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        description: { type: String }
    }],
    education: [{
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date }
    }],
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    isBlocked: {
        type: Boolean,
        default: false
      }
});

// Middleware to update `updatedAt` field on save
UserSchema.pre<UserDocument>('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const UserModel = mongoose.model<UserDocument>('User', UserSchema);
export default UserModel;
