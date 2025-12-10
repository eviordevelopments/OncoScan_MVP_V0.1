import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import GlassCard from '@/components/common/GlassCard';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Clock, 
  ExternalLink,
  ChevronRight 
} from 'lucide-react';

const categoryLabels = {
  understanding_thyroid: 'Understanding Thyroid',
  nodules_basics: 'Nodules Basics',
  tirads_explained: 'TI-RADS Explained',
  treatment_options: 'Treatment Options',
  lifestyle_nutrition: 'Lifestyle & Nutrition',
  diagnostic_tests: 'Diagnostic Tests',
  faq: 'FAQ'
};

const categoryColors = {
  understanding_thyroid: 'bg-blue-100 text-blue-700',
  nodules_basics: 'bg-purple-100 text-purple-700',
  tirads_explained: 'bg-amber-100 text-amber-700',
  treatment_options: 'bg-emerald-100 text-emerald-700',
  lifestyle_nutrition: 'bg-pink-100 text-pink-700',
  diagnostic_tests: 'bg-indigo-100 text-indigo-700',
  faq: 'bg-gray-100 text-gray-700'
};

export default function EducationCard({ article, featured = false }) {
  return (
    <GlassCard 
      padding="default" 
      hover 
      className={featured ? 'border-2 border-[#0F3F96]' : ''}
    >
      {/* Thumbnail */}
      {article.thumbnail_url && (
        <div className="h-40 rounded-xl overflow-hidden bg-gray-100 mb-4 -mx-2 -mt-2">
          <img 
            src={article.thumbnail_url} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Category Badge */}
      <Badge className={categoryColors[article.category] || 'bg-gray-100 text-gray-700'}>
        {categoryLabels[article.category] || article.category}
      </Badge>

      {/* Title & Summary */}
      <h3 className="text-lg font-semibold text-[#0C2D5C] mt-3 mb-2">
        {article.title}
      </h3>
      <p className="text-sm text-[#9CA3AF] line-clamp-3 mb-4">
        {article.summary}
      </p>

      {/* Meta Info */}
      <div className="flex items-center justify-between text-sm text-[#9CA3AF] mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {article.reading_time_minutes} min read
        </div>
        {article.author && (
          <span className="text-xs">By {article.author}</span>
        )}
      </div>

      {/* Read More Link */}
      {article.external_link ? (
        <a
          href={article.external_link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between text-[#0F3F96] hover:underline font-medium"
        >
          Read More
          <ExternalLink className="w-4 h-4" />
        </a>
      ) : (
        <Link
          to={createPageUrl(`EducationArticle?id=${article.id}`)}
          className="flex items-center justify-between text-[#0F3F96] hover:underline font-medium"
        >
          Read More
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </GlassCard>
  );
}

