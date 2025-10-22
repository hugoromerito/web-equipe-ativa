import { NextRequest, NextResponse } from 'next/server';
import { emitPatientCall } from '@/lib/socket-server';

/**
 * Endpoint de TESTE para simular chamada de paciente
 * 
 * POST /api/test/call-patient
 * 
 * Body:
 * {
 *   "organizationId": "org-123",
 *   "patientName": "João Silva",
 *   "doctorName": "Dr. Maria Santos",
 *   "room": "Consultório 1"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, patientName, doctorName, room } = body;

    // Validação básica
    if (!organizationId || !patientName) {
      return NextResponse.json(
        { error: 'organizationId e patientName são obrigatórios' },
        { status: 400 }
      );
    }

    // Emite evento de chamada de paciente
    emitPatientCall(organizationId, {
      id: `patient-${Date.now()}`,
      name: patientName,
      demandId: `demand-${Date.now()}`,
      doctorName: doctorName || 'Dr. Teste',
      room: room || 'Sala 1',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Paciente ${patientName} chamado com sucesso!`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao chamar paciente (teste):', error);
    return NextResponse.json(
      { error: 'Erro ao chamar paciente' },
      { status: 500 }
    );
  }
}

/**
 * Endpoint de TESTE para chamar múltiplos pacientes
 * 
 * POST /api/test/call-patients
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, count = 3 } = body;

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organizationId é obrigatório' },
        { status: 400 }
      );
    }

    const pacientesExemplo = [
      { name: 'João Silva', doctor: 'Dr. Maria Santos', room: 'Consultório 1' },
      { name: 'Ana Oliveira', doctor: 'Dr. Pedro Costa', room: 'Consultório 2' },
      { name: 'Carlos Souza', doctor: 'Dr. Maria Santos', room: 'Consultório 1' },
      { name: 'Beatriz Lima', doctor: 'Dr. José Almeida', room: 'Consultório 3' },
      { name: 'Ricardo Pereira', doctor: 'Dr. Pedro Costa', room: 'Consultório 2' },
    ];

    const chamadas = [];

    for (let i = 0; i < Math.min(count, pacientesExemplo.length); i++) {
      const paciente = pacientesExemplo[i];
      
      emitPatientCall(organizationId, {
        id: `patient-${Date.now()}-${i}`,
        name: paciente.name,
        demandId: `demand-${Date.now()}-${i}`,
        doctorName: paciente.doctor,
        room: paciente.room,
        timestamp: new Date().toISOString(),
      });

      chamadas.push(paciente.name);

      // Aguarda 2 segundos entre cada chamada
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return NextResponse.json({
      success: true,
      message: `${chamadas.length} pacientes chamados`,
      patients: chamadas,
    });
  } catch (error) {
    console.error('Erro ao chamar pacientes (teste):', error);
    return NextResponse.json(
      { error: 'Erro ao chamar pacientes' },
      { status: 500 }
    );
  }
}
