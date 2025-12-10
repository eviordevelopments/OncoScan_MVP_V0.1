import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/common/GlassCard';
import ReportView from '@/components/report/ReportView';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  FileSignature,
  Loader2,
  Printer,
  Archive,
  CheckCircle2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Report() {
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const caseId = urlParams.get('id');

  const [user, setUser] = useState(null);
  const [showSignDialog, setShowSignDialog] = useState(false);
  const [radiologistNotes, setRadiologistNotes] = useState('');
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);

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

  useEffect(() => {
    if (caseData) {
      setRadiologistNotes(caseData.radiologist_notes || '');
      setSelectedRecommendations(caseData.recommendations || []);
    }
  }, [caseData]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.Case.update(caseId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case', caseId] });
    }
  });

  const signReportMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.Case.update(caseId, {
        report_status: 'final',
        signed_by: user?.full_name || user?.email,
        signed_at: new Date().toISOString(),
        radiologist_notes: radiologistNotes,
        recommendations: selectedRecommendations,
        status: 'completed'
      });
      
      await base44.entities.AuditLog.create({
        case_id: caseId,
        action: 'report_signed',
        user_email: user?.email,
        user_name: user?.full_name,
        details: `Report signed and finalized`,
        model_version: 'OncoScan Binary v1.0'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case', caseId] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      setShowSignDialog(false);
      toast.success('Report signed and finalized');
    }
  });

  const handleSaveNotes = () => {
    updateMutation.mutate({ 
      radiologist_notes: radiologistNotes,
      recommendations: selectedRecommendations
    });
    toast.success('Notes saved');
  };

  const handlePrint = () => {
    // Add print-mode class to hide sidebar and UI elements
    document.body.classList.add('print-mode');
    
    // Trigger print
    window.print();
    
    // Remove print-mode class after print dialog closes
    setTimeout(() => {
      document.body.classList.remove('print-mode');
    }, 1000);
  };

  const recommendationOptions = [
    'FNA biopsy recommended',
    'Clinical follow-up ultrasound in 6-12 months',
    'Core needle biopsy if FNA non-diagnostic',
    'Molecular testing (e.g., Afirma) if FNA indeterminate',
    'Surgical consultation recommended',
    'No immediate intervention needed'
  ];

  const handleRecommendationToggle = (rec) => {
    setSelectedRecommendations(prev => 
      prev.includes(rec) 
        ? prev.filter(r => r !== rec)
        : [...prev, rec]
    );
  };

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
        <Button asChild>
          <Link to={createPageUrl('Dashboard')}>Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const isFinalized = caseData.report_status === 'final';

  const handleExportPDF = () => {
    // Create filename with case number
    const filename = `OncoScan_Report_${caseData.case_number}.pdf`;
    
    // Add print-mode class to hide all UI elements
    document.body.classList.add('print-mode');
    document.documentElement.classList.add('print-mode');
    
    // Change document title to desired filename
    const originalTitle = document.title;
    document.title = filename;
    
    // Add a small delay to ensure styles are applied
    setTimeout(() => {
      // Trigger print dialog (user can save as PDF)
      window.print();
      
      // Restore original state after print dialog
      setTimeout(() => {
        document.title = originalTitle;
        document.body.classList.remove('print-mode');
        document.documentElement.classList.remove('print-mode');
      }, 500);
    }, 100);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={createPageUrl(`Analysis?id=${caseId}`)}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#0C2D5C]">
              Report: {caseData.case_number}
            </h1>
            <p className="text-[#9CA3AF] text-sm">
              {isFinalized ? 'Final Report' : 'Draft Report'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportPDF}
            title="Opens print dialog - select 'Save as PDF' as destination"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          {!isFinalized && (
            <Button 
              onClick={() => setShowSignDialog(true)}
              className="bg-[#0F3F96] hover:bg-[#0C2D5C]"
            >
              <FileSignature className="w-4 h-4 mr-2" />
              Sign Report
            </Button>
          )}
          {isFinalized && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Signed & Finalized</span>
            </div>
          )}
        </div>
      </div>

      {/* Report Content */}
      <ReportView 
        caseData={{
          ...caseData,
          radiologist_notes: radiologistNotes,
          recommendations: selectedRecommendations
        }} 
      />

      {/* Radiologist Notes & Recommendations - Only show if not finalized */}
      {!isFinalized && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
          {/* Notes */}
          <GlassCard padding="default">
            <h3 className="font-semibold text-[#0C2D5C] mb-3">Radiologist Notes</h3>
            <Textarea
              placeholder="Add clinical impressions and additional findings..."
              value={radiologistNotes}
              onChange={(e) => setRadiologistNotes(e.target.value)}
              className="h-32 mb-3"
            />
            <Button 
              variant="outline" 
              onClick={handleSaveNotes}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Notes'}
            </Button>
          </GlassCard>

          {/* Recommendations */}
          <GlassCard padding="default">
            <h3 className="font-semibold text-[#0C2D5C] mb-3">Clinical Recommendations</h3>
            <div className="space-y-2">
              {recommendationOptions.map((rec) => (
                <div key={rec} className="flex items-center gap-2">
                  <Checkbox
                    id={rec}
                    checked={selectedRecommendations.includes(rec)}
                    onCheckedChange={() => handleRecommendationToggle(rec)}
                  />
                  <Label htmlFor={rec} className="text-sm cursor-pointer">{rec}</Label>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Sign Dialog */}
      <Dialog open={showSignDialog} onOpenChange={setShowSignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign & Finalize Report</DialogTitle>
            <DialogDescription>
              By signing this report, you confirm that you have reviewed all findings and the AI assessment. 
              The report will be locked and cannot be edited after signing.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-4">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> This action cannot be undone. Please ensure all information is accurate before signing.
              </p>
            </div>
            
            <div className="text-sm text-[#9CA3AF]">
              <p>Signing as: <span className="text-[#0C2D5C] font-medium">{user?.full_name || user?.email}</span></p>
              <p>Date: <span className="text-[#0C2D5C] font-medium">{new Date().toLocaleString()}</span></p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSignDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => signReportMutation.mutate()}
              disabled={signReportMutation.isPending}
              className="bg-[#0F3F96] hover:bg-[#0C2D5C]"
            >
              {signReportMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <FileSignature className="w-4 h-4 mr-2" />
                  Sign Report
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
