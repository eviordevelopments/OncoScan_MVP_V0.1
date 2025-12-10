import React from 'react';
import GlassCard from '@/components/common/GlassCard';
import { Activity, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function QuickStats({ cases = [] }) {
  const today = new Date().toDateString();
  
  const stats = {
    todayCases: cases.filter(c => new Date(c.created_date).toDateString() === today).length,
    pendingReview: cases.filter(c => c.status === 'awaiting_review').length,
    highRisk: cases.filter(c => c.risk_category === 'high').length,
    completed: cases.filter(c => c.status === 'completed').length
  };

  const statCards = [
    {
      label: "Today's Cases",
      value: stats.todayCases,
      icon: Activity,
      color: 'from-[#0F3F96] to-[#3C7CE3]',
      bgLight: 'bg-blue-50'
    },
    {
      label: 'Pending Review',
      value: stats.pendingReview,
      icon: Clock,
      color: 'from-[#F59E0B] to-[#FBBF24]',
      bgLight: 'bg-amber-50'
    },
    {
      label: 'High Risk Cases',
      value: stats.highRisk,
      icon: AlertTriangle,
      color: 'from-[#D4273E] to-[#E85B6C]',
      bgLight: 'bg-red-50'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'from-[#10B981] to-[#34D399]',
      bgLight: 'bg-emerald-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <GlassCard key={index} padding="default" hover className="relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${stat.bgLight} -translate-y-8 translate-x-8 opacity-60`} />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#9CA3AF] font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-[#0C2D5C] mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

