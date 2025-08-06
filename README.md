# Security Coursework 2

This repository contains the implementation for Security Coursework 2.

## Project Structure

- `backend/` - Backend server implementation
- `frontend/` - Frontend application
- `backend/config/` - Configuration files (not included in repository for security)

## Setup

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up environment variables (see backend/config/config.env.example)
4. Run the application

## Security Features

This project implements various security measures including:
- reCAPTCHA integration
- Email verification
- Secure configuration management

## Environment Variables

Create a `backend/config/config.env` file with the following variables:
- `RECAPTCHA_SECRET_KEY` - Your reCAPTCHA secret key
- `EMAIL_USER` - Email address for sending notifications
- Additional configuration as needed

**Note:** The actual config.env file is not included in this repository for security reasons. 