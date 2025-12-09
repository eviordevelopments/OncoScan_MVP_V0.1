# OncoScan AI - Complete Setup Guide

This guide will help you set up the OncoScan AI frontend application from scratch.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Project Structure](#project-structure)
3. [Component Organization](#component-organization)
4. [Backend Integration](#backend-integration)
5. [AI Model Integration](#ai-model-integration)
6. [Authentication Setup](#authentication-setup)
7. [File Upload Configuration](#file-upload-configuration)
8. [Deployment](#deployment)

---

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Development
VITE_ENV=development

# API (Update when backend is ready)
VITE_API_BASE_URL=http://localhost:8000/api

# Authentication (Add your credentials)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# AI Model (Update with your model endpoints)
VITE_MODEL_ENDPOINT=http://localhost:5000/predict
VITE_GRADCAM_ENDPOINT=http://localhost:5000/gradcam
```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

---

## Project Structure

### Current Structure

```
oncoscan-ai-frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API clients
│   │   ├── mockAPI.js    # Mock API (REPLACE WITH REAL API)
│   │   └── base44Client.js
│   ├── components/        # React components (TO BE CREATED)
│   │   ├── auth/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── analysis/
│   │   ├── report/
│   │   ├── patient/
│   │   ├── devices/
│   │   ├── upload/
│   │   ├── layout/
│   │   └── ui/
│   ├── contexts/          # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/             # Page components (TO BE CREATED)
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── patient/
│   │   ├── Dashboard.jsx
│   │   ├── NewCase.jsx
│   │   ├── Analysis.jsx
│   │   ├── Report.jsx
│   │   ├── CaseArchive.jsx
│   │   ├── Settings.jsx
│   │   ├── Help.jsx
│   │   └── DeviceManager.jsx
│   ├── utils/             # Utility functions
│   ├── lib/               # Library configs
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── SETUP.md (this file)
```

---

## Component Organization

### Components to Create

I've provided the page files (Dashboard.jsx, NewCase.jsx, etc.). Now you need to create the missing components they reference:

#### 1. Common Components (`src/components/common/`)

```bash
# Create these files:
src/components/common/GlassCard.jsx
src/components/common/StatusBadge.jsx
src/components/common/RiskBadge.jsx
src/components/common/TiradsBadge.jsx
```

**GlassCard.jsx** - Glassmorphic card component:
```jsx
import { cn } from '@/lib/utils';

export default function GlassCard({ children, padding = 'default', hover = false, className, ...props }) {
  const paddingClasses = {
    small: 'p-3',
    default: 'p-6',
    large: 'p-8',
  };

  return (
    <div
      className={cn(
        'bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl',
        paddingClasses[padding],
        hover && 'transition-all hover:shadow-xl hover:scale-[1.02]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

**StatusBadge.jsx** - Status indicator:
```jsx
import { cn } from '@/lib/utils';

export default function StatusBadge({ status, size = 'default' }) {
  const colors = {
    processing: 'bg-blue-100 text-blue-700',
    awaiting_review: 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
    archived: 'bg-gray-100 text-gray-700',
  };

  const sizes = {
    small: 'text-xs px-2 py-0.5',
    default: 'text-sm px-3 py-1',
  };

  const labels = {
    processing: 'Processing',
    awaiting_review: 'Awaiting Review',
    completed: 'Completed',
    archived: 'Archived',
  };

  return (
    <span className={cn('rounded-full font-medium', colors[status], sizes[size])}>
      {labels[status]}
    </span>
  );
}
```

#### 2. Dashboard Components (`src/components/dashboard/`)

```bash
src/components/dashboard/QuickStats.jsx
src/components/dashboard/CaseQueue.jsx
src/components/dashboard/RecentActivity.jsx
src/components/dashboard/ModelStatus.jsx
```

#### 3. Analysis Components (`src/components/analysis/`)

```bash
src/components/analysis/ImageViewer.jsx
src/components/analysis/AIRiskPanel.jsx
src/components/analysis/TIRADSForm.jsx
```

#### 4. Upload Components (`src/components/upload/`)

```bash
src/components/upload/UploadZone.jsx
src/components/upload/MetadataForm.jsx
```

#### 5. Layout Components (`src/components/layout/`)

```bash
src/components/layout/Layout.jsx
src/components/layout/PatientLayout.jsx
src/components/layout/Sidebar.jsx
src/components/layout/Header.jsx
```

#### 6. UI Components (`src/components/ui/`)

These are shadcn/ui components. Create them with:

```bash
src/components/ui/button.jsx
src/components/ui/input.jsx
src/components/ui/label.jsx
src/components/ui/checkbox.jsx
src/components/ui/select.jsx
src/components/ui/textarea.jsx
src/components/ui/switch.jsx
src/components/ui/tabs.jsx
src/components/ui/dialog.jsx
```

---

## Backend Integration

### Step 1: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Step 2: Create Supabase Client

Create `src/api/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Step 3: Replace Mock API

Update `src/api/base44Client.js`:

```javascript
import { supabase } from './supabase';

export const base44 = {
  auth: {
    async me() {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data.user;
    },
    async signup(userData) {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role,
          },
        },
      });
      if (error) throw error;
      return data.user;
    },
  },
  entities: {
    Case: {
      async list(sortBy, limit) {
        const field = sortBy.startsWith('-') ? sortBy.substring(1) : sortBy;
        const ascending = !sortBy.startsWith('-');
        
        const { data, error } = await supabase
          .from('cases')
          .select('*')
          .order(field, { ascending })
          .limit(limit);
        
        if (error) throw error;
        return data;
      },
      async filter(filters) {
        let query = supabase.from('cases').select('*');
        
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
        
        const { data, error } = await query;
        if (error) throw error;
        return data;
      },
      async create(caseData) {
        const { data, error } = await supabase
          .from('cases')
          .insert([caseData])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
      async update(id, updates) {
        const { data, error } = await supabase
          .from('cases')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
    },
    AuditLog: {
      async list(sortBy, limit) {
        const field = sortBy.startsWith('-') ? sortBy.substring(1) : sortBy;
        const ascending = !sortBy.startsWith('-');
        
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order(field, { ascending })
          .limit(limit);
        
        if (error) throw error;
        return data;
      },
      async create(logData) {
        const { data, error } = await supabase
          .from('audit_logs')
          .insert([logData])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
    },
    // Add other entities (Device, DeviceLog, EducationContent) similarly
  },
};
```

### Step 4: Database Schema

Create these tables in Supabase:

```sql
-- Cases table
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_number TEXT UNIQUE NOT NULL,
  patient_id TEXT NOT NULL,
  exam_date DATE,
  nodule_location TEXT,
  image_urls TEXT[],
  status TEXT DEFAULT 'processing',
  risk_category TEXT,
  prediction_confidence DECIMAL,
  tirads_category INTEGER,
  tirads_points INTEGER,
  assigned_to TEXT,
  report_status TEXT DEFAULT 'draft',
  signed_by TEXT,
  signed_at TIMESTAMP,
  radiologist_notes TEXT,
  recommendations TEXT[],
  created_date TIMESTAMP DEFAULT NOW(),
  updated_date TIMESTAMP DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id),
  action TEXT NOT NULL,
  user_email TEXT,
  user_name TEXT,
  details TEXT,
  model_version TEXT,
  created_date TIMESTAMP DEFAULT NOW()
);

-- Devices table
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id TEXT UNIQUE NOT NULL,
  device_name TEXT NOT NULL,
  serial_number TEXT,
  location TEXT,
  department TEXT,
  status TEXT DEFAULT 'offline',
  ip_address TEXT,
  connection_type TEXT,
  firmware_version TEXT,
  model TEXT,
  last_heartbeat TIMESTAMP,
  total_cases_processed INTEGER DEFAULT 0,
  pending_upload_count INTEGER DEFAULT 0,
  storage_used_gb DECIMAL DEFAULT 0,
  storage_total_gb DECIMAL DEFAULT 256,
  encryption_enabled BOOLEAN DEFAULT true,
  auto_upload BOOLEAN DEFAULT true,
  assigned_users TEXT[],
  notes TEXT,
  created_date TIMESTAMP DEFAULT NOW()
);

-- Device logs table
CREATE TABLE device_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID REFERENCES devices(id),
  log_type TEXT NOT NULL,
  severity TEXT,
  message TEXT,
  user_email TEXT,
  details JSONB,
  created_date TIMESTAMP DEFAULT NOW()
);

-- Education content table
CREATE TABLE education_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  category TEXT,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  published_date TIMESTAMP DEFAULT NOW(),
  author TEXT,
  read_time INTEGER
);
```

---

## AI Model Integration

### Step 1: Create Model API Client

Create `src/api/modelAPI.js`:

```javascript
const MODEL_ENDPOINT = import.meta.env.VITE_MODEL_ENDPOINT;
const GRADCAM_ENDPOINT = import.meta.env.VITE_GRADCAM_ENDPOINT;

export const modelAPI = {
  async predict(imageUrls) {
    const response = await fetch(MODEL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ images: imageUrls }),
    });

    if (!response.ok) {
      throw new Error('Prediction failed');
    }

    return response.json();
  },

  async generateGradCAM(imageUrl) {
    const response = await fetch(GRADCAM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageUrl }),
    });

    if (!response.ok) {
      throw new Error('Grad-CAM generation failed');
    }

    return response.json();
  },
};
```

### Step 2: Update NewCase.jsx

Replace the mock prediction with real API call:

```javascript
import { modelAPI } from '@/api/modelAPI';

