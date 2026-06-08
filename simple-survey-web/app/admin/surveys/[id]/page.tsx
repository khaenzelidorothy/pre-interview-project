'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  order: number;
  is_required: boolean;
  options?: any[];
}

interface Survey {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  questions: Question[];
}

const QUESTION_TYPES = [
  { value: 'short_text', label: 'Short Text' },
  { value: 'long_text', label: 'Long Text' },
  { value: 'email', label: 'Email' },
  { value: 'single_choice', label: 'Single Choice' },
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'file_upload', label: 'File Upload' },
];

export default function SurveyDetail() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.id as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question_text: '',
    question_type: 'short_text',
    is_required: true,
    order: 0,
  });

  useEffect(() => {
    fetchSurvey();
  }, [surveyId]);

  const fetchSurvey = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getSurvey(surveyId);
      setSurvey(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch survey');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createQuestion({
        survey: surveyId,
        ...formData,
        order: survey?.questions.length || 0,
      });
      setFormData({
        question_text: '',
        question_type: 'short_text',
        is_required: true,
        order: 0,
      });
      setShowQuestionForm(false);
      fetchSurvey();
    } catch (err: any) {
      setError(err.message || 'Failed to create question');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await apiClient.deleteQuestion(questionId);
        fetchSurvey();
      } catch (err: any) {
        setError(err.message || 'Failed to delete question');
      }
    }
  };

  if (loading) return <div>Loading survey...</div>;
  if (!survey) return <div>Survey not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1>{survey.name}</h1>
          <p style={styles.description}>{survey.description}</p>
        </div>
        <button style={styles.backButton} onClick={() => router.push('/admin')}>
          ← Back
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2>Questions</h2>
          <button
            style={styles.addButton}
            onClick={() => setShowQuestionForm(!showQuestionForm)}
          >
            {showQuestionForm ? '− Cancel' : '+ Add Question'}
          </button>
        </div>

        {showQuestionForm && (
          <form onSubmit={handleCreateQuestion} style={styles.form}>
            <div style={styles.formGroup}>
              <label>Question Text *</label>
              <textarea
                required
                value={formData.question_text}
                onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                style={styles.textarea}
                rows={3}
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label>Question Type *</label>
                <select
                  value={formData.question_type}
                  onChange={(e) => setFormData({ ...formData, question_type: e.target.value })}
                  style={styles.select}
                >
                  {QUESTION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.checkboxGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_required}
                    onChange={(e) => setFormData({ ...formData, is_required: e.target.checked })}
                  />
                  Required
                </label>
              </div>
            </div>

            <button type="submit" style={styles.submitButton}>
              Add Question
            </button>
          </form>
        )}

        {survey.questions.length === 0 ? (
          <p style={styles.empty}>No questions added yet.</p>
        ) : (
          <div style={styles.questionsList}>
            {survey.questions.map((question, index) => (
              <div key={question.id} style={styles.questionCard}>
                <div style={styles.questionHeader}>
                  <div>
                    <h3 style={styles.questionNumber}>Question {index + 1}</h3>
                    <p style={styles.questionText}>{question.question_text}</p>
                  </div>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    Delete
                  </button>
                </div>
                <div style={styles.questionMeta}>
                  <span>{QUESTION_TYPES.find((t) => t.value === question.question_type)?.label}</span>
                  <span>{question.is_required ? 'Required' : 'Optional'}</span>
                  {question.options && question.options.length > 0 && (
                    <span>{question.options.length} options</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '900px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  description: {
    color: '#6b7280',
    marginTop: '5px',
    fontSize: '14px',
  },
  backButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
  },
  section: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  addButton: {
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '6px',
    marginBottom: '20px',
    border: '1px solid #e5e7eb',
  },
  formGroup: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
  },
  formRow: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
  },
  textarea: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    marginTop: '5px',
    fontFamily: 'inherit',
  },
  select: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    marginTop: '5px',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'flex-end',
    marginTop: '20px',
  },
  submitButton: {
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  empty: {
    color: '#6b7280',
    textAlign: 'center',
    padding: '20px',
  },
  questionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  questionCard: {
    border: '1px solid #e5e7eb',
    padding: '15px',
    borderRadius: '6px',
    backgroundColor: '#f9fafb',
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  questionNumber: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '5px 0 0 0',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  questionMeta: {
    display: 'flex',
    gap: '10px',
    fontSize: '12px',
    color: '#6b7280',
  },
};
