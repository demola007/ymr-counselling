import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import apiClient from "@/utils/apiClient";

export interface CounsellorProfile {
  id?: number;
  name: string;
  email: string;
  phone_number: string;
  gender: string;
  country: string;
  state: string;
  date_of_birth: string;
  address: string;
  years_of_experience: number;
  has_certification: boolean;
  denomination: string;
  will_attend_ymr: boolean;
  is_available_for_training: boolean;
  picture_url?: string;
  role?: string;
}

export const useProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.get('counsellor/me');
      if (response.data) {
        return response.data as CounsellorProfile;
      }
      throw new Error('Failed to fetch profile');
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: Partial<CounsellorProfile>) => {
      const response = await apiClient.put('counsellor/me', updatedProfile);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.detail || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      const response = await apiClient.post('counsellor/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.detail || "Failed to change password",
        variant: "destructive",
      });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
  };
};
