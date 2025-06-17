
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, ImagePlus, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploaderProps {
  onImageSelected: (file: File | null) => void;
  className?: string;
}

export const ImageUploader = ({ onImageSelected, className }: ImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const directUploadRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const { data, error } = await supabase
        .storage
        .from('portfolio')
        .upload(`images/${Date.now()}-${file.name}`, file);

      if (error) {
        alert("❌ שגיאה בהעלאה: " + error.message);
        console.error(error);
      } else {
        alert("✅ תמונה הועלתה בהצלחה!");
        console.log("uploaded image:", data);
        
        // Create preview for the uploaded file
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPreviewImage(result);
          setSelectedFile(file);
          onImageSelected(file);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert("❌ שגיאה בהעלאה");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (file: File | null) => {
    if (!file) {
      clearImage();
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      alert('אנא העלה קובץ תמונה תקין (JPG, PNG, WEBP, HEIC)');
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('גודל התמונה חייב להיות קטן מ-10MB');
      return;
    }
    
    console.log('Selected file:', { name: file.name, size: file.size, type: file.type });
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
      setSelectedFile(file);
      onImageSelected(file);
    };
    reader.onerror = () => {
      console.error('Error reading file');
      alert('שגיאה בקריאת הקובץ');
    };
    reader.readAsDataURL(file);
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

  const handleGalleryClick = () => {
    inputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const clearImage = () => {
    console.log('Clearing image selection');
    setPreviewImage(null);
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (directUploadRef.current) directUploadRef.current.value = '';
    onImageSelected(null);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={inputRef}
        onChange={handleInputChange}
        accept=".jpg,.jpeg,.png,.webp,.heic,image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleInputChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />
      {/* Direct upload input as requested */}
      <input
        type="file"
        ref={directUploadRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />
      
      {!previewImage ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[280px] cursor-pointer transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100",
            dragActive 
              ? "border-pink-400 bg-pink-50 shadow-lg transform scale-105" 
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          )}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleGalleryClick}
        >
          <div className="bg-white rounded-full p-6 shadow-lg mb-6">
            <ImagePlus className="h-12 w-12 text-gray-400" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            העלה תמונה חדשה
          </h3>
          
          <p className="text-gray-600 mb-6 max-w-sm">
            גרור ושחרר תמונה או בחר מהאפשרויות למטה
          </p>
          
          <div className="flex gap-3 flex-wrap justify-center">
            <Button 
              type="button" 
              onClick={(e) => {
                e.stopPropagation();
                handleGalleryClick();
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl px-6 py-3 font-medium shadow-lg"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 ml-2" />
              בחר מהגלריה
            </Button>
            
            <Button 
              type="button" 
              onClick={(e) => {
                e.stopPropagation();
                handleCameraClick();
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl px-6 py-3 font-medium shadow-lg"
              disabled={isUploading}
            >
              <Camera className="h-4 w-4 ml-2" />
              צלם עכשיו
            </Button>

            <Button 
              type="button" 
              onClick={(e) => {
                e.stopPropagation();
                directUploadRef.current?.click();
              }}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 font-medium shadow-lg"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 ml-2" />
              {isUploading ? 'מעלה...' : 'העלה ישירות'}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            JPG, PNG, WEBP, HEIC נתמכים (עד 10MB)
          </p>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-xl">
          <img 
            src={previewImage}
            alt="תצוגה מקדימה" 
            className="w-full h-auto object-cover max-h-96"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearImage();
            }}
            className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white shadow-lg transition-all duration-200 hover:scale-110"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
          
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
            תמונה נבחרה ✓
          </div>
        </div>
      )}
    </div>
  );
};
