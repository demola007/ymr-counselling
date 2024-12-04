import { useState } from "react";
import { Upload, Search, FileText } from "lucide-react";

const Index = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white">
      <div className="container px-4 py-16 mx-auto">
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
            Drop your files here
          </h2>
          <p className="text-muted-foreground mb-6">
            or click to browse your computer
          </p>
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium button-hover">
            Browse Files
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;