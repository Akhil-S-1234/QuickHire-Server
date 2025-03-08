import mongoose, { Schema, Document } from "mongoose";

export enum NotificationType {
  SYSTEM = "system",
  JOB = "job",
  APPLICATION = "application",
  MESSAGE = "message",
}

export interface INotification {
  title: string;
  message: string;
  type: NotificationType;
  targetGroup: "job_seeker" | "recruiter" | "all";
  targetUserIds: string[];
  sendToAll: boolean;
  // createdBy?: string;
  read: Record<string, boolean>;
}

export interface NotificationDocument extends INotification, Document {
  markAsRead(userId: string): Promise<void>;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    targetGroup: { type: String, enum: ["jobSeeker", "recruiter", "all"], required: true },
    targetUserIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    sendToAll: { type: Boolean, default: false },
    // createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    read: { type: Map, of: Boolean, default: () => new Map() },
  },
  { timestamps: true }
);

NotificationSchema.methods.markAsRead = async function(userId: string) {
  this.read.set(userId, true);
  await this.save();
};

const NotificationModel = mongoose.model<NotificationDocument>("Notification", NotificationSchema);

export default NotificationModel;