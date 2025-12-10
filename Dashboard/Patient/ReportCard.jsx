import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import GlassCard from '@/components/common/GlassCard';
import RiskBadge from '@/components/common/RiskBadge';
import TiradsBadge from '@/components/common/TiradsBadge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Calendar, 
  User, 
  Eye,
  Download,
  CheckCircle2
} from 'lucide-react';

export default function ReportCard({ report }) {
  return (
    <GlassCard padding="default" hover className="relative">
      {/* Signed Badge */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
          <CheckCircle2 className="w-3 h-3" />
          Finalized
        </div>
      </div>

      {/* Report Info */}
      <div className="pr-24">
        <h3 className="text-lg font-semibold text-[#0C2D5C] mb-1">
          Thyroid Ultrasound Report
        </h3>
        <p className="text-sm text-[#9CA3AF]">{report.case_number}</p>
      </div>

      {/* Date & Physician */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-[#0C2D5C]">
          <Calendar className="w-4 h-4 text-[#9CA3AF]" />
          Exam Date: {report.exam_date && format(new Date(report.exam_date), 'MMM d, yyyy')}
        </div>
        {report.signed_by && (
          <div className="flex items-center gap-2 text-sm text-[#0C2D5C]">
            <User className="w-4 h-4 text-[#9CA3AF]" />
            {report.signed_by}
          </div>
        )}
      </div>

      {/* Risk Summary */}
      <div className="mt-4 p-3 rounded-xl bg-gray-50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#9CA3AF]">Assessment</span>
          {report.risk_category && (
            <RiskBadge risk={report.risk_category} size="small" showIcon={false} />
          )}
        </div>
        {report.tirads_category && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#9CA3AF]">TI-RADS Category</span>
            <TiradsBadge category={report.tirads_category} size="small" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[rgba(15,63,150,0.08)]">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link to={createPageUrl(`PatientReport?id=${report.id}`)}>
            <Eye className="w-4 h-4 mr-2" />
            View Report
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Signed Date */}
      {report.signed_at && (
        <p className="text-xs text-[#9CA3AF] text-center mt-3">
          Signed on {format(new Date(report.signed_at), 'MMM d, yyyy')}
        </p>
      )}
    </GlassCard>
  );
}

