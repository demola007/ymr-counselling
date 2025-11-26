import { useState } from "react";
import { Upload, X, User } from "lucide-react";
import { FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface PictureUploadFieldProps {
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const PictureUploadField = ({ value, onChange, required = false }: PictureUploadFieldProps) => {
  const [preview, setPreview] = useState<string>(value || "");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const clearImage = () => {
    setPreview("");
    onChange("");
  };

  return (
    <div className="space-y-3 w-full">
      <FormLabel className="text-sm font-medium text-foreground">
        Profile Picture
        {required && <span className="text-destructive ml-1">*</span>}
      </FormLabel>
      <p className="text-xs text-muted-foreground">
        Upload a professional photo (JPEG, PNG, max 5MB)
      </p>

      {/* Mobile-First Layout */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Preview Area - Centered */}
        <div className="relative">
          <div className={cn(
            "w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-2 overflow-hidden bg-card/50 backdrop-blur-sm flex items-center justify-center transition-all",
            preview ? "border-army-gold/50 shadow-[0_0_20px_hsl(40_100%_50%/0.2)]" : "border-army-gold/30"
          )}>
            {preview ? (
              <img 
                src={preview} 
                alt="Profile preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/50" />
            )}
          </div>
          {preview && (
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-lg hover:bg-destructive/90 transition-all active:scale-95"
              aria-label="Remove picture"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Upload Area - Full Width on Mobile */}
        <div
          className={cn(
            "w-full border-2 border-dashed rounded-xl p-5 sm:p-6 transition-all cursor-pointer min-h-[120px] flex items-center justify-center",
            isDragging 
              ? "border-army-gold bg-army-gold/10 scale-[0.98]" 
              : "border-army-gold/30 hover:border-army-gold/50 bg-card/30 backdrop-blur-sm active:scale-[0.98]"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("picture-upload")?.click()}
        >
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="rounded-xl bg-army-gold/15 p-3 transition-transform hover:scale-110">
              <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-army-gold" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                {preview ? "Change Picture" : "Upload Picture"}
              </p>
              <p className="text-xs text-muted-foreground">
                Tap to browse or drag & drop
              </p>
            </div>
          </div>
          <input
            id="picture-upload"
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};
