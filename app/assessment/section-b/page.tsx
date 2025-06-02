"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useAssessmentStore } from "@/lib/store/assessmentStore"

export default function SectionB() {
  const router = useRouter()
  const { updateResponses } = useAssessmentStore()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<string, Record<string, string>>>({
    "B.1": {},
    "B.2": {},
    "B.3": {},
    "B.4": {},
  })

  const questions = [
    {
      id: "B.1",
      title: "Protesto",
      description:
        "Você pode perceber quando a pessoa não quer algo específico como determinada comida, um brinquedo ou um jogo? Neste caso, o que ela faz para que você perceba que não quer algo?",
      categories: {
        "Movimentos Corporais": [
          "movimentos de cabeça (mexe a cabeça para um lado ou para trás)",
          "movimentos de braços (agita os braços, empurra, joga objetos)",
          "movimentos de perna (pisoteia o chão, pisoteia)",
          "afasta-se das pessoas ou objetos",
        ],
        "Primeiros Sons": ["charaminga, alvoroça-se, grita"],
        "Expressões Faciais": ["franze as sombrancelhas, faz caretas"],
      },
    },
    {
      id: "B.2",
      title: "Continua uma ação",
      description:
        "Você pode perceber quando a pessoa gostaria de continuar com uma ação ou uma atividade que você acaba de fazer com ela? Neste caso, o que ela faz para que você note que gostaria de continuar com determinada atividade?",
      categories: {
        "Movimentos Corporais": [
          "movimentos de cabeça (aproxima a cabeça, assente)",
          "movimentos de braços (agita os braços)",
          "movimentos das pernas (pisoteia)",
        ],
        "Primeiros Sons": ["gemidos, gritinhos, alvoroço"],
        "Expressões Faciais": ["sorriso"],
        Visual: ["olha as pessoas"],
      },
    },
    {
      id: "B.3",
      title: "Obtém mais de algo",
      description:
        "Você pode perceber às vezes que a pessoa quer mais de algo específico (como comida ou brinquedo)? Neste caso, o que ela faz para que você note que quer mais de algo?",
      categories: {
        "Movimentos Corporais": [
          "aproxima-se do objeto desejado",
          "movimentos de cabeça (aproxima a cabeça, assente)",
          "movimentos dos braços (agita os braços)",
          "movimentos das pernas (pisoteia)",
          "pega o objeto desejado",
        ],
        "Primeiros Sons": ["gemidos, gritinhos, alvoroço"],
        "Expressões Faciais": ["sorriso"],
        Visual: ["olha os objetos desejados"],
      },
    },
    {
      id: "B.4",
      title: "Chama a atenção",
      description:
        "A pessoa faz algo que faz com que você lhe dirija atenção, mesmo quando não está tentando atrair sua atenção intencionalmente? Neste caso, quais comportamentos dela fazem com que você lhe dirija a atenção?",
      categories: {
        "Movimentos Corporais": [
          "aproxima-se da pessoa",
          "movimentos de cabeça (aproxima a cabeça, assente)",
          "movimentos dos braços (agita os braços)",
          "movimentos das pernas (pisoteia)",
        ],
        "Primeiros Sons": ["gemidos, gritinhos, alvoroço"],
        "Expressões Faciais": ["sorriso"],
        Visual: ["olha as pessoas"],
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
      updateResponses("sectionB", responses)
      router.push("/assessment/section-c")
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    } else {
      router.push("/assessment/section-a")
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 flex flex-col items-center p-4">
      <div className="max-w-3xl w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-teal-800 mb-2">Seção B: Comportamento Intencional</h1>
          <p className="text-gray-600 mb-4">
            Nesta etapa, a pessoa é capaz de fazer coisas intencionalmente, mas ainda não percebeu que pode comunicar
            coisas a você utilizando o seu comportamento.
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
              {currentQuestion < questions.length - 1 ? "Próxima" : "Continuar para Seção C"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
