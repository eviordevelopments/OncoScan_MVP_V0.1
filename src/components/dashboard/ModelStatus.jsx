import GlassCard from '@/components/common/GlassCard';
import { Cpu, CheckCircle, TrendingUp } from 'lucide-react';

export default function ModelStatus() {
  return (
    <GlassCard padding="default">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3F96] to-[#3C7CE3] flex items-center justify-center">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#0C2D5C]">AI Model Status</h2>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-600 font-medium">Online</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#9CA3AF]">Model Version</span>
            <span className="text-sm font-medium text-[#0C2D5C]">OncoScan Binary v1.0</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#9CA3AF]">Last Updated</span>
            <span className="text-sm font-medium text-[#0C2D5C]">Dec 1, 2024</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-[#0C2D5C] mb-3">Performance Metrics</h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#9CA3AF]">Sensitivity</span>
                <span className="text-xs font-medium text-[#0C2D5C]">88.7%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-[#0F3F96] to-[#3C7CE3] h-2 rounded-full" style={{ width: '88.7%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#9CA3AF]">Specificity</span>
                <span className="text-xs font-medium text-[#0C2D5C]">82.3%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full" style={{ width: '82.3%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#9CA3AF]">AUC-ROC</span>
                <span className="text-xs font-medium text-[#0C2D5C]">0.839</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full" style={{ width: '83.9%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-[#9CA3AF]">FDA Cleared</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-[#9CA3AF]">Continuous Learning Enabled</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
