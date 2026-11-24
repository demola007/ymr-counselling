import type { Channel } from "@/types";

/**
 * Messaging providers and indicative unit costs in Naira.
 * Rates are estimates gathered November 2026 (see README → Notifications) at
 * roughly ₦1,560/$; confirm against each provider's live rate card before budgeting.
 */
export interface ProviderInfo {
  id: string;
  name: string;
  channel: Channel;
  unitCostNgn: number; // per message (per 160-char page for SMS)
  note: string;
  recommended?: boolean;
}

export const PROVIDERS: ProviderInfo[] = [
  { id: "kapso", name: "Kapso (WhatsApp Cloud API)", channel: "whatsapp", unitCostNgn: 10.5, note: "Utility template ≈ $0.0067 billed by Meta at cost; marketing ≈ $0.0516. Kapso free tier: 2,000 msgs/mo, Pro $25/mo.", recommended: true },
  { id: "twilio", name: "Twilio WhatsApp", channel: "whatsapp", unitCostNgn: 18.3, note: "Meta fee + $0.005 Twilio fee per message." },
  { id: "termii", name: "Termii SMS (DND route)", channel: "sms", unitCostNgn: 6.5, note: "≈ ₦5.50–8.00 per page on the DND/transactional route; generic route is cheaper but blocked for DND numbers.", recommended: true },
  { id: "aws_ses", name: "Amazon SES", channel: "email", unitCostNgn: 0.16, note: "$0.10 per 1,000 emails. Already integrated in the API.", recommended: true },
  { id: "sendbyte", name: "SendByte", channel: "email", unitCostNgn: 0.3, note: "₦300 per 1,000 emails pay-as-you-go, 3,000/mo free, billed in Naira. SMS/WhatsApp still in early access." },
  { id: "brevo", name: "Brevo", channel: "email", unitCostNgn: 2.8, note: "Free 300/day; Starter $9/mo for 5,000. WhatsApp needs the Professional plan." },
];

export const defaultProvider = (channel: Channel) => PROVIDERS.find((p) => p.channel === channel && p.recommended)!;

export const smsPages = (text: string) => {
  // GSM-7 single page = 160 chars, concatenated pages = 153 chars each. Non-GSM (emoji) drops to 70/67.
  const unicode = /[^\x00-\x7F£¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉÄÖÑÜ§¿äöñüà€]/.test(text);
  const single = unicode ? 70 : 160;
  const multi = unicode ? 67 : 153;
  if (text.length <= single) return { pages: text.length ? 1 : 0, perPage: single, unicode };
  return { pages: Math.ceil(text.length / multi), perPage: multi, unicode };
};
