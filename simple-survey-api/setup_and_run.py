import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'survey_project.settings')
django.setup()

from surveys.models import Survey, Question, QuestionOption, Response, ResponseAnswer
from django.contrib.auth.models import User

def run_migrations():
    """Run all migrations"""
    print("[1/5] Running migrations...")
    os.system('python manage.py migrate')
    print("✓ Migrations completed\n")

def create_superuser():
    """Create superuser if it doesn't exist"""
    print("[2/5] Creating superuser...")
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("✓ Superuser created (username: admin, password: admin123)\n")
    else:
        print("✓ Superuser already exists\n")

def create_sample_surveys():
    """Create sample surveys"""
    print("[3/5] Creating sample surveys...")
    
    # Survey 1: Customer Feedback
    survey1, created = Survey.objects.get_or_create(
        name='Customer Feedback Survey',
        defaults={
            'description': 'Help us improve our service by sharing your feedback',
            'is_active': True
        }
    )
    
    if created:
        print("✓ Created survey: Customer Feedback Survey")
        
        # Questions for Survey 1
        q1 = Question.objects.create(
            survey=survey1,
            question_text='What is your email address?',
            question_type='email',
            order=1,
            is_required=True
        )
        print("  - Question 1: Email (Email)")
        
        q2 = Question.objects.create(
            survey=survey1,
            question_text='How satisfied are you with our service?',
            question_type='single_choice',
            order=2,
            is_required=True
        )
        print("  - Question 2: Satisfaction (Single Choice)")
        
        # Options for q2
        QuestionOption.objects.create(question=q2, option_text='Very Satisfied', order=1)
        QuestionOption.objects.create(question=q2, option_text='Satisfied', order=2)
        QuestionOption.objects.create(question=q2, option_text='Neutral', order=3)
        QuestionOption.objects.create(question=q2, option_text='Dissatisfied', order=4)
        print("  - Added 4 options for satisfaction question")
        
        q3 = Question.objects.create(
            survey=survey1,
            question_text='What features would you like to see?',
            question_type='multiple_choice',
            order=3,
            is_required=False
        )
        print("  - Question 3: Features (Multiple Choice)")
        
        # Options for q3
        QuestionOption.objects.create(question=q3, option_text='Better Performance', order=1)
        QuestionOption.objects.create(question=q3, option_text='More Features', order=2)
        QuestionOption.objects.create(question=q3, option_text='Better UI', order=3)
        QuestionOption.objects.create(question=q3, option_text='Better Documentation', order=4)
        print("  - Added 4 options for features question")
        
        q4 = Question.objects.create(
            survey=survey1,
            question_text='Please share any additional feedback:',
            question_type='long_text',
            order=4,
            is_required=False
        )
        print("  - Question 4: Additional Feedback (Long Text)\n")
    else:
        print("✓ Sample surveys already exist\n")
    
    return survey1

def create_sample_responses(survey1):
    """Create sample responses with answers"""
    print("[4/5] Creating sample responses with answers...")
    
    # Response 1
    response1, created = Response.objects.get_or_create(
        survey=survey1,
        respondent_email='john@example.com',
        defaults={'is_complete': True}
    )
    
    if created:
        print("✓ Created response from john@example.com")
        
        # Get questions
        questions = survey1.questions.all().order_by('order')
        
        # Email answer
        email_q = questions.filter(question_type='email').first()
        if email_q:
            ResponseAnswer.objects.get_or_create(
                response=response1,
                question=email_q,
                defaults={'answer_text': 'john@example.com'}
            )
        
        # Satisfaction answer
        satisfaction_q = questions.filter(question_type='single_choice').first()
        if satisfaction_q:
            option = satisfaction_q.options.filter(option_text='Very Satisfied').first()
            answer, _ = ResponseAnswer.objects.get_or_create(
                response=response1,
                question=satisfaction_q
            )
            if option:
                answer.answer_options.add(option)
        
        # Feedback answer
        feedback_q = questions.filter(question_type='long_text').first()
        if feedback_q:
            ResponseAnswer.objects.get_or_create(
                response=response1,
                question=feedback_q,
                defaults={'answer_text': 'Great service! Keep up the good work.'}
            )
        
        print("  - Added answers to all questions")
    else:
        print("✓ Sample responses already exist\n")
    
    # Response 2
    response2, created = Response.objects.get_or_create(
        survey=survey1,
        respondent_email='jane@example.com',
        defaults={'is_complete': True}
    )
    
    if created:
        print("✓ Created response from jane@example.com")
        
        questions = survey1.questions.all().order_by('order')
        
        email_q = questions.filter(question_type='email').first()
        if email_q:
            ResponseAnswer.objects.get_or_create(
                response=response2,
                question=email_q,
                defaults={'answer_text': 'jane@example.com'}
            )
        
        satisfaction_q = questions.filter(question_type='single_choice').first()
        if satisfaction_q:
            option = satisfaction_q.options.filter(option_text='Satisfied').first()
            answer, _ = ResponseAnswer.objects.get_or_create(
                response=response2,
                question=satisfaction_q
            )
            if option:
                answer.answer_options.add(option)
        
        features_q = questions.filter(question_type='multiple_choice').first()
        if features_q:
            answer, _ = ResponseAnswer.objects.get_or_create(
                response=response2,
                question=features_q
            )
            options = features_q.options.filter(option_text__in=['Better Performance', 'Better UI'])
            answer.answer_options.set(options)
        
        print("  - Added answers to questions\n")
    else:
        print("✓ Sample responses already exist\n")

def display_summary():
    """Display API summary"""
    print("[5/5] Setup complete!\n")
    print("=" * 60)
    print("SIMPLE SURVEY API - SETUP COMPLETE")
    print("=" * 60)
    print("\nAdmin Panel: http://localhost:8000/admin/")
    print("  Username: admin")
    print("  Password: admin123")
    print("\nAPI Endpoints:")
    print("  Root: http://localhost:8000/")
    print("  Surveys: http://localhost:8000/api/surveys/")
    print("  Questions: http://localhost:8000/api/questions/")
    print("  Responses: http://localhost:8000/api/responses/")
    print("\nTest the API:")
    print("  - Get all surveys: GET http://localhost:8000/api/surveys/")
    print("  - Get survey detail: GET http://localhost:8000/api/surveys/{id}/")
    print("  - Get survey responses: GET http://localhost:8000/api/surveys/{id}/responses/")
    print("  - Create response: POST http://localhost:8000/api/surveys/{id}/create_response/")
    print("  - Submit answer: POST http://localhost:8000/api/responses/{id}/submit_answer/")
    print("\nDatabase: SQLite (db.sqlite3)")
    print("Sample data created:")
    print(f"  - Surveys: {Survey.objects.count()}")
    print(f"  - Questions: {Question.objects.count()}")
    print(f"  - Responses: {Response.objects.count()}")
    print("=" * 60)

def main():
    """Run complete setup"""
    print("\n" + "=" * 60)
    print("SIMPLE SURVEY API - COMPLETE SETUP")
    print("=" * 60 + "\n")
    
    try:
        run_migrations()
        create_superuser()
        survey1 = create_sample_surveys()
        create_sample_responses(survey1)
        display_summary()
    except Exception as e:
        print(f"\n✗ Error during setup: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()