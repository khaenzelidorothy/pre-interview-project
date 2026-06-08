'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import apiClient from '@/lib/apiClient';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  is_required: boolean;
  options?: any[];
}

interface Survey {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

const QUESTION_TYPES = {
  short_text: 'Short Text',
  long_text: 'Long Text',
  email: 'Email',
  single_choice: 'Single Choice',
  multiple_choice: 'Multiple Choice',
  file_upload: 'File Upload',
};

export default function SurveyResponse() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const surveyId = params.id as string;
  const userEmail = searchParams.get('email') || '';

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responseId, setResponseId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchSurvey();
    createResponse();
  }, [surveyId, userEmail]);

  const fetchSurvey = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getSurvey(surveyId);
      setSurvey(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch survey');
    } finally {
      setLoading(false);
    }
  };

  const createResponse = async () => {
    try {
      const response = await apiClient.createSurveyResponse(surveyId, userEmail);
      setResponseId(response.data.id);
    } catch (err: any) {
      console.error('Error creating response:', err);
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const submitCurrentAnswer = async () => {
    if (!responseId || currentStep >= survey!.questions.length) return;

    const question = survey!.questions[currentStep];
    const answer = answers[question.id];

    if (question.is_required && !answer) {
      setError('This question is required');
      return;
    }

    try {
      setSubmitting(true);
      const payload: any = { question_id: question.id };

      if (question.question_type === 'single_choice' || question.question_type === 'multiple_choice') {
        payload.option_ids = Array.isArray(answer) ? answer : [answer];
      } else {
        payload.answer_text = answer;
      }

      await apiClient.submitAnswer(responseId, payload);
      setError(null);
      
      if (currentStep < survey!.questions.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteResponse = async () => {
    if (!responseId) return;

    try {
      setSubmitting(true);
      await apiClient.markResponseComplete(responseId);
      router.push(`/user/thank-you`);
    } catch (err: any) {
      setError(err.message || 'Failed to complete survey');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={styles.container}><p>Loading survey...</p></div>;
  if (!survey) return <div style={styles.container}><p>Survey not found</p></div>;

  const question = survey.questions[currentStep];
  const isLastQuestion = currentStep === survey.questions.length - 1;
  const currentAnswer = answers[question?.id];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          onClick={() => router.push('/user')}
          style={styles.backButton}
        >
          ← Back
        </button>
        <div>
          <h1>{survey.name}</h1>
          <p style={styles.description}>{survey.description}</p>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.card}>
        <div style={styles.progress}>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${((currentStep + 1) / survey.questions.length) * 100}%`,
              }}
            />
          </div>
          <span style={styles.progressText}>
            Question {currentStep + 1} of {survey.questions.length}
          </span>
        </div>

        {question && (
          <div style={styles.questionSection}>
            <h2 style={styles.questionText}>{question.question_text}</h2>
            {question.is_required && <span style={styles.required}>*</span>}

            <div style={styles.answerSection}>
              {question.question_type === 'short_text' && (
                <input
                  type="text"
                  value={currentAnswer || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  style={styles.input}
                  placeholder="Enter your answer"
                />
              )}

              {question.question_type === 'long_text' && (
                <textarea
                  value={currentAnswer || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  style={styles.textarea}
                  rows={5}
                  placeholder="Enter your answer"
                />
              )}

              {question.question_type === 'email' && (
                <input
                  type="email"
                  value={currentAnswer || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  style={styles.input}
                  placeholder="Enter your email"
                />
              )}

              {question.question_type === 'single_choice' && (
                <div style={styles.optionsContainer}>
                  {question.options?.map((option) => (
                    <label key={option.id} style={styles.radioLabel}>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.id}
                        checked={currentAnswer === option.id}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      />
                      {option.option_text}
                    </label>
                  ))}
                </div>
              )}

              {question.question_type === 'multiple_choice' && (
                <div style={styles.optionsContainer}>
                  {question.options?.map((option) => (
                    <label key={option.id} style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        value={option.id}
                        checked={(currentAnswer || []).includes(option.id)}
                        onChange={(e) => {
                          const newAnswers = currentAnswer || [];
                          if (e.target.checked) {
                            newAnswers.push(option.id);
                          } else {
                            newAnswers.splice(newAnswers.indexOf(option.id), 1);
                          }
                          handleAnswerChange(question.id, newAnswers);
                        }}
                      />
                      {option.option_text}
                    </label>
                  ))}
                </div>
              )}

              {question.question_type === 'file_upload' && (
                <input
                  type="file"
                  onChange={(e) => handleAnswerChange(question.id, e.target.files?.[0])}
                  style={styles.fileInput}
                />
              )}
            </div>

            <div style={styles.actions}>
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  style={styles.prevButton}
                >
                  ← Previous
                </button>
              )}

              {isLastQuestion ? (
                <button
                  onClick={handleCompleteResponse}
                  disabled={submitting}
                  style={styles.submitButton}
                >
                  {submitting ? 'Submitting...' : 'Complete Survey'}
                </button>
              ) : (
                <button
                  onClick={submitCurrentAnswer}
                  disabled={submitting}
                  style={styles.nextButton}
                >
                  {submitting ? 'Saving...' : 'Next →'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '700px',
  },
  header: {
    marginBottom: '30px',
  },
  backButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '15px',
    fontSize: '14px',
  },
  description: {
    color: '#6b7280',
    fontSize: '14px',
    marginTop: '5px',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  progress: {
    marginBottom: '30px',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '10px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '13px',
    color: '#6b7280',
  },
  questionSection: {
    marginBottom: '20px',
  },
  questionText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '20px',
    margin: '0 0 20px 0',
  },
  required: {
    color: '#ef4444',
  },
  answerSection: {
    marginBottom: '30px',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    boxSizing: 'border-box' as const,
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  },
  fileInput: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: '10px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: '10px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '30px',
  },
  prevButton: {
    flex: 1,
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  nextButton: {
    flex: 1,
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  submitButton: {
    flex: 1,
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
