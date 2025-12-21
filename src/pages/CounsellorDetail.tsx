import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Mail, Phone, MapPin, Award, Calendar, User } from "lucide-react";
import apiClient from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const CounsellorDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["counsellor", id],
    queryFn: async () => {
      const response = await apiClient.get(`counsellors/${id}/`);
      return response.data?.data;
    },
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground font-medium tracking-wide">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
            <User className="w-8 h-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">Counsellor not found</h1>
            <p className="text-muted-foreground">The counsellor you're looking for doesn't exist or has been removed.</p>
          </div>
          <Link to="/counsellors">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Counsellors
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";
  };

  const getIconForField = (key: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      email: <Mail className="w-4 h-4" />,
      phone: <Phone className="w-4 h-4" />,
      phone_number: <Phone className="w-4 h-4" />,
      location: <MapPin className="w-4 h-4" />,
      address: <MapPin className="w-4 h-4" />,
      certifications: <Award className="w-4 h-4" />,
      certification: <Award className="w-4 h-4" />,
      created_at: <Calendar className="w-4 h-4" />,
      updated_at: <Calendar className="w-4 h-4" />,
    };
    return iconMap[key.toLowerCase()] || null;
  };

  const formatValue = (key: string, value: any): string => {
    if (value === null || value === undefined || value === "") return "—";
    if (key.includes("date") || key.includes("_at")) {
      try {
        return new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch {
        return String(value);
      }
    }
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  const formatLabel = (key: string): string => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Separate primary info from other fields
  const primaryFields = ["name", "full_name", "first_name", "email", "phone", "phone_number"];
  const excludeFields = ["id", "picture", "image", "avatar", "photo"];
  
  const allFields = Object.entries(data).filter(
    ([key]) => !excludeFields.includes(key.toLowerCase())
  );

  const mainInfo = allFields.filter(([key]) => 
    primaryFields.some(f => key.toLowerCase().includes(f))
  );
  
  const otherInfo = allFields.filter(([key]) => 
    !primaryFields.some(f => key.toLowerCase().includes(f))
  );

  const displayName = data.name || data.full_name || 
    `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Counsellor";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            to="/counsellors" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Counsellors</span>
          </Link>
          <img
            src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png"
            alt="YMR Logo"
            className="h-8 w-auto opacity-80"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Hero */}
        <div className="flex flex-col items-center text-center mb-12 animate-fade-in">
          <Avatar className="w-28 h-28 mb-6 ring-4 ring-background shadow-xl">
            <AvatarImage src={data.picture || data.image || data.avatar} alt={displayName} />
            <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="text-3xl font-semibold text-foreground tracking-tight mb-2">
            {displayName}
          </h1>
          
          {data.role && (
            <p className="text-muted-foreground font-medium">{data.role}</p>
          )}
          
          {data.availability !== undefined && (
            <div className="mt-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                data.availability 
                  ? "bg-emerald-500/10 text-emerald-600" 
                  : "bg-muted text-muted-foreground"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  data.availability ? "bg-emerald-500" : "bg-muted-foreground"
                }`} />
                {data.availability ? "Available" : "Unavailable"}
              </span>
            </div>
          )}
        </div>

        {/* Contact Info Cards */}
        {mainInfo.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 mb-8">
            {mainInfo.map(([key, value], index) => (
              <div
                key={key}
                className="group p-4 rounded-xl bg-card border border-border/50 hover:border-border hover:shadow-sm transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary/70 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {getIconForField(key) || <User className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      {formatLabel(key)}
                    </p>
                    <p className="text-foreground font-medium truncate">
                      {formatValue(key, value)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Other Details */}
        {otherInfo.length > 0 && (
          <>
            <Separator className="my-8" />
            
            <div className="space-y-1 mb-6">
              <h2 className="text-lg font-semibold text-foreground">Details</h2>
              <p className="text-sm text-muted-foreground">Additional information about this counsellor</p>
            </div>

            <div className="space-y-4">
              {otherInfo.map(([key, value], index) => (
                <div
                  key={key}
                  className="group flex items-start justify-between py-3 border-b border-border/30 last:border-0 hover:bg-muted/30 -mx-3 px-3 rounded-lg transition-colors"
                  style={{ animationDelay: `${(mainInfo.length + index) * 50}ms` }}
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {getIconForField(key)}
                    <span className="text-sm font-medium">{formatLabel(key)}</span>
                  </div>
                  <span className="text-sm text-foreground text-right max-w-[60%]">
                    {formatValue(key, value)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CounsellorDetail;
