import { useState, useCallback } from "react";
import { Upload, Search, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
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
      description: `Successfully uploaded ${file.name}`,
    });
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0];
    await processFile(file);
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const file = files[0];
    await processFile(file);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white">
      <div className="container px-4 py-16 mx-auto">
        <nav className="flex justify-end mb-8">
          <Link to="/data">
            <Button variant="outline">View Documents</Button>
          </Link>
        </nav>

        <header className="text-center mb-16 animate-fade-in">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-accent text-foreground">
            Document Management System
          </span>
          <h1 className="font-display text-5xl font-bold mb-6 text-balance">
            Manage your documents with elegance
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload, organize, and access your documents with our beautifully designed interface.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16 animate-fade-in-up">
          <div className="glass-panel rounded-2xl p-6 hover-scale">
            <Upload className="w-8 h-8 mb-4 text-primary" />
            <h3 className="font-display text-xl font-semibold mb-2">Easy Upload</h3>
            <p className="text-muted-foreground">
              Drag and drop your files or browse to upload documents securely.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 hover-scale">
            <Search className="w-8 h-8 mb-4 text-primary" />
            <h3 className="font-display text-xl font-semibold mb-2">Quick Search</h3>
            <p className="text-muted-foreground">
              Find any document instantly with our powerful search functionality.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 hover-scale">
            <FileText className="w-8 h-8 mb-4 text-primary" />
            <h3 className="font-display text-xl font-semibold mb-2">Smart Organization</h3>
            <p className="text-muted-foreground">
              Keep your documents organized with intelligent categorization.
            </p>
          </div>
        </div>

        <div
          className={`glass-panel rounded-3xl p-12 text-center transition-all duration-300 ${
            isDragging ? "border-primary border-2" : ""
          } animate-fade-in-up delay-100`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 mb-4 mx-auto text-primary" />
          <h2 className="font-display text-2xl font-semibold mb-2">
            {isUploading ? "Uploading..." : "Drop your files here"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isUploading ? "Please wait while we process your file" : "or click to browse your computer"}
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
                accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
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