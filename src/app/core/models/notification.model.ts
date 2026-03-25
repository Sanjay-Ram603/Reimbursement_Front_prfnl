

export interface Notification {
  notificationId: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}