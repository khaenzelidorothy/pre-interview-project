import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class APIClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Survey endpoints
  getSurveys(filters?: { is_active?: boolean; search?: string; page?: number }) {
    const params = new URLSearchParams();
    if (filters?.is_active !== undefined) params.append('is_active', String(filters.is_active));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));

    return this.instance.get(`/surveys/?${params.toString()}`);
  }

  getSurvey(id: string) {
    return this.instance.get(`/surveys/${id}/`);
  }

  createSurvey(data: { name: string; description: string; is_active: boolean }) {
    return this.instance.post('/surveys/', data);
  }

  updateSurvey(id: string, data: { name?: string; description?: string; is_active?: boolean }) {
    return this.instance.put(`/surveys/${id}/`, data);
  }

  deleteSurvey(id: string) {
    return this.instance.delete(`/surveys/${id}/`);
  }

  getSurveyResponses(surveyId: string, filters?: { email?: string }) {
    const params = new URLSearchParams();
    if (filters?.email) params.append('email', filters.email);

    return this.instance.get(`/surveys/${surveyId}/responses/?${params.toString()}`);
  }

  createSurveyResponse(surveyId: string, respondentEmail: string) {
    return this.instance.post(`/surveys/${surveyId}/create_response/`, {
      respondent_email: respondentEmail,
    });
  }

  // Question endpoints
  getQuestions(filters?: { survey?: string; question_type?: string }) {
    const params = new URLSearchParams();
    if (filters?.survey) params.append('survey', filters.survey);
    if (filters?.question_type) params.append('question_type', filters.question_type);

    return this.instance.get(`/questions/?${params.toString()}`);
  }

  createQuestion(data: {
    survey: string;
    question_text: string;
    question_type: string;
    order: number;
    is_required: boolean;
  }) {
    return this.instance.post('/questions/', data);
  }

  updateQuestion(id: string, data: any) {
    return this.instance.put(`/questions/${id}/`, data);
  }

  deleteQuestion(id: string) {
    return this.instance.delete(`/questions/${id}/`);
  }

  // Question Option endpoints
  createOption(data: { question: string; option_text: string; order: number }) {
    return this.instance.post('/options/', data);
  }

  updateOption(id: string, data: { option_text?: string; order?: number }) {
    return this.instance.put(`/options/${id}/`, data);
  }

  deleteOption(id: string) {
    return this.instance.delete(`/options/${id}/`);
  }

  // Response endpoints
  getResponses(filters?: { survey?: string; is_complete?: boolean; email?: string; page?: number }) {
    const params = new URLSearchParams();
    if (filters?.survey) params.append('survey', filters.survey);
    if (filters?.is_complete !== undefined) params.append('is_complete', String(filters.is_complete));
    if (filters?.email) params.append('search', filters.email);
    if (filters?.page) params.append('page', String(filters.page));

    return this.instance.get(`/responses/?${params.toString()}`);
  }

  getResponse(id: string) {
    return this.instance.get(`/responses/${id}/`);
  }

  markResponseComplete(id: string) {
    return this.instance.post(`/responses/${id}/mark_complete/`);
  }

  submitAnswer(responseId: string, data: any) {
    return this.instance.post(`/responses/${responseId}/submit_answer/`, data);
  }

  // Generic request method for XML responses
  getAsXML(endpoint: string) {
    return this.instance.get(`${endpoint}?format=xml`);
  }
}

export default new APIClient();
