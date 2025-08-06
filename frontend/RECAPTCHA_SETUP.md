# reCAPTCHA Setup Guide

## Why You Need Your Own reCAPTCHA Keys

The reCAPTCHA keys are domain-specific and should be unique to your application. Using someone else's keys can cause:
- Security issues
- Domain verification failures
- Service disruptions

## How to Get Your Own reCAPTCHA Keys

### Step 1: Go to Google reCAPTCHA Admin
1. Visit: https://www.google.com/recaptcha/admin
2. Sign in with your Google account

### Step 2: Register a New Site
1. Click "Register a new site"
2. Choose "reCAPTCHA v2" with "I'm not a robot" checkbox
3. Add your domains:
   - For development: `localhost`, `127.0.0.1`
   - For production: Your actual domain (e.g., `yourdomain.com`)
4. Accept the terms and click "Submit"

### Step 3: Get Your Keys
You'll receive two keys:
- **Site Key**: Used in the frontend (public)
- **Secret Key**: Used in the backend (private)

### Step 4: Configure Your Application

#### Frontend Configuration
1. Create a `.env` file in the `frontend` directory:
```env
REACT_APP_RECAPTCHA_SITE_KEY=your_site_key_here
REACT_APP_API_URL=http://localhost:3000/api/v1
```

#### Backend Configuration
1. Update `backend/config/config.env`:
```env
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### Step 5: Restart Your Application
After updating the environment variables, restart both frontend and backend servers.

## Current Status
- ✅ Frontend code is ready to use environment variables
- ✅ Backend is configured to verify reCAPTCHA tokens
- ⚠️ You need to add your own reCAPTCHA keys

## Testing
Once configured, the reCAPTCHA challenge box should appear when you click "I'm not a robot" on the registration and login forms. 