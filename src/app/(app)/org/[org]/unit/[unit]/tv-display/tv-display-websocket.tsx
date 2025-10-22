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

  // Remove padding/margin do body e html
  useEffect(() => {
    const originalBodyStyle = {
      margin: document.body.style.margin,
      padding: document.body.style.padding,
      overflow: document.body.style.overflow,
    };
    const originalHtmlStyle = {
      margin: document.documentElement.style.margin,
      padding: document.documentElement.style.padding,
      overflow: document.documentElement.style.overflow,
    };

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.margin = originalBodyStyle.margin;
      document.body.style.padding = originalBodyStyle.padding;
      document.body.style.overflow = originalBodyStyle.overflow;
      document.documentElement.style.margin = originalHtmlStyle.margin;
      document.documentElement.style.padding = originalHtmlStyle.padding;
      document.documentElement.style.overflow = originalHtmlStyle.overflow;
    };
  }, []);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!organizationSlug || !unitSlug) return;
    const socket = getSocket();
    const handleConnect = () => {
      console.log('✅ WebSocket conectado');
      setIsConnected(true);
      joinUnit(organizationSlug, unitSlug);
    };
    const handleDisconnect = () => {
      console.log('❌ WebSocket desconectado');
      setIsConnected(false);
    };
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    if (socket.connected) handleConnect();
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      leaveUnit(organizationSlug, unitSlug);
    };
  }, [organizationSlug, unitSlug]);

  useEffect(() => {
    const cleanup = onPatientCalled((data: PatientCallData) => {
      console.log('🔔 Paciente chamado:', data);
      const newPatient: CalledPatient = { ...data, displayedAt: new Date() };
      setCalledPatients(prev => [newPatient, ...prev].slice(0, 10));
      setCurrentPatient(newPatient);
      setTimeout(() => setCurrentPatient(prev => prev?.demandId === newPatient.demandId ? null : prev), 15000);
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

  const formatTime = (date: Date) => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date);
  const formatDate = (date: Date) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
  
  const getPriorityColor = (priority: string) => {
    const colors = { URGENT: 'text-red-500', HIGH: 'text-orange-500', MEDIUM: 'text-yellow-500', LOW: 'text-blue-500' };
    return colors[priority as keyof typeof colors] || 'text-gray-500';
  };
  
  const getPriorityLabel = (priority: string) => {
    const labels = { URGENT: 'URGENTE', HIGH: 'ALTA', MEDIUM: 'MÉDIA', LOW: 'BAIXA' };
    return labels[priority as keyof typeof labels] || priority;
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col z-50">
      {/* Header Fixo */}
      <div className="flex-none px-12 py-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2 h-16 bg-blue-500 rounded-full"></div>
            <div>
              <h1 className="text-3xl font-bold text-white">Sistema de Chamadas</h1>
              <p className="text-blue-300 text-sm">Recepção • Tempo Real</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-white/70 text-lg mb-1">{currentTime ? formatDate(currentTime) : '--'}</div>
            <div className="text-white text-5xl font-bold font-mono tracking-wider">{currentTime ? formatTime(currentTime) : '--:--:--'}</div>
          </div>
          <div className="flex items-center gap-3 bg-black/30 px-6 py-3 rounded-full">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
            <span className="text-white/90 text-lg font-medium">{isConnected ? 'Conectado' : 'Desconectado'}</span>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-12 py-8">
        <div className="max-w-[1896px] mx-auto space-y-8">
          {currentPatient ? (
            <div className="animate-pulse-slow">
              <div className="bg-gradient-to-br from-yellow-400/95 to-orange-400/95 rounded-2xl shadow-2xl p-12">
                <div className="flex items-center justify-center gap-8 mb-6">
                  <div className="text-8xl animate-bounce">🔔</div>
                  <h2 className="text-6xl font-black text-gray-900 uppercase tracking-tight">Paciente Chamado</h2>
                </div>
                <div className="text-center space-y-4">
                  <div className="text-8xl font-black text-gray-900 leading-tight break-words">{currentPatient.patientName}</div>
                  <div className="flex items-center justify-center gap-6 text-4xl text-gray-800">
                    <div className="flex items-center gap-3 bg-white/40 px-6 py-3 rounded-xl">
                      <span>👨‍⚕️</span>
                      <span className="font-semibold">{currentPatient.memberName}</span>
                    </div>
                    {currentPatient.jobTitle && (
                      <div className="bg-white/30 px-6 py-3 rounded-xl font-medium">{currentPatient.jobTitle}</div>
                    )}
                  </div>
                  <div className={`text-3xl font-bold uppercase ${getPriorityColor(currentPatient.priority)} bg-white/40 inline-block px-8 py-3 rounded-xl`}>
                    {getPriorityLabel(currentPatient.priority)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-8xl mb-6 opacity-30">⏳</div>
                <h2 className="text-4xl font-bold text-white/60">Aguardando Próxima Chamada</h2>
              </div>
            </div>
          )}

          {calledPatients.length > 0 && (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 px-8 py-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">📋 Histórico de Chamadas</h3>
              </div>
              <div className="divide-y divide-white/10">
                {calledPatients.slice(0, 5).map((patient, index) => (
                  <div key={`${patient.demandId}-${patient.calledAt}`}
                    className={`px-8 py-4 transition-all ${index === 0 && currentPatient?.demandId === patient.demandId ? 'bg-yellow-500/20' : 'hover:bg-white/5'}`}>
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-2xl font-bold text-white truncate">{patient.patientName}</div>
                        <div className="flex items-center gap-4 text-base text-white/60 mt-1">
                          <span className="flex items-center gap-2">👨‍⚕️ {patient.memberName}</span>
                          {patient.jobTitle && <span className="text-white/40">• {patient.jobTitle}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className={`text-lg font-bold px-4 py-2 rounded-lg bg-black/30 ${getPriorityColor(patient.priority)}`}>
                          {getPriorityLabel(patient.priority)}
                        </div>
                        <div className="text-xl font-mono text-white font-semibold">{formatTime(new Date(patient.calledAt))}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
