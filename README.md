# Blood Bank Management System

A full-stack application to bridge the gap between blood donors, hospitals, and administrative management.

## Features
- **Role-Based Access Control**: Separate dashboards for Admin, Donor, and Hospital.
- **Donor Portal**: Donors can track donation history and log new donations.
- **Hospital Portal**: Hospitals can browse live stock and place blood requests (supports emergency flagging).
- **Admin Panel**: Statistics overview (Charts), automatic stock management, and manual user approval system.
- **Secure Auth**: JWT based authentication with bcrypt password hashing.

## Prerequisites
- **Node.js**: v16+
- **Python**: v3.9+
- **MongoDB**: A running instance (local or Atlas)

## Installation & Setup

### 1. Database Configuration
Ensure MongoDB is running locally at `mongodb://localhost:27017/bloodbank` or update the `.env` file with your URI.

### 2. Backend Setup
    cd backend
    python -m venv venv
    # Windows:
    venv\Scripts\activate
    # Mac/Linux:
    source venv/bin/activate
    
    pip install -r requirements.txt
    
    # Create .env file from .env.example
    cp ../.env.example .env
    
    python app.py

### 3. Frontend Setup
    cd frontend
    npm install
    npm run dev

## Usage

1. **Admin Registration**:
   By default, anyone registering with the 'admin' role in the backend demo is auto-approved. In production, the first admin should be manual.
2. **Donor/Hospital Flow**:
   - Register a new account.
   - Login with an Admin account and go to the dashboard.
   - Click the "Check" icon next to the new user in the "Pending Approvals" list.
   - Now the Donor/Hospital can login and access their dashboard.

## Project Structure
- `backend/`: Flask REST API using PyMongo.
- `frontend/`: React + Vite + Tailwind CSS UI.
- `routes/`: Implementation of business logic for each role.
- `context/`: React Context for state management.

## Troubleshooting
- **CORS Errors**: Ensure the frontend is on port 3000 and backend on port 5000 as configured.
- **MongoDB Connection**: If using Atlas, ensure your IP is whitelisted in the Mongo console.
- **Module Missing**: Ensure you've activated the virtual environment before running `pip install`.
