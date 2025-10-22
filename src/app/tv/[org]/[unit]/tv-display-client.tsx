'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  getSocket, 
  joinUnit, 
  leaveUnit, 
  onPatientCalled,
  PatientCallData 
} from '@/lib/socket-client';

interface TVDisplayClientProps {
  organizationSlug: string;
  unitSlug: string;
}

interface CalledPatient extends PatientCallData {
  displayedAt: Date;
}

export function TVDisplayClient({ organizationSlug, unitSlug }: TVDisplayClientProps) {
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

    // Remove todos os estilos do body e html
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.overflow = 'hidden';
    
    // Oculta elementos do layout pai
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    const whatsappButton = document.querySelector('[class*="whatsapp"]');
    
    if (main) {
      (main as HTMLElement).style.padding = '0';
      (main as HTMLElement).style.margin = '0';
      (main as HTMLElement).style.maxWidth = 'none';
    }
    if (footer) (footer as HTMLElement).style.display = 'none';
    if (whatsappButton) (whatsappButton as HTMLElement).style.display = 'none';

    return () => {
      document.body.style.margin = originalBodyStyle.margin;
      document.body.style.padding = originalBodyStyle.padding;
      document.body.style.overflow = originalBodyStyle.overflow;
      document.documentElement.style.margin = originalHtmlStyle.margin;
      document.documentElement.style.padding = originalHtmlStyle.padding;
      document.documentElement.style.overflow = originalHtmlStyle.overflow;
      
      if (main) {
        (main as HTMLElement).style.padding = '';
        (main as HTMLElement).style.margin = '';
        (main as HTMLElement).style.maxWidth = '';
      }
      if (footer) (footer as HTMLElement).style.display = '';
      if (whatsappButton) (whatsappButton as HTMLElement).style.display = '';
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

  const playCallSound = useCallback(() => {
    try {
      const audio = new Audio('/sounds/call-notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.error('Erro ao tocar som:', err));
    } catch (error) {
      console.error('Erro ao criar áudio:', error);
    }
  }, []);

  const speakPatientName = useCallback(async (patientName: string, memberName: string) => {
    try {
      const text = `${patientName}, comparecer ao consultório do doutor ${memberName}.`;
      
      console.log('🔊 Sintetizando voz para:', patientName);

      // Chama a API do Google Cloud TTS via nossa rota Next.js
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        console.error('❌ Erro ao obter áudio do TTS');
        // Fallback para Web Speech API
        fallbackToWebSpeech(text);
        return;
      }

      const data = await response.json();

      // Converte o base64 para blob e reproduz
      const audioBlob = base64ToBlob(data.audioContent, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.volume = 1;
      
      // Reproduz após 1.5s para dar tempo do som de notificação
      setTimeout(() => {
        audio.play()
          .then(() => console.log('✅ Áudio TTS reproduzido com sucesso'))
          .catch(err => {
            console.error('❌ Erro ao reproduzir áudio TTS:', err);
            fallbackToWebSpeech(text);
          });
      }, 1500);

      // Limpa o objeto URL após reproduzir
      audio.onended = () => URL.revokeObjectURL(audioUrl);

    } catch (error) {
      console.error('❌ Erro ao sintetizar voz com Google TTS:', error);
      // Fallback para Web Speech API
      fallbackToWebSpeech(`${patientName}, comparecer ao consultório do doutor ${memberName}.`);
    }
  }, []);

  // Função auxiliar para converter base64 para blob
  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  // Fallback para Web Speech API caso Google TTS falhe
  const fallbackToWebSpeech = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        const voices = window.speechSynthesis.getVoices();
        const brazilianVoice = voices.find(voice => 
          voice.lang.includes('pt-BR') || voice.lang.includes('pt')
        );
        if (brazilianVoice) utterance.voice = brazilianVoice;
        
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 1500);
        
        console.log('🔊 Usando Web Speech API como fallback');
      }
    } catch (error) {
      console.error('❌ Erro no fallback Web Speech:', error);
    }
  };

  useEffect(() => {
    const cleanup = onPatientCalled((data: PatientCallData) => {
      console.log('🔔 Paciente chamado:', data);
      const newPatient: CalledPatient = { ...data, displayedAt: new Date() };
      setCalledPatients(prev => [newPatient, ...prev].slice(0, 10));
      setCurrentPatient(newPatient);
      setTimeout(() => setCurrentPatient(prev => prev?.demandId === newPatient.demandId ? null : prev), 15000);
      
      // Toca som e fala o nome
      playCallSound();
      speakPatientName(data.patientName, data.memberName);
    });
    return cleanup;
  }, [playCallSound, speakPatientName]);

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
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col z-50" style={{ margin: 0, padding: 0 }}>
      {/* Header Profissional - Estilo Banco */}
      <div className="flex-none px-16 py-8 bg-white shadow-lg border-b-4 border-blue-600">
        <div className="flex items-center justify-between">
          {/* Logo e Título */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Painel de Chamadas</h1>
              <p className="text-blue-600 text-lg font-medium mt-1">Aguarde ser chamado</p>
            </div>
          </div>
          
          {/* Relógio Central */}
          <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 px-12 py-4 rounded-2xl border-2 border-blue-200 shadow-md">
            <div className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-1">
              {currentTime ? formatDate(currentTime) : '--'}
            </div>
            <div className="text-blue-900 text-6xl font-bold font-mono tabular-nums">
              {currentTime ? formatTime(currentTime) : '--:--:--'}
            </div>
          </div>
          
          {/* Status de Conexão */}
          <div className="flex items-center gap-4 bg-gray-50 px-8 py-4 rounded-2xl border-2 border-gray-200 shadow-md">
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</span>
              <span className={`text-lg font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} shadow-lg ${isConnected ? 'animate-pulse' : ''}`} />
          </div>
        </div>
      </div>

      {/* Área Principal de Chamada - Estilo Banco Moderno */}
      <div className="flex-1 overflow-hidden px-16 py-12">
        <div className="h-full flex flex-col gap-8">
          
          {/* Chamada Atual - Destaque Grande */}
          {currentPatient ? (
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl shadow-2xl p-16 border-4 border-blue-400 animate-pulse-slow">
              <div className="flex items-center justify-center gap-12 mb-8">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl animate-bounce">
                  <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h2 className="text-6xl font-black text-white uppercase tracking-tight">Chamada de Paciente</h2>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border-2 border-white/20">
                <div className="text-center space-y-8">
                  {/* Nome do Paciente - Destaque Máximo */}
                  <div className="bg-white rounded-2xl px-16 py-12 shadow-2xl">
                    <div className="text-gray-500 text-2xl font-semibold uppercase tracking-widest mb-4">Paciente</div>
                    <div className="text-blue-900 text-8xl font-black leading-none break-words">
                      {currentPatient.patientName}
                    </div>
                  </div>
                  
                  {/* Informações do Atendimento */}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="bg-white/90 rounded-xl px-8 py-6 shadow-lg">
                      <div className="text-gray-600 text-lg font-medium mb-2 uppercase tracking-wide">Profissional</div>
                      <div className="text-gray-900 text-3xl font-bold flex items-center justify-center gap-3">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {currentPatient.memberName}
                      </div>
                    </div>
                    
                    {currentPatient.jobTitle && (
                      <div className="bg-white/90 rounded-xl px-8 py-6 shadow-lg">
                        <div className="text-gray-600 text-lg font-medium mb-2 uppercase tracking-wide">Consultório</div>
                        <div className="text-gray-900 text-3xl font-bold">{currentPatient.jobTitle}</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Prioridade */}
                  <div className={`inline-block px-12 py-4 rounded-full text-2xl font-bold uppercase shadow-lg
                    ${currentPatient.priority === 'URGENT' ? 'bg-red-500 text-white' : ''}
                    ${currentPatient.priority === 'HIGH' ? 'bg-orange-500 text-white' : ''}
                    ${currentPatient.priority === 'MEDIUM' ? 'bg-yellow-500 text-gray-900' : ''}
                    ${currentPatient.priority === 'LOW' ? 'bg-green-500 text-white' : ''}
                  `}>
                    {getPriorityLabel(currentPatient.priority)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl border-2 border-dashed border-gray-400 shadow-inner">
              <div className="text-center">
                <div className="text-8xl mb-6 opacity-20">
                  <svg className="w-32 h-32 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-5xl font-bold text-gray-400">Aguardando Próxima Chamada</h2>
              </div>
            </div>
          )}
          
          {/* Histórico de Chamadas - Estilo Painel de Aeroporto/Banco */}
          {calledPatients.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Últimas Chamadas
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {calledPatients.slice(0, 5).map((patient, index) => (
                  <div key={`${patient.demandId}-${patient.calledAt}`}
                    className={`px-8 py-5 transition-all ${index === 0 && currentPatient?.demandId === patient.demandId ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-6">
                      {/* Número */}
                      <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg
                        ${index === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-gray-400 to-gray-600'}
                      `}>
                        {index + 1}
                      </div>
                      
                      {/* Informações do Paciente */}
                      <div className="flex-1 min-w-0">
                        <div className="text-2xl font-bold text-gray-900 truncate">{patient.patientName}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {patient.memberName}
                          </span>
                          {patient.jobTitle && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span>{patient.jobTitle}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Prioridade e Horário */}
                      <div className="flex items-center gap-6">
                        <div className={`px-5 py-2 rounded-full text-sm font-bold uppercase shadow-sm
                          ${patient.priority === 'URGENT' ? 'bg-red-100 text-red-700 border border-red-300' : ''}
                          ${patient.priority === 'HIGH' ? 'bg-orange-100 text-orange-700 border border-orange-300' : ''}
                          ${patient.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : ''}
                          ${patient.priority === 'LOW' ? 'bg-green-100 text-green-700 border border-green-300' : ''}
                        `}>
                          {getPriorityLabel(patient.priority)}
                        </div>
                        <div className="text-2xl font-mono font-bold text-blue-600 bg-blue-50 px-6 py-2 rounded-lg border border-blue-200">
                          {formatTime(new Date(patient.calledAt))}
                        </div>
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
