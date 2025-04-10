# Phase 3: GitHub Integration Service

This guide covers implementing the GitHub API integration service for the web game platform.

## GitHub Service

Create `server/src/services/github.service.ts`:

```typescript
import axios, { AxiosInstance } from 'axios';

interface GitHubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content?: string;
  encoding?: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  owner: {
    login: string;
  };
  default_branch: string;
  stargazers_count: number;
}

export interface GameMetadata {
  title: string;
  description: string;
  author: string;
  version?: string;
  tags?: string[];
  thumbnailPath?: string;
}

export class GitHubService {
  private api: AxiosInstance;
  
  constructor(accessToken?: string) {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json'
    };
    
    if (accessToken) {
      headers['Authorization'] = `token ${accessToken}`;
    }
    
    this.api = axios.create({
      baseURL: 'https://api.github.com',
      headers
    });
  }
  
  // Get repository details
  async getRepo(owner: string, repo: string): Promise<GitHubRepo> {
    try {
      const response = await this.api.get<GitHubRepo>(`/repos/${owner}/${repo}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch repo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Get file content from repository
  async getFileContent(owner: string, repo: string, path: string): Promise<string> {
    try {
      const response = await this.api.get<GitHubContent>(`/repos/${owner}/${repo}/contents/${path}`);
      
      if (response.data.type === 'file' && response.data.content && response.data.encoding === 'base64') {
        return Buffer.from(response.data.content, 'base64').toString();
      }
      
      throw new Error('Path does not point to a file or content is not available');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`File not found: ${path}`);
      }
      throw new Error(`Failed to fetch file content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Check if a file exists in the repository
  async fileExists(owner: string, repo: string, path: string): Promise<boolean> {
    try {
      await this.api.get<GitHubContent>(`/repos/${owner}/${repo}/contents/${path}`);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // List repository contents
  async listRepoContents(owner: string, repo: string, path = ''): Promise<GitHubContent[]> {
    try {
      const response = await this.api.get<GitHubContent[]>(`/repos/${owner}/${repo}/contents/${path}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to list repo contents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Get raw file URL
  getRawFileUrl(owner: string, repo: string, path: string, branch = 'main'): string {
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  }
  
  // Validate a game repository (check for required files)
  async validateGameRepo(owner: string, repo: string): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    try {
      // Check if index.html exists (required)
      const indexExists = await this.fileExists(owner, repo, 'index.html');
      if (!indexExists) {
        issues.push('Repository must contain an index.html file at the root');
      }
      
      return {
        isValid: issues.length === 0,
        issues
      };
    } catch (error) {
      issues.push(`Failed to validate repository: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        isValid: false,
        issues
      };
    }
  }
  
  // Get game metadata from repository
  async getGameMetadata(owner: string, repo: string): Promise<GameMetadata> {
    try {
      // Try to get game.json
      const gameJsonContent = await this.getFileContent(owner, repo, 'game.json');
      return JSON.parse(gameJsonContent) as GameMetadata;
    } catch (error) {
      // If game.json doesn't exist or is invalid, fallback to repo metadata
      const repoDetails = await this.getRepo(owner, repo);
      
      return {
        title: repoDetails.name,
        description: repoDetails.description || '',
        author: repoDetails.owner.login,
        tags: []
      };
    }
  }
  
  // Parse GitHub repo URL or string to owner and repo
  static parseRepoString(repoString: string): { owner: string; repo: string } {
    // Handle full URLs
    if (repoString.startsWith('https://github.com/')) {
      repoString = repoString.replace('https://github.com/', '');
    }
    
    // Split owner/repo
    const parts = repoString.split('/');
    if (parts.length !== 2) {
      throw new Error('Invalid GitHub repository format. Use "owner/repo"');
    }
    
    return {
      owner: parts[0],
      repo: parts[1]
    };
  }
}
```

## GitHub Service Utilities

Create `server/src/utils/github.utils.ts`:

```typescript
// Convert GitHub path to URL path
export const githubPathToUrl = (path: string): string => {
  // Remove leading slash if present
  if (path.startsWith('/')) {
    path = path.substring(1);
  }
  
  // URL encode path components but preserve slashes
  return path.split('/').map(part => encodeURIComponent(part)).join('/');
};

// Extract repository information from various formats
export const extractRepoInfo = (input: string): { owner: string; repo: string } | null => {
  // Match patterns like:
  // username/repo
  // https://github.com/username/repo
  // https://github.com/username/repo.git
  
  // Full URL pattern
  const urlPattern = /https?:\/\/github\.com\/([^\/]+)\/([^\/\.]+)(\.git)?/;
  const urlMatch = input.match(urlPattern);
  
  if (urlMatch) {
    return {
      owner: urlMatch[1],
      repo: urlMatch[2]
    };
  }
  
  // Simple owner/repo pattern
  const simplePattern = /^([^\/]+)\/([^\/]+)$/;
  const simpleMatch = input.match(simplePattern);
  
  if (simpleMatch) {
    return {
      owner: simpleMatch[1],
      repo: simpleMatch[2]
    };
  }
  
  return null;
};
```

## Testing GitHub Service

Create `server/src/routes/github.routes.ts` for testing the GitHub service:

```typescript
import express, { Request, Response } from 'express';
import { GitHubService } from '../services/github.service';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Test repo validation endpoint
router.get('/validate/:owner/:repo', async (req: Request, res: Response) => {
  try {
    const { owner, repo } = req.params;
    
    // Use anonymous GitHub service for public repos
    const githubService = new GitHubService();
    
    const validation = await githubService.validateGameRepo(owner, repo);
    res.json(validation);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to validate repository',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get repository metadata
router.get('/repo/:owner/:repo', async (req: Request, res: Response) => {
  try {
    const { owner, repo } = req.params;
    
    // Use anonymous GitHub service for public repos
    const githubService = new GitHubService();
    
    const repoData = await githubService.getRepo(owner, repo);
    res.json(repoData);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch repository data',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get game metadata
router.get('/metadata/:owner/:repo', async (req: Request, res: Response) => {
  try {
    const { owner, repo } = req.params;
    
    // Use anonymous GitHub service for public repos
    const githubService = new GitHubService();
    
    const metadata = await githubService.getGameMetadata(owner, repo);
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch game metadata',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get file content (requires authentication)
router.get('/content/:owner/:repo/*', authenticate, async (req: Request, res: Response) => {
  try {
    const { owner, repo } = req.params;
    // Extract path from the wildcard part of the URL
    const path = req.params[0] || '';
    
    // Use authenticated GitHub service
    const githubService = new GitHubService(req.user?.accessToken);
    
    const content = await githubService.getFileContent(owner, repo, path);
    res.send(content);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch file content',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router;
```

## Update Server Index File

Update `server/src/index.ts` to include the GitHub routes:

```typescript
// Add this import
import githubRoutes from './routes/github.routes';

// Add the GitHub routes
app.use('/api/github', githubRoutes);
```

## Test GitHub Integration

1. Start the server: `cd server && npm run dev`
2. Test repository validation: http://localhost:3000/api/github/validate/username/repo
3. Test repository metadata: http://localhost:3000/api/github/repo/username/repo
4. Test game metadata: http://localhost:3000/api/github/metadata/username/repo
5. Replace `username/repo` with a real GitHub repository that contains a web game

## Next Steps

After completing the GitHub integration service:
1. Implement the game management API endpoints
2. Create the frontend game browser components
3. Build the game player component
