"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useAssessmentStore } from "@/lib/store/assessmentStore"

export default function SectionC() {
  const router = useRouter()
  const { updateResponses } = useAssessmentStore()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<string, Record<string, string>>>({})

  // Initialize responses for all C questions
  useEffect(() => {
    const initialResponses: Record<string, Record<string, string>> = {}
    for (let i = 1; i <= 17; i++) {
      initialResponses[`C.${i}`] = {}
    }
    setResponses(initialResponses)
  }, [])

  const questions = [
    {
      id: "C.1",
      title: "Rejeita ou nega algo",
      description:
        "A pessoa mostra a você de maneira intencional que não quer certas coisas ou atividades? Neste caso, o que ela faz para rejeitar algo?",
      categories: {
        "Nível III": {
          "Movimentos Corporais": [
            "movimentos corporais completos (se contorce, dá voltas)",
            "movimentos de cabeça (afasta a cabeça ou joga-a para um lado)",
            "movimentos de braços e mãos",
            "movimentos de pernas (pisoteia, pisoteia o chão)",
          ],
          "Primeiros Sons": ["gemidos, gritinhos, alvoroço"],
          "Expressões Faciais": ["sorriso"],
          "Gestos Simples": ["empurra o objeto ou pessoa para afastá-la"],
        },
        "Nível IV": {
          "Gestos convencionais e vocalização": [
            "dá a você um objeto não desejado",
            "nega com a cabeça",
            "vocalizações especiais",
          ],
        },
        "Nível V": {
          "Símbolos concretos": [
            "rejeita a foto ou o desenho do objeto não desejado",
            "rejeita o símbolo dos objetos que representam o objeto não desejado",
          ],
        },
        "Nível VI": {
          "Símbolos abstratos": [
            "palavra falada ('não', 'acabado')",
            "sinal de libras ('não', 'parar')",
            "palavra escrita ('não', 'acabado')",
            "palavra em Braille ('não', 'parar')",
            "símbolo 3D abstrato ('não', 'parar')",
            "símbolo 2D abstrato ('não', 'parar')",
          ],
        },
        "Nível VII": {
          Linguagem: ["combina dois ou mais símbolos ('para isso', 'tudo acabado', 'não sair agora')"],
        },
      },
    },
    {
      id: "C.2",
      title: "Pede para continuar uma ação",
      description:
        "A pessoa mostra a você de maneira intencional que quer continuar a ação que você acaba de parar de fazer? Neste caso, o que ela faz para mostrar que quer continuar a ação?",
      categories: {
        "Nível III": {
          "Movimentos Corporais": [
            "movimentos corporais completos (se balança)",
            "movimentos de braços e mãos (agita os braços)",
            "movimentos de pernas (pisoteia)",
          ],
          "Primeiros Sons": ["gemidos, gritinhos, risada"],
          "Expressões Faciais": ["sorriso"],
          "Gestos Simples": [
            "segura a sua mão",
            "toca em você",
            "inclina-se na sua direção ou dá leves batidinhas em você",
          ],
          Visual: ["olha para você"],
        },
        "Nível IV": {
          "Gestos convencionais e vocalização": [
            "faz sinais para que continue",
            "mantém suas mãos levantadas ou estendidas para você (para que o segure)",
            "assente com a cabeça",
          ],
        },
        "Nível V": {
          "Símbolos concretos": [
            "rejeita a foto ou o desenho do objeto não desejado",
            "rejeita o símbolo dos objetos que representam o objeto não desejado",
            "dramatiza a ação desejada",
          ],
        },
        "Nível VI": {
          "Símbolos abstratos": [
            "palavra falada ('mais', 'cócegas')",
            "sinal de libras ('mais', 'balanço')",
            "palavra escrita ('mais', 'cócegas')",
            "palavra em Braille ('mais', 'pedra')",
            "símbolo 3D abstrato ('mais', 'cócegas')",
            "símbolo 2D abstrato ('mais', 'comer')",
          ],
        },
        "Nível VII": {
          Linguagem: ["combina dois ou mais símbolos ('mais cócegas', 'outra vez')"],
        },
      },
    },
    {
      id: "C.3",
      title: "Solicita Nova Ação",
      description: "A pessoa solicita que você faça uma nova ação?",
      categories: {
        "Nível III": {
          "Gestos Simples": ["puxa você para a ação desejada", "toca ou aponta para o objeto"],
        },
        "Nível IV": {
          "Gestos convencionais": ["aponta para o que quer", "gesticula a ação desejada"],
        },
        "Nível V": {
          "Símbolos concretos": ["mostra uma foto da ação desejada"],
        },
        "Nível VI": {
          "Símbolos abstratos": ["usa palavras ou sinais para pedir a ação"],
        },
        "Nível VII": {
          Linguagem: ["combina dois ou mais símbolos para pedir a ação"],
        },
      },
    },
    {
      id: "C.4",
      title: "Solicita mais objeto",
      description: "A pessoa pede mais de um objeto que ela já tem?",
      categories: {
        "Nível III": {
          "Gestos Simples": ["estende a mão aberta", "olha para o objeto e para você"],
          "Movimentos Corporais": ["se inclina em direção ao objeto"],
        },
        "Nível IV": {
          "Gestos convencionais": ["aponta para o objeto", "faz gesto de 'me dá'"],
        },
        "Nível V": {
          "Símbolos concretos": ["mostra uma foto ou símbolo do objeto desejado"],
        },
        "Nível VI": {
          "Símbolos abstratos": ["usa palavras ou sinais para pedir mais"],
        },
        "Nível VII": {
          Linguagem: ["combina dois ou mais símbolos ('quero mais biscoito')"],
        },
      },
    },
    {
      id: "C.5",
      title: "Faz escolhas",
      description: "A pessoa escolhe entre opções que você oferece?",
      categories: {
        "Nível III": {
          "Gestos Simples": ["toca ou pega o objeto desejado", "olha fixamente para a opção preferida"],
        },
        "Nível IV": {
          "Gestos convencionais": ["aponta para a opção desejada", "pega e mostra o que quer"],
        },
        "Nível V": {
          "Símbolos concretos": ["seleciona a foto ou símbolo da opção desejada"],
        },
        "Nível VI": {
          "Símbolos abstratos": ["usa palavras ou sinais para indicar sua escolha"],
        },
        "Nível VII": {
          Linguagem: ["combina dois ou mais símbolos ('quero o vermelho, não o azul')"],
        },
      },
    },
    {
      id: "C.6",
      title: "Solicita novo objeto",
      description: "A pessoa pede objetos novos ou diferentes?",
      categories: {
        "Nível III": {
          "Gestos Simples": ["olha ou se move em direção ao objeto desejado", "tenta alcançar o objeto"],
        },
        "Nível IV": {
          "Gestos convencionais": ["aponta para o objeto desejado", "leva você até o objeto"],
        },
        "Nível V": {
          "Símbolos concretos": ["mostra ou seleciona a foto ou símbolo do objeto desejado"],
        },
        "Nível VI": {
          "Símbolos abstratos": ["usa palavras ou sinais para pedir o objeto"],
        },
        "Nível VII": {
          Linguagem: ["combina dois ou mais símbolos ('quero bola grande')"],
        },
      },
    },
    {
      id: "C.7",
      title: "Solicita Objetos Ausentes",
      description: "A pessoa pede objetos que não estão presentes ou visíveis?",
      categories: {
        "Nível III": {
          "Gestos Simples": ["leva você ao local onde o objeto costuma estar", "faz gestos que representam o objeto"],
        },
        "Nível IV": {
          "Gestos convencionais": [
            "aponta para o local onde o objeto costuma estar",
            "faz gestos que simbolizam o objeto",
          ],
        },
        "Nível V": {
          "Símbolos concretos": ["mostra a foto ou símbolo do objeto ausente"],
        },
        "Nível VI": {
          "Símbolos abstratos": ["usa palavras ou sinais para pedir o objeto ausente"],
        },
        "Nível VII": {
          Linguagem: ["combina dois ou mais símbolos ('quero meu livro do quarto')"],
        },
      },
    },
    {
      id: "C.8",
      title: "Solicita atenção",
      description: "A pessoa pede sua atenção?",
      categories: {
        "Nível III": {
          "Gestos Simples": ["toca em você", "puxa sua roupa"],
          Vocalizações: ["faz sons para chamar sua atenção"],
        },
        "Nível IV": {
          "Gestos convencionais": ["acena para você", "bate palmas para chamar atenção"],
        },
        "Nível V": {
          "Símbolos concretos": ["mostra uma foto ou símbolo que representa 'olhe para mim'"],
        },
        "Nível VI": {
          "Símbolos abstratos": ["usa palavras ou sinais como 'olhe', 'veja'"],
        },
        "Nível VII": {
          Linguagem: ["combina dois ou mais símbolos ('olhe para mim agora')"],
        },
      },
    },
    {
      id: "C.9",
      title: "Demonstra afeição",
      description: "A pessoa demonstra afeição por você ou outros?",
      categories: {
        "Nível III": {
          "Gestos Simples": ["abraça", "beija", "acaricia"],
        },
        "Nível IV": {
          "Gestos convencionais": ["manda beijo com a mão", "faz coração com as mãos"],
        },
        "Nível V": {
          "Símbolos concretos": ["mostra foto ou símbolo que representa afeto"],
        },
        "Nível VI": {
          "Símbolos abstratos": ["usa palavras ou sinais como 'amo você', 'gosto'"],
        },
        "Nível VII": {
          Linguagem: ["combina dois ou mais símbolos ('eu te amo muito')"],
        },
      },
    },
    {
      id: "C.10",
      title: "Cumprimenta as pessoas",
      description: "A pessoa cumprimenta ou se despede das pessoas?",
      categories: {
        "Nível III": {
          "Gestos Simples": ["estende a mão", "se aproxima da pessoa"],
        },
        "Nível IV": {
          "Gestos convencionais": ["acena", "dá a mão", "abraça ao encontrar ou se despedir"],
        },
        "Nível V": {
          "Símbolos concretos": ["mostra foto ou símbolo que representa cumprimento"],
        },
        "Nível VI": {
          "Símbolos abstratos": ["usa palavras ou sinais como 'oi', 'tchau', 'bom dia'"],
        },
        "Nível VII": {
          Linguagem: ["combina dois ou mais símbolos ('bom dia, como vai?')"],
        },
      },
    },
    {
      id: "C.11",
      title: "Oferece, Ações",
      description: "A pessoa oferece coisas ou quer compartilhar ações com você?",
      categories: {
        "Nível III": {
          "Gestos Simples": ["entrega objeto a você", "puxa você para participar"],
        },
        "Nível IV": {
          "Gestos convencionais": ["mostra o objeto antes de entregar", "gesticula para você participar"],
        },
        "Nível V": {
          "Símbolos concretos": ["mostra foto ou símbolo do que quer compartilhar"],
        },
        "Nível VI": {
          "Símbolos abstratos": ["usa palavras ou sinais como 'quer?', 'para você'"],
        },
        "Nível VII": {
          Linguagem: ["combina dois ou mais símbolos ('quer jogar comigo?')"],
        },
      },
    },
    {
      id: "C.12",
      title: "Direciona sua atenção",
      description: "A pessoa tenta dirigir sua atenção para algo interessante?",
      categories: {
        "Nível III": {
          "Gestos Simples": ["olha alternadamente para você e para o objeto", "puxa você em direção ao objeto"],
        },
        "Nível IV": {
          "Gestos convencionais": ["aponta para o objeto de interesse", "mostra o objeto para você"],
        },
        "Nível V": {
          "Símbolos concretos": ["mostra foto ou símbolo do que quer que você veja"],
        },
        "Nível VI": {
          "Símbolos abstratos": ["usa palavras ou sinais como 'olhe', 'veja isso'"],
        },
        "Nível VII": {
          Linguagem: ["combina dois ou mais símbolos ('olhe o cachorro ali')"],
        },
      },
    },
    {
      id: "C.13",
      title: "Formas sociais educadas",
      description: "A pessoa usa formas sociais educadas?",
      categories: {
        "Nível III": {
          "Gestos Simples": ["faz gestos que indicam agradecimento ou pedido"],
        },
        "Nível IV": {
          "Gestos convencionais": ["acena com a cabeça em agradecimento", "gestos formais de cortesia"],
        },
        "Nível V": {
          "Símbolos concretos": ["mostra foto ou símbolo que representa 'por favor' ou 'obrigado'"],
        },
        "Nível VI": {
          "Símbolos abstratos": ["usa palavras ou sinais como 'por favor', 'obrigado', 'desculpe'"],
        },
        "Nível VII": {
          Linguagem: ["combina dois ou mais símbolos ('muito obrigado pela ajuda')"],
        },
      },
    },
    {
      id: "C.14",
      title: "Responde Sim/Não Perguntas",
      description: "A pessoa responde perguntas de sim/não?",
      categories: {
        "Nível III": {
          "Gestos Simples": ["mostra aceitação ou rejeição através de expressões ou movimentos"],
        },
        "Nível IV": {
          "Gestos convencionais": ["acena com a cabeça para sim", "balança a cabeça para não"],
        },
        "Nível V": {
          "Símbolos concretos": ["mostra foto ou símbolo que representa 'sim' ou 'não'"],
        },
        "Nível VI": {
          "Símbolos abstratos": ["usa palavras ou sinais como 'sim', 'não', 'talvez'"],
        },
        "Nível VII": {
          Linguagem: ["combina dois ou mais símbolos ('sim, eu quero' ou 'não, obrigado')"],
        },
      },
    },
    {
      id: "C.15",
      title: "Faz perguntas",
      description: "A pessoa faz perguntas a você?",
      categories: {
        "Nível III": {
          "Gestos Simples": ["expressão facial de questionamento", "gestos que indicam dúvida"],
        },
        "Nível IV": {
          "Gestos convencionais": ["levanta as mãos em questionamento", "inclina a cabeça em dúvida"],
        },
        "Nível V": {
          "Símbolos concretos": ["mostra foto ou símbolo que representa uma pergunta"],
        },
        "Nível VI": {
          "Símbolos abstratos": ["usa palavras ou sinais como 'quem', 'o que', 'onde', 'quando'"],
        },
        "Nível VII": {
          Linguagem: ["combina dois ou mais símbolos para formar perguntas ('onde está a bola?')"],
        },
      },
    },
    {
      id: "C.16",
      title: "Nomeia Coisas/Pessoas",
      description: "A pessoa nomeia objetos, pessoas ou ações?",
      categories: {
        "Nível III": {
          "Gestos Simples": ["gestos que representam características específicas de objetos ou pessoas"],
        },
        "Nível IV": {
          "Gestos convencionais": ["gestos que simbolizam objetos ou pessoas específicas"],
        },
        "Nível V": {
          "Símbolos concretos": ["mostra foto ou símbolo que representa o objeto ou pessoa"],
        },
        "Nível VI": {
          "Símbolos abstratos": ["usa palavras ou sinais para nomear objetos, pessoas ou ações"],
        },
        "Nível VII": {
          Linguagem: ["combina dois ou mais símbolos para descrever ('carro vermelho grande')"],
        },
      },
    },
    {
      id: "C.17",
      title: "Faz Comentários",
      description: "A pessoa faz comentários ou dá informações?",
      categories: {
        "Nível III": {
          "Gestos Simples": ["gestos que expressam opinião ou observação"],
        },
        "Nível IV": {
          "Gestos convencionais": ["gestos que comunicam informações ou opiniões"],
        },
        "Nível V": {
          "Símbolos concretos": ["mostra fotos ou símbolos para fazer comentários"],
        },
        "Nível VI": {
          "Símbolos abstratos": ["usa palavras ou sinais para fazer comentários simples"],
        },
        "Nível VII": {
          Linguagem: ["combina dois ou mais símbolos para fazer comentários ('o céu está bonito hoje')"],
        },
      },
    },
  ]

  const currentQuestionData = questions[currentQuestion]

  const handleCheckboxChange = (level: string, category: string, behavior: string, status: string) => {
    setResponses((prev) => {
      const questionResponses = { ...prev[currentQuestionData.id] }
      // Usar um formato de chave que inclui explicitamente o nível
      const responseKey = `Nível ${level}:${category}:${behavior}`
      questionResponses[responseKey] = status
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
      updateResponses("sectionC", responses)
      router.push("/assessment/results")
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    } else {
      router.push("/assessment/section-b")
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 flex flex-col items-center p-4">
      <div className="max-w-3xl w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-teal-800 mb-2">Seção C: Comunicação Intencional</h1>
          <p className="text-gray-600 mb-4">
            Nesta etapa, a pessoa sabe que se fizer certas coisas, você reagirá de determinada maneira e utiliza seus
            comportamentos para comunicar-se intencionalmente.
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
            <div className="space-y-8">
              {Object.entries(currentQuestionData.categories).map(([level, levelCategories]) => (
                <div key={level} className="space-y-4">
                  <h3 className="font-semibold text-teal-800 text-lg">{level}</h3>
                  <div className="space-y-6 pl-4">
                    {Object.entries(levelCategories).map(([category, behaviors]) => (
                      <div key={`${level}-${category}`} className="space-y-3">
                        <h4 className="font-medium text-teal-700">{category}</h4>
                        <div className="space-y-3 pl-4">
                          {behaviors.map((behavior) => (
                            <div key={`${level}-${category}-${behavior}`} className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Label className="text-gray-700">{behavior}</Label>
                              </div>
                              <div className="flex space-x-4 pl-4">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${level}-${category}-${behavior}-emergent`}
                                    checked={
                                      responses[currentQuestionData.id]?.[`Nível ${level}:${category}:${behavior}`] ===
                                      "emergent"
                                    }
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        handleCheckboxChange(level, category, behavior, "emergent")
                                      } else {
                                        handleCheckboxChange(level, category, behavior, "")
                                      }
                                    }}
                                    className="border-yellow-500 data-[state=checked]:bg-yellow-500"
                                  />
                                  <Label
                                    htmlFor={`${level}-${category}-${behavior}-emergent`}
                                    className="text-yellow-600"
                                  >
                                    Emergente
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${level}-${category}-${behavior}-mastered`}
                                    checked={
                                      responses[currentQuestionData.id]?.[`Nível ${level}:${category}:${behavior}`] ===
                                      "mastered"
                                    }
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        handleCheckboxChange(level, category, behavior, "mastered")
                                      } else {
                                        handleCheckboxChange(level, category, behavior, "")
                                      }
                                    }}
                                    className="border-green-500 data-[state=checked]:bg-green-500"
                                  />
                                  <Label
                                    htmlFor={`${level}-${category}-${behavior}-mastered`}
                                    className="text-green-600"
                                  >
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
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack} className="border-teal-600 text-teal-700 hover:bg-teal-50">
              Voltar
            </Button>
            <Button onClick={handleNext} className="bg-teal-600 hover:bg-teal-700 text-white">
              {currentQuestion < questions.length - 1 ? "Próxima" : "Ver Resultados"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
