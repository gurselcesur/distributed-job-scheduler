const API_BASE_URL = 'http://localhost:3000';

// TEST MODE: Mock API responses when server is not available
const TEST_MODE = false;

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getAuthHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  async request(endpoint, options = {}) {
    // TEST MODE: Return mock responses
    if (TEST_MODE) {
      return this.mockRequest(endpoint, options);
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Mock API responses for testing without backend
  async mockRequest(endpoint, options = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : {};

    switch (`${method} ${endpoint}`) {
      case 'POST /login':
        if (!body.username || !body.password) {
          throw new Error('Kullanıcı adı ve şifre gerekli');
        }
        return {
          message: 'Login successful',
          token: 'mock-jwt-token-' + Date.now()
        };

      case 'POST /users':
        if (!body.username || !body.password) {
          throw new Error('Kullanıcı adı ve şifre gerekli');
        }
        return {
          message: 'User created successfully',
          userId: Math.floor(Math.random() * 1000)
        };

      case 'GET /agents':
        return [
          {
            id: 1,
            hostname: 'test-agent-1',
            ip: '192.168.1.100',
            lastSeen: new Date().toISOString()
          },
          {
            id: 2,
            hostname: 'test-agent-2',
            ip: '192.168.1.101',
            lastSeen: new Date().toISOString()
          }
        ];

      case 'POST /agents':
        return {
          id: Math.floor(Math.random() * 1000),
          hostname: body.hostname,
          ip: body.ip,
          lastSeen: new Date().toISOString()
        };

      case 'GET /protected':
        if (!this.token) {
          throw new Error('Access token is missing');
        }
        return {
          message: 'Hello test user, you are authorized.'
        };

      default:
        throw new Error('Mock endpoint not implemented: ' + endpoint);
    }
  }

  // Authentication methods
  async register(username, password) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async login(username, password) {
    const response = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    this.removeToken();
  }

  // Agent methods
  async getAgents() {
    return this.request('/agents');
  }

  async registerAgent(hostname, ip) {
    return this.request('/agents', {
      method: 'POST',
      body: JSON.stringify({ hostname, ip }),
    });
  }

  // Protected route example
  async getProtectedData() {
    return this.request('/protected');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Job methods
  async getJobs() {
    return this.request('/jobs');
  }

  async createJob(command, schedule, agentId) {
    if (!agentId) {
      throw new Error("Agent ID is required to create a job.");
    }

    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify({ command, schedule, agentId }),
    });
  }

  async deleteJob(jobId) {
    return this.request(`/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

}

export default new ApiService(); 