import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import RiskBadge from '@/components/common/RiskBadge';
import TiradsBadge from '@/components/common/TiradsBadge';
import { format } from 'date-fns';

export default function ReportView({ caseData }) {
  if (!caseData) {
    return (
      <GlassCard padding="default">
        <p className="text-[#9CA3AF] text-center py-12">No report data available</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard padding="large" className="max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="text-center border-b border-gray-200 pb-6">
          <h1 className="text-2xl font-bold text-[#0C2D5C] mb-2">
            OncoScan AI Thyroid Screening Report
          </h1>
          <p className="text-[#9CA3AF]">Case #{caseData.case_number}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-[#9CA3AF]">Patient ID</p>
            <p className="font-medium text-[#0C2D5C]">{caseData.patient_id}</p>
          </div>
          <div>
            <p className="text-sm text-[#9CA3AF]">Exam Date</p>
            <p className="font-medium text-[#0C2D5C]">
              {caseData.exam_date && format(new Date(caseData.exam_date), 'MMMM d, yyyy')}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#9CA3AF]">Status</p>
            <StatusBadge status={caseData.status} />
          </div>
          <div>
            <p className="text-sm text-[#9CA3AF]">Risk Assessment</p>
            {caseData.risk_category && <RiskBadge risk={caseData.risk_category} />}
          </div>
        </div>

        {caseData.tirads_category && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-[#0C2D5C] mb-3">TI-RADS Assessment</h3>
            <div className="flex items-center gap-4">
              <TiradsBadge category={caseData.tirads_category} />
              <span className="text-sm text-[#9CA3AF]">
                {caseData.tirads_points} points
              </span>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-semibold text-[#0C2D5C] mb-3">AI Analysis</h3>
          <p className="text-sm text-[#9CA3AF]">
            Confidence: {caseData.prediction_confidence?.toFixed(1)}%
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
