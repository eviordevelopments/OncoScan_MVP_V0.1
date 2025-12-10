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
  educationContent: [
    {
      id: 'edu-1',
      title: 'Understanding Thyroid Nodules: A Patient Guide',
      category: 'nodules_basics',
      summary: 'Learn what thyroid nodules are, how common they are, and what they mean for your health.',
      content: '# Understanding Thyroid Nodules\n\nThyroid nodules are small lumps that form within your thyroid gland. Most nodules are benign (non-cancerous) and don\'t cause symptoms.\n\n## What are thyroid nodules?\n\nThyroid nodules are very common, especially as we age. They can be:\n- Solid or filled with fluid\n- Single or multiple\n- Small or large\n\n## Should I be worried?\n\nMost thyroid nodules are benign. Only about 5% of thyroid nodules are cancerous. Your doctor will evaluate your nodule using ultrasound and may recommend additional tests if needed.',
      author: 'OncoScan Medical Team',
      published_date: '2024-01-15',
      reading_time_minutes: 5,
      tags: ['thyroid', 'nodules', 'basics', 'health'],
      featured: true,
      thumbnail_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'
    },
    {
      id: 'edu-2',
      title: 'What is TI-RADS? Understanding Your Ultrasound Results',
      category: 'tirads_explained',
      summary: 'TI-RADS is a standardized system used to evaluate thyroid nodules. Learn what your TI-RADS score means.',
      content: '# Understanding TI-RADS\n\nTI-RADS (Thyroid Imaging Reporting and Data System) is a standardized way to describe thyroid nodules seen on ultrasound.\n\n## TI-RADS Categories:\n\n**TI-RADS 1:** Normal thyroid\n**TI-RADS 2:** Benign nodules\n**TI-RADS 3:** Probably benign\n**TI-RADS 4:** Suspicious nodules\n**TI-RADS 5:** Highly suspicious for malignancy\n\n## What does this mean for me?\n\nYour doctor uses TI-RADS to determine if additional testing is needed and to plan follow-up care.',
      author: 'Dr. Sarah Johnson',
      published_date: '2024-01-10',
      reading_time_minutes: 7,
      tags: ['tirads', 'ultrasound', 'diagnosis', 'classification'],
      featured: true,
      thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400'
    },
    {
      id: 'edu-3',
      title: 'Thyroid Health and Nutrition: What You Need to Know',
      category: 'lifestyle_nutrition',
      summary: 'Discover how nutrition and lifestyle choices can support your thyroid health.',
      content: '# Thyroid Health and Nutrition\n\nYour thyroid needs specific nutrients to function properly. Here\'s what you should know:\n\n## Important Nutrients:\n\n**Iodine:** Essential for thyroid hormone production\n**Selenium:** Helps protect the thyroid\n**Zinc:** Supports thyroid function\n**Iron:** Needed for thyroid hormone synthesis\n\n## Foods to Include:\n- Seafood and seaweed (iodine)\n- Brazil nuts (selenium)\n- Lean meats and legumes (zinc and iron)\n- Dairy products (iodine)\n\n## Lifestyle Tips:\n- Manage stress levels\n- Get adequate sleep\n- Exercise regularly\n- Avoid smoking',
      author: 'OncoScan Nutrition Team',
      published_date: '2024-01-05',
      reading_time_minutes: 8,
      tags: ['nutrition', 'lifestyle', 'thyroid health', 'prevention'],
      featured: true,
      thumbnail_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400'
    },
    {
      id: 'edu-4',
      title: 'Frequently Asked Questions About Thyroid Nodules',
      category: 'faq',
      summary: 'Get answers to the most common questions patients have about thyroid nodules.',
      content: '# Frequently Asked Questions\n\n## Q: How common are thyroid nodules?\nA: Very common! Up to 50% of people have thyroid nodules by age 50.\n\n## Q: Do thyroid nodules cause symptoms?\nA: Most don\'t cause symptoms. Large nodules might cause difficulty swallowing or breathing.\n\n## Q: Will I need surgery?\nA: Most nodules don\'t require surgery. Your doctor will monitor benign nodules with regular ultrasounds.\n\n## Q: Can thyroid nodules be prevented?\nA: There\'s no proven way to prevent thyroid nodules, but maintaining good thyroid health through proper nutrition may help.\n\n## Q: How often should I have follow-up ultrasounds?\nA: This depends on your nodule\'s characteristics. Your doctor will create a personalized follow-up plan.',
      author: 'OncoScan Medical Team',
      published_date: '2024-01-01',
      reading_time_minutes: 6,
      tags: ['faq', 'questions', 'thyroid nodules', 'patient education'],
      featured: false,
      thumbnail_url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400'
    }
  ],
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
