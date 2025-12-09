import { useState, useEffect } from 'react';
import GlassCard from '@/components/common/GlassCard';
import TiradsBadge from '@/components/common/TiradsBadge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save, RotateCcw, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TIRADSForm({ caseData, onSave, isSaving }) {
  const [scores, setScores] = useState({
    composition: null,
    echogenicity: null,
    shape: null,
    margin: null,
    echogenic_foci: []
  });

  // Calculate total points
  const totalPoints = 
    (scores.composition || 0) +
    (scores.echogenicity || 0) +
    (scores.shape || 0) +
    (scores.margin || 0) +
    (scores.echogenic_foci.length > 0 ? Math.max(...scores.echogenic_foci) : 0);

  // Determine TI-RADS category
  const getTIRADSCategory = (points) => {
    if (points === 0) return 1;
    if (points === 2) return 2;
    if (points === 3) return 3;
    if (points >= 4 && points <= 6) return 4;
    return 5;
  };

  const category = getTIRADSCategory(totalPoints);

  // Get suspiciousness level and recommendation
  const getTIRADSInfo = (cat) => {
    const info = {
      1: {
        suspiciousness: 'Benign',
        recommendation: 'No FNA required',
        color: 'bg-emerald-50 border-emerald-200 text-emerald-700'
      },
      2: {
        suspiciousness: 'Not Suspicious',
        recommendation: 'No FNA required',
        color: 'bg-green-50 border-green-200 text-green-700'
      },
      3: {
        suspiciousness: 'Mildly Suspicious',
        recommendation: 'FNA if ≥2.5 cm, Follow-up if ≥1.5 cm',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-700'
      },
      4: {
        suspiciousness: 'Moderately Suspicious',
        recommendation: 'FNA if ≥1.5 cm, Follow-up if ≥1 cm',
        color: 'bg-orange-50 border-orange-200 text-orange-700'
      },
      5: {
        suspiciousness: 'Highly Suspicious',
        recommendation: 'FNA if ≥1 cm, Follow-up if ≥0.5 cm',
        color: 'bg-red-50 border-red-200 text-red-700'
      }
    };
    return info[cat] || info[1];
  };

  const tiradsInfo = getTIRADSInfo(category);

  const handleSave = () => {
    onSave?.({
      tirads_points: totalPoints,
      tirads_category: category,
      tirads_scores: scores,
      tirads_suspiciousness: tiradsInfo.suspiciousness,
      tirads_recommendation: tiradsInfo.recommendation
    });
  };

  const handleReset = () => {
    setScores({
      composition: null,
      echogenicity: null,
      shape: null,
      margin: null,
      echogenic_foci: []
    });
  };

  const RadioOption = ({ name, value, points, label, checked, onChange }) => (
    <label className={cn(
      "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
      checked 
        ? "border-[#0F3F96] bg-blue-50" 
        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
    )}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-[#0F3F96]"
      />
      <span className="flex-1 text-sm text-gray-900">{label}</span>
      <span className="text-xs font-semibold text-gray-600">({points} pts)</span>
    </label>
  );

  const CheckboxOption = ({ name, value, points, label, checked, onChange }) => (
    <label className={cn(
      "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
      checked 
        ? "border-[#0F3F96] bg-blue-50" 
        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
    )}>
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-[#0F3F96] rounded"
      />
      <span className="flex-1 text-sm text-gray-900">{label}</span>
      <span className="text-xs font-semibold text-gray-600">({points} pts)</span>
    </label>
  );

  return (
    <GlassCard padding="default">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F3F96] flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">ACR TI-RADS Assessment</h3>
            <p className="text-xs text-gray-500">Thyroid Imaging Reporting and Data System</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-600">Total Points</p>
            <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
          </div>
          <TiradsBadge category={category} size="default" />
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        {/* Composition */}
        <div>
          <Label className="text-sm font-semibold text-gray-900 mb-3 block">
            Composition
          </Label>
          <div className="space-y-2">
            <RadioOption
              name="composition"
              value="0"
              points={0}
              label="Cystic or almost completely cystic"
              checked={scores.composition === 0}
              onChange={() => setScores({ ...scores, composition: 0 })}
            />
            <RadioOption
              name="composition"
              value="1"
              points={1}
              label="Spongiform"
              checked={scores.composition === 1}
              onChange={() => setScores({ ...scores, composition: 1 })}
            />
            <RadioOption
              name="composition"
              value="2a"
              points={2}
              label="Mixed cystic and solid"
              checked={scores.composition === 2}
              onChange={() => setScores({ ...scores, composition: 2 })}
            />
            <RadioOption
              name="composition"
              value="2b"
              points={2}
              label="Solid or almost completely solid"
              checked={scores.composition === 2}
              onChange={() => setScores({ ...scores, composition: 2 })}
            />
          </div>
        </div>

        {/* Echogenicity */}
        <div>
          <Label className="text-sm font-semibold text-gray-900 mb-3 block">
            Echogenicity
          </Label>
          <div className="space-y-2">
            <RadioOption
              name="echogenicity"
              value="0"
              points={0}
              label="Anechoic"
              checked={scores.echogenicity === 0}
              onChange={() => setScores({ ...scores, echogenicity: 0 })}
            />
            <RadioOption
              name="echogenicity"
              value="1"
              points={1}
              label="Hyperechoic or isoechoic"
              checked={scores.echogenicity === 1}
              onChange={() => setScores({ ...scores, echogenicity: 1 })}
            />
            <RadioOption
              name="echogenicity"
              value="2"
              points={2}
              label="Hypoechoic"
              checked={scores.echogenicity === 2}
              onChange={() => setScores({ ...scores, echogenicity: 2 })}
            />
            <RadioOption
              name="echogenicity"
              value="3"
              points={3}
              label="Very hypoechoic"
              checked={scores.echogenicity === 3}
              onChange={() => setScores({ ...scores, echogenicity: 3 })}
            />
          </div>
        </div>

        {/* Shape */}
        <div>
          <Label className="text-sm font-semibold text-gray-900 mb-3 block">
            Shape
          </Label>
          <div className="space-y-2">
            <RadioOption
              name="shape"
              value="0"
              points={0}
              label="Wider-than-tall"
              checked={scores.shape === 0}
              onChange={() => setScores({ ...scores, shape: 0 })}
            />
            <RadioOption
              name="shape"
              value="3"
              points={3}
              label="Taller-than-wide"
              checked={scores.shape === 3}
              onChange={() => setScores({ ...scores, shape: 3 })}
            />
          </div>
        </div>

        {/* Margin */}
        <div>
          <Label className="text-sm font-semibold text-gray-900 mb-3 block">
            Margin
          </Label>
          <div className="space-y-2">
            <RadioOption
              name="margin"
              value="0"
              points={0}
              label="Smooth"
              checked={scores.margin === 0}
              onChange={() => setScores({ ...scores, margin: 0 })}
            />
            <RadioOption
              name="margin"
              value="2"
              points={2}
              label="Lobulated or irregular"
              checked={scores.margin === 2}
              onChange={() => setScores({ ...scores, margin: 2 })}
            />
            <RadioOption
              name="margin"
              value="3"
              points={3}
              label="Extra-thyroidal extension"
              checked={scores.margin === 3}
              onChange={() => setScores({ ...scores, margin: 3 })}
            />
          </div>
        </div>

        {/* Echogenic Foci */}
        <div>
          <Label className="text-sm font-semibold text-gray-900 mb-3 block">
            Echogenic Foci (Select all that apply)
          </Label>
          <div className="space-y-2">
            <CheckboxOption
              name="echogenic_foci"
              value="0"
              points={0}
              label="None or large comet-tail artifacts"
              checked={scores.echogenic_foci.includes(0)}
              onChange={(e) => {
                const newFoci = e.target.checked
                  ? [...scores.echogenic_foci, 0]
                  : scores.echogenic_foci.filter(v => v !== 0);
                setScores({ ...scores, echogenic_foci: newFoci });
              }}
            />
            <CheckboxOption
              name="echogenic_foci"
              value="2"
              points={2}
              label="Macrocalcifications"
              checked={scores.echogenic_foci.includes(2)}
              onChange={(e) => {
                const newFoci = e.target.checked
                  ? [...scores.echogenic_foci, 2]
                  : scores.echogenic_foci.filter(v => v !== 2);
                setScores({ ...scores, echogenic_foci: newFoci });
              }}
            />
            <CheckboxOption
              name="echogenic_foci"
              value="1"
              points={1}
              label="Peripheral (rim) calcifications"
              checked={scores.echogenic_foci.includes(1)}
              onChange={(e) => {
                const newFoci = e.target.checked
                  ? [...scores.echogenic_foci, 1]
                  : scores.echogenic_foci.filter(v => v !== 1);
                setScores({ ...scores, echogenic_foci: newFoci });
              }}
            />
            <CheckboxOption
              name="echogenic_foci"
              value="3"
              points={3}
              label="Punctate echogenic foci"
              checked={scores.echogenic_foci.includes(3)}
              onChange={(e) => {
                const newFoci = e.target.checked
                  ? [...scores.echogenic_foci, 3]
                  : scores.echogenic_foci.filter(v => v !== 3);
                setScores({ ...scores, echogenic_foci: newFoci });
              }}
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className={cn(
        "mt-6 p-4 rounded-xl border-2",
        tiradsInfo.color
      )}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs font-medium mb-1">TI-RADS Level</div>
            <div className="text-2xl font-bold">TR{category}</div>
          </div>
          <div>
            <div className="text-xs font-medium mb-1">Suspiciousness</div>
            <div className="text-sm font-bold">{tiradsInfo.suspiciousness}</div>
          </div>
          <div>
            <div className="text-xs font-medium mb-1">Points</div>
            <div className="text-2xl font-bold">{totalPoints}</div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-current/20">
          <div className="text-xs font-medium mb-1">Clinical Recommendation</div>
          <div className="text-sm font-semibold">{tiradsInfo.recommendation}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving || totalPoints === 0}
          className="flex-1 bg-[#0F3F96] hover:bg-[#0C2D5C]"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Assessment'}
        </Button>
      </div>
    </GlassCard>
  );
}
