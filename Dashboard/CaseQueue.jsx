import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import RiskBadge from '@/components/common/RiskBadge';
import TiradsBadge from '@/components/common/TiradsBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Download, 
  Archive,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function CaseQueue({ cases = [], isLoading = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.case_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patient_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || c.risk_category === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <GlassCard padding="none" className="overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[rgba(15,63,150,0.08)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-[#0C2D5C]">Case Queue</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <Input
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="awaiting_review">Awaiting Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[rgba(15,63,150,0.03)]">
              <TableHead className="text-[#0C2D5C] font-semibold">Case ID</TableHead>
              <TableHead className="text-[#0C2D5C] font-semibold">Patient</TableHead>
              <TableHead className="text-[#0C2D5C] font-semibold">Date</TableHead>
              <TableHead className="text-[#0C2D5C] font-semibold">Status</TableHead>
              <TableHead className="text-[#0C2D5C] font-semibold">Risk</TableHead>
              <TableHead className="text-[#0C2D5C] font-semibold">TI-RADS</TableHead>
              <TableHead className="text-[#0C2D5C] font-semibold">Assigned</TableHead>
              <TableHead className="text-[#0C2D5C] font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  {Array(8).fill(0).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedCases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-[#9CA3AF]">
                  No cases found
                </TableCell>
              </TableRow>
            ) : (
              paginatedCases.map((caseItem) => (
                <TableRow 
                  key={caseItem.id} 
                  className="hover:bg-[rgba(15,63,150,0.02)] transition-colors cursor-pointer"
                >
                  <TableCell>
                    <Link 
                      to={createPageUrl(`Analysis?id=${caseItem.id}`)}
                      className="font-medium text-[#0F3F96] hover:underline"
                    >
                      {caseItem.case_number}
                    </Link>
                  </TableCell>
                  <TableCell className="text-[#0C2D5C]">{caseItem.patient_id}</TableCell>
                  <TableCell className="text-[#9CA3AF] text-sm">
                    {caseItem.created_date && format(new Date(caseItem.created_date), 'MMM d, yyyy HH:mm')}
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
                    {caseItem.tirads_category && (
                      <TiradsBadge category={caseItem.tirads_category} size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0F3F96] to-[#3C7CE3] flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-[#0C2D5C] truncate max-w-24">
                        {caseItem.assigned_to?.split('@')[0] || 'Unassigned'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={createPageUrl(`Analysis?id=${caseItem.id}`)}>
                          <ExternalLink className="w-4 h-4 text-[#0F3F96]" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4 text-[#9CA3AF]" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Archive className="w-4 h-4 text-[#9CA3AF]" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-[rgba(15,63,150,0.08)] flex items-center justify-between">
          <p className="text-sm text-[#9CA3AF]">
            Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredCases.length)} of {filteredCases.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-[#0C2D5C] px-3">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

