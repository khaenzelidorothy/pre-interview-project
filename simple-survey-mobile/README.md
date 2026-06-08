# Simple Survey Mobile App

A React Native mobile application for taking surveys using Expo.

## Features

- **Survey Discovery**: Browse available surveys
- **Stepped Interface**: Answer one question at a time
- **Multiple Question Types**: Support for text, email, single choice, and multiple choice questions
- **Progress Tracking**: Visual progress indicator for survey completion
- **Offline Support**: Works with both online and offline data storage

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (optional, but recommended)

### Setup

1. Navigate to the project directory:
```bash
cd simple-survey-mobile
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API URL in `app/utils/apiClient.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

Update `localhost:8000` to your API server URL if different.

## Running the App

### With Expo CLI
```bash
npx expo start
```

Then:
- Press `a` to open on Android
- Press `i` to open on iOS
- Press `w` to open in web browser

### Direct Commands
```bash
npm run android    # Open on Android device/emulator
npm run ios        # Open on iOS device/simulator
npm run web        # Open in web browser
```

## Project Structure

```
simple-survey-mobile/
├── app/
│   ├── _layout.js              # Root navigation layout
│   ├── index.js                # Home screen
│   ├── survey-list.js          # Survey discovery screen
│   ├── survey-response.js      # Survey form screen
│   ├── thank-you.js            # Completion screen
│   ├── store/
│   │   └── surveyStore.js      # Zustand state management
│   └── utils/
│       └── apiClient.js        # API client
├── app.json                    # Expo configuration
├── package.json
└── README.md
```

## Screens

### Home Screen (`/`)
- Entry point with email input
- User enters their email to start taking surveys

### Survey List (`/survey-list`)
- Displays all available active surveys
- Shows survey metadata (questions count, description)
- Allows user to select a survey to take

### Survey Response (`/survey-response`)
- Stepped survey form interface
- One question per step
- Progress bar showing completion percentage
- Support for multiple question types:
  - Short text
  - Long text
  - Email
  - Single choice (radio buttons)
  - Multiple choice (checkboxes)

### Thank You Screen (`/thank-you`)
- Confirmation after survey completion
- Option to take another survey or return home

## API Integration

The app communicates with the Django REST API. Ensure the API is running before starting the app.

### Required Endpoints
- `GET /surveys/` - List active surveys
- `GET /surveys/{id}/` - Get survey details
- `POST /surveys/{id}/create_response/` - Create response
- `POST /responses/{id}/submit_answer/` - Submit answer
- `POST /responses/{id}/mark_complete/` - Mark as complete

## State Management

Uses Zustand for global state management:
- Survey list
- Current survey and response
- User email
- Form answers
- UI loading states

See `app/store/surveyStore.js` for detailed state structure.

## Styling

All styling is done with React Native `StyleSheet` for optimal performance. The app uses a consistent color scheme:
- Primary: Green (#10b981)
- Secondary: Blue (#0070f3)
- Neutral: Gray (#6b7280)

## Development Tips

### Testing API Connection
Ensure your API server is accessible. Update the API URL in `apiClient.js` if needed.

### Hot Reload
Changes to JavaScript files will hot reload automatically in the Expo app.

### Native Code
If you need native features, you can eject from Expo, but it's recommended to keep the setup simple initially.

## Building for Production

### Android
```bash
npx expo build:android
```

### iOS
```bash
npx expo build:ios
```

## Troubleshooting

### API Connection Issues
- Ensure the Django API is running on the correct address
- Update `API_BASE_URL` in `app/utils/apiClient.js`
- Check CORS settings on the API

### Module Not Found
Run `npm install` again to ensure all dependencies are installed.

### Port Already in Use
Expo will suggest an alternative port if the default (8081) is busy.

## Technologies

- **React Native**: Mobile UI framework
- **Expo**: Development platform and build service
- **Expo Router**: File-based routing
- **Zustand**: State management
- **Axios**: HTTP client

## Notes

- The app is designed to work with the Simple Survey API
- Internet connection is required for API calls
- User email is required to start surveys
- Each question is submitted individually as you progress through the survey
