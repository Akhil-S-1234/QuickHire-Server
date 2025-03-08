// src/infrastructure/services/socketService.ts
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
// import { UserRole } from '../../domain/entities/User';

interface UserSocket {
  userId: string;
  role: string;
  socketId: string;
}

export class SocketService {
  private io: Server;
  private connectedUsers: UserSocket[] = [];

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.FRONTEND_URL 
          : 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`New client connected: ${socket.id}`);

      // Authenticate user and store connection
      socket.on('authenticate', ({ userId, role }: { userId: string; role: string }) => {
        this.registerUser(socket.id, userId, role);
        console.log(`User authenticated: ${userId} as ${role}`);

        console.log(this.connectedUsers, ':)')
        
        // Join appropriate rooms based on role
        socket.join(`role:${role}`);
        socket.join(`user:${userId}`);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.removeUserBySocketId(socket.id);
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  private registerUser(socketId: string, userId: string, role: string): void {
    // Remove existing socket connection if any
    this.removeUserById(userId);
    
    // Add new connection
    this.connectedUsers.push({
      userId,
      role,
      socketId
    });
  }

  private removeUserBySocketId(socketId: string): void {
    this.connectedUsers = this.connectedUsers.filter(user => user.socketId !== socketId);
  }

  private removeUserById(userId: string): void {
    this.connectedUsers = this.connectedUsers.filter(user => user.userId !== userId);
  }

  // Send notification to specific user
  public sendNotificationToUser(userId: string, notification: any): void {
    this.io.to(`user:${userId}`).emit('notification', notification);
  }

  // Send notification to all users with specific role
  public sendNotificationByRole(role: string, notification: any): void {
    this.io.to(`role:${role}`).emit('notification', notification);
  }

  // Send notification to all users
  public broadcastNotification(notification: any): void {
    this.io.emit('notification', notification);
  }

  // Get count of online users by role
  public getOnlineCountByRole(role: string): number {
    return this.connectedUsers.filter(user => user.role === role).length;
  }
}

// Singleton instance
let socketServiceInstance: SocketService | null = null;

export const initSocketService = (httpServer: HttpServer): SocketService => {
  if (!socketServiceInstance) {
    socketServiceInstance = new SocketService(httpServer);
  }
  return socketServiceInstance;
};

export const getSocketService = (): SocketService => {
  if (!socketServiceInstance) {
    throw new Error('Socket service not initialized. Call initSocketService first.');
  }
  return socketServiceInstance;
};