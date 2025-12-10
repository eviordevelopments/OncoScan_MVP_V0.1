import { useState, useRef, useEffect } from 'react';
import GlassCard from '@/components/common/GlassCard';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Move,
  Ruler,
  Crop,
  Maximize2,
  RotateCw,
  Filter,
  X,
  Expand
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ImageViewer({ 
  images = [], 
  activeIndex = 0, 
  onIndexChange,
  showGradCAM = false,
  gradCAMOpacity = 30 
}) {
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState(null); // 'pan', 'ruler', 'crop'
  const [rulerPoints, setRulerPoints] = useState([]);
  const [xrayFilter, setXrayFilter] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const imageRef = useRef(null);

  const handlePrevious = () => {
    if (activeIndex > 0) {
      onIndexChange?.(activeIndex - 1);
      resetView();
    }
  };

  const handleNext = () => {
    if (activeIndex < images.length - 1) {
      onIndexChange?.(activeIndex + 1);
      resetView();
    }
  };

  const resetView = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
    setRulerPoints([]);
    setActiveTool(null);
  };

  const handleZoomIn = () => setZoom(Math.min(200, zoom + 10));
  const handleZoomOut = () => setZoom(Math.max(50, zoom - 10));
  const handleFitToScreen = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (activeTool === 'pan') {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y
      });
    } else if (activeTool === 'ruler') {
      const rect = imageRef.current.getBoundingClientRect();
      const point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      if (rulerPoints.length < 2) {
        setRulerPoints([...rulerPoints, point]);
      } else {
        setRulerPoints([point]);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && activeTool === 'pan') {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const calculateDistance = () => {
    if (rulerPoints.length === 2) {
      const dx = rulerPoints[1].x - rulerPoints[0].x;
      const dy = rulerPoints[1].y - rulerPoints[0].y;
      return Math.sqrt(dx * dx + dy * dy).toFixed(1);
    }
    return 0;
  };

  if (images.length === 0) {
    return (
      <GlassCard padding="default" className="h-full flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard padding="default" className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">
            Image {activeIndex + 1} of {images.length}
          </span>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-1">
          <Button
            variant={activeTool === 'pan' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTool(activeTool === 'pan' ? null : 'pan')}
            title="Pan"
          >
            <Move className="w-4 h-4" />
          </Button>
          <Button
            variant={activeTool === 'ruler' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTool(activeTool === 'ruler' ? null : 'ruler')}
            title="Ruler"
          >
            <Ruler className="w-4 h-4" />
          </Button>
          <Button
            variant={activeTool === 'crop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTool(activeTool === 'crop' ? null : 'crop')}
            title="Crop"
          >
            <Crop className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600 w-12 text-center font-medium">{zoom}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFitToScreen}
            title="Fit to Screen"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullscreen(true)}
            title="Fullscreen View"
          >
            <Expand className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button
            variant={xrayFilter ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setXrayFilter(!xrayFilter)}
            title="X-Ray Filter"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Image Container */}
      <div 
        ref={imageRef}
        className="flex-1 bg-gray-900 rounded-xl overflow-hidden relative cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px)`
          }}
        >
          <img
            src={images[activeIndex]}
            alt={`Medical image ${activeIndex + 1}`}
            className={cn(
              "max-w-full max-h-full object-contain transition-transform",
              xrayFilter && "contrast-150 brightness-110"
            )}
            style={{ 
              transform: `scale(${zoom / 100})`,
              filter: xrayFilter ? 'invert(1) hue-rotate(180deg)' : 'none'
            }}
          />

          {/* Grad-CAM Overlay */}
          {showGradCAM && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, rgba(255, 0, 0, ${gradCAMOpacity / 100}), transparent 60%)`,
                mixBlendMode: 'multiply'
              }}
            />
          )}

          {/* Ruler Line */}
          {activeTool === 'ruler' && rulerPoints.length === 2 && (
            <svg className="absolute inset-0 pointer-events-none">
              <line
                x1={rulerPoints[0].x}
                y1={rulerPoints[0].y}
                x2={rulerPoints[1].x}
                y2={rulerPoints[1].y}
                stroke="#3B82F6"
                strokeWidth="2"
              />
              <circle cx={rulerPoints[0].x} cy={rulerPoints[0].y} r="4" fill="#3B82F6" />
              <circle cx={rulerPoints[1].x} cy={rulerPoints[1].y} r="4" fill="#3B82F6" />
              <text
                x={(rulerPoints[0].x + rulerPoints[1].x) / 2}
                y={(rulerPoints[0].y + rulerPoints[1].y) / 2 - 10}
                fill="#3B82F6"
                fontSize="14"
                fontWeight="bold"
              >
                {calculateDistance()} px
              </text>
            </svg>
          )}
        </div>

        {/* Tool Instructions */}
        {activeTool && (
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
            {activeTool === 'pan' && 'Click and drag to pan'}
            {activeTool === 'ruler' && 'Click two points to measure'}
            {activeTool === 'crop' && 'Select area to crop'}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
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
          onClick={resetView}
        >
          Reset View
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

      {/* Fullscreen Modal */}
      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
          <div className="relative w-full h-full bg-black">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </Button>
            
            {/* Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={activeIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  disabled={activeIndex === images.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
            
            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
              {activeIndex + 1} / {images.length}
            </div>
            
            {/* Fullscreen Image */}
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={images[activeIndex]}
                alt={`Medical image ${activeIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                style={{
                  filter: xrayFilter ? 'invert(1) hue-rotate(180deg) contrast-150 brightness-110' : 'none'
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </GlassCard>
  );
}
