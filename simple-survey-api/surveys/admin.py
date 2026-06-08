from django.contrib import admin
from .models import Survey, Question, QuestionOption, Response, ResponseAnswer


@admin.register(Survey)
class SurveyAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('is_active', 'created_at')
    readonly_fields = ('id', 'created_at', 'updated_at')


class QuestionOptionInline(admin.TabularInline):
    model = QuestionOption
    extra = 1


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'survey', 'question_type', 'order')
    search_fields = ('question_text',)
    list_filter = ('question_type', 'survey')
    inlines = [QuestionOptionInline]
    readonly_fields = ('id', 'created_at', 'updated_at')


@admin.register(QuestionOption)
class QuestionOptionAdmin(admin.ModelAdmin):
    list_display = ('option_text', 'question', 'order')
    search_fields = ('option_text',)
    list_filter = ('question',)
    readonly_fields = ('id', 'created_at')


@admin.register(Response)
class ResponseAdmin(admin.ModelAdmin):
    list_display = ('respondent_email', 'survey', 'is_complete', 'created_at')
    search_fields = ('respondent_email',)
    list_filter = ('survey', 'is_complete', 'created_at')
    readonly_fields = ('id', 'created_at', 'updated_at')


@admin.register(ResponseAnswer)
class ResponseAnswerAdmin(admin.ModelAdmin):
    list_display = ('response', 'question', 'created_at')
    search_fields = ('response__respondent_email',)
    list_filter = ('response__survey', 'question')
    readonly_fields = ('id', 'created_at', 'updated_at')
