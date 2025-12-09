import GlassCard from '@/components/common/GlassCard';
import { Cpu, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DeviceCard({ device }) {
  const isOnline = device?.status === 'online';

  return (
    <GlassCard padding="default">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isOnline ? 'bg-emerald-100' : 'bg-gray-100'
          }`}>
            <Cpu className={`w-5 h-5 ${isOnline ? 'text-emerald-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-[#0C2D5C]">{device?.device_name}</h3>
            <p className="text-xs text-[#9CA3AF]">{device?.location}</p>
          </div>
        </div>
        {isOnline ? (
          <Wifi className="w-5 h-5 text-emerald-600" />
        ) : (
          <WifiOff className="w-5 h-5 text-gray-400" />
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[#9CA3AF]">Status</span>
          <span className={`font-medium ${isOnline ? 'text-emerald-600' : 'text-gray-600'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#9CA3AF]">Model</span>
          <span className="text-[#0C2D5C]">{device?.model || 'N/A'}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Button variant="outline" size="sm" className="w-full">
          View Details
        </Button>
      </div>
    </GlassCard>
  );
}
