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
  /** Preferred field used across the app */
  profile_image?: string;
  /** Some API responses may return this key instead */
  profile_image_url?: string;
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
      const response = await apiClient.get("counsellors/me");
      if (response.data) {
        const data = response.data as any;

        // Normalize profile image field (API may return `profile_image_url`)
        const rawImage: unknown = data.profile_image ?? data.profile_image_url;
        const normalizedImage =
          typeof rawImage === "string" && rawImage.trim()
            ? rawImage.startsWith("http")
              ? rawImage.replace(/^http:\/\//, "https://")
              : new URL(rawImage, apiClient.defaults.baseURL).toString()
            : undefined;

        return {
          ...data,
          profile_image: normalizedImage,
        } as CounsellorProfile;
      }
      throw new Error("Failed to fetch profile");
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<CounsellorProfile> | FormData) => {
      const isFormData = data instanceof FormData;
      const response = await apiClient.put('counsellors/me', data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      });
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
      const response = await apiClient.put('counsellors/me/password', {
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
