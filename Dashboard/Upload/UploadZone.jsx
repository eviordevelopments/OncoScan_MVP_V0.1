import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/common/GlassCard';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { 
  Upload, 
  Image, 
  X, 
  CheckCircle2, 
  AlertCircle,
  FileImage,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UploadZone({ onFilesUploaded, maxFiles = 10 }) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/dicom'];
    const maxSize = 100 * 1024 * 1024; // 100MB
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.dcm')) {
      return { valid: false, error: 'Invalid file type. Use JPEG, PNG, or DICOM.' };
    }
    if (file.size > maxSize) {
      return { valid: false, error: 'File too large. Max 100MB.' };
    }
    return { valid: true };
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer?.files || e.target.files || []);
    addFiles(droppedFiles);
  }, [files]);

  const addFiles = (newFiles) => {
    const processedFiles = newFiles.slice(0, maxFiles - files.length).map(file => {
      const validation = validateFile(file);
      return {
        file,
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        status: validation.valid ? 'ready' : 'error',
        error: validation.error,
        url: null
      };
    });
    
    setFiles(prev => [...prev, ...processedFiles]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFiles = async () => {
    const validFiles = files.filter(f => f.status === 'ready');
    if (validFiles.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];

    for (const fileData of validFiles) {
      try {
        setUploadProgress(prev => ({ ...prev, [fileData.id]: 'uploading' }));
        
        const result = await base44.integrations.Core.UploadFile({ file: fileData.file });
        
        setFiles(prev => prev.map(f => 
          f.id === fileData.id 
            ? { ...f, status: 'uploaded', url: result.file_url }
            : f
        ));
        uploadedUrls.push(result.file_url);
        setUploadProgress(prev => ({ ...prev, [fileData.id]: 'done' }));
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === fileData.id 
            ? { ...f, status: 'error', error: 'Upload failed' }
            : f
        ));
        setUploadProgress(prev => ({ ...prev, [fileData.id]: 'error' }));
      }
    }

    setUploading(false);
    if (uploadedUrls.length > 0) {
      onFilesUploaded(uploadedUrls);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300",
          isDragging 
            ? "border-[#0F3F96] bg-blue-50/50" 
            : "border-[rgba(15,63,150,0.2)] hover:border-[#3C7CE3] hover:bg-blue-50/30"
        )}
      >
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.dcm"
          onChange={handleDrop}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors",
            isDragging ? "bg-[#0F3F96]" : "bg-gradient-to-br from-[#0F3F96] to-[#3C7CE3]"
          )}>
            <Upload className="w-8 h-8 text-white" />
          </div>
          
          <p className="text-lg font-medium text-[#0C2D5C] mb-1">
            {isDragging ? 'Drop files here' : 'Drag ultrasound images here'}
          </p>
          <p className="text-sm text-[#9CA3AF] mb-4">
            or click to browse • JPEG, PNG, DICOM • Max 100MB each
          </p>
          
          <Button variant="outline" className="pointer-events-none">
            <Image className="w-4 h-4 mr-2" />
            Select Files
          </Button>
        </div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {files.map((fileData) => (
              <motion.div
                key={fileData.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                  fileData.status === 'error' 
                    ? "border-red-200 bg-red-50" 
                    : fileData.status === 'uploaded'
                    ? "border-green-200 bg-green-50"
                    : "border-[rgba(15,63,150,0.1)] bg-white"
                )}
              >
                {/* Preview */}
                {fileData.preview ? (
                  <img 
                    src={fileData.preview} 
                    alt={fileData.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FileImage className="w-6 h-6 text-gray-400" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0C2D5C] truncate">
                    {fileData.name}
                  </p>
                  <p className="text-xs text-[#9CA3AF]">
                    {formatSize(fileData.size)}
                    {fileData.error && (
                      <span className="text-red-500 ml-2">• {fileData.error}</span>
                    )}
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {uploadProgress[fileData.id] === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-[#0F3F96] animate-spin" />
                  )}
                  {fileData.status === 'uploaded' && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  {fileData.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(fileData.id)}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}

            {/* Upload Button */}
            {files.some(f => f.status === 'ready') && (
              <Button 
                onClick={uploadFiles}
                disabled={uploading}
                className="w-full bg-[#0F3F96] hover:bg-[#0C2D5C]"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {files.filter(f => f.status === 'ready').length} Files
                  </>
                )}
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
