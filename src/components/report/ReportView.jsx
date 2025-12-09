import { useState } from 'react';
import { format } from 'date-fns';
import Logo from '@/components/common/Logo';
import StatusBadge from '@/components/common/StatusBadge';
import TiradsBadge from '@/components/common/TiradsBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Printer, 
  Download, 
  FileSignature, 
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  FileText,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReportView({ caseData, onSign, onExportPDF, onPrint }) {
  const [radiologistNotes, setRadiologistNotes] = useState('');
  const [clinicalRecommendations, setClinicalRecommendations] = useState({
    fna_biopsy: false,
    clinical_followup: false,
    core_needle_biopsy: false,
    molecular_testing: false,
    surgical_consultation: false,
    no_intervention: false
  });

  if (!caseData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No report data available</p>
      </div>
    );
  }

  const handleExportPDF = () => {
    // This will trigger browser print dialog with PDF save option
    window.print();
  };

  const handleSign = () => {
    const signedData = {
      ...caseData,
      signed_at: new Date().toISOString(),
      signed_by: 'Dr. Sarah Johnson', // This should come from auth context
      radiologist_notes: radiologistNotes,
      clinical_recommendations: clinicalRecommendations,
      status: 'completed'
    };
    onSign?.(signedData);
  };

  // Get TI-RADS info
  const getTIRADSInfo = (cat) => {
    const info = {
      1: { suspiciousness: 'Benign', recommendation: 'No FNA required' },
      2: { suspiciousness: 'Not Suspicious', recommendation: 'No FNA required' },
      3: { suspiciousness: 'Mildly Suspicious', recommendation: 'FNA if ≥2.5 cm, Follow-up if ≥1.5 cm' },
      4: { suspiciousness: 'Moderately Suspicious', recommendation: 'FNA if ≥1.5 cm, Follow-up if ≥1 cm' },
      5: { suspiciousness: 'Highly Suspicious', recommendation: 'FNA if ≥1 cm, Follow-up if ≥0.5 cm' }
    };
    return info[cat] || info[1];
  };

  const tiradsInfo = getTIRADSInfo(caseData.tirads_category || 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Action Bar - Hidden in print */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Report: {caseData.case_number}</h1>
            <p className="text-sm text-gray-600">Draft Report</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button 
              onClick={handleSign}
              className="bg-[#0F3F96] hover:bg-[#0C2D5C]"
            >
              <FileSignature className="w-4 h-4 mr-2" />
              Sign Report
            </Button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-5xl mx-auto p-8 print:p-0">
        <div className="bg-white shadow-lg print:shadow-none">
          {/* Header */}
          <div className="p-8 border-b-4 border-[#0F3F96]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Logo size="large" showText={true} />
                <p className="text-sm text-gray-600 mt-2">Thyroid Screening & Malignancy Risk Assessment</p>
                <p className="text-xs text-gray-500">123 Medical Center Drive, Suite 100</p>
                <p className="text-xs text-gray-500">Phone: (555) 123-4567 | Fax: (555) 123-4568</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">Report Generated</p>
                <p className="text-sm text-gray-600">{format(new Date(), 'MMM d, yyyy HH:mm')}</p>
                <StatusBadge status={caseData.status} className="mt-2" />
              </div>
            </div>
          </div>

          {/* Case Information */}
          <div className="p-8 bg-gray-50">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Case Information</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">Case Number:</span>
                    <span className="text-sm text-gray-900">{caseData.case_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">Patient ID:</span>
                    <span className="text-sm text-gray-900">{caseData.patient_id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">Exam Date:</span>
                    <span className="text-sm text-gray-900">
                      {caseData.exam_date && format(new Date(caseData.exam_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">Nodule Location:</span>
                    <span className="text-sm text-gray-900 capitalize">
                      {caseData.nodule_location?.replace('_', ' ') || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Clinical Data</h2>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Radiologist:</span>
                    <span className="text-sm text-gray-900 ml-2">
                      {caseData.signed_by || 'Dr. Sarah Johnson'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Indication:</span>
                    <span className="text-sm text-gray-900 ml-2">
                      {caseData.indication || 'Routine thyroid screening'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Referring Physician:</span>
                    <span className="text-sm text-gray-900 ml-2">
                      {caseData.referring_physician || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nodule Images */}
          <div className="p-8 border-t border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Nodule Images
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {caseData.image_urls?.slice(0, 2).map((url, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-900 p-2">
                    <img 
                      src={url} 
                      alt={`Nodule image ${index + 1}`}
                      className="w-full h-64 object-contain"
                    />
                  </div>
                  <div className="p-2 bg-gray-50">
                    <p className="text-xs text-gray-600">Image {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Grad-CAM Heatmap */}
            {caseData.gradcam_url && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Grad-CAM Activation Map</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-900 p-2">
                    <img 
                      src={caseData.gradcam_url} 
                      alt="Grad-CAM heatmap"
                      className="w-full h-64 object-contain"
                    />
                  </div>
                  <div className="p-2 bg-gray-50">
                    <p className="text-xs text-gray-600">AI Model Focus Areas (Grad-CAM Visualization)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Risk Assessment */}
          <div className="p-8 border-t border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              AI Risk Assessment
            </h2>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1 text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-red-500 bg-white">
                  <div>
                    <div className="text-4xl font-bold text-gray-900">
                      {(caseData.prediction_confidence || 96.6).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600">Malignancy</div>
                    <div className="text-xs text-gray-600">Confidence</div>
                  </div>
                </div>
                <div className="mt-3 px-4 py-2 bg-red-100 border-2 border-red-500 rounded-lg">
                  <p className="text-sm font-bold text-red-700">HIGH RISK</p>
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Clinical Interpretation:</p>
                    <p className="text-sm text-gray-700">
                      High suspicion for malignancy based on morphologic features. Recommend FNA/biopsy workup.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600">Sensitivity</p>
                      <p className="text-lg font-bold text-gray-900">88.7%</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600">Specificity</p>
                      <p className="text-lg font-bold text-gray-900">57.9%</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600">AUC-ROC</p>
                      <p className="text-lg font-bold text-gray-900">0.839</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600">Accuracy</p>
                      <p className="text-lg font-bold text-gray-900">79.9%</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-xs text-gray-600">
                      Model: OncoScan Binary v1.0 (ResNet-34)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TI-RADS Stratification */}
          <div className="p-8 border-t border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              ACR TI-RADS Stratification
            </h2>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
                <div className="text-4xl font-bold text-emerald-700 mb-1">
                  {caseData.tirads_category || 1}
                </div>
                <div className="text-sm font-semibold text-emerald-700">TI-RADS {caseData.tirads_category || 1}</div>
                <div className="text-xs text-emerald-600 mt-1">{tiradsInfo.suspiciousness}</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {caseData.tirads_points || 0}
                </div>
                <div className="text-sm font-semibold text-gray-700">points</div>
                <div className="text-xs text-gray-600 mt-1">Total score</div>
              </div>
              
              <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                <div className="text-xs font-semibold text-yellow-800 mb-2">ACR Recommendation</div>
                <div className="text-sm text-yellow-900">{tiradsInfo.recommendation}</div>
              </div>
            </div>

            {/* TI-RADS Details */}
            <div className="grid grid-cols-5 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Composition</p>
                <p className="text-sm font-semibold text-gray-900">
                  {caseData.tirads_scores?.composition ?? '-'}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Echogenicity</p>
                <p className="text-sm font-semibold text-gray-900">
                  {caseData.tirads_scores?.echogenicity ?? '-'}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Shape</p>
                <p className="text-sm font-semibold text-gray-900">
                  {caseData.tirads_scores?.shape ?? '-'}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Margin</p>
                <p className="text-sm font-semibold text-gray-900">
                  {caseData.tirads_scores?.margin ?? '-'}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Echogenic Foci</p>
                <p className="text-sm font-semibold text-gray-900">
                  {caseData.tirads_scores?.echogenic_foci?.length > 0 
                    ? Math.max(...caseData.tirads_scores.echogenic_foci)
                    : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="p-8 border-t border-gray-200 bg-red-50">
            <div className="flex gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-red-900 mb-2">IMPORTANT NOTICE</h3>
                <p className="text-sm text-red-800">
                  This AI assessment is a screening aid only. Final diagnosis must be rendered by a qualified 
                  radiologist in conjunction with clinical correlation and pathology findings. Do not use for 
                  patient self-diagnosis or self-treatment.
                </p>
              </div>
            </div>
          </div>

          {/* Radiologist Notes - Hidden in print if empty */}
          <div className="p-8 border-t border-gray-200 print:hidden">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Radiologist Notes</h2>
            <Textarea
              value={radiologistNotes}
              onChange={(e) => setRadiologistNotes(e.target.value)}
              placeholder="Add clinical impressions and additional findings..."
              rows={4}
              className="w-full"
            />
          </div>

          {/* Clinical Recommendations - Hidden in print if empty */}
          <div className="p-8 border-t border-gray-200 print:hidden">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Clinical Recommendations</h2>
            <div className="space-y-2">
              {[
                { key: 'fna_biopsy', label: 'FNA biopsy recommended' },
                { key: 'clinical_followup', label: 'Clinical follow-up ultrasound in 6-12 months' },
                { key: 'core_needle_biopsy', label: 'Core needle biopsy if FNA non-diagnostic' },
                { key: 'molecular_testing', label: 'Molecular testing (e.g., Afirma) if FNA indeterminate' },
                { key: 'surgical_consultation', label: 'Surgical consultation recommended' },
                { key: 'no_intervention', label: 'No immediate intervention needed' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clinicalRecommendations[key]}
                    onChange={(e) => setClinicalRecommendations({
                      ...clinicalRecommendations,
                      [key]: e.target.checked
                    })}
                    className="w-4 h-4 text-[#0F3F96] rounded"
                  />
                  <span className="text-sm text-gray-900">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Signature Section */}
          {caseData.signed_at && (
            <div className="p-8 border-t-2 border-gray-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <p className="text-sm font-semibold text-gray-900">Electronically Signed</p>
                  </div>
                  <p className="text-sm text-gray-700">
                    {caseData.signed_by || 'Dr. Sarah Johnson'}
                  </p>
                  <p className="text-xs text-gray-600">
                    Signed on {format(new Date(caseData.signed_at), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">License #: MD-12345</p>
                  <p className="text-xs text-gray-600">Board Certified Radiologist</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-6 bg-gray-100 border-t border-gray-200">
            <p className="text-xs text-center text-gray-600">
              <span className="font-semibold text-red-600">FDA Notice:</span>{' '}
              OncoScan AI™ is a screening aid only. Final diagnosis must be rendered by a qualified radiologist.
            </p>
            <p className="text-xs text-center text-gray-500 mt-2">
              OncoScan AI™ | 123 Medical Center Drive, Suite 100 | Phone: (555) 123-4567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
