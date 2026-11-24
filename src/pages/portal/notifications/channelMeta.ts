import { Mail, MessageCircle, MessageSquareText } from "lucide-react";
import type { Channel } from "@/types";

export const CHANNEL_META: Record<Channel, { label: string; icon: typeof Mail; color: string }> = {
  whatsapp: { label: "WhatsApp", icon: MessageCircle, color: "var(--series-3)" },
  sms: { label: "SMS", icon: MessageSquareText, color: "var(--series-1)" },
  email: { label: "Email", icon: Mail, color: "var(--series-2)" },
};
