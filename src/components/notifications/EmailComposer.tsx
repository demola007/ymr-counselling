import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2, Mail, FileText, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EmailTemplate {
  key: string;
  description: string;
  auto_variables: string[];
}

interface EmailComposerProps {
  onSend: (subject: string, templateKey: string) => void;
  isSending: boolean;
  recipientCount: number;
  templates: Record<string, EmailTemplate>;
  isLoadingTemplates: boolean;
}

export const EmailComposer = ({
  onSend,
  isSending,
  recipientCount,
  templates,
  isLoadingTemplates,
}: EmailComposerProps) => {
  const [subject, setSubject] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const templateList = templates ? Object.values(templates) : [];
  const currentTemplate = selectedTemplate ? templates?.[selectedTemplate] : null;

  const handleSend = () => {
    if (subject.trim() && selectedTemplate && recipientCount > 0) {
      onSend(subject, selectedTemplate);
    }
  };

  // Auto-set first template when templates load
  useEffect(() => {
    if (templateList.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templateList[0].key);
    }
  }, [templateList, selectedTemplate]);

  return (
    <Card className="bg-card/40 backdrop-blur-sm border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-lg">Compose Email</CardTitle>
          </div>
          <Badge variant="outline" className="bg-card/50">
            {recipientCount} recipients
          </Badge>
        </div>
        <CardDescription>
          Send templated emails to selected recipients. Templates include automatic personalization.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Email Template
          </label>
          <Select 
            value={selectedTemplate} 
            onValueChange={setSelectedTemplate}
            disabled={isLoadingTemplates}
          >
            <SelectTrigger className="bg-card/50 border-border/50">
              <SelectValue placeholder={isLoadingTemplates ? "Loading templates..." : "Select a template"} />
            </SelectTrigger>
            <SelectContent>
              {templateList.map((template) => (
                <SelectItem key={template.key} value={template.key}>
                  <div className="flex items-center gap-2">
                    <span className="capitalize">{template.key.replace(/_/g, " ")}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Template Info */}
          {currentTemplate && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm text-blue-300">{currentTemplate.description}</p>
                  {currentTemplate.auto_variables.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-xs text-muted-foreground">Auto-filled:</span>
                      {currentTemplate.auto_variables.map((variable) => (
                        <Badge 
                          key={variable} 
                          variant="outline" 
                          className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30"
                        >
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Subject Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Subject</label>
          <Input
            placeholder="Enter email subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-card/50 border-border/50"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            {recipientCount === 0
              ? "Select at least one recipient to send"
              : `Email will be sent to ${recipientCount} recipient${recipientCount > 1 ? "s" : ""}`}
          </p>
          <Button
            onClick={handleSend}
            disabled={!subject.trim() || !selectedTemplate || recipientCount === 0 || isSending}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
