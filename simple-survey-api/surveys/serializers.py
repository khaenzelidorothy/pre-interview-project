from rest_framework import serializers
from .models import Survey, Question, QuestionOption, Response, ResponseAnswer


class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ['id', 'question', 'option_text', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']


class QuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'survey', 'question_text', 'question_type', 'order', 'is_required', 'options', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SurveyListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for survey lists"""
    question_count = serializers.SerializerMethodField()
    response_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Survey
        fields = ['id', 'name', 'description', 'is_active', 'question_count', 'response_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_question_count(self, obj):
        return obj.questions.count()
    
    def get_response_count(self, obj):
        return obj.responses.count()


class SurveyDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer including all questions"""
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Survey
        fields = ['id', 'name', 'description', 'is_active', 'questions', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ResponseAnswerSerializer(serializers.ModelSerializer):
    option_ids = serializers.PrimaryKeyRelatedField(
        queryset=QuestionOption.objects.all(),
        many=True,
        write_only=True,
        source='answer_options'
    )
    
    class Meta:
        model = ResponseAnswer
        fields = ['id', 'response', 'question', 'answer_text', 'answer_file', 'option_ids', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        options = validated_data.pop('answer_options', [])
        response_answer = ResponseAnswer.objects.create(**validated_data)
        response_answer.answer_options.set(options)
        return response_answer


class ResponseDetailSerializer(serializers.ModelSerializer):
    answers = ResponseAnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Response
        fields = ['id', 'survey', 'respondent_email', 'is_complete', 'answers', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ResponseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = ['id', 'survey', 'respondent_email', 'is_complete', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SurveyCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = ['name', 'description', 'is_active']
