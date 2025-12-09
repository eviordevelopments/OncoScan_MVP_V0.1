import GlassCard from '@/components/common/GlassCard';
import { Activity, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function QuickStats({ cases = [] }) {
  const stats = {
    total: cases.length,
    processing: cases.filter(c => c.status === 'processing').length,
    awaiting: cases.filter(c => c.status === 'awaiting_review').length,
    completed: cases.filter(c => c.status === 'completed').length,
  };

  const statCards = [
    {
      label: 'Total Cases',
      value: stats.total,
      icon: Activity,
      color: 'from-[#0F3F96] to-[#3C7CE3]',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Processing',
      value: stats.processing,
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Awaiting Review',
      value: stats.awaiting,
      icon: AlertTriangle,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <GlassCard key={index} padding="default" hover className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
