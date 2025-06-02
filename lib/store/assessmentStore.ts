import { create } from 'zustand'

interface AssessmentState {
  patientName?: string
  setPatientName: (name: string) => void
  responses: Record<string, any>
  resetResponses: () => void
  updateResponses: (section: string, sectionResponses: Record<string, any>) => void
}

export const useAssessmentStore = create<AssessmentState>((set) => ({
  patientName: undefined,
  setPatientName: (name) => set({ patientName: name }),
  responses: {},
  resetResponses: () => set({ responses: {} }),
  updateResponses: (section, sectionResponses) => 
    set((state) => ({
      responses: {
        ...state.responses,
        [section]: sectionResponses
      }
    }))
}))

export default useAssessmentStore; 