'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { useSurveyStore } from '@/lib/store';

interface Survey {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  question_count: number;
  response_count: number;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getSurveys({ is_active: true });
      setSurveys(response.data.results || response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch surveys');
      console.error('Error fetching surveys:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createSurvey({
        ...formData,
        is_active: true,
      });
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
      fetchSurveys();
    } catch (err: any) {
      setError(err.message || 'Failed to create survey');
    }
  };

  const handleDeleteSurvey = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        await apiClient.deleteSurvey(id);
        fetchSurveys();
      } catch (err: any) {
        setError(err.message || 'Failed to delete survey');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Surveys Management</h1>
        <button
          style={styles.createButton}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ New Survey'}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {showCreateForm && (
        <div style={styles.formCard}>
          <h2>Create New Survey</h2>
          <form onSubmit={handleCreateSurvey}>
            <div style={styles.formGroup}>
              <label>Survey Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={styles.textarea}
                rows={4}
              />
            </div>
            <button type="submit" style={styles.submitButton}>Create Survey</button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading surveys...</p>
      ) : surveys.length === 0 ? (
        <div style={styles.empty}>
          <p>No surveys found. Create one to get started!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {surveys.map((survey) => (
            <div key={survey.id} style={styles.surveyCard}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{survey.name}</h3>
                <span style={styles.badge}>{survey.is_active ? 'Active' : 'Inactive'}</span>
              </div>
              <p style={styles.description}>{survey.description}</p>
              <div style={styles.stats}>
                <span>{survey.question_count} Questions</span>
                <span>{survey.response_count} Responses</span>
              </div>
              <div style={styles.actions}>
                <button
                  style={styles.viewButton}
                  onClick={() => router.push(`/admin/surveys/${survey.id}`)}
                >
                  Manage
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDeleteSurvey(survey.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  createButton: {
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  formCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    marginTop: '5px',
  },
  textarea: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    marginTop: '5px',
    fontFamily: 'inherit',
  },
  submitButton: {
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
  },
  empty: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    color: '#6b7280',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  surveyCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  badge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  description: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '10px',
  },
  stats: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
    fontSize: '13px',
    color: '#374151',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
  },
};
