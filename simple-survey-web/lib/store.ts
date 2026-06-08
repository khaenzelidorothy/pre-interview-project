import { create } from 'zustand';

interface Survey {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  questions?: any[];
  created_at: string;
  updated_at: string;
}

interface Response {
  id: string;
  survey: string;
  respondent_email: string;
  is_complete: boolean;
  answers?: any[];
  created_at: string;
  updated_at: string;
}

interface SurveyStore {
  // Surveys
  surveys: Survey[];
  currentSurvey: Survey | null;
  setSurveys: (surveys: Survey[]) => void;
  setCurrentSurvey: (survey: Survey | null) => void;
  addSurvey: (survey: Survey) => void;
  updateSurvey: (id: string, survey: Partial<Survey>) => void;
  removeSurvey: (id: string) => void;

  // Responses
  responses: Response[];
  currentResponse: Response | null;
  setResponses: (responses: Response[]) => void;
  setCurrentResponse: (response: Response | null) => void;
  addResponse: (response: Response) => void;
  updateResponse: (id: string, response: Partial<Response>) => void;

  // UI State
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Admin specific
  adminUserId: string | null;
  setAdminUserId: (id: string | null) => void;

  // User specific
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
}

export const useSurveyStore = create<SurveyStore>((set) => ({
  // Surveys
  surveys: [],
  currentSurvey: null,
  setSurveys: (surveys) => set({ surveys }),
  setCurrentSurvey: (survey) => set({ currentSurvey: survey }),
  addSurvey: (survey) => set((state) => ({ surveys: [...state.surveys, survey] })),
  updateSurvey: (id, survey) =>
    set((state) => ({
      surveys: state.surveys.map((s) => (s.id === id ? { ...s, ...survey } : s)),
      currentSurvey: state.currentSurvey?.id === id ? { ...state.currentSurvey, ...survey } : state.currentSurvey,
    })),
  removeSurvey: (id) =>
    set((state) => ({
      surveys: state.surveys.filter((s) => s.id !== id),
      currentSurvey: state.currentSurvey?.id === id ? null : state.currentSurvey,
    })),

  // Responses
  responses: [],
  currentResponse: null,
  setResponses: (responses) => set({ responses }),
  setCurrentResponse: (response) => set({ currentResponse: response }),
  addResponse: (response) => set((state) => ({ responses: [...state.responses, response] })),
  updateResponse: (id, response) =>
    set((state) => ({
      responses: state.responses.map((r) => (r.id === id ? { ...r, ...response } : r)),
      currentResponse: state.currentResponse?.id === id ? { ...state.currentResponse, ...response } : state.currentResponse,
    })),

  // UI State
  loading: false,
  error: null,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Admin specific
  adminUserId: null,
  setAdminUserId: (id) => set({ adminUserId: id }),

  // User specific
  userEmail: null,
  setUserEmail: (email) => set({ userEmail: email }),
}));
