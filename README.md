# Bus Tracker Backend

This repository contains the backend server for the Bus Tracker application, a real-time system for tracking school buses to enhance student safety and provide peace of mind for parents.

## Key Features

*   **Real-time Bus Location Tracking:** Utilizes Firebase Real-time Database to track and broadcast bus locations.
*   **User Authentication:** Secure JWT-based authentication for different user roles (Admin, Parent, Driver).
*   **Role-based Access Control:** Middleware to protect routes based on user roles.
*   **CRUD Operations** for:
    *   Buses
    *   Drivers
    *   Students
    *   Parents
    *   Routes
*   **OTP Verification:** Twilio integration for sending one-time passwords for phone verification.
*   **Comprehensive Test Suite:** Unit and integration tests for controllers and services using Jest and Supertest.

## Tech Stack

*   **Backend:** Node.js, Express.js, TypeScript
*   **Database:** MongoDB with Mongoose
*   **Real-time Engine:** Firebase Real-time Database
*   **Authentication:** JSON Web Tokens (JWT)
*   **Testing:** Jest, Supertest
*   **Messaging:** Twilio for OTP
*   **Logging:** Winston

## API Documentation

(You can add more detail here. Consider using a tool like Swagger or Postman to generate and host your API documentation.)

A basic overview of the available routes:

*   `POST /api/auth/login`: User login
*   `POST /api/auth/register`: User registration
*   `GET /api/buses`: Get all buses
*   `POST /api/buses`: Create a new bus
*   ... and so on for drivers, students, routes, etc.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm
*   MongoDB instance (local or cloud-based like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd bus-tracker-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create Environment Files:**
    *   Create a `.env` file in the root directory. This file will hold your secret keys and configuration variables.
    *   Create a `serviceAccountKey.json` file in the root directory. This file contains your Firebase service account credentials. You can get this from your Firebase project settings.

    Your `.env` file should look like this:
    ```
    MONGO_URI=<Your_MongoDB_Connection_String>
    JWT_SECRET=<Your_JWT_Secret_Key>
    TWILIO_ACCOUNT_SID=<Your_Twilio_Account_SID>
    TWILIO_AUTH_TOKEN=<Your_Twilio_Auth_Token>
    TWILIO_PHONE_NUMBER=<Your_Twilio_Phone_Number>
    ```

4.  **Build the project:**
    The project is written in TypeScript and needs to be compiled to JavaScript.
    ```bash
    npm run build
    ```

### Running the Application

*   **For development (with auto-reloading):**
    ```bash
    npm run dev
    ```
*   **For production:**
    ```bash
    npm start
    ```
The server will start on the port defined in your application (e.g., `http://localhost:3000`).

## Running Tests

This project uses Jest for testing. To run the test suite:

```bash
npm test
```

To run tests in watch mode:
```bash
npm test:watch
```

## Project Structure

The project follows a standard MVC-like architecture:

```
src/
├── controllers/  # Request handlers
├── services/     # Business logic
├── models/       # Mongoose data models
├── routes/       # API route definitions
├── middlewares/  # Custom middleware (e.g., auth)
├── interfaces/   # TypeScript interfaces
├── config/       # Database, Firebase configuration
├── utils/        # Utility functions (e.g., logger)
└── __tests__/    # Jest tests
```