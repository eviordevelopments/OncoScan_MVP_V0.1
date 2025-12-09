import GlassCard from '@/components/common/GlassCard';
import { BookOpen, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EducationCard({ content }) {
  return (
    <GlassCard padding="default" hover>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-[#0C2D5C] mb-1">{content.title}</h3>
          <p className="text-xs text-[#9CA3AF]">{content.category}</p>
        </div>
      </div>

      <p className="text-sm text-[#9CA3AF] mb-4 line-clamp-3">
        {content.summary}
      </p>

      <Button variant="outline" size="sm" className="w-full">
        <ExternalLink className="w-4 h-4 mr-2" />
        Read More
      </Button>
    </GlassCard>
  );
}
