'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

// Interface para o evento patient-called do seu backend
export interface PatientCallData {
  demandId: string;
  patientName: string;
  memberName: string;
  jobTitle: string | null;
  status: 'IN_PROGRESS';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  calledAt: Date;
  unitId: string;
  unitSlug: string;
  organizationId: string;
}

export interface DemandStatusUpdateData {
  id: string;
  status: string;
  patientName?: string;
  timestamp: string;
}

export function getSocket(): Socket {
  if (!socket) {
    // Usa a URL do backend WebSocket (porta 3333 por padrão)
    const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3333';
    
    socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('⚠️ Socket connection error:', error);
    });
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Função para entrar na sala da unidade (seu backend usa join-unit)
export function joinUnit(organizationSlug: string, unitSlug: string) {
  const socket = getSocket();
  socket.emit('join-unit', {
    organizationSlug,
    unitSlug,
  });
  console.log(`📡 Joining unit: ${organizationSlug}/${unitSlug}`);
}

// Função para sair da sala da unidade
export function leaveUnit(organizationSlug: string, unitSlug: string) {
  const socket = getSocket();
  socket.emit('leave-unit', {
    organizationSlug,
    unitSlug,
  });
  console.log(`📡 Leaving unit: ${organizationSlug}/${unitSlug}`);
}

// MANTIDO PARA COMPATIBILIDADE (se necessário em outro contexto)
export function joinOrganization(organizationId: string) {
  const socket = getSocket();
  socket.emit('join-organization', organizationId);
}

export function leaveOrganization(organizationId: string) {
  const socket = getSocket();
  socket.emit('leave-organization', organizationId);
}

// Listener para chamadas de paciente (evento do seu backend)
export function onPatientCalled(callback: (data: PatientCallData) => void) {
  const socket = getSocket();
  socket.on('patient-called', callback);
  
  return () => {
    socket.off('patient-called', callback);
  };
}

// Listener para atualização de status de demanda
export function onDemandStatusUpdate(callback: (data: DemandStatusUpdateData) => void) {
  const socket = getSocket();
  socket.on('demand-status-updated', callback);
  
  return () => {
    socket.off('demand-status-updated', callback);
  };
}
