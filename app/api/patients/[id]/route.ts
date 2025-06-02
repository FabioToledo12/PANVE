import { type NextRequest, NextResponse } from "next/server"
import { getPatient, updatePatient, deletePatient } from "@/lib/db"
import type { ApiResponse, Patient } from "@/lib/types"

// GET /api/patients/[id] - Obter um paciente específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<Patient>>> {
  try {
    const patient = await getPatient(params.id)

    if (!patient) {
      return NextResponse.json({ success: false, error: "Paciente não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: patient })
  } catch (error) {
    console.error("Erro ao buscar paciente:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar paciente" }, { status: 500 })
  }
}

// PUT /api/patients/[id] - Atualizar um paciente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<Patient>>> {
  try {
    const body = await request.json()
    const updatedPatient = await updatePatient(params.id, {
      name: body.name,
      birthDate: body.birthDate,
    })

    if (!updatedPatient) {
      return NextResponse.json({ success: false, error: "Paciente não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedPatient })
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error)
    return NextResponse.json({ success: false, error: "Erro ao atualizar paciente" }, { status: 500 })
  }
}

// DELETE /api/patients/[id] - Excluir um paciente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const success = await deletePatient(params.id)

    if (!success) {
      return NextResponse.json({ success: false, error: "Paciente não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir paciente:", error)
    return NextResponse.json({ success: false, error: "Erro ao excluir paciente" }, { status: 500 })
  }
}
