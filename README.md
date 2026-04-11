# The Task — Gig Worker Task Manager

A React Native task management app built with Expo and Firebase, designed for gig workers to manage their daily tasks efficiently.

## Features

- 🔐 **Authentication** — Email/password signup and login via Firebase Auth
- ✅ **Task Management** — Create, edit, delete, and view tasks
- 🎯 **Priority Levels** — Low, medium, and high priority with color coding
- 📅 **Due Dates** — Set and track task deadlines
- 🔄 **Complete/Incomplete Toggle** — Mark tasks as done
- 🔍 **Filtering** — Filter tasks by status and priority
- 📊 **Real-time Sync** — Tasks sync instantly via Firestore
- 💾 **Persistent Auth** — Stay logged in after app refresh

## Tech Stack

- **React Native** with Expo
- **Expo Router** for navigation
- **Firebase Authentication** for user auth
- **Cloud Firestore** for data storage
- **TypeScript** for type safety

## Project Structure
app/
├── _layout.tsx        # Root layout with auth guard
├── index.tsx          # Entry point
├── login.tsx          # Login screen
├── signup.tsx         # Signup screen
├── Home.tsx           # Task list screen
└── task/
├── addTask.tsx    # Add task screen
└── [id].tsx       # Edit task screen
components/
├── TaskCard.tsx       # Task card component
└── FilterBar.tsx      # Filter component
hooks/
└── useTasks.ts        # Firestore task logic
types/
└── task.ts            # TypeScript types
lib/
└── firebase.js        # Firebase config

## Setup

1. Clone the repo
```bash
git clone https://github.com/yourusername/the-task.git
cd the-task
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file in root:
EXPO_PUBLIC_API_KEY=your_api_key
EXPO_PUBLIC_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_PROJECT_ID=your_project_id
EXPO_PUBLIC_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_APP_ID=your_app_id

4. Start the app
```bash
npx expo start
```
