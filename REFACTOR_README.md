# Merify Backend - Structure

This project has been into a modular structure for better maintainability and organization.

## Project Structure

```
merify-be/
├── app.js                 # Main application entry point
├── package.json
├── README.md
└── src/
    ├── config/
    │   └── index.js       # Configuration management
    ├── middleware/
    │   └── index.js       # Middleware setup
    ├── routes/
    │   ├── index.js       # Basic routes
    │   ├── google.js      # Google OAuth routes
    │   ├── slack.js       # Slack OAuth routes
    │   └── routes.js      # Main routes aggregator
    └── services/
        ├── googleAuth.js  # Google authentication service
        └── slackAuth.js   # Slack authentication service
```

## Key Improvements

1. **Modular Architecture**: Code is now organized into logical modules
2. **Separation of Concerns**: Routes, services, middleware, and configuration are separated
3. **Service Layer**: Authentication logic is encapsulated in service classes
4. **Configuration Management**: Environment variables are centralized
5. **Error Handling**: Improved error handling with try-catch blocks
6. **Maintainability**: Easier to test, debug, and extend

## Files Overview

### Configuration (`src/config/index.js`)
- Centralized configuration management
- Environment variable handling
- Session, Google OAuth, and Slack OAuth settings

### Middleware (`src/middleware/index.js`)
- Express middleware setup
- Security headers, CORS, logging, session management

### Routes (`src/routes/`)
- **index.js**: Basic application routes
- **google.js**: Google OAuth authentication routes
- **slack.js**: Slack OAuth authentication routes
- **routes.js**: Main router that combines all routes

### Services (`src/services/`)
- **googleAuth.js**: Google OAuth service with token management
- **slackAuth.js**: Slack OAuth service with token exchange

### Main App (`app.js`)
- Clean, minimal entry point
- Imports and uses modular components
- Error handling and server startup

## Running the Application

```bash
npm start        # Production
npm run dev      # Development with nodemon
```
