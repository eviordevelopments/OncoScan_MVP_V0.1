import { useState, useCallback } from 'react';
import { Upload, X, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UploadZone({ onFilesUploaded }) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFiles = (newFiles) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    
    // Create mock URLs for demo
    const urls = imageFiles.map(file => URL.createObjectURL(file));
    setFiles(prev => [...prev, ...imageFiles]);
    
    if (onFilesUploaded) {
      onFilesUploaded(urls);
    }
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
          isDragging ? 'border-[#0F3F96] bg-blue-50' : 'border-gray-300 bg-gray-50'
        )}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 mx-auto text-[#9CA3AF] mb-4" />
          <p className="text-[#0C2D5C] font-medium mb-1">
            Drop images here or click to browse
          </p>
          <p className="text-sm text-[#9CA3AF]">
            Supports: JPG, PNG, DICOM
          </p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <FileImage className="w-full h-full p-4 text-gray-400" />
              </div>
              <button
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-xs text-[#9CA3AF] mt-1 truncate">{file.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
