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
    <div className="space-y-2 w-full">
      <FormLabel className="text-sm font-medium text-foreground">
        Profile Picture
        {required && <span className="text-destructive ml-1">*</span>}
      </FormLabel>
      <p className="text-xs text-muted-foreground mb-2">
        Upload a professional photo (JPEG, PNG, max 5MB)
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Preview Area */}
        <div className="relative">
          <div className={cn(
            "w-32 h-32 rounded-xl border-2 overflow-hidden bg-card/50 backdrop-blur-sm flex items-center justify-center transition-all",
            preview ? "border-army-green/50" : "border-army-green/30"
          )}>
            {preview ? (
              <img 
                src={preview} 
                alt="Profile preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-muted-foreground/50" />
            )}
          </div>
          {preview && (
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-lg hover:bg-destructive/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Upload Area */}
        <div
          className={cn(
            "flex-1 border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer",
            isDragging ? "border-army-green bg-army-green/5" : "border-army-green/30 hover:border-army-green/50 bg-card/30 backdrop-blur-sm"
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
            <div className="rounded-lg bg-army-green/15 p-3">
              <Upload className="w-6 h-6 text-army-green-light" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                {preview ? "Change Picture" : "Upload Picture"}
              </p>
              <p className="text-xs text-muted-foreground">
                Drag & drop or click to browse
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
