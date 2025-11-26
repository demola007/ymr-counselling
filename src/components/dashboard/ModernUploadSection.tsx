import { Upload, Image, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ModernUploadSectionProps {
  onFileSelect: (files: FileList) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}

export const ModernUploadSection = ({ onFileSelect, isDragging, setIsDragging }: ModernUploadSectionProps) => {
  return (
    <Card 
      id="upload"
      className="relative overflow-hidden bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-xl border-border/40 hover:border-army-gold/50 transition-all duration-300"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-army-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-army-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <CardHeader className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-army-gold/10 rounded-xl">
            <Upload className="h-6 w-6 text-army-gold" />
          </div>
          <div>
            <CardTitle className="text-2xl">Upload Images</CardTitle>
            <CardDescription className="text-base">
              Drag and drop or click to upload counselling session images
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div
          className={`border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
            isDragging
              ? "border-army-gold bg-army-gold/10 scale-[0.98]"
              : "border-border/40 hover:border-army-gold/50 bg-card/30"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            onFileSelect(e.dataTransfer.files);
          }}
        >
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-army-gold/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative p-6 bg-gradient-to-br from-army-gold/20 to-army-green/20 rounded-2xl">
                <Image className="h-16 w-16 text-army-gold" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                Drop your images here
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Support for JPEG, JPG, and PNG formats. Upload multiple files at once for batch processing.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="file"
                id="fileInput"
                className="hidden"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    onFileSelect(e.target.files);
                  }
                }}
              />
              <Button 
                size="lg"
                onClick={() => document.getElementById('fileInput')?.click()}
                className="bg-army-gold hover:bg-army-gold/90 text-army-black font-semibold shadow-[0_0_20px_hsl(40_100%_50%/0.3)] hover:shadow-[0_0_30px_hsl(40_100%_50%/0.4)] transition-all"
              >
                <Upload className="mr-2 h-5 w-5" />
                Browse Files
              </Button>
            </div>

            <div className="flex items-center gap-8 text-xs text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Secure Upload</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>AI Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
