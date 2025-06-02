import { type NextRequest, NextResponse } from "next/server"
import { updateAssessmentResponses, getAssessment } from "@/lib/db"
import type { ApiResponse, Assessment } from "@/lib/types"

// PUT /api/assessments/[id]/responses - Atualizar respostas de uma avaliação
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<Assessment>>> {
  try {
    const body = await request.json()

    // Validação básica
    if (!body.section || !body.responses) {
      return NextResponse.json({ success: false, error: "Seção e respostas são obrigatórias" }, { status: 400 })
    }

    // Verificar se a seção é válida
    if (!["sectionA", "sectionB", "sectionC"].includes(body.section)) {
      return NextResponse.json({ success: false, error: "Seção inválida" }, { status: 400 })
    }

    const updatedAssessment = await updateAssessmentResponses(
      params.id,
      body.section as "sectionA" | "sectionB" | "sectionC",
      body.responses,
    )

    if (!updatedAssessment) {
      return NextResponse.json({ success: false, error: "Avaliação não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedAssessment })
  } catch (error) {
    console.error("Erro ao atualizar respostas:", error)
    return NextResponse.json({ success: false, error: "Erro ao atualizar respostas" }, { status: 500 })
  }
}

// GET /api/assessments/[id]/responses - Obter respostas de uma avaliação
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<Assessment["responses"]>>> {
  try {
    const assessment = await getAssessment(params.id)

    if (!assessment) {
      return NextResponse.json({ success: false, error: "Avaliação não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: assessment.responses })
  } catch (error) {
    console.error("Erro ao buscar respostas:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar respostas" }, { status: 500 })
  }
}
