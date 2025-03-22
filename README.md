# TaskBuddy - Task Management Tool

A modern task management application built with React, TypeScript, and Firebase. TaskBuddy helps you organize your tasks with an intuitive interface, offering both list and board views to manage your workflow effectively.

## Live Demo

The application is deployed and can be accessed at: [https://task-management-tool-91d42.web.app](https://task-management-tool-91d42.web.app/ "Live Link")

## Features

* **User Authentication** : Sign in with Google to access your personalized dashboard
* **Task Management** : Create, edit, and delete tasks with categories, tags, and due dates
* **Multiple Views** : Toggle between list and board (Kanban) views
* **Batch Actions** : Select multiple tasks to complete or delete them in one go
* **Task Filtering** : Filter tasks by category, date range, tags, and search text
* **Drag & Drop** : Easily move tasks between status columns
* **File Attachments** : Attach files to tasks for additional context
* **Activity Tracking** : View history of changes for each task
* **Responsive Design** : Works seamlessly on mobile, tablet, and desktop

## Tech Stack

* **Frontend** : React 19, TypeScript
* **Styling** : TailwindCSS 4
* **State Management** : React Query (TanStack Query)
* **Routing** : React Router 7
* **Authentication & Database** : Firebase 11
* **UI Notifications** : React Hot Toast
* **Build Tool** : Vite

## Prerequisites

* Node.js (v14 or higher)
* npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/milindkusahu/Task-Management-Tool.git
   cd Task-Management-Tool
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```
4. Start the development server:
   ```
   npm start
   ```

## Project Structure

* `/src/components`: Reusable UI components
* `/src/contexts`: React context providers for state management
* `/src/firebase`: Firebase configuration and initialization
* `/src/hooks`: Custom React hooks for shared functionality
* `/src/pages`: Main application views
* `/src/services`: API and Firebase service integration
* `/src/types`: TypeScript type definitions
* `/src/utils`: Utility functions and helpers

## Development Challenges

* **Real-time Updates** : Implemented React Query for efficient data fetching and cache management
* **Drag and Drop** : Created custom handling for task status changes via drag interactions
* **Responsive Design** : Used Tailwind CSS for a mobile-first approach that scales to any device
* **User Experience** : Added toast notifications and loading states for better feedback
* **File Attachments** : Built a secure upload system with Firebase Storage integration
