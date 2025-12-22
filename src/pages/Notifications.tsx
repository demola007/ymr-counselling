import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecipientSelector } from "@/components/notifications/RecipientSelector";
import { MessageComposer, SMSChannel } from "@/components/notifications/MessageComposer";
import { NotificationResult } from "@/components/notifications/NotificationResult";
import { NotificationsHeader } from "@/components/notifications/NotificationsHeader";
import { useNotifications } from "@/hooks/useNotifications";
import { MessageSquare, Phone, Send, Sparkles, Zap } from "lucide-react";

interface Recipient {
  id: number | string;
  name: string;
  phone: string;
  type: "convert" | "counsellor" | "counsellee" | "custom";
}

const Notifications = () => {
  const [activeTab, setActiveTab] = useState<"sms" | "whatsapp">("sms");
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [lastResult, setLastResult] = useState<any>(null);

  const { sendSMS, sendWhatsApp, isSendingSMS, isSendingWhatsApp, smsResult, whatsappResult } = useNotifications();

  const handleSendSMS = (message: string, channel?: SMSChannel) => {
    const phoneNumbers = selectedRecipients.map((r) => r.phone);
    sendSMS(
      { to: phoneNumbers, message, channel: channel || "generic", type: "plain" },
      {
        onSuccess: (data) => {
          setLastResult(data);
          setSelectedRecipients([]);
        },
      }
    );
  };

  const handleSendWhatsApp = (message: string) => {
    const phoneNumbers = selectedRecipients.map((r) => r.phone);
    sendWhatsApp(
      { to: phoneNumbers, message },
      {
        onSuccess: (data) => {
          setLastResult(data);
          setSelectedRecipients([]);
        },
      }
    );
  };

  const result = activeTab === "sms" ? smsResult : whatsappResult;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-army-black/5 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--army-green)) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      <div className="container px-4 py-4 md:py-6 mx-auto max-w-7xl relative z-10">
        <NotificationsHeader />

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card/40 backdrop-blur-sm border-border/40 hover:border-army-green/30 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Zap className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold">Instant Delivery</p>
                  <p className="text-xs text-muted-foreground">Messages sent in real-time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/40 backdrop-blur-sm border-border/40 hover:border-army-green/30 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold">Multi-Channel</p>
                  <p className="text-xs text-muted-foreground">SMS & WhatsApp support</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/40 backdrop-blur-sm border-border/40 hover:border-army-green/30 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold">Bulk Messaging</p>
                  <p className="text-xs text-muted-foreground">Send to multiple recipients</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "sms" | "whatsapp")}>
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-card/50 border border-border/30 mb-6">
            <TabsTrigger 
              value="sms" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-army-green/20 data-[state=active]:to-army-green-light/20 data-[state=active]:text-army-green-light"
            >
              <Phone className="h-4 w-4 mr-2" />
              SMS
            </TabsTrigger>
            <TabsTrigger 
              value="whatsapp"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-emerald-400/20 data-[state=active]:text-emerald-400"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp
            </TabsTrigger>
          </TabsList>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Recipient Selection */}
            <Card className="bg-card/40 backdrop-blur-sm border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-army-green/20">
                    <Send className="h-4 w-4 text-army-green-light" />
                  </span>
                  Select Recipients
                </CardTitle>
                <CardDescription>
                  Choose who you want to send the message to
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecipientSelector
                  selectedRecipients={selectedRecipients}
                  onSelectionChange={setSelectedRecipients}
                />
              </CardContent>
            </Card>

            {/* Right Column - Message Composer */}
            <div className="space-y-6">
              <TabsContent value="sms" className="mt-0">
                <MessageComposer
                  type="sms"
                  onSend={handleSendSMS}
                  isSending={isSendingSMS}
                  recipientCount={selectedRecipients.length}
                  maxLength={160}
                />
              </TabsContent>

              <TabsContent value="whatsapp" className="mt-0">
                <MessageComposer
                  type="whatsapp"
                  onSend={handleSendWhatsApp}
                  isSending={isSendingWhatsApp}
                  recipientCount={selectedRecipients.length}
                  maxLength={4096}
                />
              </TabsContent>

              {/* Result Display */}
              {result && (
                <NotificationResult result={result} type={activeTab} />
              )}
            </div>
          </div>
        </Tabs>

        {/* Selected Recipients Preview */}
        {selectedRecipients.length > 0 && (
          <Card className="mt-6 bg-card/40 backdrop-blur-sm border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Selected Recipients Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedRecipients.slice(0, 10).map((recipient) => (
                  <Badge
                    key={`${recipient.type}-${recipient.id}`}
                    variant="outline"
                    className="bg-card/50 border-border/50"
                  >
                    {recipient.name}
                  </Badge>
                ))}
                {selectedRecipients.length > 10 && (
                  <Badge variant="outline" className="bg-army-green/20 text-army-green-light border-army-green/30">
                    +{selectedRecipients.length - 10} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notifications;
