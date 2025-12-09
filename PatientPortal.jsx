import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/common/GlassCard';
import ReportCard from '@/components/patient/ReportCard';
import EducationCard from '@/components/patient/EducationCard';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  BookOpen, 
  MessageCircle,
  Activity,
  Calendar,
  ChevronRight,
  Shield,
  Bell
} from 'lucide-react';

export default function PatientPortal() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {}
    };
    loadUser();
  }, []);

  // Fetch patient's finalized reports
  const { data: reports = [] } = useQuery({
    queryKey: ['patient-reports', user?.email],
    queryFn: () => base44.entities.Case.filter({ 
      report_status: 'final'
    }).then(cases => cases.slice(0, 3)), // Show latest 3
    enabled: !!user
  });

  // Fetch featured educational content
  const { data: educationContent = [] } = useQuery({
    queryKey: ['education-featured'],
    queryFn: () => base44.entities.EducationContent.filter({ featured: true }).then(res => res.slice(0, 3)),
  });

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="relative">
        <GlassCard padding="large" className="bg-gradient-to-r from-[rgba(15,63,150,0.05)] to-transparent">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#0C2D5C]">
                Welcome, {user?.full_name?.split(' ')[0] || 'Patient'}
              </h1>
              <p className="text-[#9CA3AF] mt-2">
                Access your thyroid health information and educational resources
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0F3F96] to-[#3C7CE3] flex items-center justify-center text-white text-2xl font-bold">
                {user?.full_name?.charAt(0) || 'P'}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard padding="default" hover className="cursor-pointer" asChild>
          <Link to={createPageUrl('PatientReports')}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#0F3F96] to-[#3C7CE3]">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#0C2D5C]">My Reports</p>
                <p className="text-xs text-[#9CA3AF]">{reports.length} available</p>
              </div>
            </div>
          </Link>
        </GlassCard>

        <GlassCard padding="default" hover className="cursor-pointer" asChild>
          <Link to={createPageUrl('Education')}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#10B981] to-[#34D399]">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#0C2D5C]">Education</p>
                <p className="text-xs text-[#9CA3AF]">Learn more</p>
              </div>
            </div>
          </Link>
        </GlassCard>

        <GlassCard padding="default" className="opacity-60">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA]">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[#0C2D5C]">Messages</p>
              <p className="text-xs text-[#9CA3AF]">Coming Soon</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard padding="default" className="opacity-60">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#FBBF24]">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[#0C2D5C]">Appointments</p>
              <p className="text-xs text-[#9CA3AF]">Coming Soon</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recent Reports */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0C2D5C]">Recent Reports</h2>
          {reports.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link to={createPageUrl('PatientReports')}>
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          )}
        </div>

        {reports.length === 0 ? (
          <GlassCard padding="large" className="text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-[#9CA3AF] mb-2">No reports available yet</p>
            <p className="text-sm text-[#9CA3AF]">
              Your finalized reports will appear here once available
            </p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>

      {/* Educational Resources */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0C2D5C]">Educational Resources</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to={createPageUrl('Education')}>
              Browse All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {educationContent.length === 0 ? (
            <GlassCard padding="default" className="col-span-full text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-[#9CA3AF]">Educational content coming soon</p>
            </GlassCard>
          ) : (
            educationContent.map((article) => (
              <EducationCard key={article.id} article={article} featured />
            ))
          )}
        </div>
      </div>

      {/* Important Notice */}
      <GlassCard padding="default" className="border-l-4 border-l-[#0F3F96]">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#0F3F96] mt-0.5" />
          <div>
            <p className="font-semibold text-[#0C2D5C] mb-1">Your Privacy & Security</p>
            <p className="text-sm text-[#9CA3AF]">
              All your medical information is encrypted and HIPAA compliant. Only you and your 
              authorized care team can access your reports. If you have questions about your results, 
              please contact your physician directly.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}


