import { create } from 'zustand';

export const useSurveyStore = create((set) => ({
  // Survey List
  surveys: [],
  setSurveys: (surveys) => set({ surveys }),

  // Current Survey
  currentSurvey: null,
  setCurrentSurvey: (survey) => set({ currentSurvey: survey }),

  // Current Response
  currentResponse: null,
  setCurrentResponse: (response) => set({ currentResponse: response }),

  // User Email
  userEmail: '',
  setUserEmail: (email) => set({ userEmail: email }),

  // Current Question Step
  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),

  // Answers
  answers: {},
  setAnswers: (answers) => set({ answers }),
  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: answer,
      },
    })),

  // UI State
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error }),

  // Reset
  reset: () =>
    set({
      currentSurvey: null,
      currentResponse: null,
      currentStep: 0,
      answers: {},
      error: null,
    }),
}));
