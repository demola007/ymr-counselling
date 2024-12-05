import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface UploadAreaProps {
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  onFileSelect: (files: FileList) => void;
}

export const UploadArea = ({
  isDragging,
  setIsDragging,
  onFileSelect,
}: UploadAreaProps) => {
  return (
    <Card className={`transition-all duration-300 ${isDragging ? "border-primary border-2" : ""}`}>
      <CardHeader>
        <CardTitle>Upload Images</CardTitle>
        <CardDescription>
          Drag and drop your images here or click to browse
        </CardDescription>
      </CardHeader>
      <CardContent
        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted rounded-lg"
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
        <Upload className="w-12 h-12 mb-4 text-primary" />
        <p className="text-sm text-muted-foreground mb-2">
          Supported formats: JPEG, JPG, PNG
        </p>
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={(e) => e.target.files && onFileSelect(e.target.files)}
            accept=".jpg,.jpeg,.png"
            multiple
          />
          <Button variant="secondary">Browse Files</Button>
        </label>
      </CardContent>
    </Card>
  );
};