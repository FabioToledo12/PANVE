"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CommunicationMatrix } from "@/components/communication-matrix/communication-matrix"
import { AssessmentsAPI, PatientsAPI } from "@/lib/services/api-client"
import type { Assessment, Patient } from "@/lib/utils/types"
import AssessmentBarChart from "@/components/AssessmentBarChart"

export default function AssessmentResults({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showBarChart, setShowBarChart] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Garantir que params seja resolvido antes de acessar id
        const resolvedParams = await Promise.resolve(params);
        const assessmentId = resolvedParams.id;

        // Buscar dados da avaliação
        const assessmentResponse = await AssessmentsAPI.getById(assessmentId) // Usar o id resolvido
        if (!assessmentResponse.success || !assessmentResponse.data) {
          setError("Avaliação não encontrada")
          return
        }

        setAssessment(assessmentResponse.data)

        // Buscar dados do paciente
        if (assessmentResponse.data.patientId) {
          const patientResponse = await PatientsAPI.getById(assessmentResponse.data.patientId)
          if (patientResponse.success && patientResponse.data) {
            setPatient(patientResponse.data)
          } else {
            // Opcional: Lidar com paciente não encontrado associado à avaliação
            console.warn("Paciente associado à avaliação não encontrado.");
          }
        }
      } catch (err) {
        setError("Erro ao carregar dados")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params]) // Dependência no objeto params completo

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-teal-800 mb-4">Processando resultados...</h2>
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 flex flex-col items-center justify-center p-4">
        <Card className="bg-white shadow-lg border-teal-200 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Avaliação não encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p>A avaliação solicitada não foi encontrada ou foi removida.</p>
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

  const matrixData = {
    name: patient ? `Avaliação de ${patient.name}` : "Avaliação de Comunicação",
    date: assessment.date,
    responses: assessment.responses,
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="w-full max-w-[1200px]">
        <div className="mb-6 print:hidden">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Resultados da Avaliação</h1>
          {patient && (
            <p className="text-gray-600 mb-2">
              Paciente: <span className="font-medium">{patient.name}</span>
            </p>
          )}
          <p className="text-gray-600 mb-4">
            Data da avaliação: <span className="font-medium">{new Date(assessment.date).toLocaleDateString()}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 print:hidden">
            <p>{error}</p>
            <button className="float-right font-bold" onClick={() => setError(null)}>
              &times;
            </button>
          </div>
        )}

        <Card className="bg-white shadow-lg border-gray-300 mb-6 print:shadow-none print:border-0">
          <CardHeader className="pb-2 print:hidden">
            <CardTitle className="text-gray-800">PANVE</CardTitle>
            <CardDescription className="text-gray-600">
              Este perfil mostra o nível de comportamento comunicativo e que tipo de mensagens estão sendo expressas.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <CommunicationMatrix data={matrixData} />
          </CardContent>
          <CardFooter className="flex justify-between pt-2 print:hidden">
            {patient && (
              <Link href={`/patients/${patient.id}/assessments`}>
                <Button variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-50">
                  Voltar para Avaliações
                </Button>
              </Link>
            )}
            {!patient && (
              <Link href="/patients">
                <Button variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-50">
                  Lista de Pacientes
                </Button>
              </Link>
            )}
            <Button onClick={() => window.print()} className="bg-teal-600 hover:bg-teal-700 text-white">
              Imprimir
            </Button>
          </CardFooter>
        </Card>

        {/* Botão para alternar o gráfico, posicionado abaixo do Card principal */}
        <div className="flex justify-center mb-6 print:hidden">
          <Button
            onClick={() => setShowBarChart(!showBarChart)}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {showBarChart ? "Ocultar Gráfico de Barras" : "Mostrar Gráfico de Barras"}
          </Button>
        </div>

        {/* Gráfico de barras, exibido condicionalmente */}
        {showBarChart && assessment?.responses && (
          <div className="my-8 p-6 bg-white rounded-lg shadow-md print:shadow-none print:border-0">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumo por Pergunta</h2>
            <AssessmentBarChart responses={assessment.responses} />
          </div>
        )}

        <Card className="bg-white shadow-lg border-gray-300 print:hidden">
          <CardHeader>
            <CardTitle className="text-gray-800">Interpretação dos Resultados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              O perfil acima mostra rapidamente como a pessoa está se comunicando, usando sete níveis de comunicação e
              as quatro principais razões para se comunicar.
            </p>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Legenda:</h3>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-[#48CFAD]"></div>
                <span className="text-gray-700">Dominado - Comportamento consistente e independente</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-[#FFCE54]"></div>
                <span className="text-gray-700">Emergente - Comportamento inconsistente ou que requer incentivo</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-[#A8D8F0]"></div>
                <span className="text-gray-700">
                  Superado/Não usado - Comportamento já ultrapassado ou não aplicável
                </span>
              </div>
            </div>
            <p className="text-gray-700">
              Os resultados podem ajudar pais e educadores a decidir sobre os objetivos gerais de comunicação que são
              apropriados, considerando as habilidades atuais da pessoa avaliada.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
