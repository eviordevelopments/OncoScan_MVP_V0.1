import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import QuickStats from '@/components/dashboard/QuickStats';
import CaseQueue from '@/components/dashboard/CaseQueue';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ModelStatus from '@/components/dashboard/ModelStatus';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const { data: cases = [], isLoading: casesLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: () => base44.entities.Case.list('-created_date', 100),
  });

  const { data: auditLogs = [] } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => base44.entities.AuditLog.list('-created_date', 20),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Thyroid nodule screening & malignancy risk assessment</p>
        </div>
        <Link to="/new-case">
          <Button 
            className="bg-[#0F3F96] hover:bg-[#0C2D5C] text-white shadow-lg h-12 px-6 text-base font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Case</span>
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <QuickStats cases={cases} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Case Queue - Takes 2 columns on XL */}
        <div className="xl:col-span-2">
          <CaseQueue cases={cases} isLoading={casesLoading} />
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <ModelStatus />
          <RecentActivity logs={auditLogs} />
        </div>
      </div>
    </div>
  );
}
