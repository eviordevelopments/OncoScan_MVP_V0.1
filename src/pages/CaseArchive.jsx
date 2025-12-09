import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import RiskBadge from '@/components/common/RiskBadge';
import TiradsBadge from '@/components/common/TiradsBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CaseArchive() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    risk: 'all',
    tirads: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCases, setSelectedCases] = useState([]);
  const itemsPerPage = 12;

  const { data: cases = [], isLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: () => base44.entities.Case.list('-created_date', 500),
  });

  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.case_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patient_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filters.status === 'all' || c.status === filters.status;
    const matchesRisk = filters.risk === 'all' || c.risk_category === filters.risk;
    const matchesTirads = filters.tirads === 'all' || c.tirads_category?.toString() === filters.tirads;
    
    let matchesDate = true;
    if (filters.dateFrom) {
      matchesDate = matchesDate && new Date(c.created_date) >= new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      matchesDate = matchesDate && new Date(c.created_date) <= new Date(filters.dateTo);
    }
    
    return matchesSearch && matchesStatus && matchesRisk && matchesTirads && matchesDate;
  });

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectCase = (id) => {
    setSelectedCases(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCases.length === paginatedCases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(paginatedCases.map(c => c.id));
    }
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      risk: 'all',
      tirads: 'all',
      dateFrom: '',
      dateTo: ''
    });
    setSearchTerm('');
  };

  const hasActiveFilters = filters.status !== 'all' || filters.risk !== 'all' || 
    filters.tirads !== 'all' || filters.dateFrom || filters.dateTo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0C2D5C]">Case Archive</h1>
          <p className="text-[#9CA3AF] mt-1">
            {filteredCases.length} case{filteredCases.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        {selectedCases.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#9CA3AF]">{selectedCases.length} selected</span>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Selected
            </Button>
          </div>
        )}
      </div>

      {/* Search & Filters */}
      <GlassCard padding="default">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <Input
              placeholder="Search by Case ID, Patient ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Select value={filters.status} onValueChange={(v) => setFilters(f => ({...f, status: v}))}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="awaiting_review">Awaiting Review</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.risk} onValueChange={(v) => setFilters(f => ({...f, risk: v}))}>
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

            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(showFilters && "bg-[rgba(15,63,150,0.1)]")}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              More Filters
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-[rgba(15,63,150,0.08)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-[#9CA3AF]">TI-RADS Category</label>
              <Select value={filters.tirads} onValueChange={(v) => setFilters(f => ({...f, tirads: v}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="1">TI-RADS 1</SelectItem>
                  <SelectItem value="2">TI-RADS 2</SelectItem>
                  <SelectItem value="3">TI-RADS 3</SelectItem>
                  <SelectItem value="4">TI-RADS 4</SelectItem>
                  <SelectItem value="5">TI-RADS 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-[#9CA3AF]">Date From</label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(f => ({...f, dateFrom: e.target.value}))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-[#9CA3AF]">Date To</label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(f => ({...f, dateTo: e.target.value}))}
              />
            </div>
          </div>
        )}
      </GlassCard>

      {/* Cases Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <GlassCard key={i} padding="default" className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </GlassCard>
          ))}
        </div>
      ) : paginatedCases.length === 0 ? (
        <GlassCard padding="large" className="text-center">
          <p className="text-[#9CA3AF]">No cases found matching your criteria</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCases.map((caseItem) => (
            <GlassCard 
              key={caseItem.id} 
              padding="default" 
              hover
              className={cn(
                "relative cursor-pointer transition-all",
                selectedCases.includes(caseItem.id) && "ring-2 ring-[#0F3F96]"
              )}
            >
              {/* Select Checkbox */}
              <div className="absolute top-4 right-4">
                <Checkbox
                  checked={selectedCases.includes(caseItem.id)}
                  onCheckedChange={() => toggleSelectCase(caseItem.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Image Thumbnail */}
              <div className="h-32 rounded-xl overflow-hidden bg-gray-900 mb-4 -mx-2 -mt-2">
                {caseItem.image_urls?.length > 0 ? (
                  <img 
                    src={caseItem.image_urls[0]} 
                    alt="Ultrasound" 
                    className="w-full h-full object-cover opacity-80"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    No image
                  </div>
                )}
              </div>

              {/* Case Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-[#0C2D5C]">{caseItem.case_number}</h3>
                    <p className="text-sm text-[#9CA3AF]">{caseItem.patient_id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={caseItem.status} size="small" />
                  {caseItem.risk_category && (
                    <RiskBadge risk={caseItem.risk_category} size="small" showIcon={false} />
                  )}
                  {caseItem.tirads_category && (
                    <TiradsBadge category={caseItem.tirads_category} size="small" />
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-[#9CA3AF] pt-2 border-t border-[rgba(15,63,150,0.08)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {caseItem.created_date && format(new Date(caseItem.created_date), 'MMM d, yyyy')}
                  </span>
                  <Link 
                    to={createPageUrl(`Analysis?id=${caseItem.id}`)}
                    className="flex items-center gap-1 text-[#0F3F96] hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedCases.length === paginatedCases.length && paginatedCases.length > 0}
              onCheckedChange={toggleSelectAll}
            />
            <span className="text-sm text-[#9CA3AF]">Select all on page</span>
          </div>
          
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
    </div>
  );
}

