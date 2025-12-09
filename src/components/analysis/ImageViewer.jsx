import { useState } from 'react';
import GlassCard from '@/components/common/GlassCard';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ImageViewer({ images = [], activeIndex = 0, onIndexChange }) {
  const [zoom, setZoom] = useState(100);

  const handlePrevious = () => {
    if (activeIndex > 0) {
      onIndexChange?.(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < images.length - 1) {
      onIndexChange?.(activeIndex + 1);
    }
  };

  if (images.length === 0) {
    return (
      <GlassCard padding="default" className="h-full flex items-center justify-center">
        <p className="text-[#9CA3AF]">No images available</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard padding="default" className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-[#9CA3AF]">
          Image {activeIndex + 1} of {images.length}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-[#9CA3AF] w-12 text-center">{zoom}%</span>
          <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(200, zoom + 10))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden relative">
        <img
          src={images[activeIndex]}
          alt={`Medical image ${activeIndex + 1}`}
          className="w-full h-full object-contain"
          style={{ transform: `scale(${zoom / 100})` }}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={activeIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={activeIndex === images.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </GlassCard>
  );
}
