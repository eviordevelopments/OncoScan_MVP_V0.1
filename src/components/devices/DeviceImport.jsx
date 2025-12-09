import GlassCard from '@/components/common/GlassCard';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function DeviceImport({ devices = [] }) {
  return (
    <GlassCard padding="default">
      <h3 className="text-lg font-semibold text-[#0C2D5C] mb-4">Import from Device</h3>
      {devices.length === 0 ? (
        <p className="text-[#9CA3AF] text-center py-8">No devices available</p>
      ) : (
        <div className="space-y-2">
          {devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div>
                <p className="font-medium text-[#0C2D5C]">{device.device_name}</p>
                <p className="text-xs text-[#9CA3AF]">{device.location}</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
