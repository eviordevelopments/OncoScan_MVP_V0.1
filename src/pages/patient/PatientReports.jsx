import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import GlassCard from '@/components/common/GlassCard';
import ReportCard from '@/components/patient/ReportCard';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  FileText,
  Filter,
  Calendar,
  Loader2
} from 'lucide-react';

export default function PatientReports() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {}
    };
    loadUser();
  }, []);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['patient-reports-all', user?.email],
    queryFn: () => base44.entities.Case.filter({ 
      report_status: 'final'
    }),
    enabled: !!user
  });

  const filteredReports = reports
    .filter(r => 
      r.case_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.signed_by?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.signed_at || b.created_date) - new Date(a.signed_at || a.created_date);
      } else {
        return new Date(a.signed_at || a.created_date) - new Date(b.signed_at || b.created_date);
      }
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0C2D5C]">My Reports</h1>
        <p className="text-[#9CA3AF] mt-1">
          View and download your finalized thyroid ultrasound reports
        </p>
      </div>

      {/* Search & Filters */}
      <GlassCard padding="default">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      {/* Reports Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#0F3F96]" />
        </div>
      ) : filteredReports.length === 0 ? (
        <GlassCard padding="large" className="text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-[#9CA3AF] mb-2">
            {searchTerm ? 'No reports found matching your search' : 'No reports available yet'}
          </p>
          <p className="text-sm text-[#9CA3AF]">
            Your finalized reports will appear here once available
          </p>
        </GlassCard>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#9CA3AF]">
              {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

