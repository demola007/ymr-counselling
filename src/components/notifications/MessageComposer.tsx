import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, MessageSquare, Phone } from "lucide-react";

interface MessageComposerProps {
  onSend: (message: string) => void;
  isSending: boolean;
  recipientCount: number;
  type: "sms" | "whatsapp";
  maxLength?: number;
}

export const MessageComposer = ({
  onSend,
  isSending,
  recipientCount,
  type,
  maxLength = 160,
}: MessageComposerProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && recipientCount > 0) {
      onSend(message);
    }
  };

  const characterCount = message.length;
  const isOverLimit = characterCount > maxLength;
  const smsSegments = Math.ceil(characterCount / 160);

  return (
    <Card className="bg-card/40 backdrop-blur-sm border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {type === "sms" ? (
              <Phone className="h-5 w-5 text-army-green-light" />
            ) : (
              <MessageSquare className="h-5 w-5 text-emerald-400" />
            )}
            <CardTitle className="text-lg">
              Compose {type === "sms" ? "SMS" : "WhatsApp"} Message
            </CardTitle>
          </div>
          <Badge variant="outline" className="bg-card/50">
            {recipientCount} recipients
          </Badge>
        </div>
        <CardDescription>
          {type === "sms" 
            ? "Standard SMS is limited to 160 characters. Longer messages will be split into multiple segments."
            : "WhatsApp messages can be longer and support rich formatting."
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder={`Type your ${type === "sms" ? "SMS" : "WhatsApp"} message here...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[150px] bg-card/50 border-border/50 resize-none"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span
              className={`text-xs ${
                isOverLimit && type === "sms" ? "text-amber-400" : "text-muted-foreground"
              }`}
            >
              {characterCount}
              {type === "sms" && `/${maxLength}`}
            </span>
            {type === "sms" && smsSegments > 1 && (
              <Badge variant="outline" className="text-xs bg-amber-500/20 text-amber-400 border-amber-500/30">
                {smsSegments} segments
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            {recipientCount === 0
              ? "Select at least one recipient to send"
              : `Message will be sent to ${recipientCount} recipient${recipientCount > 1 ? "s" : ""}`}
          </p>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || recipientCount === 0 || isSending}
            className="bg-gradient-to-r from-army-green to-army-green-light hover:from-army-green-light hover:to-army-green text-black font-semibold"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send {type === "sms" ? "SMS" : "WhatsApp"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
