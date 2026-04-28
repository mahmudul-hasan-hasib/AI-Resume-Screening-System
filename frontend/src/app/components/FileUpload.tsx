import { Upload, File, X } from 'lucide-react';
import { useState, useCallback } from 'react';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  multiple?: boolean;
}

export function FileUpload({ onFilesChange, multiple = true }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );

    const newFiles = multiple ? [...files, ...droppedFiles] : droppedFiles.slice(0, 1);
    setFiles(newFiles);
    onFilesChange(newFiles);
  }, [files, multiple, onFilesChange]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        file => file.type === 'application/pdf'
      );
      const newFiles = multiple ? [...files, ...selectedFiles] : selectedFiles.slice(0, 1);
      setFiles(newFiles);
      onFilesChange(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
          isDragging
            ? 'border-primary bg-accent/50'
            : 'border-border bg-card hover:border-primary/50'
        }`}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
        <h3 className="mb-2 text-foreground">
          {isDragging ? 'Drop files here' : 'Drag and drop PDF files'}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          or click to browse from your computer
        </p>
        <label className="inline-block">
          <input
            type="file"
            multiple={multiple}
            accept=".pdf"
            onChange={handleFileInput}
            className="hidden"
          />
          <span className="px-6 py-3 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90 transition-colors inline-block">
            Choose Files
          </span>
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
              <File className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="flex-1 text-sm text-foreground truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </span>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-muted rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
