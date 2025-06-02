"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PatientsAPI, AssessmentsAPI } from "@/lib/services/api-client"
import type { Patient } from "@/lib/utils/types"
import { useAssessmentStore } from "@/lib/store/assessmentStore"
import { Input } from "@/components/ui/input"

export default function StartAssessment() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientId = searchParams.get("patientId")

  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)

  const { setPatientName } = useAssessmentStore()
  const [patientNameInput, setPatientNameInput] = useState("")

  // Buscar dados do paciente se o ID for fornecido
  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return

      try {
        setLoading(true)
        const response = await PatientsAPI.getById(patientId)
        if (response.success && response.data) {
          setPatient(response.data)
        } else {
          setError("Paciente não encontrado")
        }
      } catch (err) {
        setError("Erro ao buscar dados do paciente")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPatient()
  }, [patientId])

  // Criar uma nova avaliação quando o usuário selecionar uma opção
  const createAssessment = async () => {
    if (!patientId) return null

    try {
      const today = new Date().toISOString().split("T")[0]
      const response = await AssessmentsAPI.create({
        patientId,
        date: today,
        notes: `Avaliação iniciada com opção ${selectedOption}`,
      })

      if (response.success && response.data) {
        return response.data.id
      } else {
        setError("Erro ao criar avaliação")
        return null
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor")
      console.error(err)
      return null
    }
  }

  const handleContinue = async () => {
    if (!selectedOption) return

    // Se não temos um paciente selecionado, salvar o nome inserido
    if (!patientId && patientNameInput.trim()) {
      setPatientName(patientNameInput.trim())
    }

    // Se temos um ID de paciente, criar uma avaliação
    if (patientId) {
      setLoading(true)
      const newAssessmentId = await createAssessment()
      setLoading(false)

      if (!newAssessmentId) return

      // Armazenar o ID da avaliação para uso posterior
      setAssessmentId(newAssessmentId)

      // Redirecionar para a seção apropriada com o ID da avaliação
      if (selectedOption === "A") {
        router.push(`/assessment/section-a?assessmentId=${newAssessmentId}`)
      } else if (selectedOption === "B") {
        router.push(`/assessment/section-b?assessmentId=${newAssessmentId}`)
      } else if (selectedOption === "C") {
        router.push(`/assessment/section-c?assessmentId=${newAssessmentId}`)
      }
    } else {
      // Comportamento original sem ID de paciente
      if (selectedOption === "A") {
        router.push("/assessment/section-a")
      } else if (selectedOption === "B") {
        router.push("/assessment/section-b")
      } else if (selectedOption === "C") {
        router.push("/assessment/section-c")
      }
    }
  }

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
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {patient && (
          <div className="mb-4">
            <Card className="bg-white shadow-lg border-teal-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-teal-800">Paciente: {patient.name}</CardTitle>
                <CardDescription>
                  Data de Nascimento: {new Date(patient.birthDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}

        {!patient && (
          <div className="mb-4">
            <Card className="bg-white shadow-lg border-teal-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-teal-800">Informações do Paciente</CardTitle>
                <CardDescription>Digite o nome da pessoa que será avaliada (opcional)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="patient-name">Nome do Paciente</Label>
                  <Input
                    id="patient-name"
                    value={patientNameInput}
                    onChange={(e) => setPatientNameInput(e.target.value)}
                    placeholder="Nome da pessoa avaliada"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button className="float-right font-bold" onClick={() => setError(null)}>
              &times;
            </button>
          </div>
        )}

        <Card className="bg-white shadow-lg border-teal-200">
          <CardHeader>
            <CardTitle className="text-teal-800">Como Começar...</CardTitle>
            <CardDescription className="text-gray-600">
              Escolha UMA das quatro afirmativas seguintes que melhor descrevam as habilidades comunicativas da pessoa
              avaliada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} className="space-y-6">
              <div className="flex items-start space-x-3 p-4 rounded-md border border-teal-100 hover:bg-teal-50">
                <RadioGroupItem value="A" id="option-a" className="mt-1" />
                <div className="space-y-2">
                  <Label htmlFor="option-a" className="font-medium text-teal-800">
                    Opção A
                  </Label>
                  <p className="text-gray-700">
                    Parece que a pessoa ainda não tem controle real sobre o seu corpo. A única maneira que tenho para
                    saber se ela quer algo é porque se queixa ou choraminga quando está descontente ou incômoda, e
                    sorri, faz ruídos ou se acalma quando está contente e cômoda.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-md border border-teal-100 hover:bg-teal-50">
                <RadioGroupItem value="B" id="option-b" className="mt-1" />
                <div className="space-y-2">
                  <Label htmlFor="option-b" className="font-medium text-teal-800">
                    Opção B
                  </Label>
                  <p className="text-gray-700">
                    A pessoa tem controle sobre seus comportamentos, mas não os usa para se comunicar comigo. Não vem
                    até onde estou para que eu saiba o que ela quer, mas é fácil para mim imaginar, porque tenta fazer
                    as coisas por si mesma. Sabe o que quer e seu comportamento me mostra o que quer.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-md border border-teal-100 hover:bg-teal-50">
                <RadioGroupItem value="C" id="option-c" className="mt-1" />
                <div className="space-y-2">
                  <Label htmlFor="option-c" className="font-medium text-teal-800">
                    Opção C
                  </Label>
                  <p className="text-gray-700">
                    A pessoa tenta me comunicar claramente as suas necessidades. Sabe como fazer para que eu faça algo
                    por ela. Utiliza vários gestos e sons (como indicar, movimentar a cabeça, puxar o meu braço ou olhar
                    para mim e para o que quer alternadamente) para comunicar-se comigo.
                  </p>
                  <p className="text-gray-700">OU</p>
                  <p className="text-gray-700">
                    A pessoa tenta fazer com que eu saiba o que ela quer utilizando algum tipo de linguagem ou
                    comunicação simbólica (como a fala, palavras escritas, Braille, símbolos de imagens, símbolos
                    tridimensionais ou linguagem de sinais).
                  </p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push(patientId ? "/patients" : "/")}
              className="border-teal-600 text-teal-700 hover:bg-teal-50"
            >
              Voltar
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedOption}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Continuar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
