import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/common/GlassCard';
import DeviceCard from '@/components/devices/DeviceCard';
import DeviceConnectDialog from '@/components/devices/DeviceConnectDialog';
import DeviceLogs from '@/components/devices/DeviceLogs';
import DeviceImport from '@/components/devices/DeviceImport';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Search, 
  Activity,
  Wifi,
  Settings,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Download,
  Key,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DeviceManager() {
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const selectedDeviceId = urlParams.get('id');
  
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [managingDevice, setManagingDevice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {}
    };
    loadUser();
  }, []);

  // Fetch devices
  const { data: devices = [], isLoading: devicesLoading, refetch: refetchDevices } = useQuery({
    queryKey: ['devices'],
    queryFn: () => base44.entities.Device.list('-last_heartbeat', 100),
    refetchInterval: 10000 // Poll every 10 seconds for real-time status
  });

  // Fetch device logs
  const { data: deviceLogs = [] } = useQuery({
    queryKey: ['device-logs'],
    queryFn: () => base44.entities.DeviceLog.list('-created_date', 500),
  });

  // Connect new device mutation
  const connectDeviceMutation = useMutation({
    mutationFn: async (deviceData) => {
      const deviceId = `OSD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      const newDevice = await base44.entities.Device.create({
        device_id: deviceId,
        device_name: deviceData.device_name,
        serial_number: deviceData.serial_number,
        location: deviceData.location,
        department: deviceData.department,
        connection_type: deviceData.connection_type,
        ip_address: deviceData.ip_address,
        status: 'online',
        firmware_version: '1.0.0',
        model: 'OncoScan Edge v1.0',
        last_heartbeat: new Date().toISOString(),
        total_cases_processed: 0,
        pending_upload_count: 0,
        storage_used_gb: 0,
        storage_total_gb: 256,
        encryption_enabled: deviceData.encryption_enabled,
        auto_upload: deviceData.auto_upload,
        assigned_users: [user?.email]
      });

      // Create connection log
      await base44.entities.DeviceLog.create({
        device_id: newDevice.id,
        log_type: 'connection',
        severity: 'info',
        message: `Device ${deviceData.device_name} successfully connected`,
        user_email: user?.email,
        details: {
          ip_address: deviceData.ip_address,
          connection_type: deviceData.connection_type
        }
      });

      return newDevice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['device-logs'] });
      setShowConnectDialog(false);
      toast.success('Device connected successfully');
    },
    onError: () => {
      toast.error('Failed to connect device');
    }
  });

  // Update device mutation
  const updateDeviceMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      await base44.entities.Device.update(id, data);
      
      await base44.entities.DeviceLog.create({
        device_id: id,
        log_type: 'configuration_change',
        severity: 'info',
        message: 'Device configuration updated',
        user_email: user?.email
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['device-logs'] });
      setShowManageDialog(false);
      toast.success('Device updated successfully');
    }
  });

  // Simulate device heartbeat check
  useEffect(() => {
    const interval = setInterval(() => {
      devices.forEach(async (device) => {
        if (device.status === 'online') {
          // Simulate random disconnection (5% chance)
          if (Math.random() < 0.05) {
            await base44.entities.Device.update(device.id, {
              status: 'offline'
            });
            
            await base44.entities.DeviceLog.create({
              device_id: device.id,
              log_type: 'disconnection',
              severity: 'high',
              message: 'Device connection lost',
              details: { reason: 'Network timeout' }
            });
            
            refetchDevices();
          } else {
            // Update heartbeat
            await base44.entities.Device.update(device.id, {
              last_heartbeat: new Date().toISOString()
            });
          }
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [devices]);

  const handleManageDevice = (device) => {
    setManagingDevice(device);
    setShowManageDialog(true);
  };

  const handleSaveDevice = () => {
    if (!managingDevice) return;
    updateDeviceMutation.mutate({
      id: managingDevice.id,
      data: {
        device_name: managingDevice.device_name,
        location: managingDevice.location,
        department: managingDevice.department,
        auto_upload: managingDevice.auto_upload,
        notes: managingDevice.notes
      }
    });
  };

  const filteredDevices = devices.filter(d => 
    d.device_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.device_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusCounts = {
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length,
    error: devices.filter(d => d.status === 'error').length,
    total: devices.length
  };

  // Get selected device details
  const selectedDevice = selectedDeviceId 
    ? devices.find(d => d.id === selectedDeviceId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0C2D5C]">Device Manager</h1>
          <p className="text-[#9CA3AF] mt-1">Monitor and manage OncoScan edge devices</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetchDevices()}>
            <RefreshCw className={cn("w-4 h-4 mr-2", devicesLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button 
            onClick={() => setShowConnectDialog(true)}
            className="bg-[#0F3F96] hover:bg-[#0C2D5C]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Connect Device
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard padding="default">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#9CA3AF]">Total Devices</p>
              <p className="text-2xl font-bold text-[#0C2D5C] mt-1">{statusCounts.total}</p>
            </div>
            <Activity className="w-8 h-8 text-[#0F3F96]" />
          </div>
        </GlassCard>

        <GlassCard padding="default">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#9CA3AF]">Online</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{statusCounts.online}</p>
            </div>
            <Wifi className="w-8 h-8 text-emerald-500" />
          </div>
        </GlassCard>

        <GlassCard padding="default">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#9CA3AF]">Offline</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">{statusCounts.offline}</p>
            </div>
            <Wifi className="w-8 h-8 text-gray-400" />
          </div>
        </GlassCard>

        <GlassCard padding="default">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#9CA3AF]">Errors</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{statusCounts.error}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </GlassCard>
      </div>

      {/* Device Details View (if device selected) */}
      {selectedDevice ? (
        <div className="space-y-4">
          <Button variant="outline" asChild>
            <Link to={createPageUrl('DeviceManager')}>
              ← Back to All Devices
            </Link>
          </Button>

          <Tabs defaultValue="import" className="space-y-4">
            <TabsList>
              <TabsTrigger value="import">Import Cases</TabsTrigger>
              <TabsTrigger value="logs">Device Logs</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="import">
              <DeviceImport device={selectedDevice} />
            </TabsContent>

            <TabsContent value="logs">
              <DeviceLogs logs={deviceLogs} deviceId={selectedDevice.id} />
            </TabsContent>

            <TabsContent value="settings">
              <GlassCard padding="default">
                <h3 className="text-lg font-semibold text-[#0C2D5C] mb-4">Device Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Device Name</Label>
                    <Input value={selectedDevice.device_name} disabled className="bg-gray-50" />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={selectedDevice.location || ''} disabled className="bg-gray-50" />
                  </div>
                  <div>
                    <Label>IP Address</Label>
                    <Input value={selectedDevice.ip_address || ''} disabled className="bg-gray-50" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                    <div>
                      <p className="font-medium text-[#0C2D5C]">Auto Upload</p>
                      <p className="text-sm text-[#9CA3AF]">Automatically upload new cases</p>
                    </div>
                    <Switch checked={selectedDevice.auto_upload} disabled />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div>
                      <p className="font-medium text-emerald-800">Encryption Enabled</p>
                      <p className="text-sm text-emerald-700">End-to-end encryption active</p>
                    </div>
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <Input
              placeholder="Search devices by name, ID, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Devices Grid */}
          {devicesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#0F3F96]" />
            </div>
          ) : filteredDevices.length === 0 ? (
            <GlassCard padding="large" className="text-center">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-[#9CA3AF] mb-4">
                {searchTerm ? 'No devices found matching your search' : 'No devices connected'}
              </p>
              <Button onClick={() => setShowConnectDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Connect First Device
              </Button>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDevices.map((device) => (
                <DeviceCard 
                  key={device.id} 
                  device={device} 
                  onManage={handleManageDevice}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Connect Device Dialog */}
      <DeviceConnectDialog
        open={showConnectDialog}
        onOpenChange={setShowConnectDialog}
        onConnect={(data) => connectDeviceMutation.mutate(data)}
        isConnecting={connectDeviceMutation.isPending}
      />

      {/* Manage Device Dialog */}
      <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Device</DialogTitle>
            <DialogDescription>
              Update device configuration and settings
            </DialogDescription>
          </DialogHeader>

          {managingDevice && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Device Name</Label>
                <Input
                  value={managingDevice.device_name || ''}
                  onChange={(e) => setManagingDevice({...managingDevice, device_name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={managingDevice.location || ''}
                  onChange={(e) => setManagingDevice({...managingDevice, location: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  value={managingDevice.department || ''}
                  onChange={(e) => setManagingDevice({...managingDevice, department: e.target.value})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <p className="font-medium text-[#0C2D5C]">Auto Upload</p>
                  <p className="text-sm text-[#9CA3AF]">Automatically upload cases after acquisition</p>
                </div>
                <Switch
                  checked={managingDevice.auto_upload || false}
                  onCheckedChange={(v) => setManagingDevice({...managingDevice, auto_upload: v})}
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={managingDevice.notes || ''}
                  onChange={(e) => setManagingDevice({...managingDevice, notes: e.target.value})}
                  placeholder="Add notes about this device..."
                  className="h-24"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManageDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveDevice}
              disabled={updateDeviceMutation.isPending}
              className="bg-[#0F3F96] hover:bg-[#0C2D5C]"
            >
              {updateDeviceMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

