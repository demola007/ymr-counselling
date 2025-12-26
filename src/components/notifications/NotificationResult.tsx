import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, DollarSign, Users, Hash } from "lucide-react";

interface NotificationResultProps {
  result: {
    status: string;
    batch_id: string;
    total_recipients: number;
    successful_count: number;
    failed_count: number;
    message_id: string;
    cost: string;
  } | null;
  type: "sms" | "email";
}

export const NotificationResult = ({ result, type }: NotificationResultProps) => {
  if (!result) return null;

  const isSuccess = result.status === "success";
  const successRate = result.total_recipients > 0 
    ? Math.round((result.successful_count / result.total_recipients) * 100)
    : 0;

  return (
    <Card className={`bg-card/40 backdrop-blur-sm border ${
      isSuccess ? "border-emerald-500/30" : "border-red-500/30"
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isSuccess ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            ) : (
              <XCircle className="h-5 w-5 text-red-400" />
            )}
            <CardTitle className="text-lg">
              {type === "sms" ? "SMS" : "Email"} Delivery Report
            </CardTitle>
          </div>
          <Badge 
            variant="outline" 
            className={isSuccess 
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
              : "bg-red-500/20 text-red-400 border-red-500/30"
            }
          >
            {isSuccess ? "Success" : "Failed"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card/50 rounded-lg p-3 border border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Users className="h-3 w-3" />
              Total Recipients
            </div>
            <p className="text-xl font-bold">{result.total_recipients}</p>
          </div>
          
          <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400 text-xs mb-1">
              <CheckCircle2 className="h-3 w-3" />
              Delivered
            </div>
            <p className="text-xl font-bold text-emerald-400">{result.successful_count}</p>
          </div>
          
          <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
            <div className="flex items-center gap-2 text-red-400 text-xs mb-1">
              <XCircle className="h-3 w-3" />
              Failed
            </div>
            <p className="text-xl font-bold text-red-400">{result.failed_count}</p>
          </div>
          
          <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-400 text-xs mb-1">
              <DollarSign className="h-3 w-3" />
              Cost
            </div>
            <p className="text-xl font-bold text-amber-400">₦{parseFloat(result.cost).toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Hash className="h-3 w-3" />
            <span>Batch: {result.batch_id.slice(0, 8)}...</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Success Rate: </span>
            <span className={successRate >= 80 ? "text-emerald-400" : successRate >= 50 ? "text-amber-400" : "text-red-400"}>
              {successRate}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
