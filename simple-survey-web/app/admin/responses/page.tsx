'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';

interface Response {
  id: string;
  survey: string;
  respondent_email: string;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

interface Survey {
  id: string;
  name: string;
}

export default function ResponsesPage() {
  const router = useRouter();
  const [responses, setResponses] = useState<Response[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSurveys();
    fetchResponses();
  }, [selectedSurvey]);

  const fetchSurveys = async () => {
    try {
      const response = await apiClient.getSurveys();
      setSurveys(response.data.results || response.data);
    } catch (err: any) {
      console.error('Error fetching surveys:', err);
    }
  };

  const fetchResponses = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (selectedSurvey) {
        filters.survey = selectedSurvey;
      }
      const response = await apiClient.getResponses(filters);
      setResponses(response.data.results || response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch responses');
    } finally {
      setLoading(false);
    }
  };

  const getSurveyName = (surveyId: string) => {
    return surveys.find((s) => s.id === surveyId)?.name || 'Unknown Survey';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Survey Responses</h1>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.filterCard}>
        <label>Filter by Survey:</label>
        <select
          value={selectedSurvey}
          onChange={(e) => setSelectedSurvey(e.target.value)}
          style={styles.select}
        >
          <option value="">All Surveys</option>
          {surveys.map((survey) => (
            <option key={survey.id} value={survey.id}>
              {survey.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading responses...</p>
      ) : responses.length === 0 ? (
        <div style={styles.empty}>
          <p>No responses found.</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Survey</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => (
                <tr key={response.id} style={styles.row}>
                  <td style={styles.td}>{getSurveyName(response.survey)}</td>
                  <td style={styles.td}>{response.respondent_email}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        backgroundColor: response.is_complete ? '#dbeafe' : '#fef3c7',
                        color: response.is_complete ? '#1e40af' : '#92400e',
                      }}
                    >
                      {response.is_complete ? 'Complete' : 'Incomplete'}
                    </span>
                  </td>
                  <td style={styles.td}>{formatDate(response.created_at)}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.viewButton}
                      onClick={() => router.push(`/admin/responses/${response.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    marginBottom: '30px',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
  },
  filterCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    minWidth: '200px',
  },
  empty: {
    backgroundColor: 'white',
    padding: '40px 20px',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#6b7280',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  headerRow: {
    backgroundColor: '#f3f4f6',
    borderBottom: '2px solid #e5e7eb',
  },
  th: {
    padding: '15px',
    textAlign: 'left' as const,
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#374151',
  },
  row: {
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '15px',
    fontSize: '14px',
    color: '#1f2937',
  },
  status: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  viewButton: {
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
  },
};
