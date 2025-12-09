# OncoScan AI - Integration Plan

## 📋 Overview

This document outlines the integration of your uploaded component files into the existing project structure.

## 🗂️ Current File Structure

### Your Uploaded Files:
```
Components/
├── common/
│   ├── logo.jsx
│   ├── StatusBadge.jsx
│   ├── RiskBadge.jsx
│   ├── TiradsBadge.jsx
│   └── GlassCard.jsx

Dashboard/
├── QuickStats.jsx
├── CaseQueue.jsx
├── RecentActivity.jsx
├── ModelStatus.jsx
├── Upload/
│   ├── UploadZone.jsx
│   └── MetadataForm.jsx
├── Analysis/
│   ├── ImageViewer.jsx
│   ├── AIRiskPanel.jsx
│   └── TIRADSForm.jsx
├── Report/
│   └── ReportView.jsx
├── Devices/
│   ├── DeviceCard.jsx
│   ├── DeviceConnectDialog.jsx
│   ├── DeviceLogs.jsx
│   └── DeviceImport.jsx
└── Patient/
    ├── ReportCard.jsx
    └── EducationCard.jsx

Entities/
├── Case.json
├── AuditLog.json
├── Device.json
├── DeviceLog.json
└── EducationContent.json

layout.js (Main layout component)
```

## 🎯 Integration Strategy

### Phase 1: Reorganize File Structure ✅
Move all components to proper `src/components/` directory following React conventions:

```
src/
├── components/
│   ├── common/          # Shared UI components
│   │   ├── Logo.jsx
│   │   ├── GlassCard.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── RiskBadge.jsx
│   │   └── TiradsBadge.jsx
│   ├── dashboard/       # Dashboard-specific
│   │   ├── QuickStats.jsx
│   │   ├── CaseQueue.jsx
│   │   ├── RecentActivity.jsx
│   │   └── ModelStatus.jsx
│   ├── upload/          # File upload
│   │   ├── UploadZone.jsx
│   │   └── MetadataForm.jsx
│   ├── analysis/        # Analysis workspace
│   │   ├── ImageViewer.jsx
│   │   ├── AIRiskPanel.jsx
│   │   └── TIRADSForm.jsx
│   ├── report/          # Report generation
│   │   └── ReportView.jsx
│   ├── devices/         # Device management
│   │   ├── DeviceCard.jsx
│   │   ├── DeviceConnectDialog.jsx
│   │   ├── DeviceLogs.jsx
│   │   └── DeviceImport.jsx
│   ├── patient/         # Patient portal
│   │   ├── ReportCard.jsx
│   │   └── EducationCard.jsx
│   ├── layout/          # Layout components
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   └── Header.jsx
│   └── ui/              # shadcn/ui components
│       ├── button.jsx
│       ├── input.jsx
│       ├── table.jsx
│       ├── dropdown-menu.jsx
│       └── ... (other UI components)
```

### Phase 2: Update Import Paths
All components will use consistent import paths:
- `@/components/common/Logo` instead of `@/Components/common/logo`
- `@/components/dashboard/QuickStats` instead of `@/Dashboard/QuickStats`

### Phase 3: Add Missing UI Components
Create shadcn/ui components that are referenced but missing:
- Table component
- DropdownMenu component
- Other UI primitives

### Phase 4: Update CSS Styles
Add custom CSS classes used in your components:
- `.status-processing`, `.status-awaiting`, etc.
- `.badge-high-risk`, `.badge-medium-risk`, etc.
- `.tirads-1` through `.tirads-5`
- `.glass-card`, `.glass-card-subtle`
- `.transition-glass`

### Phase 5: Move Page Files
Move page files from root to `src/pages/`:
- Dashboard.jsx → src/pages/Dashboard.jsx
- NewCase.jsx → src/pages/NewCase.jsx
- Analysis.jsx → src/pages/Analysis.jsx
- etc.

### Phase 6: Update Entity Definitions
Use Entity JSON files to update mock API data structure

### Phase 7: Test & Validate
- Verify all imports resolve correctly
- Test component rendering
- Validate data flow

## 🔧 Key Changes Needed

### 1. Import Path Updates
**Before:**
```javascript
import Logo from '@/Components/common/logo';
import GlassCard from '@/Dashboard/common/GlassCard';
```

**After:**
```javascript
import Logo from '@/components/common/Logo';
import GlassCard from '@/components/common/GlassCard';
```

### 2. Layout Integration
Your `layout.js` will replace the template layouts and become the main layout component.

### 3. CSS Classes
Add to `src/index.css`:
```css
/* Status badges */
.status-processing { @apply bg-blue-100 text-blue-700; }
.status-awaiting { @apply bg-amber-100 text-amber-700; }
.status-completed { @apply bg-emerald-100 text-emerald-700; }
.status-flagged { @apply bg-red-100 text-red-700; }

/* Risk badges */
.badge-high-risk { @apply bg-red-100 text-red-700 border border-red-200; }
.badge-medium-risk { @apply bg-amber-100 text-amber-700 border border-amber-200; }
.badge-low-risk { @apply bg-emerald-100 text-emerald-700 border border-emerald-200; }

/* TI-RADS badges */
.tirads-1 { @apply bg-emerald-100 text-emerald-700; }
.tirads-2 { @apply bg-green-100 text-green-700; }
.tirads-3 { @apply bg-yellow-100 text-yellow-700; }
.tirads-4 { @apply bg-orange-100 text-orange-700; }
.tirads-5 { @apply bg-red-100 text-red-700; }

/* Glass cards */
.glass-card {
  @apply bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl;
}
.glass-card-subtle {
  @apply bg-white/50 backdrop-blur-sm border border-white/10 shadow-sm rounded-xl;
}
.transition-glass {
  @apply transition-all duration-300;
}
```

## 📦 Dependencies to Add

Your components use these additional dependencies:
```json
{
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-table": "^0.1.0"
}
```

## ✅ Validation Checklist

- [ ] All components moved to `src/components/`
- [ ] All import paths updated
- [ ] CSS classes added
- [ ] UI components created
- [ ] Page files moved
- [ ] Layout integrated
- [ ] Entity schemas documented
- [ ] No import errors
- [ ] Application builds successfully
- [ ] All pages render correctly

## 🚀 Next Steps

1. Execute file reorganization
2. Update all import statements
3. Add missing UI components
4. Update CSS with custom classes
5. Test the application
6. Document any issues
7. Commit changes

---

**Status**: Ready for integration
**Estimated Time**: 30-45 minutes
**Priority**: High
