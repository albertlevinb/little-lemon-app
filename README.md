# Little Lemon Restaurant Booking System

A modern, responsive React application for restaurant table reservations with a clean UI and comprehensive form validation.

[Live Demo](https://little-lemon-reservations.netlify.app)

## Features

### 🍋 Core Functionality
- **Table Reservation System**: Complete booking form with customer details and reservation preferences
- **Real-time Availability**: Dynamic time slot filtering based on existing bookings
- **Form Validation**: Comprehensive client-side validation with error messaging
- **Booking Confirmation**: Modal confirmation dialog with booking details
- **Booking History**: Display of recent reservations

### 🎨 User Interface
- **Responsive Design**: Mobile-first responsive layout using Tailwind CSS
- **Modern Styling**: Clean, professional design with yellow and green color scheme
- **Accessibility**: ARIA labels, roles, and semantic HTML for screen readers
- **Interactive Elements**: Hover effects, transitions, and visual feedback

### 📋 Form Fields
- **Personal Information**: Name, email, phone number
- **Reservation Details**: Date, time, number of guests
- **Additional Options**: Special occasion selection and custom requests
- **Validation**: Real-time error checking and user feedback

## 🔗 Supabase Backend Integration

This app uses [Supabase](https://supabase.com) as a real-time backend to manage bookings securely and efficiently.

### 🛠️ Backend Features
- **Database Integration**: Bookings are stored in a Supabase PostgreSQL table
- **Row-Level Security (RLS)**: Enabled with custom policies to allow public inserts and read-only access
- **API Calls**: Booking data is submitted securely via Supabase client libraries
- **Validation & Error Handling**: Frontend gracefully handles backend errors (e.g., booking conflicts or policy violations)

### 🔐 RLS Policies Summary
- ✅ Allow public insert for new bookings
- ✅ Allow select for availability checking
- 🚫 Deny update and delete for unauthenticated users

## Screenshots

### 🏠 Home Page
<img width="1920" height="935" alt="Screenshot 2025-07-17 at 5 59 06 PM" src="https://github.com/user-attachments/assets/f064f2fb-005a-401e-99d1-36c916e7618a" />

### 🍽️ Menu Page
<img width="1920" height="935" alt="Screenshot 2025-07-17 at 5 59 28 PM" src="https://github.com/user-attachments/assets/2e44b672-5b55-4f1d-be1a-659dd953777f" />

### 📋 Booking Form
<img width="1920" height="925" alt="Screenshot 2025-07-29 at 4 59 42 PM" src="https://github.com/user-attachments/assets/adf6a6ec-dde5-49b2-8d7f-52fbe0e8bf8d" />

## Technology Stack

- **React**: Frontend framework with hooks (useState)
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for UI elements
- **JavaScript**: ES6+ features and modern syntax
- **Supabase**: Backend-as-a-service for data storage, authentication, and row-level security

## About

This is a full-stack restaurant reservation system built with React and Supabase, featuring real-time booking validation, secure backend policies, and a polished, responsive UI.

Originally developed as part of the Meta Front-End Developer Specialization on Coursera, the project has since been extended to include a production-ready backend using Supabase with row-level security (RLS) and live availability checking.

It demonstrates modern frontend and backend integration, clean UX patterns, and real-world data handling for portfolio and freelance use.
