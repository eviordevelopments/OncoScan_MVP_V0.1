import GlassCard from '@/components/common/GlassCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function MetadataForm({ metadata, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...metadata, [field]: value });
  };

  return (
    <GlassCard padding="default">
      <h3 className="text-lg font-semibold text-[#0C2D5C] mb-4">Case Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patient_id">Patient ID *</Label>
          <Input
            id="patient_id"
            value={metadata.patient_id}
            onChange={(e) => handleChange('patient_id', e.target.value)}
            placeholder="e.g., PT-2024-001"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="exam_date">Exam Date *</Label>
          <Input
            id="exam_date"
            type="date"
            value={metadata.exam_date}
            onChange={(e) => handleChange('exam_date', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nodule_location">Nodule Location</Label>
          <Select
            value={metadata.nodule_location}
            onValueChange={(value) => handleChange('nodule_location', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="right_lobe">Right Lobe</SelectItem>
              <SelectItem value="left_lobe">Left Lobe</SelectItem>
              <SelectItem value="isthmus">Isthmus</SelectItem>
              <SelectItem value="multiple">Multiple</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="indication">Indication</Label>
          <Input
            id="indication"
            value={metadata.indication}
            onChange={(e) => handleChange('indication', e.target.value)}
            placeholder="e.g., Routine screening"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="referring_physician">Referring Physician</Label>
          <Input
            id="referring_physician"
            value={metadata.referring_physician}
            onChange={(e) => handleChange('referring_physician', e.target.value)}
            placeholder="Dr. Name"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="clinical_notes">Clinical Notes</Label>
          <Textarea
            id="clinical_notes"
            value={metadata.clinical_notes}
            onChange={(e) => handleChange('clinical_notes', e.target.value)}
            placeholder="Additional clinical information..."
            rows={3}
          />
        </div>
      </div>
    </GlassCard>
  );
}
