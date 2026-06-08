'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';

interface Survey {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  question_count: number;
  created_at: string;
}

export default function UserSurveys() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(true);

  useEffect(() => {
    if (!showEmailForm) {
      fetchSurveys();
    }
  }, [showEmailForm]);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getSurveys({ is_active: true });
      setSurveys(response.data.results || response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch surveys');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSurvey = (surveyId: string) => {
    if (!userEmail.trim()) {
      setError('Please enter your email address');
      return;
    }
    router.push(`/user/surveys/${surveyId}?email=${encodeURIComponent(userEmail)}`);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail.trim()) {
      setShowEmailForm(false);
    }
  };

  return (
    <div style={styles.container}>
      {showEmailForm ? (
        <div style={styles.emailFormCard}>
          <h1>Welcome to Surveys</h1>
          <p style={styles.subtitle}>Please enter your email to start taking surveys</p>
          <form onSubmit={handleEmailSubmit}>
            <div style={styles.formGroup}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                style={styles.emailInput}
              />
            </div>
            <button type="submit" style={styles.startButton}>
              Continue
            </button>
          </form>
          <button
            onClick={() => setShowEmailForm(false)}
            style={styles.skipButton}
          >
            Skip for now
          </button>
        </div>
      ) : (
        <>
          <div style={styles.header}>
            <div>
              <h1>Available Surveys</h1>
              {userEmail && <p style={styles.emailDisplay}>Responding as: {userEmail}</p>}
            </div>
            <button
              style={styles.changeEmailButton}
              onClick={() => {
                setShowEmailForm(true);
                setUserEmail('');
              }}
            >
              Change Email
            </button>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          {loading ? (
            <p>Loading surveys...</p>
          ) : surveys.length === 0 ? (
            <div style={styles.empty}>
              <p>No surveys available at the moment.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {surveys.map((survey) => (
                <div key={survey.id} style={styles.surveyCard}>
                  <h3 style={styles.surveyTitle}>{survey.name}</h3>
                  <p style={styles.surveyDescription}>{survey.description}</p>
                  <div style={styles.surveyMeta}>
                    <span>{survey.question_count} questions</span>
                  </div>
                  <button
                    style={styles.takeSurveyButton}
                    onClick={() => handleStartSurvey(survey.id)}
                  >
                    Take Survey
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1000px',
  },
  emailFormCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    margin: '50px auto',
    textAlign: 'center',
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: '25px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  emailInput: {
    width: '100%',
    padding: '12px 15px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    boxSizing: 'border-box' as const,
  },
  startButton: {
    width: '100%',
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  skipButton: {
    width: '100%',
    padding: '10px 20px',
    fontSize: '14px',
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
  },
  emailDisplay: {
    color: '#6b7280',
    fontSize: '14px',
    marginTop: '5px',
  },
  changeEmailButton: {
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
  empty: {
    backgroundColor: 'white',
    padding: '40px 20px',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#6b7280',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  surveyCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  surveyTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '10px',
    margin: '0 0 10px 0',
  },
  surveyDescription: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  surveyMeta: {
    fontSize: '13px',
    color: '#9ca3af',
    marginBottom: '15px',
  },
  takeSurveyButton: {
    width: '100%',
    padding: '10px 15px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
