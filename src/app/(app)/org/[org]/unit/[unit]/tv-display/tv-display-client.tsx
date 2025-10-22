'use client'

import { useEffect, useState } from 'react'
import { getRecentCalls, type RecentCall } from '@/http/get-recent-calls'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatTime } from '@/utils/date-utils'
import { Bell, Clock, User } from 'lucide-react'

interface TVDisplayClientProps {
  organizationSlug: string
  unitSlug: string
}

export function TVDisplayClient({ organizationSlug, unitSlug }: TVDisplayClientProps) {
  const [calls, setCalls] = useState<RecentCall[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)

  // Atualizar hora atual a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Buscar chamadas recentes a cada 3 segundos
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const result = await getRecentCalls({
          organizationSlug,
          unitSlug,
          minutes: 5, // Mostrar chamadas dos últimos 5 minutos
        })
        setCalls(result.calls)
        setIsLoading(false)
      } catch (error) {
        console.error('Erro ao buscar chamadas:', error)
        setIsLoading(false)
      }
    }

    fetchCalls()
    const interval = setInterval(fetchCalls, 3000) // Atualiza a cada 3 segundos

    return () => clearInterval(interval)
  }, [organizationSlug, unitSlug])

  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatCurrentDate = () => {
    return currentTime.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-2xl">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-2xl">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Chamada de Pacientes</h1>
                <p className="text-blue-100 text-sm">Fique atento ao seu nome</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-white tabular-nums">
                {formatCurrentTime()}
              </div>
              <div className="text-blue-100 text-sm capitalize">
                {formatCurrentDate()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-8 py-12">
        {calls.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-12 mb-8">
              <User className="h-24 w-24 text-white/40" />
            </div>
            <p className="text-white/60 text-3xl font-medium text-center">
              Nenhum paciente sendo chamado no momento
            </p>
            <p className="text-white/40 text-xl mt-4">
              Aguarde sua vez
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {calls.map((call, index) => (
              <div
                key={call.demandId}
                className={`
                  bg-white rounded-3xl shadow-2xl overflow-hidden
                  transform transition-all duration-500
                  ${index === 0 ? 'scale-105 ring-4 ring-green-400 animate-pulse-slow' : ''}
                `}
                style={{
                  animation: index === 0 ? 'slideIn 0.5s ease-out, pulse 2s ease-in-out infinite' : 'slideIn 0.5s ease-out',
                }}
              >
                <div className={`
                  p-8
                  ${index === 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}
                `}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <Avatar className={`h-24 w-24 border-4 ${index === 0 ? 'border-white' : 'border-white/50'}`}>
                        {call.patientAvatar && (
                          <AvatarImage src={call.patientAvatar} />
                        )}
                        <AvatarFallback className="bg-white text-4xl font-bold text-blue-600">
                          {call.patientName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        {index === 0 && (
                          <div className="bg-white/20 px-4 py-1 rounded-full inline-block mb-2">
                            <span className="text-white text-sm font-semibold flex items-center gap-2">
                              <Bell className="h-4 w-4 animate-bounce" />
                              CHAMANDO AGORA
                            </span>
                          </div>
                        )}
                        <h2 className="text-4xl font-bold text-white mb-2">
                          {call.patientName}
                        </h2>
                        {call.professionalName && (
                          <p className="text-white/90 text-xl flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Atendimento com: {call.professionalName}
                          </p>
                        )}
                      </div>
                    </div>
                    {call.scheduledTime && (
                      <div className="text-right">
                        <div className="bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-sm">
                          <div className="flex items-center gap-2 text-white/90 text-sm mb-1">
                            <Clock className="h-4 w-4" />
                            Horário
                          </div>
                          <div className="text-3xl font-bold text-white tabular-nums">
                            {formatTime(call.scheduledTime)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {index === 0 && (
                  <div className="bg-yellow-50 px-8 py-4 border-t-4 border-yellow-400">
                    <p className="text-yellow-900 text-xl font-semibold text-center">
                      🔔 Por favor, dirija-se ao consultório
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer com instruções */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm border-t border-white/10">
        <div className="container mx-auto px-8 py-4">
          <p className="text-white/60 text-center text-lg">
            💡 Fique atento à tela • Quando seu nome aparecer, dirija-se ao consultório
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(74, 222, 128, 0);
          }
        }
      `}</style>
    </div>
  )
}
