import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import apiClient from "@/utils/apiClient";

export const useCounsellors = (searchQuery: string, currentPage: number, itemsPerPage: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: counsellors = { data: [], total: 0 },
    isLoading,
  } = useQuery({
    queryKey: ['counsellors', searchQuery, currentPage],
    queryFn: async () => {
      const response = await apiClient.get('counsellors', {
        params: {
          search: searchQuery, // Changed from searchQuery to search to match API expectations
          limit: itemsPerPage,
          skip: (currentPage - 1) * itemsPerPage,
        },
      });
      if (response.data.status === "success") {
        return response.data;
      }
      throw new Error('Failed to fetch counsellors');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await apiClient.delete('counsellors/bulk-delete', {
        data: { ids },
      });
      return ids;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counsellors'] });
      toast({
        title: "Success",
        description: "Counsellor(s) deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete counsellor(s)",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (document: any) => {
      await apiClient.put(`counsellors/${document.id}`, document);
      return document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counsellors'] });
      toast({
        title: "Success",
        description: "Counsellor updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update counsellor",
        variant: "destructive",
      });
    },
  });

  return {
    counsellors: counsellors.data,
    totalRecords: counsellors.total,
    isLoading,
    deleteMutation,
    updateMutation,
  };
};