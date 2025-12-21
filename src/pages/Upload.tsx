import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ModernUploadSection } from "@/components/dashboard/ModernUploadSection";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ResultsReview } from "@/components/upload/ResultsReview";
import { useToast } from "@/components/ui/use-toast";
import { Convert } from "@/types/convert";
import { processDocumentsWithAI, bulkSubmitConverts } from "@/utils/mockConvertApi";
import { Loader2 } from "lucide-react";

const Upload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedConverts, setProcessedConverts] = useState<Convert[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const processFile = async (files: FileList) => {
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload only JPEG, JPG, PNG images or PDF documents.",
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setSelectedFiles(validFiles);
    toast({
      title: "Documents Selected",
      description: `${validFiles.length} document${validFiles.length > 1 ? 's' : ''} ready for AI processing`,
    });
  };

  const handleProcessDocuments = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No documents selected",
        description: "Please select documents to process first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      toast({
        title: "Processing Started",
        description: "AI is extracting data from your documents...",
      });

      const results = await processDocumentsWithAI(selectedFiles);
      
      setProcessedConverts(results);
      
      toast({
        title: "Processing Complete",
        description: `Successfully extracted ${results.length} convert record${results.length > 1 ? 's' : ''} from your documents.`,
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "Unable to process documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitAll = async (converts: Convert[]) => {
    setIsSubmitting(true);
    
    try {
      await bulkSubmitConverts(converts);
      
      toast({
        title: "Success",
        description: `${converts.length} convert record${converts.length > 1 ? 's' : ''} successfully saved to database.`,
      });

      // Reset state
      setProcessedConverts(null);
      setSelectedFiles([]);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Unable to save converts to database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReview = () => {
    setProcessedConverts(null);
    setSelectedFiles([]);
    toast({
      title: "Review Cancelled",
      description: "You can upload new documents to start over.",
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
            {!processedConverts ? (
              <>
                <StatsCards />
                
                <div className="space-y-6">
                  <ModernUploadSection 
                    onFileSelect={processFile}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                  />
                  
                  {selectedFiles.length > 0 && (
                    <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-6 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Selected Documents ({selectedFiles.length})
                        </h3>
                        <div className="space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                              <span className="text-sm text-foreground truncate flex-1">{file.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {(file.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        onClick={handleProcessDocuments}
                        disabled={isProcessing}
                        className="w-full py-4 px-6 bg-army-gold hover:bg-army-gold/90 text-army-black font-semibold rounded-xl shadow-[0_0_20px_hsl(40_100%_50%/0.3)] hover:shadow-[0_0_30px_hsl(40_100%_50%/0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing with AI...
                          </>
                        ) : (
                          <>
                            Process Documents with AI
                          </>
                        )}
                      </button>
                    </div>
                  )}
                  
                  <QuickActions />
                </div>
              </>
            ) : (
              <ResultsReview
                converts={processedConverts}
                onSubmitAll={handleSubmitAll}
                onCancel={handleCancelReview}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Upload;