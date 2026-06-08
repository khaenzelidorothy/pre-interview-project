from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from .models import Survey, Question, QuestionOption, Response as SurveyResponse, ResponseAnswer
from .serializers import (
    SurveyListSerializer,
    SurveyDetailSerializer,
    SurveyCreateUpdateSerializer,
    QuestionSerializer,
    QuestionOptionSerializer,
    ResponseListSerializer,
    ResponseDetailSerializer,
    ResponseAnswerSerializer,
)


class SurveyViewSet(viewsets.ModelViewSet):
    """ViewSet for managing surveys"""
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'description']
    
    def get_queryset(self):
        return Survey.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SurveyDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return SurveyCreateUpdateSerializer
        return SurveyListSerializer
    
    @action(detail=True, methods=['get'])
    def responses(self, request, pk=None):
        """Get all responses for a survey"""
        survey = self.get_object()
        responses = survey.responses.all()
        
        # Filter by email if provided
        email = request.query_params.get('email')
        if email:
            responses = responses.filter(respondent_email=email)
        
        serializer = ResponseListSerializer(responses, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def create_response(self, request, pk=None):
        """Create a new response for a survey"""
        survey = self.get_object()
        email = request.data.get('respondent_email')
        
        if not email:
            return Response({'error': 'respondent_email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        response = SurveyResponse.objects.create(
            survey=survey,
            respondent_email=email
        )
        
        serializer = ResponseDetailSerializer(response)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class QuestionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing questions"""
    serializer_class = QuestionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['survey', 'question_type']
    
    def get_queryset(self):
        return Question.objects.all()
    
    def perform_create(self, serializer):
        serializer.save()


class QuestionOptionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing question options"""
    serializer_class = QuestionOptionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['question']
    
    def get_queryset(self):
        return QuestionOption.objects.all()


class ResponseViewSet(viewsets.ModelViewSet):
    """ViewSet for managing survey responses"""
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['survey', 'is_complete']
    search_fields = ['respondent_email']
    
    def get_queryset(self):
        return SurveyResponse.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ResponseDetailSerializer
        return ResponseListSerializer
    
    @action(detail=True, methods=['post'])
    def mark_complete(self, request, pk=None):
        """Mark a response as complete"""
        response = self.get_object()
        response.is_complete = True
        response.save()
        return Response({'status': 'Response marked as complete'})
    
    @action(detail=True, methods=['post'])
    def submit_answer(self, request, pk=None):
        """Submit an answer to a question in the response"""
        response = self.get_object()
        question_id = request.data.get('question_id')
        
        if not question_id:
            return Response({'error': 'question_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        question = get_object_or_404(Question, id=question_id, survey=response.survey)
        
        # Create or update the answer
        response_answer, created = ResponseAnswer.objects.get_or_create(
            response=response,
            question=question
        )
        
        # Handle different answer types
        if question.question_type in ['short_text', 'long_text', 'email']:
            response_answer.answer_text = request.data.get('answer_text')
        elif question.question_type == 'file_upload':
            response_answer.answer_file = request.FILES.get('answer_file')
        elif question.question_type in ['single_choice', 'multiple_choice']:
            option_ids = request.data.get('option_ids', [])
            response_answer.answer_options.set(option_ids)
        
        response_answer.save()
        
        serializer = ResponseAnswerSerializer(response_answer)
        return Response(serializer.data, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)
