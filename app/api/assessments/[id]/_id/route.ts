import { type NextRequest, NextResponse } from "next/server"
import { getAssessment, updateAssessment, deleteAssessment } from "@/lib/db"
import type { ApiResponse, Assessment } from "@/lib/types"

// GET /api/assessments/[id] - Obter uma avaliação específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<Assessment>>> {
  try {
    const assessment = await getAssessment(params.id)

    if (!assessment) {
      return NextResponse.json({ success: false, error: "Avaliação não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: assessment })
  } catch (error) {
    console.error("Erro ao buscar avaliação:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar avaliação" }, { status: 500 })
  }
}

// PUT /api/assessments/[id] - Atualizar uma avaliação
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<Assessment>>> {
  try {
    const body = await request.json()
    const updatedAssessment = await updateAssessment(params.id, {
      date: body.date,
      notes: body.notes,
      responses: body.responses,
    })

    if (!updatedAssessment) {
      return NextResponse.json({ success: false, error: "Avaliação não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedAssessment })
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error)
    return NextResponse.json({ success: false, error: "Erro ao atualizar avaliação" }, { status: 500 })
  }
}

// DELETE /api/assessments/[id] - Excluir uma avaliação
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const success = await deleteAssessment(params.id)

    if (!success) {
      return NextResponse.json({ success: false, error: "Avaliação não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir avaliação:", error)
    return NextResponse.json({ success: false, error: "Erro ao excluir avaliação" }, { status: 500 })
  }
}
