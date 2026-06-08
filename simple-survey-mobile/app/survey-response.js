import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSurveyStore } from './store/surveyStore';
import {
  getSurvey,
  createSurveyResponse,
  submitAnswer,
  markResponseComplete,
  handleApiError,
} from './utils/apiClient';

export default function SurveyResponseScreen() {
  const router = useRouter();
  const {
    currentSurvey,
    currentResponse,
    setCurrentResponse,
    currentStep,
    setCurrentStep,
    answers,
    setAnswer,
    setLoading,
    loading,
    error,
    setError,
    userEmail,
  } = useSurveyStore();

  const [survey, setSurvey] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);

  useEffect(() => {
    if (currentSurvey) {
      fetchSurveyDetails();
      createResponse();
    }
  }, [currentSurvey]);

  const fetchSurveyDetails = async () => {
    try {
      setLoading(true);
      const response = await getSurvey(currentSurvey.id);
      setSurvey(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const createResponse = async () => {
    try {
      const response = await createSurveyResponse(currentSurvey.id, userEmail);
      setCurrentResponse(response.data);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const submitCurrentAnswer = async () => {
    if (!survey || !currentResponse) return;

    const question = survey.questions[currentStep];
    const answer = answers[question.id];

    if (question.is_required && !answer) {
      setError('This question is required');
      return;
    }

    try {
      setSubmitting(true);
      const payload = { question_id: question.id };

      if (
        question.question_type === 'single_choice' ||
        question.question_type === 'multiple_choice'
      ) {
        payload.option_ids = Array.isArray(answer) ? answer : [answer];
      } else {
        payload.answer_text = answer;
      }

      await submitAnswer(currentResponse.id, payload);
      setError(null);

      if (currentStep < survey.questions.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteSurvey = async () => {
    if (!currentResponse) return;

    try {
      setSubmitting(true);
      await markResponseComplete(currentResponse.id);
      router.push('/thank-you');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!survey) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Survey not found</Text>
      </View>
    );
  }

  const question = survey.questions[currentStep];
  const isLastQuestion = currentStep === survey.questions.length - 1;
  const currentAnswer = answers[question?.id];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{survey.name}</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentStep + 1) / survey.questions.length) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Question {currentStep + 1} of {survey.questions.length}
          </Text>
        </View>

        <View style={styles.questionSection}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionText}>{question.question_text}</Text>
            {question.is_required && <Text style={styles.required}>*</Text>}
          </View>

          <View style={styles.answerSection}>
            {(question.question_type === 'short_text' ||
              question.question_type === 'email') && (
              <TextInput
                style={styles.input}
                placeholder="Enter your answer"
                placeholderTextColor="#999"
                value={currentAnswer || ''}
                onChangeText={(text) => setAnswer(question.id, text)}
                keyboardType={
                  question.question_type === 'email' ? 'email-address' : 'default'
                }
                autoCapitalize={
                  question.question_type === 'email' ? 'none' : 'sentences'
                }
              />
            )}

            {question.question_type === 'long_text' && (
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Enter your answer"
                placeholderTextColor="#999"
                value={currentAnswer || ''}
                onChangeText={(text) => setAnswer(question.id, text)}
                multiline
                numberOfLines={5}
              />
            )}

            {(question.question_type === 'single_choice' ||
              question.question_type === 'multiple_choice') && (
              <View style={styles.optionsContainer}>
                {question.options?.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionButton,
                      (question.question_type === 'single_choice'
                        ? currentAnswer === option.id
                        : (currentAnswer || []).includes(option.id)) &&
                        styles.optionButtonSelected,
                    ]}
                    onPress={() => {
                      if (question.question_type === 'single_choice') {
                        setAnswer(question.id, option.id);
                      } else {
                        const newAnswers = currentAnswer || [];
                        const index = newAnswers.indexOf(option.id);
                        if (index > -1) {
                          newAnswers.splice(index, 1);
                        } else {
                          newAnswers.push(option.id);
                        }
                        setAnswer(question.id, newAnswers);
                      }
                    }}
                  >
                    <Text style={styles.optionText}>{option.option_text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        {currentStep > 0 && (
          <TouchableOpacity
            style={styles.prevButton}
            onPress={() => setCurrentStep(currentStep - 1)}
          >
            <Text style={styles.prevButtonText}>← Previous</Text>
          </TouchableOpacity>
        )}

        {isLastQuestion ? (
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.disabled]}
            onPress={handleCompleteSurvey}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Submitting...' : 'Complete Survey'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextButton, submitting && styles.disabled]}
            onPress={submitCurrentAnswer}
            disabled={submitting}
          >
            <Text style={styles.nextButtonText}>
              {submitting ? 'Saving...' : 'Next →'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#10b981',
    padding: 15,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    color: 'white',
    fontSize: 14,
    marginRight: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    margin: 15,
    borderRadius: 8,
  },
  errorText: {
    color: '#991b1b',
  },
  content: {
    padding: 15,
    paddingBottom: 120,
  },
  progressSection: {
    marginBottom: 25,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
  },
  progressText: {
    fontSize: 13,
    color: '#6b7280',
  },
  questionSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  required: {
    color: '#ef4444',
    fontSize: 16,
  },
  answerSection: {
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
  },
  textarea: {
    height: 120,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9fafb',
  },
  optionButtonSelected: {
    borderColor: '#10b981',
    backgroundColor: '#dbeafe',
  },
  optionText: {
    fontSize: 14,
    color: '#1f2937',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  prevButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  prevButtonText: {
    color: '#1f2937',
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#0070f3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.6,
  },
});
