'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { 
  getSocket, 
  joinOrganization, 
  leaveOrganization, 
  onPatientCalled,
  PatientCallData 
} from '@/lib/socket-client';

interface CalledPatient extends PatientCallData {
  displayedAt: Date;
}

export default function TVDisplayPage() {
  const params = useParams();
  const organizationSlug = params.slug as string;
  const [organizationId, setOrganizationId] = useState<string>('');
  const [organizationName, setOrganizationName] = useState<string>('');
  const [calledPatients, setCalledPatients] = useState<CalledPatient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<CalledPatient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Buscar dados da organização
  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        // Aqui você pode fazer uma chamada à API para buscar os dados da organização
        // Por enquanto, vamos usar o slug como ID
        setOrganizationId(organizationSlug);
        setOrganizationName(organizationSlug);
      } catch (error) {
        console.error('Erro ao buscar organização:', error);
      }
    };

    if (organizationSlug) {
      fetchOrganizationData();
    }
  }, [organizationSlug]);

  // Conectar ao WebSocket e entrar na sala da organização
  useEffect(() => {
    if (!organizationId) return;

    const socket = getSocket();

    // Handlers de conexão
    const handleConnect = () => {
      console.log('WebSocket conectado');
      setIsConnected(true);
      joinOrganization(organizationId);
    };

    const handleDisconnect = () => {
      console.log('WebSocket desconectado');
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Se já está conectado, entra na sala
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      leaveOrganization(organizationId);
    };
  }, [organizationId]);

  // Listener para chamadas de pacientes
  useEffect(() => {
    const cleanup = onPatientCalled((data: PatientCallData) => {
      console.log('Paciente chamado:', data);
      
      const newPatient: CalledPatient = {
        ...data,
        displayedAt: new Date(),
      };

      // Adiciona o paciente à lista
      setCalledPatients(prev => [newPatient, ...prev].slice(0, 10)); // Mantém últimos 10
      
      // Define como paciente atual
      setCurrentPatient(newPatient);

      // Remove destaque após 15 segundos
      setTimeout(() => {
        setCurrentPatient(prev => 
          prev?.id === newPatient.id ? null : prev
        );
      }, 15000);

      // Toca som de chamada (opcional)
      playCallSound();
    });

    return cleanup;
  }, []);

  const playCallSound = useCallback(() => {
    try {
      const audio = new Audio('/sounds/call-notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.error('Erro ao tocar som:', err));
    } catch (error) {
      console.error('Erro ao criar áudio:', error);
    }
  }, []);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  if (!organizationId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold">Carregando Organização...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-white mb-2">
          {organizationName || 'Sistema de Chamadas'}
        </h1>
        <div className="flex items-center justify-center gap-4 text-white/90">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
            <span className="text-lg">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          <span className="text-lg">•</span>
          <span className="text-lg">{formatTime(new Date())}</span>
        </div>
      </div>

      {/* Paciente Atual Sendo Chamado */}
      {currentPatient && (
        <div className="mb-8 animate-pulse-slow">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border-8 border-yellow-400">
            <div className="text-center">
              <div className="text-6xl mb-6">🔔</div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                CHAMANDO PACIENTE
              </h2>
              <div className="text-7xl font-bold text-blue-600 mb-6 break-words">
                {currentPatient.name}
              </div>
              {currentPatient.room && (
                <div className="text-4xl text-gray-600">
                  <span className="font-semibold">Sala:</span> {currentPatient.room}
                </div>
              )}
              {currentPatient.doctorName && (
                <div className="text-3xl text-gray-500 mt-4">
                  Dr(a). {currentPatient.doctorName}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lista de Últimas Chamadas */}
      {calledPatients.length > 0 && (
        <div className="bg-white/95 rounded-3xl shadow-xl p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            📋 Últimas Chamadas
          </h3>
          <div className="space-y-4">
            {calledPatients.map((patient, index) => (
              <div
                key={`${patient.id}-${patient.timestamp}`}
                className={`
                  flex items-center justify-between p-6 rounded-xl transition-all
                  ${index === 0 && currentPatient?.id === patient.id
                    ? 'bg-yellow-100 border-2 border-yellow-400'
                    : 'bg-gray-50 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-semibold text-gray-800">
                      {patient.name}
                    </div>
                    {patient.room && (
                      <div className="text-lg text-gray-600">
                        Sala: {patient.room}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right text-gray-500">
                  <div className="text-lg">
                    {formatTime(new Date(patient.timestamp))}
                  </div>
                  {patient.doctorName && (
                    <div className="text-sm">
                      Dr(a). {patient.doctorName}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensagem quando não há chamadas */}
      {calledPatients.length === 0 && (
        <div className="text-center text-white">
          <div className="text-8xl mb-6">⏳</div>
          <h2 className="text-4xl font-bold mb-4">
            Aguardando Chamadas
          </h2>
          <p className="text-2xl opacity-90">
            Os pacientes chamados aparecerão aqui automaticamente
          </p>
        </div>
      )}

      {/* Rodapé com informações */}
      <div className="fixed bottom-4 left-4 right-4 text-center text-white/70 text-sm">
        <p>Sistema de Chamada de Pacientes - Equipe Ativa</p>
      </div>
    </div>
  );
}
