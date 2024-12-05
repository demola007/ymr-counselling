import { useState, useCallback } from "react";
import { Upload, X, Send } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <div className="min-h-screen bg-gradient-to-b from-secondary/20 to-background">
      <div className="container px-4 py-8 mx-auto">
        <nav className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary">YMR Global</h1>
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
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 text-primary">
            Counselling Data Capture System
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload and manage counselling session data securely.
          </p>
        </header>

        <div className="grid gap-6">
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
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mb-4 text-primary" />
              <p className="text-sm text-muted-foreground mb-2">
                Supported formats: JPEG, JPG, PNG
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".jpg,.jpeg,.png"
                  multiple
                />
                <Button variant="secondary">Browse Files</Button>
              </label>
            </CardContent>
          </Card>

          {selectedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Images ({selectedFiles.length})</CardTitle>
                <CardDescription>
                  Review your selected images before uploading
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 p-1 bg-destructive/90 text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      {uploadProgress}% complete
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;