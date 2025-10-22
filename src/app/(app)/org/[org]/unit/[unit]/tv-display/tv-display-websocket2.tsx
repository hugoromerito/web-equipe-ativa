'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  getSocket, 
  joinUnit, 
  leaveUnit, 
  onPatientCalled,
  PatientCallData 
} from '@/lib/socket-client';

interface TVDisplayWithWebSocketProps {
  organizationSlug: string;
  unitSlug: string;
}

interface CalledPatient extends PatientCallData {
  displayedAt: Date;
}

export function TVDisplayWithWebSocket({ organizationSlug, unitSlug }: TVDisplayWithWebSocketProps) {
  const [calledPatients, setCalledPatients] = useState<CalledPatient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<CalledPatient | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Atualiza o relógio a cada segundo (apenas no cliente)
  useEffect(() => {
    // Define tempo inicial no cliente
    setCurrentTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Conectar ao WebSocket e entrar na sala da unidade
  useEffect(() => {
    if (!organizationSlug || !unitSlug) return;

    const socket = getSocket();

    // Handlers de conexão
    const handleConnect = () => {
      console.log('✅ WebSocket conectado');
      setIsConnected(true);
      // Entrar na sala da unidade (formato do seu backend)
      joinUnit(organizationSlug, unitSlug);
    };

    const handleDisconnect = () => {
      console.log('❌ WebSocket desconectado');
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
      leaveUnit(organizationSlug, unitSlug);
    };
  }, [organizationSlug, unitSlug]);

  // Listener para chamadas de pacientes
  useEffect(() => {
    const cleanup = onPatientCalled((data: PatientCallData) => {
      console.log('🔔 Paciente chamado:', data);
      
      const newPatient: CalledPatient = {
        ...data,
        displayedAt: new Date(),
      };

      // Adiciona o paciente à lista (mantém últimos 10)
      setCalledPatients(prev => [newPatient, ...prev].slice(0, 10));
      
      // Define como paciente atual
      setCurrentPatient(newPatient);

      // Remove destaque após 15 segundos
      setTimeout(() => {
        setCurrentPatient(prev => 
          prev?.demandId === newPatient.demandId ? null : prev
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      URGENT: 'text-red-600',
      HIGH: 'text-orange-500',
      MEDIUM: 'text-yellow-500',
      LOW: 'text-blue-500',
    };
    return colors[priority as keyof typeof colors] || 'text-gray-500';
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      URGENT: 'URGENTE',
      HIGH: 'ALTA',
      MEDIUM: 'MÉDIA',
      LOW: 'BAIXA',
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Header Fixo - Sem Scroll */}
      <div className="flex-none px-12 py-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between">
          {/* Logo/Título à Esquerda */}
          <div className="flex items-center gap-4">
            <div className="w-2 h-16 bg-blue-500 rounded-full"></div>
            <div>
              <h1 className="text-3xl font-bold text-white">Sistema de Chamadas</h1>
              <p className="text-blue-300 text-sm">Recepção • Tempo Real</p>
            </div>
          </div>
          
          {/* Relógio ao Centro */}
          <div className="text-center">
            <div className="text-white/70 text-lg mb-1">
              {currentTime ? formatDate(currentTime) : '--'}
            </div>
            <div className="text-white text-5xl font-bold font-mono tracking-wider">
              {currentTime ? formatTime(currentTime) : '--:--:--'}
            </div>
          </div>
          
          {/* Status à Direita */}
          <div className="flex items-center gap-3 bg-black/30 px-6 py-3 rounded-full">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
            <span className="text-white/90 text-lg font-medium">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>
      </div>

      {/* Paciente Atual Sendo Chamado */}
      {currentPatient && (
        <div className="mb-8 animate-pulse-slow">
          <div className="bg-white rounded-3xl shadow-2xl p-16 border-8 border-yellow-400">
            <div className="text-center">
              <div className="text-8xl mb-8 animate-bounce">🔔</div>
              <h2 className="text-5xl font-bold text-gray-800 mb-6">
                CHAMANDO PACIENTE
              </h2>
              <div className="text-9xl font-bold text-blue-600 mb-8 break-words leading-tight">
                {currentPatient.patientName}
              </div>
              <div className="text-5xl text-gray-700 font-semibold mb-4">
                �‍⚕️ {currentPatient.memberName}
              </div>
              {currentPatient.jobTitle && (
                <div className="text-4xl text-gray-500 mb-6">
                  {currentPatient.jobTitle}
                </div>
              )}
              <div className={`text-4xl font-bold ${getPriorityColor(currentPatient.priority)}`}>
                Prioridade: {getPriorityLabel(currentPatient.priority)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Últimas Chamadas */}
      {calledPatients.length > 0 && (
        <div className="bg-white/95 rounded-3xl shadow-xl p-8">
          <h3 className="text-4xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-3">
            📋 Últimas Chamadas
          </h3>
          <div className="space-y-4">
            {calledPatients.map((patient, index) => (
              <div
                key={`${patient.demandId}-${patient.calledAt}`}
                className={`
                  flex items-center justify-between p-6 rounded-xl transition-all
                  ${index === 0 && currentPatient?.demandId === patient.demandId
                    ? 'bg-yellow-100 border-4 border-yellow-400 scale-105'
                    : 'bg-gray-50 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-3xl font-semibold text-gray-800">
                      {patient.patientName}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="text-xl text-gray-600">
                        �‍⚕️ {patient.memberName}
                      </div>
                      {patient.jobTitle && (
                        <div className="text-xl text-gray-500">
                          {patient.jobTitle}
                        </div>
                      )}
                      <div className={`text-lg font-semibold ${getPriorityColor(patient.priority)}`}>
                        {getPriorityLabel(patient.priority)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right text-gray-500">
                  <div className="text-2xl font-mono">
                    {formatTime(new Date(patient.calledAt))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensagem quando não há chamadas */}
      {calledPatients.length === 0 && (
        <div className="text-center text-white">
          <div className="text-9xl mb-8 opacity-50">⏳</div>
          <h2 className="text-5xl font-bold mb-6">
            Aguardando Chamadas
          </h2>
          <p className="text-3xl opacity-90">
            Os pacientes chamados aparecerão aqui automaticamente
          </p>
          <p className="text-2xl opacity-75 mt-4">
            Sistema em tempo real via WebSocket
          </p>
        </div>
      )}

      {/* Rodapé */}
      <div className="fixed bottom-6 left-6 right-6 text-center text-white/70 text-lg">
        <p>Sistema de Chamada de Pacientes - Equipe Ativa • WebSocket</p>
      </div>
    </div>
  );
}
