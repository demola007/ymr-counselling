import { useState, useCallback } from "react";
import { Upload, X, Send } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { ImagePreview } from "@/components/ImagePreview";
import { UploadArea } from "@/components/UploadArea";

const Index = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const validateFile = (file: File) => {
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
  };

  const processFile = async (files: FileList) => {
    const validFiles = Array.from(files).filter(validateFile);
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
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Image Removed",
      description: "Image removed from staging area",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container px-4 py-8 mx-auto">
        <nav className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/fea97e0c-ca99-4275-aa6e-653e80cd7ec1.png" 
              alt="YMR Global Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold text-purple-800">YMR Global</h1>
          </div>
          <div className="flex gap-4">
            {userRole === "admin" && (
              <Link to="/data">
                <Button variant="outline">View Documents</Button>
              </Link>
            )}
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </nav>

        <header className="text-center mb-8 animate-fade-in">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 text-purple-800">
            Counselling Data Capture System
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload and manage counselling session data securely.
          </p>
        </header>

        <UploadArea
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          onFileSelect={processFile}
        />

        <ImagePreview
          selectedFiles={selectedFiles}
          removeFile={removeFile}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          handleUpload={handleUpload}
        />
      </div>
    </div>
  );
};

export default Index;