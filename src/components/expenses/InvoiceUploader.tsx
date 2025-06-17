import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Upload, X, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InvoiceUploaderProps {
  onFileSelect: (file: File | null) => void;
  existingInvoiceUrl?: string;
  isUploading?: boolean;
}

export const InvoiceUploader = ({ 
  onFileSelect, 
  existingInvoiceUrl, 
  isUploading = false 
}: InvoiceUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('אנא בחר קובץ PDF או תמונה (JPG, PNG)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('גודל הקובץ גדול מדי. המקסימום הוא 10MB');
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    } else {
      setSelectedFile(null);
      onFileSelect(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileType?: string) => {
    if (fileType?.includes('pdf')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    return <FileText className="h-8 w-8 text-blue-500" />;
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="invoice-upload">העלאת חשבונית (אופציונלי)</Label>
      
      {/* Existing invoice display */}
      {existingInvoiceUrl && !selectedFile && (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-green-600" />
            <span className="text-sm text-green-800">חשבונית קיימת</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open(existingInvoiceUrl, '_blank')}
          >
            <Download className="h-4 w-4 mr-1" />
            צפה
          </Button>
        </div>
      )}

      {/* File upload area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Input
          ref={fileInputRef}
          id="invoice-upload"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        {selectedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(selectedFile.type)}
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFile}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-blue-600"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  לחץ להעלאה
                </Button>
                {' '}או גרור קובץ לכאן
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, JPG, PNG עד 10MB
              </p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">מעלה קובץ...</p>
            </div>
          </div>
        )}
      </div>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          ניתן להעלות חשבונית בפורמט PDF או תמונה. הקובץ יישמר בצורה מאובטחת ויהיה זמין לצפיה עתידית.
        </AlertDescription>
      </Alert>
    </div>
  );
};
