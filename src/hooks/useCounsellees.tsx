import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import apiClient from "@/utils/apiClient";

export const useCounsellees = (searchQuery: string, currentPage: number, itemsPerPage: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: counsellees = { data: [], total: 0 },
    isLoading,
  } = useQuery({
    queryKey: ['counsellee', searchQuery, currentPage],
    queryFn: async () => {
      const response = await apiClient.get('counsellee', {
        params: {
          searchQuery,
          limit: itemsPerPage,
          skip: (currentPage - 1) * itemsPerPage,
        },
      });
      if (response.data.status === "success") {
        return response.data;
      }
      throw new Error('Failed to fetch counsellees');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await apiClient.delete('counsellee/bulk-delete', {
        data: { ids },
      });
      return ids;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counsellee'] });
      toast({
        title: "Success",
        description: "Counsellee(s) deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.detail || "Failed to delete counsellee(s)",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (document: any) => {
      await apiClient.put(`counsellee/${document.id}`, document);
      return document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counsellee'] });
      toast({
        title: "Success",
        description: "Counsellee updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.detail || "Failed to update counsellee",
        variant: "destructive",
      });
    },
  });

  return {
    counsellees: counsellees.data,
    totalRecords: counsellees.total,
    isLoading,
    deleteMutation,
    updateMutation,
  };
};