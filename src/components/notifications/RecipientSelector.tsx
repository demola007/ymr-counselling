import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, UserCheck, UserPlus, CheckCircle2, XCircle } from "lucide-react";
import apiClient from "@/utils/apiClient";

interface Recipient {
  id: number;
  name: string;
  phone: string;
  type: "convert" | "counsellor" | "counsellee";
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "convert":
        return <UserPlus className="h-3 w-3" />;
      case "counsellor":
        return <UserCheck className="h-3 w-3" />;
      case "counsellee":
        return <Users className="h-3 w-3" />;
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
      default:
        return "";
    }
  };

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

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-card/50 border border-border/30">
          <TabsTrigger value="all" className="text-xs data-[state=active]:bg-army-green/20">
            All ({counts.all})
          </TabsTrigger>
          <TabsTrigger value="convert" className="text-xs data-[state=active]:bg-emerald-500/20">
            Converts ({counts.convert})
          </TabsTrigger>
          <TabsTrigger value="counsellor" className="text-xs data-[state=active]:bg-blue-500/20">
            Counsellors ({counts.counsellor})
          </TabsTrigger>
          <TabsTrigger value="counsellee" className="text-xs data-[state=active]:bg-amber-500/20">
            Counsellees ({counts.counsellee})
          </TabsTrigger>
        </TabsList>

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
