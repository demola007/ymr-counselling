import { Convert } from "@/types/convert";
import apiClient from "@/utils/apiClient";

// AI processing endpoint - calls capture/extract
export const processDocumentsWithAI = async (files: File[]): Promise<Convert[]> => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await apiClient.post("capture/extract", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // The API returns an array of convert objects directly
  return response.data;
};

// Bulk submit endpoint - calls converts/bulk
export const bulkSubmitConverts = async (converts: Convert[]): Promise<void> => {
  await apiClient.post("converts/bulk", converts);
};
