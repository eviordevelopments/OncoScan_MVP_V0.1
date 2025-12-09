import GlassCard from '@/components/common/GlassCard';
import RiskBadge from '@/components/common/RiskBadge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Brain, TrendingUp } from 'lucide-react';

export default function AIRiskPanel({ caseData, showGradCAM, onToggleGradCAM, gradCAMOpacity, onOpacityChange }) {
  const confidence = caseData?.prediction_confidence || 0;
  const risk = caseData?.risk_category || 'low';

  return (
    <GlassCard padding="default" className="h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3F96] to-[#3C7CE3] flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#0C2D5C]">AI Risk Assessment</h3>
          <p className="text-xs text-[#9CA3AF]">OncoScan Binary v1.0</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm text-[#9CA3AF] mb-2">Malignancy Risk</p>
          <RiskBadge risk={risk} size="default" />
        </div>

        <div>
          <p className="text-sm text-[#9CA3AF] mb-2">Confidence Score</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[#0F3F96] to-[#3C7CE3] h-3 rounded-full transition-all"
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className="text-lg font-bold text-[#0C2D5C] w-16 text-right">
              {confidence.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Label htmlFor="gradcam" className="text-sm font-medium">
              Show Grad-CAM Overlay
            </Label>
            <Switch
              id="gradcam"
              checked={showGradCAM}
              onCheckedChange={onToggleGradCAM}
            />
          </div>

          {showGradCAM && (
            <div>
              <Label className="text-sm text-[#9CA3AF] mb-2 block">
                Opacity: {gradCAMOpacity}%
              </Label>
              <input
                type="range"
                min="0"
                max="100"
                value={gradCAMOpacity}
                onChange={(e) => onOpacityChange?.(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
            <TrendingUp className="w-4 h-4" />
            <span>Model trained on 10,000+ cases</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
