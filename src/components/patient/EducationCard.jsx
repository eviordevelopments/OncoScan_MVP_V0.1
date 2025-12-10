import { format } from 'date-fns';
import GlassCard from '@/components/common/GlassCard';
import { BookOpen, ExternalLink, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function EducationCard({ article, featured = false }) {
  const categoryLabels = {
    understanding_thyroid: 'Understanding Thyroid',
    nodules_basics: 'Nodules Basics',
    tirads_explained: 'TI-RADS',
    treatment_options: 'Treatment',
    lifestyle_nutrition: 'Lifestyle',
    diagnostic_tests: 'Tests',
    faq: 'FAQ'
  };

  return (
    <GlassCard 
      padding="default" 
      hover 
      className={cn(
        "relative",
        featured && "border-2 border-emerald-200 bg-emerald-50/30"
      )}
    >
      {featured && (
        <div className="absolute -top-2 -right-2">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <Star className="w-3 h-3 text-white fill-current" />
          </div>
        </div>
      )}

      {/* Thumbnail */}
      {article.thumbnail_url && (
        <div className="w-full h-32 rounded-lg overflow-hidden mb-4">
          <img 
            src={article.thumbnail_url} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-[#0C2D5C] mb-1 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-xs text-emerald-600 font-medium">
            {categoryLabels[article.category] || article.category}
          </p>
        </div>
      </div>

      <p className="text-sm text-[#9CA3AF] mb-4 line-clamp-3">
        {article.summary}
      </p>

      <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{article.reading_time_minutes} min read</span>
        </div>
        <span>{format(new Date(article.published_date), 'MMM d, yyyy')}</span>
      </div>

      <Button variant="outline" size="sm" className="w-full">
        <ExternalLink className="w-4 h-4 mr-2" />
        Read Article
      </Button>
    </GlassCard>
  );
}
