import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/common/GlassCard';
import UploadZone from '@/components/upload/UploadZone';
import MetadataForm from '@/components/upload/MetadataForm';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  Image
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewCase() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState(1);
  const [imageUrls, setImageUrls] = useState([]);
  const [metadata, setMetadata] = useState({
    patient_id: '',
    exam_date: new Date().toISOString().split('T')[0],
    nodule_location: '',
    indication: '',
    referring_physician: '',
    clinical_notes: ''
  });
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
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

  const generateCaseNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CASE-${year}-${random}`;
  };

  const createCaseMutation = useMutation({
    mutationFn: async (data) => {
      const caseData = {
        ...data,
        case_number: generateCaseNumber(),
        status: 'processing',
        assigned_to: user?.email
      };
      
      const newCase = await base44.entities.Case.create(caseData);
      
      // Create audit log
      await base44.entities.AuditLog.create({
        case_id: newCase.id,
        action: 'case_created',
        user_email: user?.email,
        user_name: user?.full_name,
        details: `Case ${caseData.case_number} created with ${data.image_urls.length} images`,
        model_version: 'OncoScan Binary v1.0'
      });

      // Simulate AI processing
      setTimeout(async () => {
        const mockPrediction = {
          prediction_confidence: Math.random() * 40 + 60, // 60-100
          risk_category: Math.random() > 0.5 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
          status: 'awaiting_review'
        };
        
        await base44.entities.Case.update(newCase.id, mockPrediction);
        
        await base44.entities.AuditLog.create({
          case_id: newCase.id,
          action: 'analysis_complete',
          user_email: 'system',
          user_name: 'OncoScan AI',
          details: `Analysis complete: ${mockPrediction.risk_category.toUpperCase()} risk (${mockPrediction.prediction_confidence.toFixed(1)}% confidence)`,
          model_version: 'OncoScan Binary v1.0'
        });
        
        queryClient.invalidateQueries({ queryKey: ['cases'] });
      }, 3000);

      return newCase;
    },
    onSuccess: (newCase) => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
      setStep(4);
      
      setTimeout(() => {
        navigate(createPageUrl(`Analysis?id=${newCase.id}`));
      }, 2000);
    }
  });

  const handleFilesUploaded = (urls) => {
    setImageUrls(prev => [...prev, ...urls]);
  };

  const canProceedToStep2 = imageUrls.length > 0;
  const canProceedToStep3 = metadata.patient_id && metadata.exam_date;
  const canSubmit = canProceedToStep3 && privacyConfirmed;

  const handleSubmit = () => {
    createCaseMutation.mutate({
      ...metadata,
      image_urls: imageUrls
    });
  };

  const steps = [
    { number: 1, label: 'Upload Images' },
    { number: 2, label: 'Case Information' },
    { number: 3, label: 'Review & Submit' },
    { number: 4, label: 'Processing' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0C2D5C]">New Case</h1>
        <p className="text-[#9CA3AF] mt-1">Upload thyroid ultrasound images for AI analysis</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((s, index) => (
          <React.Fragment key={s.number}>
            <div className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                step >= s.number 
                  ? "bg-[#0F3F96] text-white" 
                  : "bg-gray-100 text-gray-400"
              )}>
                {step > s.number ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  s.number
                )}
              </div>
              <span className={cn(
                "ml-2 text-sm font-medium hidden sm:inline",
                step >= s.number ? "text-[#0C2D5C]" : "text-gray-400"
              )}>
                {s.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-4",
                step > s.number ? "bg-[#0F3F96]" : "bg-gray-200"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Upload Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard padding="default" className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#0F3F96] to-[#3C7CE3]">
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0C2D5C]">File Upload</h3>
                    <p className="text-xs text-[#9CA3AF]">Upload from your device</p>
                  </div>
                </div>
                <UploadZone onFilesUploaded={handleFilesUploaded} />
              </GlassCard>

              <GlassCard padding="default" className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#10B981] to-[#34D399]">
                    <Wifi className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0C2D5C]">OncoScan Device</h3>
                    <p className="text-xs text-[#9CA3AF]">Import from edge device</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-live" />
                    <span className="text-sm font-medium text-emerald-700">2 Devices Online</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] mb-3">Hospital Lab A, Radiology Wing</p>
                  <Button 
                    variant="outline" 
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                    asChild
                  >
                    <Link to={createPageUrl('DeviceManager')}>
                      View Devices & Import
                    </Link>
                  </Button>
                </div>
              </GlassCard>
            </div>

            {/* Uploaded Files Preview */}
            {imageUrls.length > 0 && (
              <GlassCard padding="default">
                <h4 className="font-medium text-[#0C2D5C] mb-3">
                  Uploaded Images ({imageUrls.length})
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2}
                className="bg-[#0F3F96] hover:bg-[#0C2D5C]"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <MetadataForm metadata={metadata} onChange={setMetadata} />

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!canProceedToStep3}
                className="bg-[#0F3F96] hover:bg-[#0C2D5C]"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Review Summary */}
            <GlassCard padding="default">
              <h3 className="text-lg font-semibold text-[#0C2D5C] mb-4">Review Submission</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Images */}
                <div>
                  <h4 className="text-sm font-medium text-[#9CA3AF] mb-2">Images ({imageUrls.length})</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {imageUrls.slice(0, 4).map((url, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-[#9CA3AF]">Patient ID</h4>
                    <p className="text-[#0C2D5C]">{metadata.patient_id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#9CA3AF]">Exam Date</h4>
                    <p className="text-[#0C2D5C]">{metadata.exam_date}</p>
                  </div>
                  {metadata.nodule_location && (
                    <div>
                      <h4 className="text-sm font-medium text-[#9CA3AF]">Location</h4>
                      <p className="text-[#0C2D5C] capitalize">{metadata.nodule_location.replace('_', ' ')}</p>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>

            {/* Privacy Confirmation */}
            <GlassCard padding="default" className="border-2 border-amber-200 bg-amber-50/50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-amber-800 mb-1">Privacy Compliance</h4>
                  <p className="text-sm text-amber-700 mb-3">
                    Please confirm that all patient data has been properly anonymized and complies with HIPAA regulations.
                  </p>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="privacy" 
                      checked={privacyConfirmed}
                      onCheckedChange={setPrivacyConfirmed}
                    />
                    <Label htmlFor="privacy" className="text-sm text-amber-800 cursor-pointer">
                      I confirm patient privacy compliance
                    </Label>
                  </div>
                </div>
              </div>
            </GlassCard>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || createCaseMutation.isPending}
                className="bg-[#0F3F96] hover:bg-[#0C2D5C]"
              >
                {createCaseMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit for Analysis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <GlassCard padding="large" className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0F3F96] to-[#3C7CE3] flex items-center justify-center mx-auto mb-6">
                <div className="spinner w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-[#0C2D5C] mb-2">Analyzing Images</h2>
              <p className="text-[#9CA3AF] mb-4">
                OncoScan AI is processing your ultrasound images. This usually takes about 30 seconds.
              </p>
              <p className="text-sm text-[#3C7CE3]">
                Redirecting to analysis workspace...
              </p>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
