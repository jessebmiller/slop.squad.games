# Phase 2: Database Models & Authentication

This guide covers implementing database models and GitHub authentication for the web game platform.

## Database Models

### User Model

Create `server/src/models/user.model.ts`:

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  githubId: string;
  username: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
  accessToken: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  githubId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  displayName: String,
  email: String,
  avatarUrl: String,
  accessToken: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IUser>('User', userSchema);
```

### Game Model

Create `server/src/models/game.model.ts`:

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  githubRepo: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  thumbnailUrl?: string;
  addedBy: mongoose.Types.ObjectId;
  addedAt: Date;
  updatedAt: Date;
  stars: number;
  plays: number;
  ratings: {
    count: number;
    average: number;
  };
}

const gameSchema = new Schema<IGame>({
  githubRepo: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  author: String,
  tags: [String],
  thumbnailUrl: String,
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  stars: {
    type: Number,
    default: 0
  },
  plays: {
    type: Number,
    default: 0
  },
  ratings: {
    count: {
      type: Number,
      default: 0
    },
    average: {
      type: Number,
      default: 0
    }
  }
});

// Text search index
gameSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model<IGame>('Game', gameSchema);
```

## GitHub Authentication

### Passport Configuration

Create `server/src/config/passport.ts`:

```typescript
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/user.model';

export const setupPassport = () => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        callbackURL: '/api/auth/github/callback',
        scope: ['user:email', 'read:user', 'repo']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ githubId: profile.id });
          
          if (user) {
            // Update access token
            user.accessToken = accessToken;
            await user.save();
            return done(null, user);
          }
          
          // Create new user
          user = new User({
            githubId: profile.id,
            username: profile.username,
            displayName: profile.displayName || profile.username,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : undefined,
            avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
            accessToken
          });
          
          await user.save();
          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
};
```

### Authentication Middleware

Create `server/src/middleware/auth.middleware.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
```

### Authentication Controller

Create `server/src/controllers/auth.controller.ts`:

```typescript
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

// Generate JWT token
const generateToken = (userId: string) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
};

// GitHub auth callback
export const githubCallback = (req: Request, res: Response) => {
  const userId = req.user?._id;
  
  if (!userId) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }
  
  const token = generateToken(userId.toString());
  res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // req.user is set by the authenticate middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    res.json({
      _id: req.user._id,
      username: req.user.username,
      displayName: req.user.displayName,
      avatarUrl: req.user.avatarUrl,
      email: req.user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
```

### Authentication Routes

Create `server/src/routes/auth.routes.ts`:

```typescript
import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// GitHub OAuth routes
router.get('/github', passport.authenticate('github', { session: false }));

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  authController.githubCallback
);

// Get current user
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
```

## Update Server Index File

Update `server/src/index.ts` to include the authentication setup:

```typescript
// Add these imports
import { setupPassport } from './config/passport';
import authRoutes from './routes/auth.routes';

// Initialize passport
setupPassport();

// Add the auth routes
app.use('/api/auth', authRoutes);
```

## Test Authentication

1. Make sure MongoDB is running locally
2. Start the server: `cd server && npm run dev`
3. Visit http://localhost:3000/api/auth/github to test the GitHub OAuth flow
4. The server should redirect to GitHub for authorization and then back to the client

## Next Steps

After completing authentication and database models:
1. Implement the GitHub integration service
2. Build game management API endpoints
3. Create frontend authentication context
