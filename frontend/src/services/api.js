const API_BASE_URL = 'http://localhost:3000';

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
      
      // Sunucu çalışmıyor olabilir, HTTP hatası döndürebilir
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        
        // Yanıt JSON ise, hata mesajını alalım
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          throw new Error(data.error || `İstek başarısız oldu: ${response.status}`);
        } else {
          // JSON değilse (HTML gibi), genel bir hata mesajı oluşturalım
          throw new Error(`Sunucu hatası: ${response.status}. Sunucu çalışmıyor olabilir.`);
        }
      }
      
      // Başarılı yanıt, JSON'a çevirelim
      const data = await response.json();
      return data;
    } catch (error) {
      // Ağ hataları veya JSON ayrıştırma hataları
      if (error.name === 'SyntaxError') {
        throw new Error('Sunucudan geçersiz yanıt alındı. Sunucu çalışmıyor olabilir.');
      }
      throw error;
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