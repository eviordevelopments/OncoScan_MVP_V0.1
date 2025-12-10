import React, { useState } from 'react';
import GlassCard from '@/components/common/GlassCard';
import RiskBadge from '@/components/common/RiskBadge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Activity, 
  ChevronDown, 
  ChevronUp,
  Info,
  Eye,
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AIRiskPanel({ caseData, showGradCAM, onToggleGradCAM, gradCAMOpacity, onOpacityChange }) {
  const [expanded, setExpanded] = useState(false);

  const confidence = caseData?.prediction_confidence || 0;
  const risk = caseData?.risk_category || 'low';

  // Calculate the circumference for the circular progress
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (confidence / 100) * circumference;

  const interpretationText = {
    high: 'High suspicion for malignancy. Recommend FNA/biopsy workup.',
    medium: 'Moderate suspicion. Clinical correlation and follow-up recommended.',
    low: 'Low suspicion for malignancy. Routine follow-up may be appropriate.'
  };

  return (
    <GlassCard padding="default" className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#0C2D5C] flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#0F3F96]" />
          AI Risk Assessment
        </h3>
        <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
          <Cpu className="w-4 h-4" />
          v1.0
        </div>
      </div>

      {/* Circular Confidence Meter */}
      <div className="flex flex-col items-center py-4">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-100"
            />
            {/* Progress circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0F3F96" />
                <stop offset="100%" stopColor="#3C7CE3" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-[#0C2D5C]">{confidence.toFixed(1)}%</span>
            <span className="text-xs text-[#9CA3AF]">Confidence</span>
          </div>
        </div>
      </div>

      {/* Risk Badge */}
      <div className="flex flex-col items-center gap-3">
        <RiskBadge risk={risk} size="large" />
        <p className="text-sm text-[#9CA3AF] text-center px-4">
          {interpretationText[risk]}
        </p>
      </div>

      {/* Grad-CAM Controls */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[rgba(15,63,150,0.05)] to-transparent">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#0F3F96]" />
            <Label className="text-sm font-medium text-[#0C2D5C]">Grad-CAM Overlay</Label>
          </div>
          <Switch 
            checked={showGradCAM} 
            onCheckedChange={onToggleGradCAM}
          />
        </div>
        
        {showGradCAM && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#9CA3AF]">Opacity</span>
              <span className="text-[#0C2D5C]">{gradCAMOpacity}%</span>
            </div>
            <Slider
              value={[gradCAMOpacity]}
              onValueChange={([v]) => onOpacityChange(v)}
              min={0}
              max={100}
              step={10}
            />
            {/* Color Legend */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(15,63,150,0.08)]">
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 rounded bg-blue-500" />
                <span className="text-xs text-[#9CA3AF]">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 rounded bg-yellow-500" />
                <span className="text-xs text-[#9CA3AF]">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 rounded bg-red-500" />
                <span className="text-xs text-[#9CA3AF]">High</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Model Details (Expandable) */}
      <div className="border-t border-[rgba(15,63,150,0.08)] pt-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-sm text-[#9CA3AF] hover:text-[#0C2D5C]"
        >
          <span className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            Model Performance Details
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {expanded && (
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-gray-50">
              <p className="text-[#9CA3AF] text-xs">Sensitivity</p>
              <p className="font-semibold text-[#0C2D5C]">88.7%</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <p className="text-[#9CA3AF] text-xs">Specificity</p>
              <p className="font-semibold text-[#0C2D5C]">57.9%</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <p className="text-[#9CA3AF] text-xs">AUC-ROC</p>
              <p className="font-semibold text-[#0C2D5C]">0.839</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <p className="text-[#9CA3AF] text-xs">Accuracy</p>
              <p className="font-semibold text-[#0C2D5C]">79.9%</p>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-[#9CA3AF] p-3 rounded-lg bg-amber-50 border border-amber-200">
        <span className="text-amber-700 font-medium">Note:</span> This AI assessment is a screening aid only. 
        Final diagnosis must be rendered by a qualified radiologist.
      </div>
    </GlassCard>
  );
}

