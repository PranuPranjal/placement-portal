# Placement Portal

This is a full-stack web application designed to streamline the campus placement process for students, administrators, and companies.

## Features

*   **Admin Dashboard**:
    *   Add and manage company information.
    *   View detailed profiles of all students.
    *   Monitor placement statistics and activities.
*   **Student Portal**:
    *   Create and maintain a comprehensive student profile.
    *   Upload and manage documents such as CVs and marksheets.
    *   Browse and apply for available job opportunities.
*   **Company Portal**:
    *   View a list of students who have applied to their job postings.

## Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS, React Router
*   **Backend**: Node.js, Express.js, Prisma (ORM), JWT (for authentication)
*   **Database**: PostgreSQL

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm)
*   [PostgreSQL](https://www.postgresql.org/download/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/placement-portal.git
    cd placement-portal
    ```

2.  **Install dependencies for all parts of the application:**
    ```sh
    npm install
    npm run install:frontend
    npm run install:backend
    ```

3.  **Set up the database:**
    *   Navigate to the `backend` directory:
        ```sh
        cd backend
        ```
    *   Create a `.env` file by copying the example:
        ```sh
        cp .env.example .env
        ```
    *   Open the `.env` file and update the `DATABASE_URL` with your PostgreSQL connection string:
        ```
        DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
        ```
    *   Run the database migrations to create the necessary tables:
        ```sh
        npx prisma migrate dev
        ```

4.  **Start the application:**
    *   Return to the root directory:
        ```sh
        cd ..
        ```
    *   Run the development server, which will start both the frontend and backend concurrently:
        ```sh
        npm run dev
        ```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

## Folder Structure

The project is organized into two main directories:

*   `frontend/`: Contains the React application.
*   `backend/`: Contains the Node.js and Express.js server, along with the Prisma schema and migrations.

