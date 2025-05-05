
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  className?: string;
}

export const ImageUploader = ({ onImageSelected, className }: ImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, or WEBP)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    onImageSelected(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setPreviewImage(null);
    if (inputRef.current) inputRef.current.value = '';
    onImageSelected(null as any); // Clear the selected image
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        ref={inputRef}
        onChange={handleInputChange}
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
      />
      
      {!previewImage ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center min-h-[200px] cursor-pointer transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-muted",
            className
          )}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <ImagePlus className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">
            גרור ושחרר תמונה או
          </p>
          <Button type="button" variant="secondary" className="mt-2">
            <Upload className="h-4 w-4 mr-2" />
            בחר תמונה
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            JPG, PNG, WEBP נתמכים (עד 5MB)
          </p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-border">
          <img 
            src={previewImage}
            alt="Image preview" 
            className="w-full h-auto object-cover aspect-square"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-background/80 p-1 rounded-full hover:bg-background"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};
