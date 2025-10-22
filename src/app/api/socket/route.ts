import { NextResponse } from 'next/server';
import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';

let io: SocketIOServer | null = null;

export function GET(req: NextApiRequest) {
  if (!io) {
    try {
      // Inicializar Socket.IO
      const httpServer: any = (req as any).socket?.server;
      
      if (!httpServer) {
        return NextResponse.json(
          { error: 'HTTP Server not available' },
          { status: 500 }
        );
      }

      if (!httpServer.io) {
        io = new SocketIOServer(httpServer, {
          path: '/api/socket',
          addTrailingSlash: false,
          cors: {
            origin: process.env.NEXT_PUBLIC_APP_URL || '*',
            methods: ['GET', 'POST'],
            credentials: true,
          },
        });

        io.on('connection', (socket) => {
          console.log('Client connected:', socket.id);

          socket.on('join-organization', (organizationId: string) => {
            socket.join(`org-${organizationId}`);
            console.log(`Socket ${socket.id} joined organization ${organizationId}`);
          });

          socket.on('leave-organization', (organizationId: string) => {
            socket.leave(`org-${organizationId}`);
            console.log(`Socket ${socket.id} left organization ${organizationId}`);
          });

          socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
          });
        });

        httpServer.io = io;
      } else {
        io = httpServer.io;
      }

      return NextResponse.json({ success: true, message: 'Socket.IO initialized' });
    } catch (error) {
      console.error('Error initializing Socket.IO:', error);
      return NextResponse.json(
        { error: 'Failed to initialize Socket.IO' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true, message: 'Socket.IO already initialized' });
}
