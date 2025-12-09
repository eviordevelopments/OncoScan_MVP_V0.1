import { useState } from 'react';
import GlassCard from '@/components/common/GlassCard';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Brain, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AIRiskPanel({ 
  caseData, 
  showGradCAM, 
  onToggleGradCAM, 
  gradCAMOpacity, 
  onOpacityChange 
}) {
  const [showDetails, setShowDetails] = useState(false);
  
  const confidence = caseData?.prediction_confidence || 96.6;
  const risk = caseData?.risk_category || 'high';
  
  // Model performance metrics
  const metrics = {
    sensitivity: 88.7,
    specificity: 57.9,
    aucRoc: 0.839,
    accuracy: 79.9
  };

  // Determine risk level and color
  const getRiskLevel = () => {
    if (confidence >= 80) return { level: 'HIGH RISK', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    if (confidence >= 50) return { level: 'MEDIUM RISK', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' };
    return { level: 'LOW RISK', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' };
  };

  const riskInfo = getRiskLevel();

  // Get slider color based on opacity
  const getSliderColor = () => {
    if (gradCAMOpacity < 33) return 'from-blue-500 to-blue-600';
    if (gradCAMOpacity < 66) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  // Circular progress bar
  const CircularProgress = ({ percentage }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg className="transform -rotate-90 w-48 h-48">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke={confidence >= 80 ? '#DC2626' : confidence >= 50 ? '#F59E0B' : '#10B981'}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">{percentage.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 mt-1">Confidence</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <GlassCard padding="default" className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3F96] to-[#3C7CE3] flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">AI Risk Assessment</h3>
          <p className="text-xs text-gray-500">OncoScan Binary v1.0</p>
        </div>
      </div>

      {/* Circular Progress */}
      <div className="mb-6">
        <CircularProgress percentage={confidence} />
      </div>

      {/* Risk Level Badge */}
      <div className={cn(
        "text-center py-3 rounded-xl font-bold text-sm mb-4 border-2",
        riskInfo.bgColor,
        riskInfo.color,
        riskInfo.borderColor
      )}>
        {riskInfo.level}
      </div>

      {/* Recommendation */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          {confidence >= 80 
            ? 'High suspicion for malignancy. Recommend FNA/biopsy workup.'
            : confidence >= 50
            ? 'Moderate suspicion. Consider follow-up imaging or biopsy.'
            : 'Low suspicion for malignancy. Routine follow-up recommended.'}
        </p>
      </div>

      {/* Grad-CAM Controls */}
      <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <Label htmlFor="gradcam" className="text-sm font-semibold text-gray-900">
              Grad-CAM Overlay
            </Label>
          </div>
          <Switch
            id="gradcam"
            checked={showGradCAM}
            onCheckedChange={onToggleGradCAM}
          />
        </div>

        {showGradCAM && (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-xs text-gray-600">Opacity</Label>
                <span className="text-xs font-semibold text-gray-900">{gradCAMOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={gradCAMOpacity}
                onChange={(e) => onOpacityChange?.(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    #3B82F6 0%, 
                    #3B82F6 33%, 
                    #EAB308 33%, 
                    #EAB308 66%, 
                    #EF4444 66%, 
                    #EF4444 100%)`
                }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-blue-600 font-medium">Low</span>
                <span className="text-xs text-yellow-600 font-medium">Medium</span>
                <span className="text-xs text-red-600 font-medium">High</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Model Performance Details */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-900 mb-3"
        >
          <span>Model Performance Details</span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetails && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Sensitivity</div>
                <div className="text-lg font-bold text-gray-900">{metrics.sensitivity}%</div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Specificity</div>
                <div className="text-lg font-bold text-gray-900">{metrics.specificity}%</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">AUC-ROC</div>
                <div className="text-lg font-bold text-gray-900">{metrics.aucRoc}</div>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Accuracy</div>
                <div className="text-lg font-bold text-gray-900">{metrics.accuracy}%</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Warning Note */}
      <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-800">
            <span className="font-semibold">Note:</span> This AI assessment is a screening aid only. 
            Final diagnosis must be rendered by a qualified radiologist.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
