import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Wifi, Shield, Key } from 'lucide-react';

export default function DeviceConnectDialog({ open, onOpenChange, onConnect, isConnecting }) {
  const [formData, setFormData] = useState({
    device_name: '',
    serial_number: '',
    location: '',
    department: '',
    connection_type: 'ethernet',
    ip_address: '',
    auto_upload: false,
    encryption_enabled: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onConnect(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-[#0F3F96]" />
            Connect New OncoScan Device
          </DialogTitle>
          <DialogDescription>
            Register and configure a new edge device for secure data transfer
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Device Identification */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#0C2D5C] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0F3F96]" />
              Device Identification
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="device_name">
                  Device Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="device_name"
                  placeholder="e.g., OncoScan Lab A"
                  value={formData.device_name}
                  onChange={(e) => handleChange('device_name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serial_number">
                  Serial Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="serial_number"
                  placeholder="OSD-XXXX-XXXX"
                  value={formData.serial_number}
                  onChange={(e) => handleChange('serial_number', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Radiology Wing, Room 203"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="e.g., Radiology"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Network Configuration */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#0C2D5C] flex items-center gap-2">
              <Wifi className="w-4 h-4 text-[#0F3F96]" />
              Network Configuration
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="connection_type">Connection Type</Label>
                <Select 
                  value={formData.connection_type} 
                  onValueChange={(v) => handleChange('connection_type', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethernet">Ethernet (Recommended)</SelectItem>
                    <SelectItem value="wifi">WiFi</SelectItem>
                    <SelectItem value="cellular">Cellular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ip_address">
                  IP Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ip_address"
                  placeholder="192.168.1.100"
                  value={formData.ip_address}
                  onChange={(e) => handleChange('ip_address', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Security & Features */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#0C2D5C] flex items-center gap-2">
              <Key className="w-4 h-4 text-[#0F3F96]" />
              Security & Features
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex-1">
                  <p className="font-medium text-emerald-800">End-to-End Encryption</p>
                  <p className="text-sm text-emerald-700">
                    All data transfer will be encrypted using AES-256
                  </p>
                </div>
                <Checkbox 
                  checked={formData.encryption_enabled}
                  onCheckedChange={(v) => handleChange('encryption_enabled', v)}
                  disabled
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex-1">
                  <p className="font-medium text-[#0C2D5C]">Automatic Upload</p>
                  <p className="text-sm text-[#9CA3AF]">
                    Automatically upload cases after acquisition
                  </p>
                </div>
                <Checkbox 
                  checked={formData.auto_upload}
                  onCheckedChange={(v) => handleChange('auto_upload', v)}
                />
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> After registration, you will receive a unique API key and 
              connection instructions. Keep this information secure and configure it on the physical device.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isConnecting || !formData.device_name || !formData.serial_number || !formData.ip_address}
              className="bg-[#0F3F96] hover:bg-[#0C2D5C]"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Device'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

