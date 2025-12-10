import React from 'react';
import GlassCard from '@/components/common/GlassCard';
import { Activity, Cpu, Zap, TrendingUp } from 'lucide-react';

export default function ModelStatus() {
  const modelInfo = {
    name: 'OncoScan Binary v1.0',
    architecture: 'ResNet-34',
    status: 'online',
    accuracy: 79.9,
    sensitivity: 88.7,
    specificity: 57.9,
    auroc: 0.839,
    lastUpdated: '2025-12-06',
    inferenceTime: '<100ms'
  };

  return (
    <GlassCard padding="default">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#0C2D5C]">Model Status</h3>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50">
          <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-live" />
          <span className="text-xs font-medium text-emerald-600">Online</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Model Info */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[rgba(15,63,150,0.05)] to-transparent">
          <div className="p-2 rounded-lg bg-[#0F3F96]">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-[#0C2D5C]">{modelInfo.name}</p>
            <p className="text-xs text-[#9CA3AF]">{modelInfo.architecture}</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-blue-50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">AUC-ROC</span>
            </div>
            <p className="text-xl font-bold text-blue-700">{modelInfo.auroc}</p>
          </div>
          
          <div className="p-3 rounded-xl bg-emerald-50">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-emerald-600 font-medium">Sensitivity</span>
            </div>
            <p className="text-xl font-bold text-emerald-700">{modelInfo.sensitivity}%</p>
          </div>
          
          <div className="p-3 rounded-xl bg-amber-50">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-amber-600 font-medium">Specificity</span>
            </div>
            <p className="text-xl font-bold text-amber-700">{modelInfo.specificity}%</p>
          </div>
          
          <div className="p-3 rounded-xl bg-purple-50">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-purple-600 font-medium">Inference</span>
            </div>
            <p className="text-xl font-bold text-purple-700">{modelInfo.inferenceTime}</p>
          </div>
        </div>

        {/* Last Updated */}
        <p className="text-xs text-[#9CA3AF] text-center pt-2 border-t border-[rgba(15,63,150,0.08)]">
          Last updated: {modelInfo.lastUpdated}
        </p>
      </div>
    </GlassCard>
  );
}
