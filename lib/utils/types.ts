export interface Patient {
  id: string
  name: string
  birthDate: string
}

export interface Assessment {
  id: string;
  patientId: string;
  date: string;
  notes: string;
  responses: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 