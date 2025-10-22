// Exemplo de como emitir eventos do backend quando o status da demanda mudar

import { emitPatientCall, emitDemandStatusUpdate } from '@/lib/socket-server';

/**
 * Função de exemplo para chamar quando o status de uma demanda mudar para "em andamento"
 * 
 * Esta função deve ser chamada no seu endpoint de atualização de demanda,
 * logo após atualizar o status no banco de dados.
 */
export async function handleDemandStatusUpdate(demandData: {
  id: string;
  status: string;
  organizationId: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName?: string;
  room?: string;
}) {
  try {
    // Se o status mudou para "em andamento" (ou "in_progress", dependendo do seu enum)
    if (demandData.status === 'in_progress' || demandData.status === 'em_andamento') {
      // Emite evento para chamar o paciente na TV
      emitPatientCall(demandData.organizationId, {
        id: demandData.patientId,
        name: demandData.patientName,
        demandId: demandData.id,
        doctorName: demandData.doctorName,
        room: demandData.room,
        timestamp: new Date().toISOString(),
      });
    }

    // Emite evento geral de atualização de status
    emitDemandStatusUpdate(demandData.organizationId, {
      id: demandData.id,
      status: demandData.status,
      patientName: demandData.patientName,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao emitir evento de WebSocket:', error);
    return { success: false, error };
  }
}

/**
 * Exemplo de integração no endpoint de atualização de demanda
 * 
 * PUT/PATCH /api/demands/:id
 */
export async function updateDemandEndpointExample(
  demandId: string,
  updateData: { status: string; [key: string]: any },
  organizationId: string
) {
  try {
    // 1. Atualiza a demanda no banco de dados
    // const updatedDemand = await updateDemandInDatabase(demandId, updateData);

    // 2. Busca informações adicionais se necessário
    // const patient = await getPatientById(updatedDemand.patientId);
    // const doctor = await getDoctorById(updatedDemand.doctorId);

    // 3. Emite evento via WebSocket
    await handleDemandStatusUpdate({
      id: demandId,
      status: updateData.status,
      organizationId: organizationId,
      patientId: 'patient-id', // updatedDemand.patientId
      patientName: 'Nome do Paciente', // patient.name
      doctorId: 'doctor-id', // updatedDemand.doctorId
      doctorName: 'Dr. Nome', // doctor.name
      room: 'Sala 1', // updatedDemand.room
    });

    return {
      success: true,
      // demand: updatedDemand,
    };
  } catch (error) {
    console.error('Erro ao atualizar demanda:', error);
    throw error;
  }
}

/**
 * Exemplo de uso em um Route Handler do Next.js
 */
/*
// src/app/api/demands/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { handleDemandStatusUpdate } from '@/lib/websocket-handlers';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, organizationId, ...otherData } = body;

    // Atualiza no banco
    const updatedDemand = await updateDemandInDatabase(params.id, {
      status,
      ...otherData,
    });

    // Busca dados do paciente
    const patient = await getPatient(updatedDemand.patientId);
    
    // Busca dados do médico (se houver)
    let doctor = null;
    if (updatedDemand.doctorId) {
      doctor = await getDoctor(updatedDemand.doctorId);
    }

    // Emite evento WebSocket
    await handleDemandStatusUpdate({
      id: updatedDemand.id,
      status: updatedDemand.status,
      organizationId: organizationId,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor?.id,
      doctorName: doctor?.name,
      room: updatedDemand.room,
    });

    return NextResponse.json({
      success: true,
      demand: updatedDemand,
    });
  } catch (error) {
    console.error('Error updating demand:', error);
    return NextResponse.json(
      { error: 'Failed to update demand' },
      { status: 500 }
    );
  }
}
*/
