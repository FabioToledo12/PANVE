import type { Patient, Assessment, ApiResponse } from "@/lib/utils/types"

// Simulação de banco de dados em memória
let fakePatients: Patient[] = [
  { id: 'patient-1', name: 'Paciente Teste', birthDate: '2000-01-01' },
  { id: 'patient-2', name: 'Paciente Exemplo', birthDate: '2005-03-10' },
  { id: 'patient-fixed-id-1', name: 'Paciente com Avaliação Simulada', birthDate: '1995-05-20' }, // Ensure patient exists for the simulated assessment
  { id: 'patient-3', name: 'Novo Paciente Teste', birthDate: '2010-07-07' }, // Novo paciente
]

// Simulação de respostas de avaliação (manter se necessário para outras lógicas, mas o foco é fakeAssessments agora)
// let fakeAssessmentResponses: Record<string, { sectionA?: any }> = {}

// Simulação de avaliações
let fakeAssessments: Assessment[] = [
  {
    id: "assessment-fixed-id-1",
    patientId: "patient-fixed-id-1",
    date: "2023-10-27", // Using the date from the image
    responses: { // Adding simulated responses based on the 'Dominado' state in the image
      sectionA: {
        "A.1": { "someCategory:someBehavior": "mastered" }, // Simulate 'Dominado'
        "A.2": { "someCategory:someBehavior": "mastered" },
        "A.3": { "someCategory:someBehavior": "mastered" },
      },
      sectionB: {
        "B.1": { "someCategory:someBehavior": "mastered" }, // Simulate 'Dominado'
        "B.2": { "someCategory:someBehavior": "mastered" },
        "B.3": { "someCategory:someBehavior": "mastered" },
        "B.4": { "someCategory:someBehavior": "mastered" },
      },
      sectionC: { // Simulating all C questions as 'Dominado' based on visible part of image
        "C.1": { "someCategory:someBehavior": "mastered" },
        "C.2": { "someCategory:someBehavior": "mastered" },
        "C.3": { "someCategory:someBehavior": "mastered" },
        "C.4": { "someCategory:someBehavior": "mastered" },
        "C.5": { "someCategory:someBehavior": "mastered" },
        "C.6": { "someCategory:someBehavior": "mastered" },
        "C.7": { "someCategory:someBehavior": "mastered" },
        "C.8": { "someCategory:someBehavior": "mastered" },
        "C.9": { "someCategory:someBehavior": "mastered" },
        "C.10": { "someCategory:someBehavior": "mastered" },
        "C.11": { "someCategory:someBehavior": "mastered" },
        "C.12": { "someCategory:someBehavior": "mastered" },
        "C.13": { "someCategory:someBehavior": "mastered" },
        "C.14": { "someCategory:someBehavior": "mastered" },
        "C.15": { "someCategory:someBehavior": "mastered" },
        "C.16": { "someCategory:someBehavior": "mastered" },
        "C.17": { "someCategory:someBehavior": "mastered" },
      } as Assessment['responses'],
      // Add other sections (D, E, F, G) with default or simulated data if needed
    },
    notes: "Simulação baseada na imagem 2023-10-27",
    createdAt: "2023-10-27T10:00:00.000Z",
    updatedAt: "2023-10-27T10:00:00.000Z",
  },
  { 
    id: 'assessment-patient1-scenario1', 
    patientId: 'patient-1', 
    date: '2023-11-01', 
    notes: 'Avaliação Paciente Teste - Cenário 1 (Emergente/Dominado)', 
    responses: {
      sectionA: { "A.1": {"b1":"emergent"}, "A.2": {"b1":"mastered"}, "A.3": { "b1": "emergent" } },
      sectionB: { "B.1": {"b1":"mastered"}, "B.2": {"b1":"emergent"}, "B.3": { "b1": "mastered" }, "B.4": { "b1": "emergent" } },
      sectionC: {}, // Garantir que a Seção C está vazia nesta simulação para refletir a imagem 2023-11-01
    } as Assessment['responses'],
    createdAt: '2023-11-01T10:00:00.000Z', 
    updatedAt: '2023-11-01T10:00:00.000Z' 
  },
  { 
    id: 'assessment-patient1-scenario2', 
    patientId: 'patient-1', 
    date: '2023-11-15', 
    notes: 'Avaliação Paciente Teste - Cenário 2 (Emergente/Não Usado)', 
    responses: {
      sectionA: { "A.1": {"b1":"not-used"}, "A.2": {"b1":"emergent"}, "A.3": {"b1":"not-used"} },
      sectionB: { "B.1": {"b1":"emergent"}, "B.2": {"b1":"not-used"}, "B.3": {"b1":"emergent"}, "B.4": {"b1":"not-used"} },
      sectionC: { 
        "C.1": {"b1":"emergent"}, "C.2": {"b1":"not-used"}, "C.3": {"b1":"emergent"}, "C.4": {"b1":"not-used"}, "C.5": {"b1":"emergent"},
        "C.6": {"b1":"not-used"}, "C.7": {"b1":"emergent"}, "C.8": {"b1":"not-used"}, "C.9": {"b1":"emergent"}, "C.10": {"b1":"not-used"},
        "C.11": {"b1":"emergent"}, "C.12": {"b1":"not-used"}, "C.13": {"b1":"emergent"}, "C.14": {"b1":"not-used"}, "C.15": {"b1":"emergent"},
        "C.16": {"b1":"not-used"}, "C.17": {"b1":"emergent"},
      } as Assessment['responses'],
    },
    createdAt: '2023-11-15T10:00:00.000Z', 
    updatedAt: '2023-11-15T10:00:00.000Z' 
  },
  { 
    id: 'assessment-patient1-scenario3', 
    patientId: 'patient-1', 
    date: '2023-11-29', 
    notes: 'Avaliação Paciente Teste - Cenário 3 (Baseado na Imagem 2023-11-29)', 
    responses: {
      sectionA: { "A.1": {"b1":"mastered"}, "A.2": {}, "A.3": {"b1":"mastered"} }, // Baseado na imagem
      sectionB: { "B.1": {"b1":"mastered"}, "B.2": {}, "B.3": {"b1":"mastered"}, "B.4": {} }, // Baseado na imagem
      sectionC: {}, // Vazio, baseado na imagem
    } as Assessment['responses'],
    createdAt: '2023-11-29T10:00:00.000Z', 
    updatedAt: '2023-11-29T10:00:00.000Z' 
  },
   { 
    id: 'assessment-patient2-scenario1', 
    patientId: 'patient-2', 
    date: '2023-12-01', 
    notes: 'Avaliação Paciente Exemplo - Cenário 1 (Emergente/Dominado)', 
    responses: {
       sectionA: { "A.1": {"b1":"mastered"}, "A.2": {"b1":"emergent"}, "A.3": {"b1":"mastered"} },
      sectionB: { "B.1": {"b1":"emergent"}, "B.2": {"b1":"mastered"}, "B.3": {"b1":"emergent"}, "B.4": {"b1":"mastered"} },
      sectionC: { 
        "C.1": {"b1":"emergent"}, "C.2": {"b1":"mastered"}, "C.3": {"b1":"emergent"}, "C.4": {"b1":"mastered"}, "C.5": {"b1":"emergent"},
        "C.6": {"b1":"mastered"}, "C.7": {"b1":"emergent"}, "C.8": {"b1":"mastered"}, "C.9": {"b1":"emergent"}, "C.10": {"b1":"mastered"},
        "C.11": {"b1":"emergent"}, "C.12": {"b1":"mastered"}, "C.13": {"b1":"emergent"}, "C.14": {"b1":"mastered"}, "C.15": {"b1":"emergent"},
        "C.16": {"b1":"mastered"}, "C.17": {"b1":"emergent"},
      } as Assessment['responses'],
    },
    createdAt: '2023-12-01T10:00:00.000Z', 
    updatedAt: '2023-12-01T10:00:00.000Z' 
  },
   { 
    id: 'assessment-patient2-scenario2', 
    patientId: 'patient-2', 
    date: '2023-12-15', 
    notes: 'Avaliação Paciente Exemplo - Cenário 2 (Não Usado/Dominado)', 
    responses: {
       sectionA: { "A.1": {"b1":"not-used"}, "A.2": {"b1":"mastered"}, "A.3": {"b1":"not-used"} },
      sectionB: { "B.1": {"b1":"mastered"}, "B.2": {"b1":"not-used"}, "B.3": {"b1":"mastered"}, "B.4": {"b1":"not-used"} },
      sectionC: { 
        "C.1": {"b1":"not-used"}, "C.2": {"b1":"mastered"}, "C.3": {"b1":"not-used"}, "C.4": {"b1":"mastered"}, "C.5": {"b1":"not-used"},
        "C.6": {"b1":"mastered"}, "C.7": {"b1":"not-used"}, "C.8": {"b1":"mastered"}, "C.9": {"b1":"not-used"}, "C.10": {"b1":"mastered"},
        "C.11": {"b1":"not-used"}, "C.12": {"b1":"mastered"}, "C.13": {"b1":"not-used"}, "C.14": {"b1":"mastered"}, "C.15": {"b1":"not-used"},
        "C.16": {"b1":"mastered"}, "C.17": {"b1":"not-used"},
      } as Assessment['responses'],
    },
    createdAt: '2023-12-15T10:00:00.000Z', 
    updatedAt: '2023-12-15T10:00:00.000Z' 
  },
  { 
    id: 'assessment-patient2-scenario3', 
    patientId: 'patient-2', 
    date: '2023-12-29', 
    notes: 'Avaliação Paciente Exemplo - Cenário 3 (Emergente/Não Usado)', 
    responses: {
       sectionA: { "A.1": {"b1":"emergent"}, "A.2": {"b1":"not-used"}, "A.3": {"b1":"emergent"} },
      sectionB: { "B.1": {"b1":"not-used"}, "B.2": {"b1":"emergent"}, "B.3": {"b1":"not-used"}, "B.4": {"b1":"emergent"} },
      sectionC: { 
        "C.1": {"b1":"not-used"}, "C.2": {"b1":"emergent"}, "C.3": {"b1":"not-used"}, "C.4": {"b1":"emergent"}, "C.5": {"b1":"not-used"},
        "C.6": {"b1":"emergent"}, "C.7": {"b1":"not-used"}, "C.8": {"b1":"emergent"}, "C.9": {"b1":"not-used"}, "C.10": {"b1":"emergent"},
        "C.11": {"b1":"not-used"}, "C.12": {"b1":"emergent"}, "C.13": {"b1":"not-used"}, "C.14": {"b1":"emergent"}, "C.15": {"b1":"not-used"},
        "C.16": {"b1":"emergent"}, "C.17": {"b1":"not-used"},
      } as Assessment['responses'],
    },
    createdAt: '2023-12-29T10:00:00.000Z', 
    updatedAt: '2023-12-29T10:00:00.000Z' 
  },
   { 
    id: 'assessment-patient-fixed-scenario2', 
    patientId: 'patient-fixed-id-1', 
    date: '2023-11-10', 
    notes: 'Avaliação Simulada - Cenário 2 (Emergente/Não Usado)', 
    responses: {
       sectionA: { "A.1": {"b1":"emergent"}, "A.2": {"b1":"not-used"}, "A.3": {"b1":"emergent"} },
      sectionB: { "B.1": {"b1":"not-used"}, "B.2": {"b1":"emergent"}, "B.3": {"b1":"not-used"}, "B.4": {"b1":"emergent"} },
      sectionC: { 
        "C.1": {"b1":"emergent"}, "C.2": {"b1":"not-used"}, "C.3": {"b1":"emergent"}, "C.4": {"b1":"not-used"}, "C.5": {"b1":"emergent"},
        "C.6": {"b1":"not-used"}, "C.7": {"b1":"emergent"}, "C.8": {"b1":"not-used"}, "C.9": {"b1":"emergent"}, "C.10": {"b1":"not-used"},
        "C.11": {"b1":"emergent"}, "C.12": {"b1":"not-used"}, "C.13": {"b1":"emergent"}, "C.14": {"b1":"not-used"}, "C.15": {"b1":"emergent"},
        "C.16": {"b1":"not-used"}, "C.17": {"b1":"emergent"},
      } as Assessment['responses'],
    },
    createdAt: '2023-11-10T10:00:00.000Z', 
    updatedAt: '2023-11-10T10:00:00.000Z' 
  },
   { 
    id: 'assessment-patient-fixed-scenario3', 
    patientId: 'patient-fixed-id-1', 
    date: '2023-12-05', 
    notes: 'Avaliação Simulada - Cenário 3 (Combinado)', 
    responses: {
       sectionA: { "A.1": {"b1":"mastered"}, "A.2": {"b1":"emergent"}, "A.3": {"b1":"not-used"} },
      sectionB: { "B.1": {"b1":"emergent"}, "B.2": {"b1":"mastered"}, "B.3": {"b1":"not-used"}, "B.4": {"b1":"emergent"} },
      sectionC: { 
        "C.1": {"b1":"mastered"}, "C.2": {"b1":"emergent"}, "C.3": {"b1":"not-used"}, "C.4": {"b1":"mastered"}, "C.5": {"b1":"emergent"},
        "C.6": {"b1":"not-used"}, "C.7": {"b1":"mastered"}, "C.8": {"b1":"emergent"}, "C.9": {"b1":"not-used"}, "C.10": {"b1":"mastered"},
        "C.11": {"b1":"emergent"}, "C.12": {"b1":"not-used"}, "C.13": {"b1":"mastered"}, "C.14": {"b1":"emergent"}, "C.15": {"b1":"not-used"},
        "C.16": {"b1":"mastered"}, "C.17": {"b1":"emergent"},
      } as Assessment['responses'],
    },
    createdAt: '2023-12-05T10:00:00.000Z', 
    updatedAt: '2023-12-05T10:00:00.000Z' 
  },
  // Novas avaliações mocadas adicionadas para testes
  {
    id: 'assessment-patient1-scenario4',
    patientId: 'patient-1',
    date: '2024-01-10',
    notes: 'Avaliação Paciente Teste - Cenário 4 (Mais Variedade)',
    responses: {
      sectionA: { "A.1": {"b1":"mastered"}, "A.2": {"b1":"not-used"}, "A.3": {"b1":"emergent"} },
      sectionB: { "B.1": {"b1":"not-used"}, "B.2": {"b1":"mastered"}, "B.3": {"b1":"emergent"}, "B.4": {"b1":"not-used"} },
      sectionC: { 
        "C.1": {"b1":"emergent"}, "C.2": {"b1":"mastered"}, "C.3": {"b1":"not-used"}, "C.4": {"b1":"emergent"}, "C.5": {"b1":"mastered"},
        "C.6": {"b1":"not-used"}, "C.7": {"b1":"emergent"}, "C.8": {"b1":"mastered"}, "C.9": {"b1":"not-used"}, "C.10": {"b1":"emergent"},
        "C.11": {"b1":"mastered"}, "C.12": {"b1":"not-used"}, "C.13": {"b1":"emergent"}, "C.14": {"b1":"mastered"}, "C.15": {"b1":"not-used"},
        "C.16": {"b1":"emergent"}, "C.17": {"b1":"mastered"},
      } as Assessment['responses'],
    },
    createdAt: '2024-01-10T10:00:00.000Z',
    updatedAt: '2024-01-10T10:00:00.000Z'
  },
  {
    id: 'assessment-patient2-scenario4',
    patientId: 'patient-2',
    date: '2024-01-12',
    notes: 'Avaliação Paciente Exemplo - Cenário 4 (Outra Combinação)',
    responses: {
      sectionA: { "A.1": {"b1":"not-used"}, "A.2": {"b1":"emergent"}, "A.3": {"b1":"mastered"} },
      sectionB: { "B.1": {"b1":"emergent"}, "B.2": {"b1":"not-used"}, "B.3": {"b1":"mastered"}, "B.4": {"b1":"emergent"} },
      sectionC: { 
        "C.1": {"b1":"mastered"}, "C.2": {"b1":"not-used"}, "C.3": {"b1":"emergent"}, "C.4": {"b1":"mastered"}, "C.5": {"b1":"not-used"},
        "C.6": {"b1":"emergent"}, "C.7": {"b1":"mastered"}, "C.8": {"b1":"not-used"}, "C.9": {"b1":"emergent"}, "C.10": {"b1":"mastered"},
        "C.11": {"b1":"not-used"}, "C.12": {"b1":"emergent"}, "C.13": {"b1":"mastered"}, "C.14": {"b1":"not-used"}, "C.15": {"b1":"emergent"},
        "C.16": {"b1":"mastered"}, "C.17": {"b1":"not-used"},
      } as Assessment['responses'],
    },
    createdAt: '2024-01-12T10:00:00.000Z',
    updatedAt: '2024-01-12T10:00:00.000Z'
  },
   {
    id: 'assessment-patient-fixed-scenario4',
    patientId: 'patient-fixed-id-1',
    date: '2024-01-15',
    notes: 'Avaliação Simulada - Cenário 4 (Mais Emergent/Not-Used)',
    responses: {
       sectionA: { "A.1": {"b1":"emergent"}, "A.2": {"b1":"emergent"}, "A.3": {"b1":"not-used"} },
      sectionB: { "B.1": {"b1":"emergent"}, "B.2": {"b1":"not-used"}, "B.3": {"b1":"emergent"}, "B.4": {"b1":"not-used"} },
      sectionC: { 
        "C.1": {"b1":"not-used"}, "C.2": {"b1":"emergent"}, "C.3": {"b1":"not-used"}, "C.4": {"b1":"emergent"}, "C.5": {"b1":"not-used"},
        "C.6": {"b1":"emergent"}, "C.7": {"b1":"not-used"}, "C.8": {"b1":"emergent"}, "C.9": {"b1":"not-used"}, "C.10": {"b1":"emergent"},
        "C.11": {"b1":"not-used"}, "C.12": {"b1":"emergent"}, "C.13": {"b1":"not-used"}, "C.14": {"b1":"emergent"}, "C.15": {"b1":"not-used"},
        "C.16": {"b1":"emergent"}, "C.17": {"b1":"not-used"},
      } as Assessment['responses'],
    },
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z'
  },
] as Assessment[];

