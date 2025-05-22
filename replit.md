# FitPlan Application

## Overview

FitPlan is a full-stack web application that allows users to create, manage, and track their workout routines. The application provides features for browsing exercises, creating personalized workouts, tracking progress, and managing user profiles.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

FitPlan follows a client-server architecture with a clear separation between frontend and backend components:

1. **Frontend**: React-based single-page application with Tailwind CSS for styling and shadcn/ui components
2. **Backend**: Express.js server handling API requests and authentication
3. **Database**: PostgreSQL database with Drizzle ORM for data access
4. **Authentication**: Replit Auth integration for user authentication

The application is designed to be deployed on Replit, utilizing Replit's PostgreSQL database service and authentication system.

## Key Components

### Frontend

- **React**: Main UI library for building the user interface
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **React Query**: Data fetching and state management
- **wouter**: Lightweight routing library
- **react-hook-form**: Form handling and validation
- **zod**: Schema validation for forms and API requests

### Backend

- **Express.js**: Web server framework
- **Drizzle ORM**: Database ORM for PostgreSQL
- **Replit Auth**: Authentication system integration
- **PostgreSQL**: Relational database

### Database Schema

The application uses Drizzle ORM with the following main data models:

1. **Users**: Store user information and authentication details
2. **Workouts**: Store workout plans created by users
3. **Exercises**: Predefined exercise database
4. **WorkoutExercises**: Junction table linking exercises to workouts
5. **UserProfiles**: Additional user settings and preferences

## Data Flow

1. **Authentication Flow**
   - User logs in via Replit Auth
   - The backend validates the session and provides user data
   - The frontend stores authentication state in React Query

2. **Workout Management Flow**
   - Users browse and select exercises
   - Users create workouts by adding exercises
   - The backend stores workout data in the database
   - Users can view, edit, and track their workouts

3. **Exercise Library Flow**
   - Predefined exercises are stored in the database
   - Users can browse and filter exercises by muscle group, equipment, etc.
   - Users can add exercises to their workouts

## External Dependencies

### Frontend Dependencies
- React ecosystem (react, react-dom)
- UI components (radix-ui components, shadcn/ui)
- Data fetching (tanstack/react-query)
- Form handling (react-hook-form, zod)
- Routing (wouter)
- Styling (tailwind, clsx, cva)
- Date handling (date-fns)

### Backend Dependencies
- Express.js for API server
- Drizzle ORM for database access
- PostgreSQL for data storage
- Replit Auth for authentication
- uuid for generating unique identifiers

## Deployment Strategy

The application is configured for deployment on Replit with:

1. **Development Mode**:
   - Run with `npm run dev`
   - Uses Vite for frontend development
   - Hot module replacement for faster development

2. **Production Mode**:
   - Build with `npm run build`
   - Bundle frontend with Vite
   - Bundle backend with esbuild
   - Run with `npm run start`

3. **Database**:
   - Uses Replit's PostgreSQL database
   - Schema is defined in `shared/schema.ts`
   - Migrations managed with Drizzle ORM

4. **Environment Variables**:
   - DATABASE_URL: PostgreSQL connection string
   - SESSION_SECRET: Secret for session management
   - REPL_ID and REPLIT_DOMAINS: For Replit integration

## API Endpoints

The application exposes several API endpoints:

1. **Authentication**:
   - `/api/auth/user`: Get current user information

2. **Workouts**:
   - `/api/workouts`: CRUD operations for workouts
   - `/api/workouts/favorites`: Get favorite workouts
   - `/api/workouts/completed`: Get completed workouts
   - `/api/workouts/next`: Get next planned workout
   - `/api/workouts/popular`: Get popular workouts

3. **Exercises**:
   - `/api/exercises`: Get exercise library
   - `/api/exercises/:id`: Get specific exercise

4. **User Profile**:
   - `/api/profile`: Get and update user profile

## Main Pages

1. **Login**: Authentication page
2. **Dashboard**: Overview of user's progress and next workout
3. **My Workouts**: List of user's created workouts
4. **Workout Editor**: Interface for creating and editing workouts
5. **Exercises**: Library of available exercises
6. **Profile**: User profile settings