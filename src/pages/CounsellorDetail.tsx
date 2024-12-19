import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import apiClient from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";

const CounsellorDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["counsellor", id],
    queryFn: async () => {
      const response = await apiClient.get(`counsellors/${id}`);
      return response.data?.data;
    },
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">Failed to load counsellor details</h1>
          <Link to="/counsellors">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Counsellors
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const fields = Object.entries(data).filter(([key]) => key !== "id");

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <nav className="flex items-center justify-between mb-8 sticky top-0 bg-[#1A1F2C] backdrop-blur-lg z-10 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png"
              alt="YMR Logo"
              className="h-10 w-auto"
            />
            <h1 className="text-xl md:text-2xl font-bold text-white">Counsellor Details</h1>
          </div>
          <Link to="/counsellors">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-[#1A1F2C] hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Counsellors
            </Button>
          </Link>
        </nav>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {fields.map(([key, value]) => (
              <div
                key={key}
                className="space-y-2 p-4 bg-purple-50/50 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <h3 className="text-sm font-medium text-purple-600 capitalize">
                  {key.replace(/_/g, " ")}
                </h3>
                <p className="text-lg text-gray-900">{String(value) || "N/A"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorDetail;