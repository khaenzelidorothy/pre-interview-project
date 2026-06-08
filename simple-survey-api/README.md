# Simple Survey API

A Django REST Framework API for managing surveys, questions, and responses.

## Features

- Survey CRUD operations
- Question management with multiple question types
- Support for different answer types (short text, long text, email, single choice, multiple choice, file upload)
- Response tracking with partial and complete states
- XML and JSON response formats
- CORS enabled for frontend integration
- Pagination and filtering
- File upload handling

## Installation

### Prerequisites
- Python 3.8+
- PostgreSQL 12+
- pip or conda

### Setup

1. Navigate to the project directory:
```bash
cd simple-survey-api
```

2. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file with your configuration:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_ENGINE=django.db.backends.postgresql
DB_NAME=survey_db
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

5. Create the PostgreSQL database:
```sql
CREATE DATABASE survey_db;
```

6. Run migrations:
```bash
python manage.py migrate
```

7. Create a superuser for admin access:
```bash
python manage.py createsuperuser
```

8. Run the development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Surveys
- `GET /api/surveys/` - List all surveys with pagination
- `POST /api/surveys/` - Create a new survey
- `GET /api/surveys/{id}/` - Retrieve survey details with questions
- `PUT /api/surveys/{id}/` - Update a survey
- `DELETE /api/surveys/{id}/` - Delete a survey
- `GET /api/surveys/{id}/responses/` - Get all responses for a survey
- `POST /api/surveys/{id}/create_response/` - Create a new response

### Questions
- `GET /api/questions/` - List all questions
- `POST /api/questions/` - Create a new question
- `GET /api/questions/{id}/` - Retrieve question details
- `PUT /api/questions/{id}/` - Update a question
- `DELETE /api/questions/{id}/` - Delete a question

### Question Options
- `GET /api/options/` - List all question options
- `POST /api/options/` - Create a new option
- `GET /api/options/{id}/` - Retrieve option details

### Responses
- `GET /api/responses/` - List all responses
- `POST /api/responses/` - Create a new response
- `GET /api/responses/{id}/` - Retrieve response details with answers
- `POST /api/responses/{id}/mark_complete/` - Mark response as complete
- `POST /api/responses/{id}/submit_answer/` - Submit an answer to a question

## Request/Response Format

### Response Format - JSON (default)
```json
{
  "id": "uuid",
  "name": "Survey Name",
  "description": "Survey description",
  "is_active": true,
  "questions": [...],
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

### Response Format - XML
Add `?format=xml` to any endpoint to get XML responses.

## Examples

### Create a Survey
```bash
curl -X POST http://localhost:8000/api/surveys/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer Feedback",
    "description": "Feedback survey",
    "is_active": true
  }'
```

### Create a Question
```bash
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -d '{
    "survey": "survey-uuid",
    "question_text": "How satisfied are you?",
    "question_type": "single_choice",
    "order": 1,
    "is_required": true
  }'
```

### Submit a Response
```bash
curl -X POST http://localhost:8000/api/surveys/survey-uuid/create_response/ \
  -H "Content-Type: application/json" \
  -d '{
    "respondent_email": "user@example.com"
  }'
```

### Submit an Answer
```bash
curl -X POST http://localhost:8000/api/responses/response-uuid/submit_answer/ \
  -H "Content-Type: application/json" \
  -d '{
    "question_id": "question-uuid",
    "answer_text": "Very satisfied"
  }'
```

## Admin Dashboard

Access the Django admin at `http://localhost:8000/admin/` with your superuser credentials.

## Development

### Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Testing
```bash
python manage.py test
```

## Architecture

### Database Schema
- **Survey**: Stores survey metadata
- **Question**: Stores survey questions with types
- **QuestionOption**: Stores options for choice questions
- **Response**: Stores survey responses by respondent
- **ResponseAnswer**: Stores individual answers to questions

### Models
- UUIDs are used as primary keys for better security and scalability
- Soft delete can be added to Survey and Response models
- Answer storage is flexible to handle all question types

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