// Adicionar uma avaliação para o novo paciente mocada
fakeAssessments.push({
  id: 'assessment-patient3-scenario1',
  patientId: 'patient-3',
  date: '2024-01-20',
  notes: 'Avaliação Novo Paciente - Cenário Inicial',
  responses: {
    sectionA: { "A.1": {"b1":"emergent"}, "A.2": {"b1":"emergent"}, "A.3": {"b1":"emergent"} },
    sectionB: { "B.1": {"b1":"emergent"}, "B.2": {"b1":"emergent"}, "B.3": {"b1":"emergent"}, "B.4": {"b1":"emergent"} },
    sectionC: { 
      "C.1": {"b1":"emergent"}, "C.2": {"b1":"emergent"}, "C.3": {"b1":"emergent"}, "C.4": {"b1":"emergent"}, "C.5": {"b1":"emergent"},
      "C.6": {"b1":"emergent"}, "C.7": {"b1":"emergent"}, "C.8": {"b1":"emergent"}, "C.9": {"b1":"emergent"}, "C.10": {"b1":"emergent"},
      "C.11": {"b1":"emergent"}, "C.12": {"b1":"emergent"}, "C.13": {"b1":"emergent"}, "C.14": {"b1":"emergent"}, "C.15": {"b1":"emergent"},
      "C.16": {"b1":"emergent"}, "C.17": {"b1":"emergent"},
    } as Assessment['responses'],
  },
  createdAt: '2024-01-20T10:00:00.000Z',
  updatedAt: '2024-01-20T10:00:00.000Z'
});

