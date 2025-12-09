import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import ImageViewer from '@/components/analysis/ImageViewer';
import AIRiskPanel from '@/components/analysis/AIRiskPanel';
import TIRADSForm from '@/components/analysis/TIRADSForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Calendar, 
  MapPin,
  Loader2
} from 'lucide-react';

export default function Analysis() {
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const caseId = urlParams.get('id');

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showGradCAM, setShowGradCAM] = useState(false);
  const [gradCAMOpacity, setGradCAMOpacity] = useState(60);
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

  const { data: caseData, isLoading } = useQuery({
    queryKey: ['case', caseId],
    queryFn: () => base44.entities.Case.filter({ id: caseId }).then(res => res[0]),
    enabled: !!caseId
  });

  const updateCaseMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.Case.update(caseId, data);
      
      await base44.entities.AuditLog.create({
        case_id: caseId,
        action: 'tirads_saved',
        user_email: user?.email,
        user_name: user?.full_name,
        details: `TI-RADS ${data.tirads_category} saved (${data.tirads_points} points)`,
        model_version: 'OncoScan Binary v1.0'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case', caseId] });
      toast.success('TI-RADS assessment saved successfully');
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0F3F96]" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-[#0C2D5C] mb-2">Case not found</h2>
        <p className="text-[#9CA3AF] mb-4">The requested case could not be found.</p>
        <Button asChild>
          <Link to={createPageUrl('Dashboard')}>Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={createPageUrl('Dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl lg:text-2xl font-bold text-[#0C2D5C]">
                {caseData.case_number}
              </h1>
              <StatusBadge status={caseData.status} />
            </div>
            <p className="text-[#9CA3AF] text-sm mt-1">Analysis Workspace</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={createPageUrl(`Report?id=${caseId}`)}>
              <FileText className="w-4 h-4 mr-2" />
              View Report
            </Link>
          </Button>
        </div>
      </div>

      {/* Case Info Bar */}
      <GlassCard padding="small" className="flex flex-wrap items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[#9CA3AF]" />
          <span className="text-sm text-[#0C2D5C]">{caseData.patient_id}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#9CA3AF]" />
          <span className="text-sm text-[#0C2D5C]">
            {caseData.exam_date && format(new Date(caseData.exam_date), 'MMM d, yyyy')}
          </span>
        </div>
        {caseData.nodule_location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#9CA3AF]" />
            <span className="text-sm text-[#0C2D5C] capitalize">
              {caseData.nodule_location.replace('_', ' ')}
            </span>
          </div>
        )}
        {caseData.assigned_to && (
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0F3F96] to-[#3C7CE3] flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-[#0C2D5C]">
              {caseData.assigned_to.split('@')[0]}
            </span>
          </div>
        )}
      </GlassCard>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Image Viewer - 2 columns */}
        <div className="xl:col-span-2 h-[500px] lg:h-[600px]">
          <ImageViewer 
            images={caseData.image_urls || []}
            activeIndex={activeImageIndex}
            onIndexChange={setActiveImageIndex}
          />
        </div>

        {/* AI Risk Panel - 1 column */}
        <div className="xl:col-span-1">
          <AIRiskPanel 
            caseData={caseData}
            showGradCAM={showGradCAM}
            onToggleGradCAM={setShowGradCAM}
            gradCAMOpacity={gradCAMOpacity}
            onOpacityChange={setGradCAMOpacity}
          />
        </div>
      </div>

      {/* TI-RADS Form */}
      <TIRADSForm 
        caseData={caseData}
        onSave={(data) => updateCaseMutation.mutate(data)}
        isSaving={updateCaseMutation.isPending}
      />
    </div>
  );
}
