import { type NextRequest, NextResponse } from "next/server"
import { createPatient, getPatients } from "@/lib/db"
import type { ApiResponse, Patient } from "@/lib/types"

// GET /api/patients - Listar todos os pacientes
export async function GET(): Promise<NextResponse<ApiResponse<Patient[]>>> {
  try {
    const patients = await getPatients()
    return NextResponse.json({ success: true, data: patients })
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar pacientes" }, { status: 500 })
  }
}

// POST /api/patients - Criar um novo paciente
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Patient>>> {
  try {
    const body = await request.json()

    // Validação básica
    if (!body.name || !body.birthDate) {
      return NextResponse.json({ success: false, error: "Nome e data de nascimento são obrigatórios" }, { status: 400 })
    }

    const patient = await createPatient({
      name: body.name,
      birthDate: body.birthDate,
    })

    return NextResponse.json({ success: true, data: patient }, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar paciente:", error)
    return NextResponse.json({ success: false, error: "Erro ao criar paciente" }, { status: 500 })
  }
}