// In createCaseMutation:
const newCase = await base44.entities.Case.create(caseData);

// Call AI model
try {
  const prediction = await modelAPI.predict(data.image_urls);
  
  await base44.entities.Case.update(newCase.id, {
    prediction_confidence: prediction.confidence,
    risk_category: prediction.risk_category,
    status: 'awaiting_review',
  });
} catch (error) {
  console.error('AI prediction failed:', error);
  // Handle error appropriately
}
```

---

## Authentication Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
6. Copy Client ID to `.env`

### Supabase Auth

1. In Supabase Dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google Client ID and Secret
4. Configure redirect URLs

---

## File Upload Configuration

### Supabase Storage

1. Create a storage bucket in Supabase:
   - Name: `case-images`
   - Public: No (private)

2. Update `UploadZone.jsx`:

```javascript
import { supabase } from '@/api/supabase';

const handleUpload = async (files) => {
  const uploadPromises = files.map(async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('case-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('case-images')
      .getPublicUrl(fileName);

    return publicUrl;
  });

  const urls = await Promise.all(uploadPromises);
  onFilesUploaded(urls);
};
```

---

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Environment Variables

Don't forget to set environment variables in your deployment platform!

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment variables
3. ⏳ Create missing components (see Component Organization section)
4. ⏳ Set up Supabase database
5. ⏳ Replace mock API with real API
6. ⏳ Connect AI model endpoints
7. ⏳ Configure file upload
8. ⏳ Set up authentication
9. ⏳ Test all features
10. ⏳ Deploy to production

---

## Troubleshooting

### Common Issues

**Issue**: Module not found errors
**Solution**: Make sure all dependencies are installed: `npm install`

**Issue**: Environment variables not loading
**Solution**: Restart dev server after changing `.env`

**Issue**: Supabase connection fails
**Solution**: Check your Supabase URL and anon key in `.env`

**Issue**: Components not rendering
**Solution**: Check that all component files are created and exported correctly

---

## Support

For questions or issues:
- Email: support@oncoscan.ai
- Documentation: docs.oncoscan.ai

---

**Last Updated**: December 2024
