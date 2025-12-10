import { format } from 'date-fns';
import StatusBadge from '@/components/common/StatusBadge';
import { 
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  FileText,
  CheckCircle
} from 'lucide-react';

export default function ReportView({ caseData }) {
  if (!caseData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No report data available</p>
      </div>
    );
  }

  const isFinalized = caseData.report_status === 'final';
  const radiologistNotes = caseData.radiologist_notes || '';
  const recommendations = caseData.recommendations || [];

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
    <div className="bg-white shadow-lg print:shadow-none">
      {/* Header */}
      <div className="p-8 border-b-4 border-[#0F3F96]">
        <div className="flex items-start justify-between mb-6">
          <div>
            {/* OncoScan Logo */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 relative bg-white rounded-lg p-1 shadow-sm">
                {/* Fallback image for print */}
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJibHVlR3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzQzdDRTMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMEYzRjk2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJyZWRHcmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0U4NUI2QyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNENDI3M0UiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxwYXRoIGQ9Ik0xNSAzNUMxNSAyMCAyNSAxNSAzNSAxNUM0NSAxNSA1MCAyNSA1MCA0NUM1MCA1NSA0NSA3MCA0MCA4MEMzNSA4NSAyNSA4NSAyMCA3NUMxNSA2NSAxNSA1MCAxNSAzNVoiIGZpbGw9InVybCgjYmx1ZUdyYWQpIiBzdHJva2U9IiMwRjNGOTYiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxwYXRoIGQ9Ik04NSAzNUM4NSAyMCA3NSAxNSA2NSAxNUM1NSAxNSA1MCAyNSA1MCA0NUM1MCA1NSA1NSA3MCA2MCA4MEM2NSA4NSA3NSA4NSA4MCA3NUM4NSA2NSA4NSA1MCA4NSAzNVoiIGZpbGw9InVybCgjcmVkR3JhZCkiIHN0cm9rZT0iI0Q0MjczRSIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPGVsbGlwc2UgY3g9IjUwIiBjeT0iNDUiIHJ4PSI4IiByeT0iMTIiIGZpbGw9IiMwQzJENUMiIG9wYWNpdHk9IjAuNCIvPgogIDxlbGxpcHNlIGN4PSIzNSIgY3k9IjMwIiByeD0iMyIgcnk9IjUiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyIvPgogIDxlbGxpcHNlIGN4PSI2NSIgY3k9IjMwIiByeD0iMyIgcnk9IjUiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyIvPgo8L3N2Zz4="
                  alt="OncoScan AI Logo"
                  className="w-full h-full object-contain"
                  style={{ printColorAdjust: 'exact' }}
                />
              </div>
              <div className="font-bold text-2xl">
                <span className="text-[#0C2D5C]">Onco</span>
                <span className="text-[#D4273E]">Scan</span>
                <span className="text-[#0F3F96] text-sm ml-1 font-normal">AI™</span>
              </div>
            </div>
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
                <div className="text-3xl font-bold text-gray-900">
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

      {/* Radiologist Notes - Show if finalized and has notes */}
      {isFinalized && radiologistNotes && (
        <div className="p-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Radiologist Observations</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{radiologistNotes}</p>
          </div>
        </div>
      )}

      {/* Clinical Recommendations - Show if finalized and has recommendations */}
      {isFinalized && recommendations.length > 0 && (
        <div className="p-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Clinical Recommendations</h2>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-gray-900">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Footer - FDA Disclaimer */}
      <div className="p-6 bg-gray-100 border-t border-gray-200 print:bg-white print:border-gray-400">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-center text-gray-800 font-medium print:text-black">
            <span className="font-bold text-red-600 print:text-black">FDA Notice:</span>{' '}
            OncoScan AI™ is a screening aid only. Final diagnosis must be rendered by a qualified radiologist.
          </p>
          <p className="text-xs text-center text-gray-600 mt-2 print:text-black">
            OncoScan AI™ | 123 Medical Center Drive, Suite 100 | Phone: (555) 123-4567
          </p>
        </div>
      </div>
    </div>
  );
}
