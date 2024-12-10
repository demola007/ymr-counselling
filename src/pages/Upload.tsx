import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { MainNavigation } from "@/components/MainNavigation";
import { PageHeader } from "@/components/PageHeader";
import { ImagePreview } from "@/components/ImagePreview";
import { UploadArea } from "@/components/UploadArea";

const Index = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const userRole = localStorage.getItem("userRole");

  const processFile = async (files: FileList) => {
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload only JPEG, JPG, or PNG images.",
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setSelectedFiles(prev => [...prev, ...validFiles]);
    toast({
      title: "Images Selected",
      description: `${validFiles.length} image${validFiles.length > 1 ? 's' : ''} added to staging area`,
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload first.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    clearInterval(interval);
    setUploadProgress(100);
    setIsUploading(false);
    setSelectedFiles([]);

    toast({
      title: "Upload Complete",
      description: `Successfully uploaded ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}`,
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
    toast({
      title: "Image Removed",
      description: "Image removed from staging area",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container px-4 py-8 mx-auto">
        <MainNavigation userRole={userRole} />
        <PageHeader />

        <div className="glass-panel rounded-lg p-6 mb-6">
          <div 
            className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
              isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              processFile(e.dataTransfer.files);
            }}
          >
            <div className="flex flex-col items-center gap-4">
              <input
                type="file"
                id="fileInput"
                className="hidden"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    processFile(e.target.files);
                  }
                }}
              />
              <UploadArea
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                onFileSelect={processFile}
              />
            </div>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <ImagePreview
            selectedFiles={selectedFiles}
            removeFile={removeFile}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            handleUpload={handleUpload}
          />
        )}
      </div>
    </div>
  );
};

export default Index;