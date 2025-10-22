'use client';

import { useEffect, useCallback, useRef } from 'react';
import { 
  getSocket, 
  joinOrganization, 
  leaveOrganization,
  onPatientCalled,
  onDemandStatusUpdate,
  PatientCallData,
  DemandStatusUpdateData,
} from '@/lib/socket-client';

interface UseWebSocketOptions {
  organizationId: string;
  onPatientCalled?: (data: PatientCallData) => void;
  onDemandStatusUpdate?: (data: DemandStatusUpdateData) => void;
  enabled?: boolean;
}

export function useWebSocket({
  organizationId,
  onPatientCalled: onPatientCalledCallback,
  onDemandStatusUpdate: onDemandStatusUpdateCallback,
  enabled = true,
}: UseWebSocketOptions) {
  const isConnectedRef = useRef(false);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

  // Conectar e entrar na organização
  useEffect(() => {
    if (!enabled || !organizationId) return;

    const socket = getSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      console.log('WebSocket conectado');
      isConnectedRef.current = true;
      joinOrganization(organizationId);
    };

    const handleDisconnect = () => {
      console.log('WebSocket desconectado');
      isConnectedRef.current = false;
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Se já está conectado
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      leaveOrganization(organizationId);
    };
  }, [organizationId, enabled]);

  // Listener para chamadas de paciente
  useEffect(() => {
    if (!enabled || !onPatientCalledCallback) return;

    const cleanup = onPatientCalled(onPatientCalledCallback);
    return cleanup;
  }, [enabled, onPatientCalledCallback]);

  // Listener para atualização de status
  useEffect(() => {
    if (!enabled || !onDemandStatusUpdateCallback) return;

    const cleanup = onDemandStatusUpdate(onDemandStatusUpdateCallback);
    return cleanup;
  }, [enabled, onDemandStatusUpdateCallback]);

  const isConnected = useCallback(() => {
    return isConnectedRef.current;
  }, []);

  return {
    isConnected,
    socket: socketRef.current,
  };
}
