# Phase 1: Project Setup & Configuration

This guide provides instructions for setting up the initial project structure for the GitHub-powered web game platform.

## Directory Structure

```bash
mkdir -p web-game-platform/{client,server}
cd web-game-platform
git init
echo "node_modules\n.env\n.DS_Store\nbuild\ndist\n.vscode" > .gitignore
```

## Backend Setup

### Initialize Express Server

```bash
cd server
npm init -y
npm install express mongoose cors helmet dotenv jsonwebtoken passport passport-github2 axios compression
npm install --save-dev typescript ts-node nodemon @types/express @types/node
```

### TypeScript Configuration

Create `server/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

### Server Directory Structure

```bash
mkdir -p src/{controllers,models,routes,middleware,services,utils,config}
```

### Environment Variables

Create `server/.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/game-platform
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Basic Server File

Create `server/src/index.ts`:
```typescript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import passport from 'passport';
import path from 'path';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "https://api.github.com"],
      imgSrc: ["'self'", "data:", "https://github.com", "https://raw.githubusercontent.com"],
      frameSrc: ["'self'"]
    }
  }
}));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Placeholder for routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
```

### Package.json Scripts

Update `server/package.json` to include:
```json
"scripts": {
  "dev": "nodemon --exec ts-node src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

## Frontend Setup

### Initialize React App with Vite

```bash
cd ../client
npm create vite@latest . -- --template react-ts
npm install react-router-dom axios @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

### Environment Variables

Create `client/.env`:
```
VITE_API_URL=http://localhost:3000/api
```

### Update package.json

Update `client/package.json` to include:
```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview"
}
```

### Basic App Structure

Update `client/src/App.tsx`:
```tsx
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Box maxWidth="1200px" margin="0 auto" p={4}>
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="/games" element={<div>Games Page</div>} />
            <Route path="/games/:id" element={<div>Game Details</div>} />
            <Route path="/play/:id" element={<div>Play Game</div>} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
```

## GitHub OAuth Setup

1. Register a new OAuth app at GitHub:
   - Go to GitHub Settings > Developer Settings > OAuth Apps > New OAuth App
   - Set Homepage URL: http://localhost:5173
   - Set Authorization callback URL: http://localhost:3000/api/auth/github/callback
   - Copy the Client ID and Client Secret to your server .env file

## Next Steps

After completing this setup:
1. Start the server with `cd server && npm run dev`
2. Start the client with `cd client && npm run dev`
3. Verify the server health endpoint works: http://localhost:3000/api/health
4. Proceed to Phase 2 to implement authentication and database models
