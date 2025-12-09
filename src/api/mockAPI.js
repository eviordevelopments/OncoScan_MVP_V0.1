/**
 * Mock API Client
 * 
 * This file provides mock API functions to simulate backend operations.
 * Replace these with actual API calls when connecting to your backend.
 * 
 * TODO: Replace with actual Supabase/Backend integration
 */

// Mock data storage with demo users
const mockDB = {
  users: [
    {
      id: 'user-1',
      email: 'doctor@oncoscan.ai',
      password: 'demo123',
      full_name: 'Dr. Sarah Johnson',
      role: 'clinician',
      specialty: 'Endocrinology',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'user-2',
      email: 'patient@example.com',
      password: 'demo123',
      full_name: 'John Smith',
      role: 'patient',
      date_of_birth: '1985-06-15',
      created_at: '2024-01-15T00:00:00Z',
    },
  ],
  cases: [],
  auditLogs: [],
  devices: [],
  deviceLogs: [],
  educationContent: [],
};

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// AUTH API
// ============================================================================

export const authAPI = {
  async login(email, password) {
    await delay();
    
    // Mock validation
    const user = mockDB.users.find(u => u.email === email);
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async signup(userData) {
    await delay();
    
    // Check if user exists
    if (mockDB.users.find(u => u.email === userData.email)) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: generateId(),
      ...userData,
      created_at: new Date().toISOString(),
    };
    
    mockDB.users.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async me() {
    await delay(200);
    const storedUser = localStorage.getItem('oncoscan_user');
    if (!storedUser) throw new Error('Not authenticated');
    return JSON.parse(storedUser);
  },
};

// ============================================================================
// CASE API
// ============================================================================

export const caseAPI = {
  async list(sortBy = '-created_date', limit = 100) {
    await delay();
    let cases = [...mockDB.cases];
    
    // Sort
    if (sortBy.startsWith('-')) {
      const field = sortBy.substring(1);
      cases.sort((a, b) => new Date(b[field]) - new Date(a[field]));
    }
    
    return cases.slice(0, limit);
  },

  async filter(filters) {
    await delay();
    return mockDB.cases.filter(c => {
      return Object.entries(filters).every(([key, value]) => c[key] === value);
    });
  },

  async create(data) {
    await delay();
    const newCase = {
      id: generateId(),
      ...data,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    };
    mockDB.cases.push(newCase);
    return newCase;
  },

  async update(id, data) {
    await delay();
    const index = mockDB.cases.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Case not found');
    
    mockDB.cases[index] = {
      ...mockDB.cases[index],
      ...data,
      updated_date: new Date().toISOString(),
    };
    return mockDB.cases[index];
  },

  async delete(id) {
    await delay();
    const index = mockDB.cases.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Case not found');
    mockDB.cases.splice(index, 1);
    return { success: true };
  },
};

// ============================================================================
// AUDIT LOG API
// ============================================================================

export const auditLogAPI = {
  async list(sortBy = '-created_date', limit = 100) {
    await delay();
    let logs = [...mockDB.auditLogs];
    
    if (sortBy.startsWith('-')) {
      const field = sortBy.substring(1);
      logs.sort((a, b) => new Date(b[field]) - new Date(a[field]));
    }
    
    return logs.slice(0, limit);
  },

  async create(data) {
    await delay();
    const newLog = {
      id: generateId(),
      ...data,
      created_date: new Date().toISOString(),
    };
    mockDB.auditLogs.push(newLog);
    return newLog;
  },
};

// ============================================================================
// DEVICE API
// ============================================================================

export const deviceAPI = {
  async list(sortBy = '-last_heartbeat', limit = 100) {
    await delay();
    let devices = [...mockDB.devices];
    
    if (sortBy.startsWith('-')) {
      const field = sortBy.substring(1);
      devices.sort((a, b) => new Date(b[field]) - new Date(a[field]));
    }
    
    return devices.slice(0, limit);
  },

  async create(data) {
    await delay();
    const newDevice = {
      id: generateId(),
      ...data,
      created_date: new Date().toISOString(),
    };
    mockDB.devices.push(newDevice);
    return newDevice;
  },

  async update(id, data) {
    await delay();
    const index = mockDB.devices.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Device not found');
    
    mockDB.devices[index] = {
      ...mockDB.devices[index],
      ...data,
    };
    return mockDB.devices[index];
  },
};

// ============================================================================
// DEVICE LOG API
// ============================================================================

export const deviceLogAPI = {
  async list(sortBy = '-created_date', limit = 500) {
    await delay();
    let logs = [...mockDB.deviceLogs];
    
    if (sortBy.startsWith('-')) {
      const field = sortBy.substring(1);
      logs.sort((a, b) => new Date(b[field]) - new Date(a[field]));
    }
    
    return logs.slice(0, limit);
  },

  async create(data) {
    await delay();
    const newLog = {
      id: generateId(),
      ...data,
      created_date: new Date().toISOString(),
    };
    mockDB.deviceLogs.push(newLog);
    return newLog;
  },
};

// ============================================================================
// EDUCATION CONTENT API
// ============================================================================

export const educationAPI = {
  async list(sortBy = '-published_date', limit = 100) {
    await delay();
    let content = [...mockDB.educationContent];
    
    if (sortBy.startsWith('-')) {
      const field = sortBy.substring(1);
      content.sort((a, b) => new Date(b[field]) - new Date(a[field]));
    }
    
    return content.slice(0, limit);
  },

  async filter(filters) {
    await delay();
    return mockDB.educationContent.filter(c => {
      return Object.entries(filters).every(([key, value]) => c[key] === value);
    });
  },
};

// ============================================================================
// UNIFIED API CLIENT (Base44 replacement)
// ============================================================================

export const apiClient = {
  auth: authAPI,
  entities: {
    Case: caseAPI,
    AuditLog: auditLogAPI,
    Device: deviceAPI,
    DeviceLog: deviceLogAPI,
    EducationContent: educationAPI,
  },
};

// Export as base44 for compatibility with existing code
export const base44 = apiClient;

export default apiClient;
