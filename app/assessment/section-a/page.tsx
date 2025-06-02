"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useAssessmentStore } from "@/lib/store/assessmentStore"

type SectionAResponses = Record<string, Record<string, string>>

export default function SectionA() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const assessmentId = searchParams.get("assessmentId")
  const { updateResponses } = useAssessmentStore()

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<SectionAResponses>({
    "A.1": {},
    "A.2": {},
    "A.3": {},
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar respostas existentes se houver um ID de avaliação
  useEffect(() => {
    const fetchResponses = async () => {
      if (!assessmentId) return

      try {
        setLoading(true)
        // Aqui você pode adicionar a lógica para carregar respostas existentes se necessário
        setLoading(false)
      } catch (err) {
        console.error("Erro ao carregar respostas:", err)
        setLoading(false)
      }
    }

    fetchResponses()
  }, [assessmentId])

  const questions = [
    {
      id: "A.1",
      title: "Expressa incomodo",
      description:
        "Você pode perceber quando a pessoa não está cômoda (com dor, molhada, com fome, assustada)? Neste caso, o que ela faz para que você note que não está cômoda?",
      categories: {
        "Movimentos Corporais": [
          "muda de postura (endurece o corpo, se contorce, dá voltas)",
          "movimentos de extremidades (pisoteia, agita os braços)",
          "movimentos de cabeça (afasta a cabeça)",
        ],
        "Primeiros Sons": ["chora, grunhe, grita"],
        "Expressões Faciais": ["faz caretas"],
      },
    },
    {
      id: "A.2",
      title: "Expressa comodidade",
      description:
        "Você pode perceber quando a pessoa está contente ou animada? Neste caso, o que ela faz para que você note que está cômoda?",
      categories: {
        "Movimentos Corporais": [
          "muda de postura (endurece o corpo, relaxa)",
          "movimentos de extremidades (pisoteia, agita os braços)",
          "movimentos de cabeça (assente com a cabeça)",
        ],
        "Primeiros Sons": ["gemidos, gritinhos"],
        "Expressões Faciais": ["sorriso"],
      },
    },
    {
      id: "A.3",
      title: "Expressa interesse em outras pessoas",
      description:
        "Você pode perceber quando a pessoa se interessa por outras pessoas? Neste caso, o que ela faz para que você note que está interessada em você ou em outras pessoas?",
      categories: {
        "Movimentos Corporais": [
          "muda de postura (endurece o corpo, relaxa)",
          "movimentos de extremidades (pisoteia, agita os braços)",
        ],
        "Primeiros Sons": ["gemidos, agitação"],
        "Expressões Faciais": ["sorriso"],
      },
    },
  ]

  const currentQuestionData = questions[currentQuestion]

  const handleCheckboxChange = (category: string, behavior: string, status: string) => {
    setResponses((prev) => {
      const questionResponses = { ...prev[currentQuestionData.id] }
      questionResponses[`${category}:${behavior}`] = status
      return {
        ...prev,
        [currentQuestionData.id]: questionResponses,
      }
    })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      // Save all responses to the store
      updateResponses("sectionA", responses)
      router.push("/assessment/section-b")
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    } else {
      router.push("/assessment/start")
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-teal-800 mb-4">Carregando...</h2>
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 flex flex-col items-center p-4">
      <div className="max-w-3xl w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-teal-800 mb-2">Seção A: Comportamento Pré-intencional</h1>
          <p className="text-gray-600 mb-4">
            Nesta etapa, a pessoa não parece ter controle sobre os seus comportamentos, mas parece que reage
            principalmente às sensações. Suas reações mostram como ela se sente.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Questão {currentQuestion + 1} de {questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-teal-100" indicatorClassName="bg-teal-600" />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button className="float-right font-bold" onClick={() => setError(null)}>
              &times;
            </button>
          </div>
        )}

        <Card className="bg-white shadow-lg border-teal-200 mb-6">
          <CardHeader>
            <CardTitle className="text-teal-800">{currentQuestionData.title}</CardTitle>
            <CardDescription className="text-gray-600">{currentQuestionData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(currentQuestionData.categories).map(([category, behaviors]) => (
                <div key={category} className="space-y-4">
                  <h3 className="font-medium text-teal-700">{category}</h3>
                  <div className="space-y-3 pl-4">
                    {behaviors.map((behavior) => (
                      <div key={behavior} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label className="text-gray-700">{behavior}</Label>
                        </div>
                        <div className="flex space-x-4 pl-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${behavior}-emergent`}
                              checked={responses[currentQuestionData.id]?.[`${category}:${behavior}`] === "emergent"}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleCheckboxChange(category, behavior, "emergent")
                                } else {
                                  handleCheckboxChange(category, behavior, "")
                                }
                              }}
                              className="border-yellow-500 data-[state=checked]:bg-yellow-500"
                            />
                            <Label htmlFor={`${behavior}-emergent`} className="text-yellow-600">
                              Emergente
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${behavior}-mastered`}
                              checked={responses[currentQuestionData.id]?.[`${category}:${behavior}`] === "mastered"}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleCheckboxChange(category, behavior, "mastered")
                                } else {
                                  handleCheckboxChange(category, behavior, "")
                                }
                              }}
                              className="border-green-500 data-[state=checked]:bg-green-500"
                            />
                            <Label htmlFor={`${behavior}-mastered`} className="text-green-600">
                              Dominado
                            </Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack} className="border-teal-600 text-teal-700 hover:bg-teal-50">
              Voltar
            </Button>
            <Button onClick={handleNext} className="bg-teal-600 hover:bg-teal-700 text-white">
              {currentQuestion < questions.length - 1 ? "Próxima" : "Continuar para Seção B"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
