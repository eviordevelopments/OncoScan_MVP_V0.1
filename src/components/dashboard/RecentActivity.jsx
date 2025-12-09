import { formatDistanceToNow } from 'date-fns';
import GlassCard from '@/components/common/GlassCard';
import { Activity, FileText, AlertCircle, CheckCircle, Upload } from 'lucide-react';

export default function RecentActivity({ logs = [] }) {
  const getIcon = (action) => {
    switch (action) {
      case 'case_created':
        return Upload;
      case 'analysis_complete':
        return Activity;
      case 'report_signed':
        return CheckCircle;
      case 'tirads_saved':
        return FileText;
      default:
        return AlertCircle;
    }
  };

  const getColor = (action) => {
    switch (action) {
      case 'case_created':
        return 'text-blue-600 bg-blue-100';
      case 'analysis_complete':
        return 'text-emerald-600 bg-emerald-100';
      case 'report_signed':
        return 'text-green-600 bg-green-100';
      case 'tirads_saved':
        return 'text-amber-600 bg-amber-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <GlassCard padding="default">
      <h2 className="text-lg font-semibold text-[#0C2D5C] mb-4">Recent Activity</h2>
      
      {logs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#9CA3AF] text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.slice(0, 8).map((log) => {
            const Icon = getIcon(log.action);
            const colorClass = getColor(log.action);
            
            return (
              <div key={log.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0C2D5C] font-medium truncate">
                    {log.user_name || 'System'}
                  </p>
                  <p className="text-xs text-[#9CA3AF] line-clamp-2">
                    {log.details}
                  </p>
                  <p className="text-xs text-[#9CA3AF] mt-1">
                    {log.created_date && formatDistanceToNow(new Date(log.created_date), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
