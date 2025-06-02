"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PatientsAPI, AssessmentsAPI } from "@/lib/services/api-client"
import type { Patient, Assessment } from "@/lib/utils/types"
import { Calendar, FileText, Trash2, PlusCircle } from "lucide-react"

export default function PatientAssessmentsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Garantir que params seja resolvido antes de acessar id
        const resolvedParams = await Promise.resolve(params);
        const patientId = resolvedParams.id;

        // Buscar dados do paciente
        const patientResponse = await PatientsAPI.getById(patientId)
        if (!patientResponse.success || !patientResponse.data) {
          setError("Paciente não encontrado")
          return
        }

        setPatient(patientResponse.data)

        // Buscar avaliações do paciente
        const assessmentsResponse = await AssessmentsAPI.getAll(patientId)
        if (assessmentsResponse.success && assessmentsResponse.data) {
          setAssessments(assessmentsResponse.data)
        } else {
          setError(assessmentsResponse.error || "Erro ao carregar avaliações")
        }
      } catch (err) {
        setError("Erro ao conectar com o servidor")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params])

  // Excluir avaliação
  const handleDeleteAssessment = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta avaliação?")) {
      try {
        const result = await AssessmentsAPI.delete(id)
        if (result.success) {
          setAssessments(assessments.filter((a) => a.id !== id))
        } else {
          setError(result.error || "Erro ao excluir avaliação")
        }
      } catch (err) {
        setError("Erro ao conectar com o servidor")
        console.error(err)
      }
    }
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-teal-800 mb-4">Carregando avaliações...</h2>
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 flex flex-col items-center justify-center p-4">
        <Card className="bg-white shadow-lg border-teal-200 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Paciente não encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p>O paciente solicitado não foi encontrado ou foi removido.</p>
          </CardContent>
          <CardFooter>
            <Link href="/patients">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">Voltar para Lista de Pacientes</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 flex flex-col items-center p-4">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-teal-800">{patient.name}</h1>
            <p className="text-gray-600">
              <span className="flex items-center mt-1">
                <Calendar size={16} className="mr-1" />
                Data de Nascimento: {formatDate(patient.birthDate)}
              </span>
            </p>
          </div>

          <Link href={`/assessment/start?patientId=${patient.id}`}>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Nova Avaliação
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button className="float-right font-bold" onClick={() => setError(null)}>
              &times;
            </button>
          </div>
        )}

        <h2 className="text-xl font-semibold text-teal-700 mb-4">Avaliações</h2>

        {assessments.length === 0 ? (
          <Card className="bg-white shadow-lg border-teal-200 mb-6">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600">Nenhuma avaliação registrada para este paciente.</p>
              <p className="text-gray-600 mt-2">Clique em "Nova Avaliação" para começar.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <Card key={assessment.id} className="bg-white shadow-lg border-teal-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-teal-800 flex justify-between">
                    <span>Avaliação de {formatDate(assessment.date)}</span>
                    <button
                      onClick={() => handleDeleteAssessment(assessment.id)}
                      className="text-gray-400 hover:text-red-500"
                      title="Excluir avaliação"
                    >
                      <Trash2 size={18} />
                    </button>
                  </CardTitle>
                  <CardDescription className="flex items-center">
                    <FileText size={14} className="mr-1" />
                    {assessment.notes ? assessment.notes : "Sem observações"}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <Link href={`/assessment/results/${assessment.id}`} className="w-full">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">Ver Resultados</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/patients">
            <Button variant="outline" className="border-teal-600 text-teal-700 hover:bg-teal-50">
              Voltar para Lista de Pacientes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
