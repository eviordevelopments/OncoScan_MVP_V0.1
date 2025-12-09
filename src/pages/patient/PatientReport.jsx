import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ReportView from '@/components/report/ReportView';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Download, 
  Lock,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import GlassCard from '@/components/common/GlassCard';

export default function PatientReport() {
  const urlParams = new URLSearchParams(window.location.search);
  const caseId = urlParams.get('id');
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
    queryKey: ['patient-report', caseId],
    queryFn: () => base44.entities.Case.filter({ id: caseId }).then(res => res[0]),
    enabled: !!caseId
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
        <h2 className="text-xl font-semibold text-[#0C2D5C] mb-2">Report not found</h2>
        <Button asChild>
          <Link to={createPageUrl('PatientReports')}>Back to My Reports</Link>
        </Button>
      </div>
    );
  }

  // Security check - only show finalized reports
  if (caseData.report_status !== 'final') {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <GlassCard padding="large" className="text-center">
          <Lock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#0C2D5C] mb-2">Report Not Available</h2>
          <p className="text-[#9CA3AF] mb-4">
            This report has not been finalized yet. You will be able to view it once your 
            physician completes and signs the report.
          </p>
          <Button asChild>
            <Link to={createPageUrl('PatientReports')}>Back to My Reports</Link>
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={createPageUrl('PatientReports')}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#0C2D5C]">
              Thyroid Ultrasound Report
            </h1>
            <p className="text-[#9CA3AF] text-sm">Read-Only View</p>
          </div>
        </div>
        
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Important Notice for Patients */}
      <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200 print:hidden">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-blue-800 mb-1">Important Information</p>
            <p className="text-sm text-blue-700">
              This report has been reviewed and signed by your radiologist. If you have questions 
              about your results or recommended next steps, please contact your referring physician 
              or healthcare provider. Do not make medical decisions based solely on this report.
            </p>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <ReportView caseData={caseData} />
    </div>
  );
}

