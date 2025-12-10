import React, { useState, useRef } from 'react';
import GlassCard from '@/components/common/GlassCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Ruler, 
  RotateCcw, 
  Maximize,
  Contrast
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ImageViewer({ images = [], activeIndex = 0, onIndexChange }) {
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [inverted, setInverted] = useState(false);
  const [activeTool, setActiveTool] = useState('pan');
  const imageRef = useRef(null);
  const startPan = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (activeTool === 'pan') {
      setIsPanning(true);
      startPan.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning && activeTool === 'pan') {
      setPan({
        x: e.clientX - startPan.current.x,
        y: e.clientY - startPan.current.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleReset = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
    setInverted(false);
  };

  const tools = [
    { id: 'pan', icon: Move, label: 'Pan' },
    { id: 'measure', icon: Ruler, label: 'Measure' },
  ];

  return (
    <GlassCard padding="none" className="h-full flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="p-3 border-b border-[rgba(15,63,150,0.08)] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant="ghost"
              size="icon"
              onClick={() => setActiveTool(tool.id)}
              className={cn(
                "h-9 w-9",
                activeTool === tool.id && "bg-[rgba(15,63,150,0.1)] text-[#0F3F96]"
              )}
              title={tool.label}
            >
              <tool.icon className="w-4 h-4" />
            </Button>
          ))}
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setInverted(!inverted)}
            className={cn("h-9 w-9", inverted && "bg-[rgba(15,63,150,0.1)] text-[#0F3F96]")}
            title="Invert Colors"
          >
            <Contrast className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleReset} title="Reset" className="h-9 w-9">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(50, z - 25))} className="h-8 w-8">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 w-32">
            <Slider
              value={[zoom]}
              onValueChange={([v]) => setZoom(v)}
              min={50}
              max={400}
              step={25}
              className="w-full"
            />
            <span className="text-xs text-[#9CA3AF] w-12">{zoom}%</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(400, z + 25))} className="h-8 w-8">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Fullscreen" className="h-8 w-8">
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Image Area */}
      <div 
        className="flex-1 bg-[#1a1a1a] relative overflow-hidden cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        {images.length > 0 ? (
          <div
            ref={imageRef}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
              transition: isPanning ? 'none' : 'transform 0.2s ease-out',
              filter: inverted ? 'invert(1)' : 'none'
            }}
          >
            <img
              src={images[activeIndex]}
              alt="Ultrasound"
              className="max-w-full max-h-full object-contain"
              draggable={false}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            No images available
          </div>
        )}

        {/* Measurement overlay would go here */}
        {activeTool === 'measure' && (
          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-[#0F3F96] text-white text-sm">
            Click two points to measure
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="p-2 border-t border-[rgba(15,63,150,0.08)] bg-gray-50">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((url, index) => (
              <button
                key={index}
                onClick={() => onIndexChange(index)}
                className={cn(
                  "flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all",
                  activeIndex === index 
                    ? "border-[#0F3F96] shadow-md" 
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={url} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}

