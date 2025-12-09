import { useState } from 'react';
import GlassCard from '@/components/common/GlassCard';
import TiradsBadge from '@/components/common/TiradsBadge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Save } from 'lucide-react';

export default function TIRADSForm({ caseData, onSave, isSaving }) {
  const [scores, setScores] = useState({
    composition: 0,
    echogenicity: 0,
    shape: 0,
    margin: 0,
    echogenic_foci: 0,
  });

  const totalPoints = Object.values(scores).reduce((sum, val) => sum + val, 0);
  const category = totalPoints === 0 ? 1 : totalPoints <= 2 ? 2 : totalPoints <= 3 ? 3 : totalPoints <= 6 ? 4 : 5;

  const handleSave = () => {
    onSave?.({
      tirads_points: totalPoints,
      tirads_category: category,
      tirads_scores: scores,
    });
  };

  return (
    <GlassCard padding="default">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#0C2D5C]">TI-RADS Scoring</h3>
          <p className="text-sm text-[#9CA3AF]">ACR Thyroid Imaging Reporting and Data System</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-[#9CA3AF]">Total Points</p>
            <p className="text-2xl font-bold text-[#0C2D5C]">{totalPoints}</p>
          </div>
          <TiradsBadge category={category} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-[#0C2D5C] mb-2 block">
              Composition (0-2 points)
            </Label>
            <div className="space-y-2">
              {[
                { value: 0, label: 'Cystic or almost completely cystic' },
                { value: 1, label: 'Spongiform' },
                { value: 2, label: 'Mixed cystic and solid' },
                { value: 2, label: 'Solid or almost completely solid' },
              ].map((option, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Checkbox
                    checked={scores.composition === option.value}
                    onCheckedChange={() => setScores({ ...scores, composition: option.value })}
                  />
                  <span className="text-sm text-[#0C2D5C]">{option.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-[#0C2D5C] mb-2 block">
              Echogenicity (0-3 points)
            </Label>
            <div className="space-y-2">
              {[
                { value: 0, label: 'Anechoic' },
                { value: 1, label: 'Hyperechoic or isoechoic' },
                { value: 2, label: 'Hypoechoic' },
                { value: 3, label: 'Very hypoechoic' },
              ].map((option, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Checkbox
                    checked={scores.echogenicity === option.value}
                    onCheckedChange={() => setScores({ ...scores, echogenicity: option.value })}
                  />
                  <span className="text-sm text-[#0C2D5C]">{option.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#0F3F96] hover:bg-[#0C2D5C]"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save TI-RADS Assessment'}
        </Button>
      </div>
    </GlassCard>
  );
}
