import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Survey endpoints
export const getSurveys = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.is_active !== undefined) params.append('is_active', String(filters.is_active));
  if (filters.search) params.append('search', filters.search);
  if (filters.page) params.append('page', String(filters.page));

  return apiClient.get(`/surveys/?${params.toString()}`);
};

export const getSurvey = (id) => {
  return apiClient.get(`/surveys/${id}/`);
};

// Response endpoints
export const createSurveyResponse = (surveyId, respondentEmail) => {
  return apiClient.post(`/surveys/${surveyId}/create_response/`, {
    respondent_email: respondentEmail,
  });
};

export const getResponse = (id) => {
  return apiClient.get(`/responses/${id}/`);
};

export const submitAnswer = (responseId, data) => {
  return apiClient.post(`/responses/${responseId}/submit_answer/`, data);
};

export const markResponseComplete = (id) => {
  return apiClient.post(`/responses/${id}/mark_complete/`);
};

// Error handler
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.detail || error.response.data?.error || 'An error occurred';
  } else if (error.request) {
    return 'No response from server';
  } else {
    return error.message || 'An error occurred';
  }
};
