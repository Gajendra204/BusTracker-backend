# BusTracker Backend

A Node.js backend application for tracking school buses, managing routes, and ensuring safe student transportation.

## Features

-  Real-time bus tracking
-  User management (Admin, Drivers, Parents)
-  Authentication and Authorization
-  Route management
-  Student management
-  Driver management
-  SMS notifications via Twilio
-  OTP-based authentication
-  Logging system

## Technologies Used

- Node.js with TypeScript
- Express.js
- Firebase Authentication
- MongoDB (through Mongoose)
- Twilio API for SMS

## Project Structure

```
src/
├── config/         # Configuration files (DB, Firebase)
├── controllers/    # Request handlers
├── interfaces/     # TypeScript interfaces
├── middlewares/    # Custom middleware functions
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
└── utils/          # Utility functions
```

## Prerequisites

- Node.js 
- MongoDB
- Firebase account
- Twilio account

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Gajendra204/BusTracker-backend.git
cd BusTracker-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=your_port
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

4. Set up your Firebase configuration in `serviceAccountKey.json`

## Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

Run tests:

```bash
npm test
```

