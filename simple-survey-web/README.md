# Simple Survey Web

A Next.js web application for survey management with separate admin and user portals.

## Features

- **Admin Panel**: Create, edit, and manage surveys and questions
- **User Portal**: Take surveys and submit responses
- **Real-time Updates**: Responsive UI with React
- **API Integration**: Connected to Simple Survey API
- **State Management**: Zustand for global state

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. Navigate to the project directory:
```bash
cd simple-survey-web
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_ADMIN_BASE_URL=http://localhost:3000/admin
NEXT_PUBLIC_USER_BASE_URL=http://localhost:3000/user
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
simple-survey-web/
├── app/
│   ├── admin/          # Admin panel pages
│   ├── user/           # User portal pages
│   ├── api/            # API routes
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # Reusable components
├── lib/
│   ├── apiClient.ts    # API client
│   └── store.ts        # Zustand store
├── public/             # Static assets
└── next.config.js      # Next.js configuration
```

## Pages

### Admin Panel (`/admin`)
- Dashboard with survey overview
- Survey CRUD operations
- Question management
- Response tracking and analytics

### User Portal (`/user`)
- Survey discovery
- Survey response form with stepped interface
- Answer submission
- Response history

## API Integration

The application communicates with the Django REST API at `http://localhost:8000/api`. Make sure the API is running before starting the development server.

## Building for Production

```bash
npm run build
npm start
```

## Development

### Linting
```bash
npm run lint
```

### File Structure for Components
- Place reusable components in `components/`
- Admin-specific components in `app/admin/components/`
- User-specific components in `app/user/components/`

## Technologies

- **Next.js**: React framework for production
- **React**: UI library
- **Axios**: HTTP client
- **Zustand**: State management
- **TypeScript**: Type safety

## Notes

- All API calls are handled through `lib/apiClient.ts`
- Global state is managed with Zustand in `lib/store.ts`
- Components use inline styles for simplicity; consider using CSS modules or Tailwind for larger projects
