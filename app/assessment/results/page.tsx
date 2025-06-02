"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAssessmentStore } from "@/lib/store/assessmentStore"
import { CommunicationMatrix } from "@/components/communication-matrix/communication-matrix"

export default function Results() {
  const router = useRouter()
  const { responses, resetResponses, patientName } = useAssessmentStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Just a short delay to simulate processing
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleRestart = () => {
    // Limpar completamente os dados da avaliação antes de redirecionar
    resetResponses()
    router.push("/")
  }

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

  const matrixData = {
    name: patientName || "Avaliação de Comunicação",
    date: new Date().toLocaleDateString(),
    responses: responses,
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="w-full max-w-[1200px]">
        <div className="mb-6 print:hidden">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Resultados da Avaliação</h1>
          <p className="text-gray-600 mb-4">Abaixo está o perfil de comunicação baseado nas respostas fornecidas.</p>
        </div>

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
            <Button
              variant="outline"
              onClick={handleRestart}
              className="border-gray-400 text-gray-700 hover:bg-gray-50"
            >
              Nova Avaliação
            </Button>
            <div className="flex gap-2">
              <Link href="/assessment/section-c">
                <Button variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-50">
                  Voltar
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>

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
                <div className="w-4 h-4 bg-white border border-gray-400"></div>
                <span className="text-gray-700">
                  Não usado - Comportamento já ultrapassado ou não aplicável
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
