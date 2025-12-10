import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import GlassCard from '@/components/common/GlassCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Wifi, 
  Download, 
  Image, 
  Calendar, 
  User,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function DeviceImport({ device, mockCases = [] }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCases, setSelectedCases] = useState([]);
  const [importing, setImporting] = useState(false);

  // Mock cases pending upload on device
  const pendingCases = mockCases.length > 0 ? mockCases : [
    {
      local_id: 'DEV-001',
      patient_id: 'PAT-XXXX-9876',
      exam_date: new Date().toISOString().split('T')[0],
      image_count: 3,
      size_mb: 12.5,
      acquired_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      local_id: 'DEV-002',
      patient_id: 'PAT-XXXX-5432',
      exam_date: new Date().toISOString().split('T')[0],
      image_count: 2,
      size_mb: 8.3,
      acquired_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    }
  ];

  const createCaseMutation = useMutation({
    mutationFn: async (caseData) => {
      const generatedCaseNumber = `CASE-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const newCase = await base44.entities.Case.create({
        case_number: generatedCaseNumber,
        patient_id: caseData.patient_id,
        exam_date: caseData.exam_date,
        status: 'processing',
        image_urls: [], // Would be populated with actual uploaded images
        device_id: device.device_id
      });

      // Create device log
      await base44.entities.DeviceLog.create({
        device_id: device.id,
        log_type: 'case_upload',
        severity: 'info',
        message: `Case ${generatedCaseNumber} imported from device`,
        details: {
          local_id: caseData.local_id,
          image_count: caseData.image_count,
          size_mb: caseData.size_mb
        }
      });

      // Simulate AI processing
      setTimeout(async () => {
        const mockPrediction = {
          prediction_confidence: Math.random() * 40 + 60,
          risk_category: Math.random() > 0.5 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
          status: 'awaiting_review'
        };
        
        await base44.entities.Case.update(newCase.id, mockPrediction);
        
        await base44.entities.AuditLog.create({
          case_id: newCase.id,
          action: 'analysis_complete',
          user_email: 'system',
          user_name: 'OncoScan AI',
          details: `Analysis complete: ${mockPrediction.risk_category.toUpperCase()} risk`,
          model_version: 'OncoScan Binary v1.0'
        });
        
        queryClient.invalidateQueries({ queryKey: ['cases'] });
      }, 3000);

      return newCase;
    }
  });

  const handleImportSelected = async () => {
    if (selectedCases.length === 0) {
      toast.error('Please select at least one case to import');
      return;
    }

    setImporting(true);
    
    try {
      const casesToImport = pendingCases.filter(c => selectedCases.includes(c.local_id));
      
      for (const caseData of casesToImport) {
        await createCaseMutation.mutateAsync(caseData);
      }

      // Update device pending count
      await base44.entities.Device.update(device.id, {
        pending_upload_count: Math.max(0, (device.pending_upload_count || 0) - selectedCases.length),
        total_cases_processed: (device.total_cases_processed || 0) + selectedCases.length
      });

      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      
      toast.success(`Successfully imported ${selectedCases.length} case(s)`);
      setSelectedCases([]);
    } catch (error) {
      toast.error('Failed to import cases');
    } finally {
      setImporting(false);
    }
  };

  const toggleCase = (localId) => {
    setSelectedCases(prev => 
      prev.includes(localId) 
        ? prev.filter(id => id !== localId)
        : [...prev, localId]
    );
  };

  const toggleAll = () => {
    if (selectedCases.length === pendingCases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(pendingCases.map(c => c.local_id));
    }
  };

  return (
    <GlassCard padding="default">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#0C2D5C] flex items-center gap-2">
            <Wifi className="w-5 h-5 text-[#0F3F96]" />
            Import Cases from Device
          </h3>
          <p className="text-sm text-[#9CA3AF]">
            {device.device_name} • {pendingCases.length} case(s) pending upload
          </p>
        </div>
        
        {device.status === 'online' ? (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
            <Wifi className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        ) : (
          <Badge variant="outline" className="text-gray-500">
            <AlertCircle className="w-3 h-3 mr-1" />
            Offline
          </Badge>
        )}
      </div>

      {device.status !== 'online' ? (
        <div className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-[#9CA3AF] mb-2">Device is offline</p>
          <p className="text-sm text-[#9CA3AF]">
            Connect the device to view and import pending cases
          </p>
        </div>
      ) : pendingCases.length === 0 ? (
        <div className="p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <p className="text-[#9CA3AF]">No pending cases</p>
        </div>
      ) : (
        <>
          {/* Select All */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 mb-3">
            <Checkbox
              checked={selectedCases.length === pendingCases.length}
              onCheckedChange={toggleAll}
            />
            <span className="text-sm text-[#0C2D5C]">
              Select all ({selectedCases.length} of {pendingCases.length} selected)
            </span>
          </div>

          {/* Cases List */}
          <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
            {pendingCases.map((caseItem) => (
              <div
                key={caseItem.local_id}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer",
                  selectedCases.includes(caseItem.local_id)
                    ? "border-[#0F3F96] bg-blue-50"
                    : "border-gray-200 hover:border-[#0F3F96] hover:bg-blue-50/50"
                )}
                onClick={() => toggleCase(caseItem.local_id)}
              >
                <Checkbox
                  checked={selectedCases.includes(caseItem.local_id)}
                  onCheckedChange={() => toggleCase(caseItem.local_id)}
                  onClick={(e) => e.stopPropagation()}
                />

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#0C2D5C]">{caseItem.local_id}</p>
                    <p className="text-xs text-[#9CA3AF] flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {caseItem.patient_id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#9CA3AF]">Exam Date</p>
                    <p className="text-sm text-[#0C2D5C] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(caseItem.exam_date), 'MMM d, yyyy')}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#9CA3AF]">Images</p>
                    <p className="text-sm text-[#0C2D5C] flex items-center gap-1">
                      <Image className="w-3 h-3" />
                      {caseItem.image_count} ({caseItem.size_mb.toFixed(1)} MB)
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#9CA3AF]">Acquired</p>
                    <p className="text-sm text-[#0C2D5C]">
                      {format(new Date(caseItem.acquired_at), 'HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Import Button */}
          <div className="flex items-center justify-between pt-4 border-t border-[rgba(15,63,150,0.08)]">
            <p className="text-sm text-[#9CA3AF]">
              Total size: {pendingCases.filter(c => selectedCases.includes(c.local_id)).reduce((sum, c) => sum + c.size_mb, 0).toFixed(1)} MB
            </p>
            <Button
              onClick={handleImportSelected}
              disabled={selectedCases.length === 0 || importing}
              className="bg-[#0F3F96] hover:bg-[#0C2D5C]"
            >
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Import Selected ({selectedCases.length})
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </GlassCard>
  );
}

