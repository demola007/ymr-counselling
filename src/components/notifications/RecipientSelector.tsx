import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, UserCheck, UserPlus, CheckCircle2, XCircle, Plus, Phone, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import apiClient from "@/utils/apiClient";

interface Recipient {
  id: number | string;
  name: string;
  phone: string;
  type: "convert" | "counsellor" | "counsellee" | "custom";
}

interface RecipientSelectorProps {
  selectedRecipients: Recipient[];
  onSelectionChange: (recipients: Recipient[]) => void;
}

export const RecipientSelector = ({
  selectedRecipients,
  onSelectionChange,
}: RecipientSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [customNumber, setCustomNumber] = useState("");
  const { toast } = useToast();
  // Fetch converts
  const { data: convertsData, isLoading: isLoadingConverts } = useQuery({
    queryKey: ["converts-for-notifications"],
    queryFn: async () => {
      const response = await apiClient.get("converts/", {
        params: { limit: 1000, skip: 0 },
      });
      return response.data?.data || [];
    },
  });

  // Fetch counsellors
  const { data: counsellorsData, isLoading: isLoadingCounsellors } = useQuery({
    queryKey: ["counsellors-for-notifications"],
    queryFn: async () => {
      const response = await apiClient.get("counsellors/", {
        params: { limit: 1000, skip: 0 },
      });
      return response.data?.data || [];
    },
  });

  // Fetch counsellees
  const { data: counselleesData, isLoading: isLoadingCounsellees } = useQuery({
    queryKey: ["counsellees-for-notifications"],
    queryFn: async () => {
      const response = await apiClient.get("counsellee/", {
        params: { limit: 1000, skip: 0 },
      });
      return response.data?.data || [];
    },
  });

  const allRecipients: Recipient[] = useMemo(() => {
    const converts = (convertsData || []).map((c: any) => ({
      id: c.id,
      name: c.name || `${c.first_name || ""} ${c.last_name || ""}`.trim(),
      phone: c.phone_number || c.phone || "",
      type: "convert" as const,
    }));

    const counsellors = (counsellorsData || []).map((c: any) => ({
      id: c.id,
      name: c.name || `${c.first_name || ""} ${c.last_name || ""}`.trim(),
      phone: c.phone_number || c.phone || "",
      type: "counsellor" as const,
    }));

    const counsellees = (counselleesData || []).map((c: any) => ({
      id: c.id,
      name: c.name || `${c.first_name || ""} ${c.last_name || ""}`.trim(),
      phone: c.phone_number || c.phone || "",
      type: "counsellee" as const,
    }));

    return [...converts, ...counsellors, ...counsellees].filter((r) => r.phone);
  }, [convertsData, counsellorsData, counselleesData]);

  const filteredRecipients = useMemo(() => {
    let filtered = allRecipients;

    if (activeTab !== "all") {
      filtered = filtered.filter((r) => r.type === activeTab);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.phone.includes(query)
      );
    }

    return filtered;
  }, [allRecipients, activeTab, searchQuery]);

  const isSelected = (recipient: Recipient) => {
    return selectedRecipients.some(
      (r) => r.id === recipient.id && r.type === recipient.type
    );
  };

  const handleToggleRecipient = (recipient: Recipient) => {
    if (isSelected(recipient)) {
      onSelectionChange(
        selectedRecipients.filter(
          (r) => !(r.id === recipient.id && r.type === recipient.type)
        )
      );
    } else {
      onSelectionChange([...selectedRecipients, recipient]);
    }
  };

  const handleSelectAll = () => {
    const allFiltered = filteredRecipients.filter((r) => !isSelected(r));
    onSelectionChange([...selectedRecipients, ...allFiltered]);
  };

  const handleDeselectAll = () => {
    const filteredIds = new Set(
      filteredRecipients.map((r) => `${r.type}-${r.id}`)
    );
    onSelectionChange(
      selectedRecipients.filter((r) => !filteredIds.has(`${r.type}-${r.id}`))
    );
  };

  const isLoading = isLoadingConverts || isLoadingCounsellors || isLoadingCounsellees;

  // Validate and add custom phone number
  const handleAddCustomNumber = () => {
    const cleaned = customNumber.replace(/\s+/g, "").trim();
    
    // Basic phone validation - must be digits, optionally starting with +
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(cleaned)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number (10-15 digits)",
        variant: "destructive",
      });
      return;
    }

    // Check if already added
    const alreadyExists = selectedRecipients.some(
      (r) => r.phone === cleaned || r.phone === cleaned.replace(/^\+/, "")
    );
    if (alreadyExists) {
      toast({
        title: "Already Added",
        description: "This number is already in your recipients list",
        variant: "destructive",
      });
      return;
    }

    const newRecipient: Recipient = {
      id: `custom-${Date.now()}`,
      name: cleaned,
      phone: cleaned,
      type: "custom",
    };

    onSelectionChange([...selectedRecipients, newRecipient]);
    setCustomNumber("");
    toast({
      title: "Number Added",
      description: `${cleaned} added to recipients`,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "convert":
        return <UserPlus className="h-3 w-3" />;
      case "counsellor":
        return <UserCheck className="h-3 w-3" />;
      case "counsellee":
        return <Users className="h-3 w-3" />;
      case "custom":
        return <Phone className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "convert":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "counsellor":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "counsellee":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "custom":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "";
    }
  };

  // Get custom recipients from selected
  const customRecipients = selectedRecipients.filter((r) => r.type === "custom");

  const counts = useMemo(() => ({
    all: allRecipients.length,
    convert: allRecipients.filter((r) => r.type === "convert").length,
    counsellor: allRecipients.filter((r) => r.type === "counsellor").length,
    counsellee: allRecipients.filter((r) => r.type === "counsellee").length,
  }), [allRecipients]);

  return (
    <div className="space-y-4">
      {/* Selected count badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-army-green/20 text-army-green-light border-army-green/30 px-3 py-1">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {selectedRecipients.length} selected
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="text-xs border-border/50 hover:bg-card/80"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeselectAll}
            className="text-xs border-border/50 hover:bg-card/80"
          >
            Deselect All
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card/50 border-border/50"
        />
      </div>

      {/* Add Custom Number */}
      <div className="p-3 rounded-lg border border-dashed border-purple-500/30 bg-purple-500/5">
        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
          <Phone className="h-3 w-3" />
          Add custom phone number
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. 2349012345678"
            value={customNumber}
            onChange={(e) => setCustomNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCustomNumber()}
            className="flex-1 bg-card/50 border-border/50 text-sm"
          />
          <Button
            size="sm"
            onClick={handleAddCustomNumber}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {/* Show custom numbers added */}
        {customRecipients.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {customRecipients.map((r) => (
              <Badge
                key={r.id}
                variant="outline"
                className="bg-purple-500/20 text-purple-400 border-purple-500/30 pr-1"
              >
                <Phone className="h-2.5 w-2.5 mr-1" />
                {r.phone}
                <button
                  onClick={() => onSelectionChange(selectedRecipients.filter((sr) => sr.id !== r.id))}
                  className="ml-1 hover:bg-purple-500/30 rounded p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <ScrollArea className="w-full">
          <TabsList className="inline-flex w-max bg-card/50 border border-border/30 p-1 gap-1">
            <TabsTrigger 
              value="all" 
              className="px-4 text-xs whitespace-nowrap data-[state=active]:bg-army-green/20 rounded-md"
            >
              All
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-[20px] text-[10px] bg-background/50">
                {counts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="convert" 
              className="px-4 text-xs whitespace-nowrap data-[state=active]:bg-emerald-500/20 rounded-md"
            >
              Converts
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-[20px] text-[10px] bg-background/50">
                {counts.convert}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="counsellor" 
              className="px-4 text-xs whitespace-nowrap data-[state=active]:bg-blue-500/20 rounded-md"
            >
              Counsellors
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-[20px] text-[10px] bg-background/50">
                {counts.counsellor}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="counsellee" 
              className="px-4 text-xs whitespace-nowrap data-[state=active]:bg-amber-500/20 rounded-md"
            >
              Counsellees
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-[20px] text-[10px] bg-background/50">
                {counts.counsellee}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>

        <TabsContent value={activeTab} className="mt-4">
          <ScrollArea className="h-[300px] rounded-lg border border-border/30 bg-card/30 p-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Loading recipients...
              </div>
            ) : filteredRecipients.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <XCircle className="h-8 w-8 mb-2 opacity-50" />
                <p>No recipients found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredRecipients.map((recipient) => (
                  <div
                    key={`${recipient.type}-${recipient.id}`}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-card/80 ${
                      isSelected(recipient)
                        ? "bg-army-green/10 border border-army-green/30"
                        : "border border-transparent"
                    }`}
                    onClick={() => handleToggleRecipient(recipient)}
                  >
                    <Checkbox
                      checked={isSelected(recipient)}
                      onCheckedChange={() => handleToggleRecipient(recipient)}
                      className="border-border/50 data-[state=checked]:bg-army-green data-[state=checked]:border-army-green"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{recipient.name}</p>
                      <p className="text-xs text-muted-foreground">{recipient.phone}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize ${getTypeColor(recipient.type)}`}
                    >
                      {getTypeIcon(recipient.type)}
                      <span className="ml-1">{recipient.type}</span>
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
