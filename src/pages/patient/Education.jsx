import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/common/GlassCard';
import EducationCard from '@/components/patient/EducationCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  BookOpen,
  Loader2
} from 'lucide-react';

export default function Education() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['education-content'],
    queryFn: () => base44.entities.EducationContent.list('-published_date', 100),
  });

  const categories = [
    { value: 'all', label: 'All Topics' },
    { value: 'understanding_thyroid', label: 'Understanding Thyroid' },
    { value: 'nodules_basics', label: 'Nodules Basics' },
    { value: 'tirads_explained', label: 'TI-RADS' },
    { value: 'treatment_options', label: 'Treatment' },
    { value: 'lifestyle_nutrition', label: 'Lifestyle' },
    { value: 'diagnostic_tests', label: 'Tests' },
    { value: 'faq', label: 'FAQ' }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = articles.filter(a => a.featured);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0C2D5C]">Educational Resources</h1>
        <p className="text-[#9CA3AF] mt-1">
          Learn about thyroid health, nodules, and diagnostic procedures
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
        <Input
          placeholder="Search articles, topics, or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Featured Articles */}
      {!searchTerm && featuredArticles.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-[#0C2D5C] mb-4">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredArticles.slice(0, 3).map((article) => (
              <EducationCard key={article.id} article={article} featured />
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-4">
        <TabsList className="w-full justify-start flex-wrap h-auto bg-white/50 p-1">
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value} className="text-sm">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory}>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#0F3F96]" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <GlassCard padding="large" className="text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-[#9CA3AF]">
                {searchTerm ? 'No articles found matching your search' : 'No articles available in this category'}
              </p>
            </GlassCard>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[#9CA3AF]">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArticles.map((article) => (
                  <EducationCard key={article.id} article={article} />
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

