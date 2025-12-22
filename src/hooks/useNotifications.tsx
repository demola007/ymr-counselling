import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import apiClient from "@/utils/apiClient";

interface SMSRequest {
  to: string[];
  message: string;
  channel?: "dnd" | "generic" | "voice";
  type?: "plain" | "unicode";
}

interface WhatsAppRequest {
  to: string[];
  message: string;
  media?: {
    url: string;
    caption?: string;
  };
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

  const whatsappMutation = useMutation({
    mutationFn: async (data: WhatsAppRequest): Promise<NotificationResponse> => {
      const response = await apiClient.post("notifications/whatsapp", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "WhatsApp Message Sent",
        description: `Sent to ${data.successful_count} of ${data.total_recipients} recipients`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.detail;
      let message = "Failed to send WhatsApp message";
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
    sendWhatsApp: whatsappMutation.mutate,
    isSendingSMS: smsMutation.isPending,
    isSendingWhatsApp: whatsappMutation.isPending,
    smsResult: smsMutation.data,
    whatsappResult: whatsappMutation.data,
  };
};
