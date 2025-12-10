import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/common/GlassCard';
import TiradsBadge from '@/components/common/TiradsBadge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ChevronDown, 
  ChevronUp, 
  Save, 
  RotateCcw,
  FileText,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const compositionOptions = [
  { value: 'cystic', label: 'Cystic or almost completely cystic', points: 0 },
  { value: 'spongiform', label: 'Spongiform', points: 0 },
  { value: 'mixed', label: 'Mixed cystic and solid', points: 1 },
  { value: 'solid', label: 'Solid or almost completely solid', points: 2 }
];

const echogenicityOptions = [
  { value: 'anechoic', label: 'Anechoic', points: 0 },
  { value: 'hyperechoic', label: 'Hyperechoic or isoechoic', points: 1 },
  { value: 'hypoechoic', label: 'Hypoechoic', points: 2 },
  { value: 'very_hypoechoic', label: 'Very hypoechoic', points: 3 }
];

const shapeOptions = [
  { value: 'wider_than_tall', label: 'Wider-than-tall', points: 0 },
  { value: 'taller_than_wide', label: 'Taller-than-wide', points: 3 }
];

const marginOptions = [
  { value: 'smooth', label: 'Smooth', points: 0 },
  { value: 'ill_defined', label: 'Ill-defined', points: 0 },
  { value: 'lobulated', label: 'Lobulated or irregular', points: 2 },
  { value: 'extrathyroidal', label: 'Extra-thyroidal extension', points: 3 }
];

const fociOptions = [
  { value: 'none', label: 'None or large comet-tail artifacts', points: 0 },
  { value: 'macrocalcifications', label: 'Macrocalcifications', points: 1 },
  { value: 'peripheral', label: 'Peripheral (rim) calcifications', points: 2 },
  { value: 'punctate', label: 'Punctate echogenic foci', points: 3 }
];

const recommendations = {
  1: { text: 'No FNA', follow: 'No follow-up needed' },
  2: { text: 'No FNA', follow: 'No follow-up needed' },
  3: { text: 'FNA if ≥ 2.5 cm, follow-up if ≥ 1.5 cm', follow: 'Follow-up at 1-2 years' },
  4: { text: 'FNA if ≥ 1.5 cm, follow-up if ≥ 1 cm', follow: 'FNA biopsy recommended' },
  5: { text: 'FNA if ≥ 1 cm, follow-up if ≥ 0.5 cm', follow: 'FNA biopsy strongly recommended' }
};

