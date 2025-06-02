"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-teal-800 tracking-tight">PANVE</h1>
        <h2 className="text-2xl font-medium text-teal-700">Avaliação de Habilidades Comunicativas</h2>

        <Card className="bg-white shadow-lg border-teal-200">
          <CardHeader>
            <CardTitle className="text-teal-800">Bem-vindo à PANVE</CardTitle>
            <CardDescription className="text-gray-600">
              Uma ferramenta para avaliar as habilidades de comunicação em indivíduos nas etapas iniciais do
              desenvolvimento comunicativo.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p className="mb-4">
              A PANVE foi desenvolvida para mostrar com exatidão como uma pessoa está se comunicando no
              momento atual e fornecer uma visão dos objetivos lógicos de comunicação para o futuro.
            </p>
            <p>
              Esta avaliação é apropriada para pessoas de qualquer idade que estejam nas etapas iniciais da comunicação,
              abrangendo habilidades comunicativas que normalmente se desenvolvem entre 0 e 24 meses.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Link href="/patients">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg">
                Gerenciar Pacientes
              </Button>
            </Link>
            <Link href="/assessment/start">
              <Button variant="outline" className="border-teal-600 text-teal-700 hover:bg-teal-50 px-8 py-6 text-lg">
                Iniciar Avaliação Rápida
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
