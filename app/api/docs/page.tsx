"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CopyIcon, CheckIcon } from "lucide-react"

export default function ApiDocs() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text)
    setCopiedEndpoint(endpoint)
    setTimeout(() => setCopiedEndpoint(null), 2000)
  }

  const endpoints = [
    {
      id: "patients-get",
      name: "GET /api/patients",
      description: "Listar todos os pacientes",
      request: "GET /api/patients",
      response: `{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "João Silva",
      "birthDate": "2015-05-10",
      "createdAt": "2023-06-15T10:30:00.000Z",
      "updatedAt": "2023-06-15T10:30:00.000Z"
    }
  ]
}`,
    },
    {
      id: "patients-post",
      name: "POST /api/patients",
      description: "Criar um novo paciente",
      request: `POST /api/patients
Content-Type: application/json

{
  "name": "Maria Oliveira",
  "birthDate": "2018-03-22"
}`,
      response: `{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Maria Oliveira",
    "birthDate": "2018-03-22",
    "createdAt": "2023-06-16T14:20:00.000Z",
    "updatedAt": "2023-06-16T14:20:00.000Z"
  }
}`,
    },
    {
      id: "patients-get-id",
      name: "GET /api/patients/[id]",
      description: "Obter um paciente específico",
      request: "GET /api/patients/123e4567-e89b-12d3-a456-426614174000",
      response: `{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "João Silva",
    "birthDate": "2015-05-10",
    "createdAt": "2023-06-15T10:30:00.000Z",
    "updatedAt": "2023-06-15T10:30:00.000Z"
  }
}`,
    },
    {
      id: "patients-put",
      name: "PUT /api/patients/[id]",
      description: "Atualizar um paciente existente",
      request: `PUT /api/patients/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "name": "João Silva Pereira"
}`,
      response: `{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "João Silva Pereira",
    "birthDate": "2015-05-10",
    "createdAt": "2023-06-15T10:30:00.000Z",
    "updatedAt": "2023-06-16T15:45:00.000Z"
  }
}`,
    },
    {
      id: "patients-delete",
      name: "DELETE /api/patients/[id]",
      description: "Excluir um paciente",
      request: "DELETE /api/patients/123e4567-e89b-12d3-a456-426614174000",
      response: `{
  "success": true
}`,
    },
    {
      id: "assessments-get",
      name: "GET /api/assessments",
      description: "Listar todas as avaliações",
      request: "GET /api/assessments?patientId=123e4567-e89b-12d3-a456-426614174000",
      response: `{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174002",
      "patientId": "123e4567-e89b-12d3-a456-426614174000",
      "date": "2023-06-20",
      "notes": "Avaliação inicial",
      "responses": {
        "sectionA": {},
        "sectionB": {},
        "sectionC": {}
      },
      "createdAt": "2023-06-20T09:15:00.000Z",
      "updatedAt": "2023-06-20T09:15:00.000Z"
    }
  ]
}`,
    },
    {
      id: "assessments-post",
      name: "POST /api/assessments",
      description: "Criar uma nova avaliação",
      request: `POST /api/assessments
Content-Type: application/json

{
  "patientId": "123e4567-e89b-12d3-a456-426614174000",
  "date": "2023-06-25",
  "notes": "Avaliação de acompanhamento"
}`,
      response: `{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174003",
    "patientId": "123e4567-e89b-12d3-a456-426614174000",
    "date": "2023-06-25",
    "notes": "Avaliação de acompanhamento",
    "responses": {
      "sectionA": {},
      "sectionB": {},
      "sectionC": {}
    },
    "createdAt": "2023-06-25T10:00:00.000Z",
    "updatedAt": "2023-06-25T10:00:00.000Z"
  }
}`,
    },
    {
      id: "assessments-responses-put",
      name: "PUT /api/assessments/[id]/responses",
      description: "Atualizar respostas de uma avaliação",
      request: `PUT /api/assessments/123e4567-e89b-12d3-a456-426614174003/responses
Content-Type: application/json

{
  "section": "sectionA",
  "responses": {
    "A.1": {
      "Movimentos Corporais:muda de postura": "emergent",
      "Primeiros Sons:chora": "mastered"
    }
  }
}`,
      response: `{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174003",
    "patientId": "123e4567-e89b-12d3-a456-426614174000",
    "date": "2023-06-25",
    "notes": "Avaliação de acompanhamento",
    "responses": {
      "sectionA": {
        "A.1": {
          "Movimentos Corporais:muda de postura": "emergent",
          "Primeiros Sons:chora": "mastered"
        }
      },
      "sectionB": {},
      "sectionC": {}
    },
    "createdAt": "2023-06-25T10:00:00.000Z",
    "updatedAt": "2023-06-25T10:30:00.000Z"
  }
}`,
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Documentação da API da PANVE</h1>
      <p className="text-gray-600 mb-8">
        Esta documentação descreve os endpoints disponíveis na API da PANVE.
      </p>

      <Tabs defaultValue="rest-api">
        <TabsList className="mb-6">
          <TabsTrigger value="rest-api">API REST</TabsTrigger>
          <TabsTrigger value="server-actions">Server Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="rest-api">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Visão Geral da API REST</CardTitle>
                <CardDescription>
                  A API REST permite que você interaja com o sistema da PANVE através de endpoints HTTP.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Todos os endpoints retornam respostas no formato JSON com a seguinte estrutura:
                </p>
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                  {`{
  "success": boolean,
  "data": object | array | null,
  "error": string | undefined
}`}
                </pre>
              </CardContent>
            </Card>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Endpoints Disponíveis</h2>

            {endpoints.map((endpoint) => (
              <Card key={endpoint.id} id={endpoint.id} className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{endpoint.name}</span>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(endpoint.request, `${endpoint.id}-request`)}
                        className="flex items-center gap-1"
                      >
                        {copiedEndpoint === `${endpoint.id}-request` ? (
                          <CheckIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <CopyIcon className="h-4 w-4" />
                        )}
                        <span>Copiar Request</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(endpoint.response, `${endpoint.id}-response`)}
                        className="flex items-center gap-1"
                      >
                        {copiedEndpoint === `${endpoint.id}-response` ? (
                          <CheckIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <CopyIcon className="h-4 w-4" />
                        )}
                        <span>Copiar Response</span>
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>{endpoint.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Request</h3>
                      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">{endpoint.request}</pre>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Response</h3>
                      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">{endpoint.response}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="server-actions">
          <Card>
            <CardHeader>
              <CardTitle>Server Actions</CardTitle>
              <CardDescription>
                Além da API REST, você pode usar Server Actions para interagir com o sistema diretamente de componentes
                React.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Os Server Actions estão disponíveis no arquivo <code>lib/actions.ts</code> e podem ser importados e
                usados em componentes do lado do cliente.
              </p>

              <h3 className="text-lg font-medium mt-6 mb-3">Exemplo de uso:</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                {`// Em um componente do lado do cliente
"use client"

import { addPatient } from '@/lib/actions';
import { useState } from 'react';

export default function CreatePatientForm() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await addPatient({ name, birthDate });
    
    if (result.success) {
      // Paciente criado com sucesso
      console.log('Paciente criado:', result.data);
    } else {
      // Erro ao criar paciente
      console.error('Erro:', result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
    </form>
  );
}`}
              </pre>

              <h3 className="text-lg font-medium mt-6 mb-3">Server Actions Disponíveis:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <code>addPatient(data)</code> - Adiciona um novo paciente
                </li>
                <li>
                  <code>editPatient(id, data)</code> - Edita um paciente existente
                </li>
                <li>
                  <code>removePatient(id)</code> - Remove um paciente
                </li>
                <li>
                  <code>addAssessment(data)</code> - Adiciona uma nova avaliação
                </li>
                <li>
                  <code>editAssessment(id, data)</code> - Edita uma avaliação existente
                </li>
                <li>
                  <code>removeAssessment(id)</code> - Remove uma avaliação
                </li>
                <li>
                  <code>updateResponses(assessmentId, section, responses)</code> - Atualiza respostas de uma avaliação
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