export default function TIRADSForm({ caseData, onSave, isSaving }) {
  const [expanded, setExpanded] = useState(true);
  const [formData, setFormData] = useState({
    composition: caseData?.tirads_composition || '',
    echogenicity: caseData?.tirads_echogenicity || '',
    shape: caseData?.tirads_shape || '',
    margin: caseData?.tirads_margin || '',
    foci: caseData?.tirads_foci || []
  });

  const calculatePoints = () => {
    let points = 0;
    
    const composition = compositionOptions.find(o => o.value === formData.composition);
    if (composition) points += composition.points;
    
    const echogenicity = echogenicityOptions.find(o => o.value === formData.echogenicity);
    if (echogenicity) points += echogenicity.points;
    
    const shape = shapeOptions.find(o => o.value === formData.shape);
    if (shape) points += shape.points;
    
    const margin = marginOptions.find(o => o.value === formData.margin);
    if (margin) points += margin.points;
    
    // For foci, take the highest points from selected options
    if (formData.foci.length > 0) {
      const maxFociPoints = Math.max(...formData.foci.map(f => {
        const option = fociOptions.find(o => o.value === f);
        return option?.points || 0;
      }));
      points += maxFociPoints;
    }
    
    return points;
  };

  const getCategory = (points) => {
    if (points === 0) return 1;
    if (points <= 2) return 2;
    if (points <= 3) return 3;
    if (points <= 6) return 4;
    return 5;
  };

  const points = calculatePoints();
  const category = getCategory(points);

  const handleFociChange = (value, checked) => {
    if (value === 'none' && checked) {
      setFormData(prev => ({ ...prev, foci: ['none'] }));
    } else {
      setFormData(prev => ({
        ...prev,
        foci: checked 
          ? [...prev.foci.filter(f => f !== 'none'), value]
          : prev.foci.filter(f => f !== value)
      }));
    }
  };

  const handleSave = () => {
    onSave({
      tirads_composition: formData.composition,
      tirads_echogenicity: formData.echogenicity,
      tirads_shape: formData.shape,
      tirads_margin: formData.margin,
      tirads_foci: formData.foci,
      tirads_points: points,
      tirads_category: category
    });
  };

  const handleReset = () => {
    setFormData({
      composition: '',
      echogenicity: '',
      shape: '',
      margin: '',
      foci: []
    });
  };

  const isFormComplete = formData.composition && formData.echogenicity && formData.shape && formData.margin;

  return (
    <GlassCard padding="none" className="overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-[#0F3F96] to-[#3C7CE3] text-white"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5" />
          <span className="font-semibold">ACR TI-RADS Assessment</span>
          {isFormComplete && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-sm">
              <TiradsBadge category={category} size="small" />
              <span>Score: {points} points</span>
            </div>
          )}
        </div>
        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {expanded && (
        <div className="p-5 space-y-6">
          {/* Composition */}
          <div className="space-y-3">
            <Label className="text-[#0C2D5C] font-semibold">Composition</Label>
            <RadioGroup 
              value={formData.composition} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, composition: v }))}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              {compositionOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`comp-${option.value}`} />
                  <Label htmlFor={`comp-${option.value}`} className="text-sm cursor-pointer flex-1">
                    {option.label}
                    <span className="text-[#9CA3AF] ml-1">({option.points} pts)</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Echogenicity */}
          <div className="space-y-3">
            <Label className="text-[#0C2D5C] font-semibold">Echogenicity</Label>
            <RadioGroup 
              value={formData.echogenicity} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, echogenicity: v }))}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              {echogenicityOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`echo-${option.value}`} />
                  <Label htmlFor={`echo-${option.value}`} className="text-sm cursor-pointer flex-1">
                    {option.label}
                    <span className="text-[#9CA3AF] ml-1">({option.points} pts)</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Shape */}
          <div className="space-y-3">
            <Label className="text-[#0C2D5C] font-semibold">Shape</Label>
            <RadioGroup 
              value={formData.shape} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, shape: v }))}
              className="grid grid-cols-2 gap-2"
            >
              {shapeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`shape-${option.value}`} />
                  <Label htmlFor={`shape-${option.value}`} className="text-sm cursor-pointer flex-1">
                    {option.label}
                    <span className="text-[#9CA3AF] ml-1">({option.points} pts)</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Margin */}
          <div className="space-y-3">
            <Label className="text-[#0C2D5C] font-semibold">Margin</Label>
            <RadioGroup 
              value={formData.margin} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, margin: v }))}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              {marginOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`margin-${option.value}`} />
                  <Label htmlFor={`margin-${option.value}`} className="text-sm cursor-pointer flex-1">
                    {option.label}
                    <span className="text-[#9CA3AF] ml-1">({option.points} pts)</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Echogenic Foci */}
          <div className="space-y-3">
            <Label className="text-[#0C2D5C] font-semibold">Echogenic Foci</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fociOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`foci-${option.value}`}
                    checked={formData.foci.includes(option.value)}
                    onCheckedChange={(checked) => handleFociChange(option.value, checked)}
                  />
                  <Label htmlFor={`foci-${option.value}`} className="text-sm cursor-pointer flex-1">
                    {option.label}
                    <span className="text-[#9CA3AF] ml-1">({option.points} pts)</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Result Summary */}
          {isFormComplete && (
            <div className={cn(
              "p-4 rounded-xl border-2",
              category >= 4 ? "bg-red-50 border-red-200" : category >= 3 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"
            )}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <TiradsBadge category={category} size="default" showLabel />
                </div>
                <span className="text-lg font-bold text-[#0C2D5C]">{points} / 14 points</span>
              </div>
              <div className="flex items-start gap-2 mt-3 pt-3 border-t border-[rgba(15,63,150,0.1)]">
                <AlertCircle className="w-4 h-4 text-[#0F3F96] mt-0.5" />
                <p className="text-sm text-[#0C2D5C]">
                  <span className="font-medium">Recommendation: </span>
                  {recommendations[category]?.follow}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(15,63,150,0.08)]">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!isFormComplete || isSaving}
              className="bg-[#0F3F96] hover:bg-[#0C2D5C]"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Assessment'}
            </Button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
