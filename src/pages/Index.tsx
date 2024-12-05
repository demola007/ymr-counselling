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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container px-4 py-8 mx-auto">
        <nav className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
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
              const files = e.dataTransfer.files;
              processFile(files);
            }}
          >
            <div className="flex flex-col items-center gap-4">
              <Upload className="w-12 h-12 text-purple-500" />
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-1">Drag and drop files here</h3>
                <p className="text-sm text-gray-600 mb-4">or</p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        processFile(e.target.files);
                      }
                    }}
                  />
                  <Button variant="secondary" className="hover-scale">
                    Browse Files
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="glass-panel rounded-lg p-6 mb-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Selected Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setSelectedFiles(files => files.filter((_, i) => i !== index));
                      toast({
                        title: "Image Removed",
                        description: "Image removed from staging area",
                      });
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full md:w-auto"
              >
                <Send className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Selected Images'}
              </Button>
              {isUploading && (
                <Progress value={uploadProgress} className="mt-4" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;