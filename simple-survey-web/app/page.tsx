'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Simple Survey Platform</h1>
        <p style={styles.description}>Survey Management System with Admin and User Portals</p>

        <div style={styles.buttonContainer}>
          <button
            style={styles.adminButton}
            onClick={() => router.push('/admin')}
          >
            Admin Panel
          </button>
          <button
            style={styles.userButton}
            onClick={() => router.push('/user')}
          >
            User Portal
          </button>
        </div>

        <div style={styles.features}>
          <h2>Features</h2>
          <ul>
            <li>Create and manage surveys</li>
            <li>Manage survey questions and options</li>
            <li>Track survey responses</li>
            <li>Support for multiple question types</li>
            <li>File upload capability</li>
            <li>Pagination and filtering</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '40px',
    maxWidth: '600px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  adminButton: {
    flex: 1,
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#0070f3',
    color: 'white',
    cursor: 'pointer',
    minWidth: '150px',
  },
  userButton: {
    flex: 1,
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#10b981',
    color: 'white',
    cursor: 'pointer',
    minWidth: '150px',
  },
  features: {
    marginTop: '30px',
    paddingTop: '30px',
    borderTop: '1px solid #eee',
  },
};
