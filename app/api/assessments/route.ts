import { type NextRequest, NextResponse } from "next/server"
import { createAssessment, getAssessments } from "@/lib/db"
import type { ApiResponse, Assessment } from "@/lib/types"

// GET /api/assessments - Listar todas as avaliações
// Pode filtrar por patientId usando query parameter
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Assessment[]>>> {
  try {
    const searchParams = request.nextUrl.searchParams
    const patientId = searchParams.get("patientId")

    const assessments = await getAssessments(patientId || undefined)
    return NextResponse.json({ success: true, data: assessments })
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar avaliações" }, { status: 500 })
  }
}

// POST /api/assessments - Criar uma nova avaliação
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Assessment>>> {
  try {
    const body = await request.json()

    // Validação básica
    if (!body.patientId || !body.date) {
      return NextResponse.json({ success: false, error: "ID do paciente e data são obrigatórios" }, { status: 400 })
    }

    const assessment = await createAssessment({
      patientId: body.patientId,
      date: body.date,
      notes: body.notes,
    })

    return NextResponse.json({ success: true, data: assessment }, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar avaliação:", error)
    return NextResponse.json({ success: false, error: "Erro ao criar avaliação" }, { status: 500 })
  }
}
