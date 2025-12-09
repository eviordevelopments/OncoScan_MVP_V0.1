import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import RiskBadge from '@/components/common/RiskBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Loader2 } from 'lucide-react';

export default function CaseQueue({ cases = [], isLoading = false }) {
  if (isLoading) {
    return (
      <GlassCard padding="default">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#0F3F96]" />
        </div>
      </GlassCard>
    );
  }

  if (cases.length === 0) {
    return (
      <GlassCard padding="default">
        <h2 className="text-lg font-semibold text-[#0C2D5C] mb-4">Case Queue</h2>
        <div className="text-center py-12">
          <p className="text-[#9CA3AF]">No cases yet. Create your first case to get started.</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard padding="default">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Case Queue</h2>
        <span className="text-sm text-gray-600">{cases.length} cases</span>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case #</TableHead>
              <TableHead>Patient ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.slice(0, 10).map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell className="font-medium">{caseItem.case_number}</TableCell>
                <TableCell>{caseItem.patient_id}</TableCell>
                <TableCell>
                  {caseItem.exam_date && format(new Date(caseItem.exam_date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <StatusBadge status={caseItem.status} size="small" />
                </TableCell>
                <TableCell>
                  {caseItem.risk_category && (
                    <RiskBadge risk={caseItem.risk_category} size="small" showIcon={false} />
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={createPageUrl(`Analysis?id=${caseItem.id}`)}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </GlassCard>
  );
}
