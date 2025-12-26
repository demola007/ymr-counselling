import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import apiClient from "@/utils/apiClient";

interface SMSRequest {
  to: string[];
  message: string;
  channel?: "dnd" | "generic" | "voice";
  type?: "plain" | "unicode";
}

interface EmailRequest {
  to: string[];
  subject: string;
  template_key: string;
}

interface EmailTemplate {
  key: string;
  description: string;
  auto_variables: string[];
}

interface EmailTemplatesResponse {
  templates: Record<string, EmailTemplate>;
}

interface NotificationResponse {
  status: string;
  batch_id: string;
  total_recipients: number;
  successful_count: number;
  failed_count: number;
  message_id: string;
  cost: string;
}

export const useNotifications = () => {
  const { toast } = useToast();

  // Fetch email templates
  const templatesQuery = useQuery({
    queryKey: ["email-templates"],
    queryFn: async (): Promise<EmailTemplatesResponse> => {
      const response = await apiClient.get("notifications/email/templates/");
      return response.data;
    },
  });

  const smsMutation = useMutation({
    mutationFn: async (data: SMSRequest): Promise<NotificationResponse> => {
      const response = await apiClient.post("notifications/sms", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "SMS Sent Successfully",
        description: `Sent to ${data.successful_count} of ${data.total_recipients} recipients`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.detail;
      let message = "Failed to send SMS";
      if (Array.isArray(errorMessage)) {
        message = errorMessage.map((e: any) => e.msg || e.message || String(e)).join(", ");
      } else if (typeof errorMessage === "string") {
        message = errorMessage;
      }
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const emailMutation = useMutation({
    mutationFn: async (data: EmailRequest): Promise<NotificationResponse> => {
      const response = await apiClient.post("notifications/email", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Email Sent Successfully",
        description: `Sent to ${data.successful_count} of ${data.total_recipients} recipients`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.detail;
      let message = "Failed to send email";
      if (Array.isArray(errorMessage)) {
        message = errorMessage.map((e: any) => e.msg || e.message || String(e)).join(", ");
      } else if (typeof errorMessage === "string") {
        message = errorMessage;
      }
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  return {
    sendSMS: smsMutation.mutate,
    sendEmail: emailMutation.mutate,
    isSendingSMS: smsMutation.isPending,
    isSendingEmail: emailMutation.isPending,
    smsResult: smsMutation.data,
    emailResult: emailMutation.data,
    emailTemplates: templatesQuery.data?.templates || {},
    isLoadingTemplates: templatesQuery.isLoading,
  };
};
