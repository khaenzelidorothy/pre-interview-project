import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSurveyStore } from './store/surveyStore';

export default function HomeScreen() {
  const router = useRouter();
  const { setUserEmail } = useSurveyStore();
  const [email, setEmail] = React.useState('');

  const handleStartSurveys = () => {
    if (!email.trim()) {
      alert('Please enter your email');
      return;
    }
    setUserEmail(email);
    router.push('/survey-list');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Simple Survey</Text>
        <Text style={styles.subtitle}>Mobile Survey Application</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Enter your email to get started:</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.button} onPress={handleStartSurveys}>
            <Text style={styles.buttonText}>Start Taking Surveys</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoTitle}>About This App</Text>
          <Text style={styles.infoText}>• Discover available surveys</Text>
          <Text style={styles.infoText}>• Answer survey questions step by step</Text>
          <Text style={styles.infoText}>• Submit your responses easily</Text>
          <Text style={styles.infoText}>• Support for multiple question types</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 10,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
    color: '#1f2937',
  },
  button: {
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    backgroundColor: '#dbeafe',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0070f3',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#1e40af',
    marginBottom: 6,
  },
});
