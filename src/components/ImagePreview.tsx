import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ImagePreviewProps {
  selectedFiles: File[];
  removeFile: (index: number) => void;
  isUploading: boolean;
  uploadProgress: number[];
  handleUpload: () => void;
}

export const ImagePreview = ({
  selectedFiles,
  removeFile,
  isUploading,
  uploadProgress,
  handleUpload,
}: ImagePreviewProps) => {
  if (selectedFiles.length === 0) return null;

  // Calculate average progress across all files
  const averageProgress = uploadProgress.length > 0
    ? Math.round(uploadProgress.reduce((a, b) => a + b, 0) / uploadProgress.length)
    : 0;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Selected Images ({selectedFiles.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <Button
          className="w-full"
          onClick={handleUpload}
          disabled={isUploading}
        >
          <Send className="w-4 h-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload Selected Images"}
        </Button>
        {isUploading && (
          <div className="mt-4">
            <Progress value={averageProgress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {averageProgress}% complete
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};