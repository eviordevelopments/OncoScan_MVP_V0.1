import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import GlassCard from '@/components/common/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Settings, 
  Activity,
  HardDrive,
  Upload,
  MapPin,
  Wrench,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  online: {
    icon: Wifi,
    label: 'Online',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-500',
    pulse: true
  },
  offline: {
    icon: WifiOff,
    label: 'Offline',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    iconColor: 'text-gray-400'
  },
  error: {
    icon: AlertTriangle,
    label: 'Error',
    color: 'bg-red-100 text-red-700 border-red-200',
    iconColor: 'text-red-500',
    pulse: true
  },
  maintenance: {
    icon: Wrench,
    label: 'Maintenance',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    iconColor: 'text-amber-500'
  },
  calibrating: {
    icon: Activity,
    label: 'Calibrating',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    iconColor: 'text-blue-500'
  }
};

export default function DeviceCard({ device, onManage }) {
  const config = statusConfig[device.status] || statusConfig.offline;
  const Icon = config.icon;
  
  const storagePercent = device.storage_total_gb 
    ? (device.storage_used_gb / device.storage_total_gb) * 100 
    : 0;

  const isCalibrationDue = device.next_calibration_due && 
    new Date(device.next_calibration_due) <= new Date();

  return (
    <GlassCard padding="default" hover className="relative">
      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        <div className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border",
          config.color
        )}>
          <Icon className={cn("w-3 h-3", config.pulse && "pulse-live")} />
          {config.label}
        </div>
      </div>

      {/* Device Info */}
      <div className="pr-20">
        <h3 className="text-lg font-semibold text-[#0C2D5C] mb-1">
          {device.device_name}
        </h3>
        <p className="text-sm text-[#9CA3AF]">{device.device_id}</p>
        {device.location && (
          <p className="text-sm text-[#9CA3AF] flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            {device.location}
          </p>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="p-3 rounded-xl bg-gray-50">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-[#9CA3AF]">Cases</span>
          </div>
          <p className="text-lg font-bold text-[#0C2D5C]">{device.total_cases_processed || 0}</p>
        </div>

        <div className="p-3 rounded-xl bg-gray-50">
          <div className="flex items-center gap-2 mb-1">
            <Upload className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-[#9CA3AF]">Pending</span>
          </div>
          <p className="text-lg font-bold text-[#0C2D5C]">{device.pending_upload_count || 0}</p>
        </div>
      </div>

      {/* Storage Bar */}
      {device.storage_total_gb && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#9CA3AF] flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              Storage
            </span>
            <span className="text-xs text-[#0C2D5C] font-medium">
              {device.storage_used_gb?.toFixed(1)} / {device.storage_total_gb} GB
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all",
                storagePercent > 90 ? "bg-red-500" : 
                storagePercent > 70 ? "bg-amber-500" : "bg-emerald-500"
              )}
              style={{ width: `${storagePercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Calibration Status */}
      {device.last_calibration && (
        <div className={cn(
          "mt-4 p-3 rounded-xl border flex items-start gap-2",
          isCalibrationDue 
            ? "bg-amber-50 border-amber-200" 
            : "bg-emerald-50 border-emerald-200"
        )}>
          {isCalibrationDue ? (
            <Clock className="w-4 h-4 text-amber-600 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-xs font-medium",
              isCalibrationDue ? "text-amber-700" : "text-emerald-700"
            )}>
              {isCalibrationDue ? 'Calibration Due' : 'Calibrated'}
            </p>
            <p className="text-xs text-gray-600 truncate">
              Last: {format(new Date(device.last_calibration), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[rgba(15,63,150,0.08)]">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onManage(device)}
          className="flex-1"
        >
          <Settings className="w-4 h-4 mr-2" />
          Manage
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          asChild
          className="flex-1"
        >
          <Link to={createPageUrl(`DeviceManager?id=${device.id}`)}>
            View Logs
          </Link>
        </Button>
      </div>

      {/* Connection Info */}
      <div className="mt-3 text-xs text-[#9CA3AF] space-y-0.5">
        <p>Firmware: {device.firmware_version || 'Unknown'}</p>
        <p>Serial: {device.serial_number}</p>
        {device.last_heartbeat && (
          <p>Last seen: {format(new Date(device.last_heartbeat), 'MMM d, HH:mm')}</p>
        )}
      </div>
    </GlassCard>
  );
}
