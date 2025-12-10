import React from 'react';
import { format } from 'date-fns';
import GlassCard from '@/components/common/GlassCard';
import RiskBadge from '@/components/common/RiskBadge';
import TiradsBadge from '@/components/common/TiradsBadge';
import StatusBadge from '@/components/common/StatusBadge';
import { 
  User, 
  Calendar, 
  MapPin, 
  Activity,
  FileText,
  Stethoscope,
  AlertCircle,
  Image
} from 'lucide-react';

export default function ReportView({ caseData }) {
  const tiradsRecommendations = {
    1: 'No FNA. No follow-up needed.',
    2: 'No FNA. No follow-up needed.',
    3: 'FNA if ≥ 2.5 cm. Follow-up if ≥ 1.5 cm at 1-2 years.',
    4: 'FNA if ≥ 1.5 cm. Follow-up if ≥ 1 cm. FNA biopsy recommended.',
    5: 'FNA if ≥ 1 cm. Follow-up if ≥ 0.5 cm. FNA biopsy strongly recommended.'
  };

  const compositionLabels = {
    cystic: 'Cystic or almost completely cystic',
    spongiform: 'Spongiform',
    mixed: 'Mixed cystic and solid',
    solid: 'Solid or almost completely solid'
  };

  const echogenicityLabels = {
    anechoic: 'Anechoic',
    hyperechoic: 'Hyperechoic or isoechoic',
    hypoechoic: 'Hypoechoic',
    very_hypoechoic: 'Very hypoechoic'
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Report Header */}
      <GlassCard padding="default" className="border-t-4 border-t-[#0F3F96]">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-[#0C2D5C]">{caseData.case_number}</h2>
              <StatusBadge status={caseData.report_status === 'final' ? 'completed' : 'awaiting_review'} />
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-[#9CA3AF]">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {caseData.patient_id}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {caseData.exam_date && format(new Date(caseData.exam_date), 'MMM d, yyyy')}
              </span>
              {caseData.nodule_location && (
                <span className="flex items-center gap-1 capitalize">
                  <MapPin className="w-4 h-4" />
                  {caseData.nodule_location.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#9CA3AF]">Generated</p>
            <p className="text-sm text-[#0C2D5C]">{format(new Date(), 'MMM d, yyyy HH:mm')}</p>
          </div>
        </div>
      </GlassCard>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Image Thumbnail */}
        <GlassCard padding="default">
          <h3 className="text-sm font-semibold text-[#0C2D5C] mb-3 flex items-center gap-2">
            <Image className="w-4 h-4 text-[#0F3F96]" />
            Nodule Image
          </h3>
          {caseData.image_urls?.length > 0 ? (
            <div className="aspect-video rounded-xl overflow-hidden bg-gray-900">
              <img 
                src={caseData.image_urls[0]} 
                alt="Ultrasound" 
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="aspect-video rounded-xl bg-gray-100 flex items-center justify-center text-[#9CA3AF]">
              No image available
            </div>
          )}
          {(caseData.nodule_size_long || caseData.nodule_size_short) && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-gray-50 text-center">
                <p className="text-xs text-[#9CA3AF]">Long Axis</p>
                <p className="font-semibold text-[#0C2D5C]">{caseData.nodule_size_long || '-'} mm</p>
              </div>
              <div className="p-2 rounded-lg bg-gray-50 text-center">
                <p className="text-xs text-[#9CA3AF]">Short Axis</p>
                <p className="font-semibold text-[#0C2D5C]">{caseData.nodule_size_short || '-'} mm</p>
              </div>
            </div>
          )}
        </GlassCard>

        {/* AI Assessment */}
        <GlassCard padding="default">
          <h3 className="text-sm font-semibold text-[#0C2D5C] mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#0F3F96]" />
            AI Risk Assessment
          </h3>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#0F3F96]">
                {caseData.prediction_confidence?.toFixed(1) || '0'}%
              </p>
              <p className="text-xs text-[#9CA3AF]">Malignancy Confidence</p>
            </div>
            <RiskBadge risk={caseData.risk_category || 'low'} size="large" />
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-r from-[rgba(15,63,150,0.05)] to-transparent">
            <p className="text-sm text-[#0C2D5C]">
              {caseData.risk_category === 'high' 
                ? 'High suspicion for malignancy based on morphologic features. Recommend FNA/biopsy workup.'
                : caseData.risk_category === 'medium'
                ? 'Moderate suspicion. Clinical correlation and follow-up recommended.'
                : 'Low suspicion for malignancy. Routine follow-up may be appropriate.'}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-[rgba(15,63,150,0.08)]">
            <p className="text-xs text-[#9CA3AF]">Model: OncoScan Binary v1.0 (ResNet-34)</p>
            <p className="text-xs text-[#9CA3AF]">AUC-ROC: 0.839 | Sensitivity: 88.7% | Specificity: 57.9%</p>
          </div>
        </GlassCard>

        {/* TI-RADS Assessment */}
        <GlassCard padding="default" className="md:col-span-2">
          <h3 className="text-sm font-semibold text-[#0C2D5C] mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0F3F96]" />
            ACR TI-RADS Stratification
          </h3>

          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-4">
              <TiradsBadge category={caseData.tirads_category || 1} size="large" showLabel />
              <div>
                <p className="text-2xl font-bold text-[#0C2D5C]">{caseData.tirads_points || 0} points</p>
                <p className="text-sm text-[#9CA3AF]">Total score</p>
              </div>
            </div>
          </div>

          {/* TI-RADS Details */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
            <div className="p-3 rounded-xl bg-gray-50">
              <p className="text-xs text-[#9CA3AF] mb-1">Composition</p>
              <p className="text-sm font-medium text-[#0C2D5C] capitalize">
                {caseData.tirads_composition?.replace('_', ' ') || '-'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50">
              <p className="text-xs text-[#9CA3AF] mb-1">Echogenicity</p>
              <p className="text-sm font-medium text-[#0C2D5C] capitalize">
                {caseData.tirads_echogenicity?.replace('_', ' ') || '-'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50">
              <p className="text-xs text-[#9CA3AF] mb-1">Shape</p>
              <p className="text-sm font-medium text-[#0C2D5C] capitalize">
                {caseData.tirads_shape?.replace('_', ' ') || '-'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50">
              <p className="text-xs text-[#9CA3AF] mb-1">Margin</p>
              <p className="text-sm font-medium text-[#0C2D5C] capitalize">
                {caseData.tirads_margin?.replace('_', ' ') || '-'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50">
              <p className="text-xs text-[#9CA3AF] mb-1">Echogenic Foci</p>
              <p className="text-sm font-medium text-[#0C2D5C] capitalize">
                {caseData.tirads_foci?.join(', ')?.replace(/_/g, ' ') || '-'}
              </p>
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <Stethoscope className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 mb-1">ACR Recommendation</p>
                <p className="text-sm text-amber-700">
                  {tiradsRecommendations[caseData.tirads_category] || 'Assessment pending'}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Clinical Notes */}
        {caseData.radiologist_notes && (
          <GlassCard padding="default" className="md:col-span-2">
            <h3 className="text-sm font-semibold text-[#0C2D5C] mb-3">Radiologist Notes</h3>
            <p className="text-sm text-[#0C2D5C] whitespace-pre-wrap">{caseData.radiologist_notes}</p>
          </GlassCard>
        )}
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 mb-1">IMPORTANT NOTICE</p>
            <p className="text-sm text-red-700">
              This AI assessment is a screening aid only. Final diagnosis must be rendered by a qualified 
              radiologist in conjunction with clinical correlation and pathology findings. Do not use for 
              patient self-diagnosis or self-treatment.
            </p>
          </div>
        </div>
      </div>

      {/* Signature Area */}
      {caseData.signed_by && (
        <GlassCard padding="default">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#9CA3AF]">Digitally Signed By</p>
              <p className="font-semibold text-[#0C2D5C]">{caseData.signed_by}</p>
              {caseData.signed_at && (
                <p className="text-xs text-[#9CA3AF]">
                  {format(new Date(caseData.signed_at), 'MMM d, yyyy HH:mm:ss')} UTC
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}