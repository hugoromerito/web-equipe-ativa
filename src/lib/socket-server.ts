import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export function initializeSocket(server: HTTPServer) {
  if (io) {
    return io;
  }

  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/api/socket',
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Cliente se junta a uma sala específica da organização
    socket.on('join-organization', (organizationId: string) => {
      socket.join(`org-${organizationId}`);
      console.log(`Socket ${socket.id} joined organization ${organizationId}`);
    });

    // Cliente sai da sala da organização
    socket.on('leave-organization', (organizationId: string) => {
      socket.leave(`org-${organizationId}`);
      console.log(`Socket ${socket.id} left organization ${organizationId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

export function getSocketIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeSocket first.');
  }
  return io;
}

// Função para emitir evento de chamada de paciente
export function emitPatientCall(organizationId: string, patientData: {
  id: string;
  name: string;
  demandId: string;
  doctorName?: string;
  room?: string;
  timestamp: string;
}) {
  if (io) {
    io.to(`org-${organizationId}`).emit('patient-called', patientData);
    console.log(`Patient called emitted to org-${organizationId}:`, patientData);
  }
}

// Função para emitir atualização de status de demanda
export function emitDemandStatusUpdate(organizationId: string, demandData: {
  id: string;
  status: string;
  patientName?: string;
  timestamp: string;
}) {
  if (io) {
    io.to(`org-${organizationId}`).emit('demand-status-updated', demandData);
    console.log(`Demand status updated emitted to org-${organizationId}:`, demandData);
  }
}
