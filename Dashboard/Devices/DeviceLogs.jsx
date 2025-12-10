import React, { useState } from 'react';
import { format } from 'date-fns';
import GlassCard from '@/components/common/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2,
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  Wifi,
  WifiOff,
  Wrench,
  Upload,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const logTypeIcons = {
  connection: Wifi,
  disconnection: WifiOff,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  case_upload: Upload,
  calibration: Activity,
  firmware_update: Download,
  maintenance: Wrench,
  configuration_change: Activity
};

const severityConfig = {
  critical: {
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-500'
  },
  high: {
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: AlertTriangle,
    iconColor: 'text-orange-500'
  },
  medium: {
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: AlertTriangle,
    iconColor: 'text-amber-500'
  },
  low: {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Info,
    iconColor: 'text-blue-500'
  },
  info: {
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: Info,
    iconColor: 'text-gray-500'
  }
};

export default function DeviceLogs({ logs = [], deviceId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expandedLog, setExpandedLog] = useState(null);

  const filteredLogs = logs
    .filter(log => log.device_id === deviceId)
    .filter(log => {
      const matchesSearch = log.message?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
      const matchesType = typeFilter === 'all' || log.log_type === typeFilter;
      return matchesSearch && matchesSeverity && matchesType;
    });

  const handleExportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `device-logs-${deviceId}-${Date.now()}.json`;
    link.click();
  };

  return (
    <GlassCard padding="default">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#0C2D5C]">Device Logs</h3>
        <Button variant="outline" size="sm" onClick={handleExportLogs}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-32">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="connection">Connection</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="case_upload">Case Upload</SelectItem>
            <SelectItem value="calibration">Calibration</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs List */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-[#9CA3AF]">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No logs found</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const severityConf = severityConfig[log.severity] || severityConfig.info;
            const TypeIcon = logTypeIcons[log.log_type] || Info;
            const isExpanded = expandedLog === log.id;

            return (
              <div 
                key={log.id}
                className={cn(
                  "p-4 rounded-xl border transition-all",
                  log.resolved ? "bg-gray-50 border-gray-200 opacity-60" : "bg-white border-[rgba(15,63,150,0.1)]"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={cn(
                    "p-2 rounded-lg flex-shrink-0",
                    severityConf.color.replace('text-', 'bg-').replace('700', '100')
                  )}>
                    <TypeIcon className={cn("w-4 h-4", severityConf.iconColor)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-[#0C2D5C] mb-1">{log.message}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={severityConf.color}>
                            {log.severity?.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-[#9CA3AF] capitalize">
                            {log.log_type?.replace(/_/g, ' ')}
                          </span>
                          {log.resolved && (
                            <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-[#9CA3AF] whitespace-nowrap">
                        {log.created_date && format(new Date(log.created_date), 'MMM d, HH:mm:ss')}
                      </span>
                    </div>

                    {/* Expandable Details */}
                    {log.details && (
                      <button
                        onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                        className="flex items-center gap-1 text-xs text-[#0F3F96] hover:underline"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3 h-3" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3" />
                            Show Details
                          </>
                        )}
                      </button>
                    )}

                    {isExpanded && log.details && (
                      <pre className="mt-2 p-3 rounded-lg bg-gray-50 text-xs text-[#0C2D5C] overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}

                    {log.user_email && (
                      <p className="text-xs text-[#9CA3AF] mt-1">
                        User: {log.user_email}
                      </p>
                    )}

                    {log.resolved && log.resolved_by && (
                      <p className="text-xs text-emerald-600 mt-1">
                        Resolved by {log.resolved_by} on{' '}
                        {log.resolved_at && format(new Date(log.resolved_at), 'MMM d, HH:mm')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
}

