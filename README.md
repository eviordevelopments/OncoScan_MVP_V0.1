# OncoScan AI - Frontend Application

AI-powered thyroid nodule screening and malignancy risk assessment platform for clinicians and patients.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern web browser

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── api/                    # API clients and mock data
│   ├── mockAPI.js         # Mock API for development
│   └── base44Client.js    # Compatibility layer
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   ├── common/           # Shared UI components
│   ├── dashboard/        # Dashboard-specific components
│   ├── analysis/         # Analysis workspace components
│   ├── report/           # Report components
│   ├── patient/          # Patient portal components
│   ├── devices/          # Device manager components
│   ├── upload/           # File upload components
│   ├── layout/           # Layout components
│   └── ui/               # Base UI components (shadcn/ui)
├── contexts/             # React contexts
│   └── AuthContext.jsx   # Authentication context
├── pages/                # Page components
│   ├── auth/            # Login, Signup
│   ├── patient/         # Patient portal pages
│   ├── Dashboard.jsx    # Main dashboard
│   ├── NewCase.jsx      # Case creation
│   ├── Analysis.jsx     # Analysis workspace
│   ├── Report.jsx       # Report generation
│   ├── CaseArchive.jsx  # Case history
│   ├── Settings.jsx     # User settings
│   ├── Help.jsx         # Help & documentation
│   └── DeviceManager.jsx # Device management
├── utils/                # Utility functions
├── lib/                  # Library configurations
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: `#0F3F96` (Deep Blue)
- **Primary Dark**: `#0C2D5C`
- **Primary Light**: `#3C7CE3`
- **Secondary**: `#9CA3AF` (Gray)

### Glassmorphism
The UI uses a glassmorphic design with:
- Semi-transparent backgrounds
- Backdrop blur effects
- Subtle borders and shadows

## 👥 User Roles

### Clinician/Doctor
- Full access to case management
- AI analysis and TI-RADS scoring
- Report generation and signing
- Device management
- Case archive

### Patient
- Read-only access to finalized reports
- Educational resources
- Personal health information

### Admin
- All clinician features
- User management
- System settings

## 🔐 Authentication

Currently using mock authentication. To integrate with your backend:

1. **Google OAuth Setup**:
   - Add your Google Client ID to `.env`
   - Implement OAuth flow in `AuthContext.jsx`

2. **Supabase Setup**:
   - Add Supabase URL and keys to `.env`
   - Replace mock API calls in `src/api/mockAPI.js`

## 🔌 API Integration

### Current State (Mock API)
The app uses `src/api/mockAPI.js` for development with in-memory data storage.

### Backend Integration Steps

1. **Replace Mock API**:
   ```javascript
   // In src/api/base44Client.js
   import { createClient } from '@supabase/supabase-js';
   
   const supabase = createClient(
     import.meta.env.VITE_SUPABASE_URL,
     import.meta.env.VITE_SUPABASE_ANON_KEY
   );
   
   export const base44 = {
     auth: {
       async me() {
         const { data } = await supabase.auth.getUser();
         return data.user;
       },
       // ... other auth methods
     },
     entities: {
       Case: {
         async list() {
           const { data } = await supabase
             .from('cases')
             .select('*')
             .order('created_date', { ascending: false });
           return data;
         },
         // ... other CRUD methods
       },
       // ... other entities
     }
   };
   ```

2. **AI Model Endpoints**:
   - Update `VITE_MODEL_ENDPOINT` in `.env`
   - Update `VITE_GRADCAM_ENDPOINT` in `.env`
   - Implement prediction calls in case creation flow

3. **File Upload**:
   - Configure storage bucket (Supabase Storage or S3)
   - Update `UploadZone` component with actual upload logic

## 📊 Data Models

### Case
```javascript
{
  id: string,
  case_number: string,
  patient_id: string,
  exam_date: string,
  nodule_location: string,
  image_urls: string[],
  status: 'processing' | 'awaiting_review' | 'completed' | 'archived',
  risk_category: 'high' | 'medium' | 'low',
  prediction_confidence: number,
  tirads_category: 1 | 2 | 3 | 4 | 5,
  tirads_points: number,
  assigned_to: string,
  report_status: 'draft' | 'final',
  signed_by: string,
  signed_at: string,
  created_date: string,
  updated_date: string
}
```

### AuditLog
```javascript
{
  id: string,
  case_id: string,
  action: string,
  user_email: string,
  user_name: string,
  details: string,
  model_version: string,
  created_date: string
}
```

### Device
```javascript
{
  id: string,
  device_id: string,
  device_name: string,
  serial_number: string,
  location: string,
  department: string,
  status: 'online' | 'offline' | 'error',
  ip_address: string,
  last_heartbeat: string,
  firmware_version: string,
  created_date: string
}
```

## 🧪 Demo Accounts

For testing, use these credentials:

**Clinician**:
- Email: `doctor@oncoscan.ai`
- Password: `demo123`

**Patient**:
- Email: `patient@example.com`
- Password: `demo123`

## 🛠️ Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📦 Dependencies

### Core
- React 18.3
- React Router 6.22
- TanStack Query 5.28
- Framer Motion 11.0

### UI
- Tailwind CSS 3.4
- Lucide React (icons)
- Sonner (toasts)
- date-fns (date formatting)

## 🚧 TODO: Backend Integration

- [ ] Replace mock API with Supabase
- [ ] Implement Google OAuth
- [ ] Connect AI model endpoints
- [ ] Set up file upload to cloud storage
- [ ] Implement real-time updates
- [ ] Add WebSocket for device heartbeat
- [ ] Set up DICOM image processing
- [ ] Implement PDF report generation
- [ ] Add email notifications
- [ ] Set up audit logging

## 📝 Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000

# Authentication
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# AI Model
VITE_MODEL_ENDPOINT=http://localhost:5000/predict
VITE_GRADCAM_ENDPOINT=http://localhost:5000/gradcam

# File Upload
VITE_MAX_FILE_SIZE=104857600
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,application/dicom
```

## 🔒 Security & Compliance

- HIPAA compliant design
- Patient data anonymization
- Encrypted data transmission
- Role-based access control
- Audit logging for all actions
- FDA regulatory compliance notices

## 📄 License

Proprietary - OncoScan AI Platform

## 👨‍💻 Support

For questions or issues, contact: support@oncoscan.ai