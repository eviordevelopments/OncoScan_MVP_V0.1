import GlassCard from '@/components/common/GlassCard';
import { formatDistanceToNow } from 'date-fns';

export default function DeviceLogs({ logs = [] }) {
  return (
    <GlassCard padding="default">
      <h3 className="text-lg font-semibold text-[#0C2D5C] mb-4">Device Activity</h3>
      {logs.length === 0 ? (
        <p className="text-[#9CA3AF] text-center py-8">No activity logs</p>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
              <div className="flex-1">
                <p className="text-[#0C2D5C]">{log.event_type}</p>
                <p className="text-xs text-[#9CA3AF]">
                  {log.created_date && formatDistanceToNow(new Date(log.created_date), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
