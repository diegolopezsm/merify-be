# Merify Backend

A Node.js Express backend application for Merify.

## Features

- Express.js framework
- CORS enabled
- Security headers with Helmet
- Request logging with Morgan
- Environment variable support
- Health check endpoint
- Error handling middleware

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

4. Start the production server:
```bash
npm start
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api` - API information

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=3000
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

## Project Structure

```
merify-be/
├── app.js              # Main application file
├── package.json        # Dependencies and scripts
├── .gitignore         # Git ignore rules
├── .env.example       # Environment variables template
└── README.md          # Project documentation
```
