import React from 'react';
import { format } from 'date-fns';
import GlassCard from '@/components/common/GlassCard';
import { 
  Plus, 
  CheckCircle2, 
  FileText, 
  AlertTriangle,
  Image,
  Archive,
  Activity
} from 'lucide-react';

const actionIcons = {
  case_created: Plus,
  image_uploaded: Image,
  analysis_complete: Activity,
  tirads_saved: FileText,
  report_signed: CheckCircle2,
  report_exported: FileText,
  case_archived: Archive,
  status_changed: AlertTriangle
};

const actionColors = {
  case_created: 'bg-blue-100 text-blue-600',
  image_uploaded: 'bg-purple-100 text-purple-600',
  analysis_complete: 'bg-emerald-100 text-emerald-600',
  tirads_saved: 'bg-amber-100 text-amber-600',
  report_signed: 'bg-green-100 text-green-600',
  report_exported: 'bg-indigo-100 text-indigo-600',
  case_archived: 'bg-gray-100 text-gray-600',
  status_changed: 'bg-orange-100 text-orange-600'
};

export default function RecentActivity({ logs = [] }) {
  const recentLogs = logs.slice(0, 8);

  return (
    <GlassCard padding="default">
      <h3 className="text-lg font-semibold text-[#0C2D5C] mb-4">Recent Activity</h3>
      
      {recentLogs.length === 0 ? (
        <div className="text-center py-8 text-[#9CA3AF]">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentLogs.map((log, index) => {
            const Icon = actionIcons[log.action] || Activity;
            const colorClass = actionColors[log.action] || 'bg-gray-100 text-gray-600';
            
            return (
              <div 
                key={log.id || index} 
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-[rgba(15,63,150,0.03)] transition-colors"
              >
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0C2D5C]">
                    <span className="font-medium">{log.user_name || log.user_email?.split('@')[0]}</span>
                    {' '}
                    <span className="text-[#9CA3AF]">
                      {log.action?.replace(/_/g, ' ')}
                    </span>
                    {log.case_id && (
                      <span className="text-[#0F3F96]"> #{log.case_id.slice(-4)}</span>
                    )}
                  </p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    {log.created_date && format(new Date(log.created_date), 'MMM d, HH:mm')}
                    {log.model_version && ` • ${log.model_version}`}
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
