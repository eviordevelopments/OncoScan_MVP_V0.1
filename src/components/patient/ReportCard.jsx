import { Link } from 'react-router-dom';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import { format } from 'date-fns';
import { FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReportCard({ report }) {
  return (
    <GlassCard padding="default" hover>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-[#0C2D5C]">{report.case_number}</h3>
            <p className="text-xs text-[#9CA3AF]">
              {report.exam_date && format(new Date(report.exam_date), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        <StatusBadge status={report.status} size="small" />
      </div>

      <p className="text-sm text-[#9CA3AF] mb-4">
        Thyroid ultrasound screening report
      </p>

      <Button variant="outline" size="sm" className="w-full" asChild>
        <Link to={`/patient/report?id=${report.id}`}>
          <Eye className="w-4 h-4 mr-2" />
          View Report
        </Link>
      </Button>
    </GlassCard>
  );
}
