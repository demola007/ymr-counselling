import { useState, useCallback } from "react";
import { Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
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

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate file upload delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    clearInterval(interval);
    setUploadProgress(100);
    setIsUploading(false);

    toast({
      title: "Upload Complete",
      description: `Successfully uploaded ${validFiles.length} image${validFiles.length > 1 ? 's' : ''}`,
    });
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    await processFile(e.dataTransfer.files);
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await processFile(e.target.files);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white">
      <div className="container px-4 py-16 mx-auto">
        <nav className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">YMR Global</h1>
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

        <header className="text-center mb-16 animate-fade-in">
          <h1 className="font-display text-4xl font-bold mb-6">
            Counselling Data Capture System
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload and manage counselling session data securely.
          </p>
        </header>

        <div
          className={`glass-panel rounded-3xl p-12 text-center transition-all duration-300 ${
            isDragging ? "border-primary border-2" : ""
          } animate-fade-in-up delay-100`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 mb-4 mx-auto text-primary" />
          <h2 className="font-display text-2xl font-semibold mb-2">
            {isUploading ? "Uploading..." : "Drop your images here"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isUploading 
              ? "Please wait while we process your files" 
              : "Supported formats: JPEG, JPG, PNG"}
          </p>
          
          {isUploading ? (
            <div className="max-w-md mx-auto mb-4">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">{uploadProgress}% complete</p>
            </div>
          ) : (
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept=".jpg,.jpeg,.png"
                multiple
              />
              <span className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium button-hover inline-block">
                Browse Files
              </span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;