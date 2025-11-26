import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ModernUploadSection } from "@/components/dashboard/ModernUploadSection";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ImagePreview } from "@/components/ImagePreview";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import apiClient from "@/utils/apiClient";

const Upload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();

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
    setUploadProgress((prev) => [...prev, ...Array(validFiles.length).fill(0)]);
    toast({
      title: "Images Selected",
      description: `${validFiles.length} image${validFiles.length > 1 ? 's' : ''} added to staging area`,
    });
  };

  const getPresignedUrls = async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      const response = await apiClient.post("uploads/generate-presigned-urls", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.upload_urls;
    } catch (error) {
      toast({
        title: "Error generating presigned URLs",
        description: "Unable to fetch presigned URLs. Please try again later.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const uploadFileToS3 = async (file: File, url: string, index: number) => {
    try {
      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (event) => {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress((prev) => {
            const updatedProgress = [...prev];
            updatedProgress[index] = progress;
            return updatedProgress;
          });
        },
      });
      return true;
    } catch (error) {
      toast({
        title: "Upload Error",
        description: `Failed to upload ${file.name}.`,
        variant: "destructive",
      });
      throw error;
    }
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
    setUploadProgress(new Array(selectedFiles.length).fill(0));
    setUploadErrors(new Array(selectedFiles.length).fill(""));

    try {
      const presignedUrls = await getPresignedUrls(selectedFiles);
      const uploadPromises = selectedFiles.map((file, index) =>
        uploadFileToS3(file, presignedUrls[index].upload_url, index)
      );

      await Promise.all(uploadPromises);

      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${selectedFiles.length} image${
          selectedFiles.length > 1 ? "s" : ""
        }.`,
      });

      setSelectedFiles([]);
      setUploadProgress([]);
    } catch {
      // Errors are handled individually
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
    setUploadProgress((progress) => progress.filter((_, i) => i !== index));
    toast({
      title: "Image Removed",
      description: "Image removed from staging area",
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-background via-army-black/5 to-background">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-auto">
          {/* Header with trigger */}
          <header className="sticky top-0 z-40 border-b border-border/40 bg-card/50 backdrop-blur-xl">
            <div className="flex items-center gap-4 px-6 py-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Data Capture System</p>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="p-6 space-y-6">
            <StatsCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ModernUploadSection 
                  onFileSelect={processFile}
                  isDragging={isDragging}
                  setIsDragging={setIsDragging}
                />
                
                {selectedFiles.length > 0 && (
                  <ImagePreview
                    selectedFiles={selectedFiles}
                    removeFile={removeFile}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                    handleUpload={handleUpload}
                  />
                )}
                
                <QuickActions />
              </div>
              
              <div className="space-y-6">
                <RecentActivity />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Upload;