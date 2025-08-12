# HACS Server

Backend server for the Hospitality Analytics Cloud Services application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `env.example`:
```bash
cp env.example .env
```

3. Update the `.env` file with your MongoDB connection string.

4. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## API Endpoints

- `GET /api/health` - Server health check
- `GET /api/analytics` - Get analytics data

## MongoDB Connection

The server connects to MongoDB using the connection string specified in the `MONGODB_URI` environment variable. 