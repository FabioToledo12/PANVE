import { v4 as uuidv4 } from 'uuid';

// Tipos
export interface Assessment {
  id: string;
  date: string;
  notes: string;
  responses: any[];
}

// Banco de dados em memória
const assessments: Assessment[] = [];

// Funções do banco de dados
export async function getAssessment(id: string): Promise<Assessment | null> {
  return assessments.find(a => a.id === id) || null;
}

export async function createAssessment(data: Omit<Assessment, 'id'>): Promise<Assessment> {
  const newAssessment: Assessment = {
    id: uuidv4(),
    ...data
  };
  assessments.push(newAssessment);
  return newAssessment;
}

export async function updateAssessment(id: string, data: Partial<Assessment>): Promise<Assessment | null> {
  const index = assessments.findIndex(a => a.id === id);
  if (index === -1) return null;

  assessments[index] = {
    ...assessments[index],
    ...data
  };
  return assessments[index];
}

export async function deleteAssessment(id: string): Promise<boolean> {
  const index = assessments.findIndex(a => a.id === id);
  if (index === -1) return false;

  assessments.splice(index, 1);
  return true;
}

export async function getAllAssessments(): Promise<Assessment[]> {
  return [...assessments];
} 