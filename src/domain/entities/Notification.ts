export enum NotificationType {
    SYSTEM = "system",
    JOB = "job",
    APPLICATION = "application",
    MESSAGE = "message",
}

export interface Notification {
    id?: string;
    title: string;
    message: string;
    type: NotificationType;
    targetGroup: string;
    targetUserIds?: string[];
    sendToAll: boolean;
    createdA?: Date;
    read?: Map<string, boolean> | Record<string, boolean>;
}