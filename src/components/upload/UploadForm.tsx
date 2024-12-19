import { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { UploadArea } from "@/components/UploadArea";
import { ImagePreview } from "@/components/ImagePreview";
import apiClient from "@/utils/apiClient";

export const UploadForm = () => {
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
    setUploadProgress((prev) => [...prev, ...Array(validFiles.length).fill(0)]); // Initialize progress
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

      return response.data.upload_urls; // [{file_key, upload_url}]
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
      // Errors are handled individually for each upload.
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
    <>
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
    </>
  );
};