export const PatientsAPI = {
  getAll: async (): Promise<ApiResponse<Patient[]>> => ({ success: true, data: fakePatients }),
  getById: async (id: string): Promise<ApiResponse<Patient>> => {
    const patient = fakePatients.find(p => p.id === id)
    return patient ? { success: true, data: patient } : { success: false, error: 'Paciente não encontrado' }
  },
  create: async (data: { name: string; birthDate: string }): Promise<ApiResponse<Patient>> => {
    const newPatient: Patient = { id: `patient-${Date.now()}-${Math.random().toString(36).substring(2)}`, ...data }
    fakePatients.push(newPatient)
    return { success: true, data: newPatient }
  },
  // ...adicione outros métodos conforme necessário
}

export const AssessmentsAPI = {
  create: async (data: any): Promise<ApiResponse<any>> => ({ success: true, data: { id: `assessment-${Date.now()}-${Math.random().toString(36).substring(2)}`, ...data } }),
  getById: async (id: string): Promise<ApiResponse<Assessment>> => {
    const assessment = fakeAssessments.find(a => a.id === id);
    return assessment ? { success: true, data: assessment } : { success: false, error: 'Avaliação não encontrada' };
  },
  getAll: async (patientId?: string): Promise<ApiResponse<Assessment[]>> => {
    const assessments = patientId ? fakeAssessments.filter(a => a.patientId === patientId) : fakeAssessments;
    return { success: true, data: assessments };
  },
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const initialLength = fakeAssessments.length;
    fakeAssessments = fakeAssessments.filter(a => a.id !== id);
    const success = fakeAssessments.length < initialLength;
    return success ? { success: true } : { success: false, error: 'Avaliação não encontrada para exclusão' };
  }
  // ...adicione outros métodos conforme necessário
} 