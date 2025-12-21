import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  Church, 
  Heart,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import apiClient from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Convert } from "@/types/convert";

const DetailView = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["convert", id],
    queryFn: async () => {
      const response = await apiClient.get(`converts/${id}`);
      return response.data?.data as Convert;
    },
    retry: 1,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Failed to load convert</h2>
            <p className="text-muted-foreground mb-6">
              The convert record could not be found or there was an error loading the data.
            </p>
            <Link to="/data">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Data
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not provided";
    return dateStr;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/data">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{data.name || "Unknown"}</h1>
              <p className="text-muted-foreground">Convert Details</p>
            </div>
          </div>
          <div className="flex gap-2">
            {data.online && (
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                <Globe className="w-3 h-3 mr-1" />
                Online
              </Badge>
            )}
            {data.availability_for_follow_up ? (
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                <CheckCircle className="w-3 h-3 mr-1" />
                Available
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                <XCircle className="w-3 h-3 mr-1" />
                Unavailable
              </Badge>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{data.name || "Unknown"}</CardTitle>
                <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                  {data.gender && (
                    <span className="capitalize">{data.gender}</span>
                  )}
                  {data.age_group && (
                    <>
                      <span>•</span>
                      <span>{data.age_group} years</span>
                    </>
                  )}
                  {data.relationship_status && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{data.relationship_status}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow icon={Mail} label="Email" value={data.email} />
              <InfoRow icon={Phone} label="Phone" value={data.phone_number} />
              <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(data.date_of_birth)} />
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow icon={Globe} label="Country" value={data.country} />
              <InfoRow icon={MapPin} label="State" value={data.state} />
              <InfoRow icon={MapPin} label="Address" value={data.address} />
              <InfoRow icon={MapPin} label="Nearest Bus Stop" value={data.nearest_bus_stop} />
            </CardContent>
          </Card>

          {/* Education & Work */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                Education & Work
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Student</span>
                <Badge variant={data.is_student ? "default" : "secondary"}>
                  {data.is_student ? "Yes" : "No"}
                </Badge>
              </div>
              {data.is_student && (
                <InfoRow icon={GraduationCap} label="School" value={data.school} />
              )}
              <InfoRow icon={Briefcase} label="Occupation" value={data.occupation} />
            </CardContent>
          </Card>

          {/* Church Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Church className="w-4 h-4 text-primary" />
                Church Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow icon={Church} label="Denomination" value={data.denomination} />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Follow-up Available</span>
                <Badge variant={data.availability_for_follow_up ? "default" : "secondary"}>
                  {data.availability_for_follow_up ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Online Convert</span>
                <Badge variant={data.online ? "default" : "secondary"}>
                  {data.online ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper component for info rows
const InfoRow = ({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | undefined | null;
}) => (
  <div className="flex items-start gap-3">
    <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-foreground truncate">{value || "Not provided"}</p>
    </div>
  </div>
);

export default DetailView;
