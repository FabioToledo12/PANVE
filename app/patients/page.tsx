"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Calendar, Trash2 } from "lucide-react"
import { PatientsAPI } from "@/lib/services/api-client"
import type { Patient } from "@/lib/utils/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function PatientsPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newPatient, setNewPatient] = useState({ name: "", birthDate: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Carregar pacientes
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        const response = await PatientsAPI.getAll()
        if (response.success && response.data) {
          setPatients(response.data)
        } else {
          setError(response.error || "Erro ao carregar pacientes")
        }
      } catch (err) {
        setError("Erro ao conectar com o servidor")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  // Criar novo paciente
  const handleCreatePatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevenir o comportamento padrão do formulário
    try {
      if (!newPatient.name || !newPatient.birthDate) {
        setError("Nome e data de nascimento são obrigatórios")
        return
      }

      const response = await PatientsAPI.create({
        name: newPatient.name,
        birthDate: newPatient.birthDate,
      })

      if (response.success && response.data) {
        setPatients([...patients, response.data])
        setNewPatient({ name: "", birthDate: "" })
        setIsDialogOpen(false)
      } else {
        setError(response.error || "Erro ao criar paciente")
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor")
      console.error(err)
    }
  }

  // Excluir paciente
  const handleDeletePatient = async (id: string) => {
    if (
      confirm("Tem certeza que deseja excluir este paciente? Todas as avaliações associadas também serão excluídas.")
    ) {
      try {
        // Remover paciente da lista fake
        // (em produção, faria uma chamada para a API real)
        setPatients(patients.filter((p) => p.id !== id))
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
          <h2 className="text-2xl font-bold text-teal-800 mb-4">Carregando pacientes...</h2>
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 flex flex-col items-center p-4">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-teal-800">Pacientes</h1>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Novo Paciente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Paciente</DialogTitle>
                <DialogDescription>Preencha os dados do paciente para criar um novo registro.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreatePatient}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={newPatient.name}
                      onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                      placeholder="Nome completo do paciente"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={newPatient.birthDate}
                      onChange={(e) => setNewPatient({ ...newPatient, birthDate: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
                    Adicionar Paciente
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button className="float-right font-bold" onClick={() => setError(null)}>
              &times;
            </button>
          </div>
        )}

        {patients.length === 0 ? (
          <Card className="bg-white shadow-lg border-teal-200 mb-6">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600">Nenhum paciente cadastrado.</p>
              <p className="text-gray-600 mt-2">Clique em "Novo Paciente" para começar.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patients.map((patient) => (
              <Card key={patient.id} className="bg-white shadow-lg border-teal-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-teal-800 flex justify-between">
                    <span>{patient.name}</span>
                    <button
                      onClick={() => handleDeletePatient(patient.id)}
                      className="text-gray-400 hover:text-red-500"
                      title="Excluir paciente"
                    >
                      <Trash2 size={18} />
                    </button>
                  </CardTitle>
                  <CardDescription className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>Nascimento: {formatDate(patient.birthDate)}</span>
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <div className="flex space-x-2 w-full">
                    <Link href={`/patients/${patient.id}/assessments`} className="flex-1">
                      <Button variant="outline" className="w-full border-teal-600 text-teal-700 hover:bg-teal-50">
                        Ver Avaliações
                      </Button>
                    </Link>
                    <Link href={`/assessment/start?patientId=${patient.id}`} className="flex-1">
                      <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">Nova Avaliação</Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline" className="border-teal-600 text-teal-700 hover:bg-teal-50">
              Voltar para Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
