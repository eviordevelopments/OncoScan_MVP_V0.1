import React from 'react';
import GlassCard from '@/components/common/GlassCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Calendar, MapPin, FileText, Stethoscope } from 'lucide-react';

export default function MetadataForm({ metadata, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...metadata, [field]: value });
  };

  return (
    <GlassCard padding="default">
      <h3 className="text-lg font-semibold text-[#0C2D5C] mb-4">Case Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Patient ID */}
        <div className="space-y-2">
          <Label htmlFor="patient_id" className="text-[#0C2D5C] flex items-center gap-2">
            <User className="w-4 h-4" />
            Patient ID <span className="text-red-500">*</span>
          </Label>
          <Input
            id="patient_id"
            placeholder="PAT-XXXX-1234"
            value={metadata.patient_id || ''}
            onChange={(e) => handleChange('patient_id', e.target.value)}
            className="focus-visible:ring-[#0F3F96]"
          />
          <p className="text-xs text-[#9CA3AF]">Pseudonymized identifier</p>
        </div>

        {/* Exam Date */}
        <div className="space-y-2">
          <Label htmlFor="exam_date" className="text-[#0C2D5C] flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Exam Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="exam_date"
            type="date"
            value={metadata.exam_date || ''}
            onChange={(e) => handleChange('exam_date', e.target.value)}
            className="focus-visible:ring-[#0F3F96]"
          />
        </div>

        {/* Nodule Location */}
        <div className="space-y-2">
          <Label htmlFor="nodule_location" className="text-[#0C2D5C] flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Nodule Location
          </Label>
          <Select 
            value={metadata.nodule_location || ''} 
            onValueChange={(v) => handleChange('nodule_location', v)}
          >
            <SelectTrigger className="focus:ring-[#0F3F96]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="right_lobe">Right Lobe</SelectItem>
              <SelectItem value="left_lobe">Left Lobe</SelectItem>
              <SelectItem value="isthmus">Isthmus</SelectItem>
              <SelectItem value="bilateral">Bilateral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Indication */}
        <div className="space-y-2">
          <Label htmlFor="indication" className="text-[#0C2D5C] flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            Indication
          </Label>
          <Select 
            value={metadata.indication || ''} 
            onValueChange={(v) => handleChange('indication', v)}
          >
            <SelectTrigger className="focus:ring-[#0F3F96]">
              <SelectValue placeholder="Select indication" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="routine_followup">Routine Follow-up</SelectItem>
              <SelectItem value="symptomatic">Symptomatic</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Referring Physician */}
        <div className="space-y-2">
          <Label htmlFor="referring_physician" className="text-[#0C2D5C] flex items-center gap-2">
            <User className="w-4 h-4" />
            Referring Physician
          </Label>
          <Input
            id="referring_physician"
            placeholder="Dr. John Smith"
            value={metadata.referring_physician || ''}
            onChange={(e) => handleChange('referring_physician', e.target.value)}
            className="focus-visible:ring-[#0F3F96]"
          />
        </div>

        {/* Clinical Notes */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="clinical_notes" className="text-[#0C2D5C] flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Clinical Notes
          </Label>
          <Textarea
            id="clinical_notes"
            placeholder="Optional clinical context..."
            value={metadata.clinical_notes || ''}
            onChange={(e) => handleChange('clinical_notes', e.target.value)}
            maxLength={500}
            className="h-24 focus-visible:ring-[#0F3F96]"
          />
          <p className="text-xs text-[#9CA3AF] text-right">
            {(metadata.clinical_notes || '').length}/500 characters
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
