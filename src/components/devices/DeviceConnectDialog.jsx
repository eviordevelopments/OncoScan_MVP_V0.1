import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function DeviceConnectDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect New Device</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="device-name">Device Name</Label>
            <Input id="device-name" placeholder="e.g., Lab Scanner 01" />
          </div>
          <div>
            <Label htmlFor="device-ip">IP Address</Label>
            <Input id="device-ip" placeholder="192.168.1.100" />
          </div>
          <div>
            <Label htmlFor="device-location">Location</Label>
            <Input id="device-location" placeholder="e.g., Radiology Wing" />
          </div>
          <Button className="w-full">Connect Device</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
