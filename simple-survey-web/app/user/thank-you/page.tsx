'use client';

import { useRouter } from 'next/navigation';

export default function ThankYou() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.checkmark}>✓</div>
        <h1>Thank You!</h1>
        <p style={styles.message}>
          Your survey response has been successfully submitted.
        </p>
        <p style={styles.submessage}>
          We appreciate your feedback and time.
        </p>
        <div style={styles.actions}>
          <button
            onClick={() => router.push('/user')}
            style={styles.button}
          >
            Take Another Survey
          </button>
          <button
            onClick={() => router.push('/')}
            style={styles.secondaryButton}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '400px',
  },
  checkmark: {
    fontSize: '48px',
    color: '#10b981',
    marginBottom: '20px',
  },
  message: {
    fontSize: '16px',
    color: '#1f2937',
    marginBottom: '10px',
  },
  submessage: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '30px',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  button: {
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
