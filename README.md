# Trackr

A full-stack task management web application designed to help users organize tasks, maintain a diary, and manage notes — all in one place.

## Project Description

Trackr is a personal productivity web application. It allows users to create, update, and delete tasks with priority levels and due dates. The application also features a diary section for daily journal entries and a notes system for task-specific annotations. Users can register and log in to access their personalized dashboard, which displays task progress, daily summaries, and monthly statistics. 

## Setup Instructions 

## Prerequisites
- Node.js
- MongoDB (local or Atlas)
- Git
- React vite

### Local Development Setup

1. Clone the repository

2. Install root dependencies

3. Install server dependencies

4. Install client dependencies

5. Configure environment variables 
-  create `server/.env` and set the following:
    PORT = 5000
    MONGOURL = (your local or atlas mongoDBurl)

6. Start mongoDB
- Ensure MongoDB is running locally (`mongod`) or that your Atlas cluster is active.

7. Run the backend:
- Run `node server.js`
- The server starts on `http://localhost:5000`.


8. Run the frontend:
- `cd client` then run `npm run dev`
- The frontend starts on `http://localhost:5173` with a proxy to the backend.


## Technologies Used

Frontend: 
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Datepicker

Backend:
- Express.js
- Node.js
- Mongoose
- MongoDB
- dotenv
- CORS

Deployment:
- Vercel - Frontend hosting
- Railway - Backend hosting
- MongoDB Atlas - Cloud database



