import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import apiClient from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import { MainNavigation } from "@/components/MainNavigation";

const CounselleeDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["counsellee", id],
    queryFn: async () => {
      const response = await apiClient.get(`counsellee/${id}`);
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
          <h1 className="text-2xl font-bold text-red-600">Failed to load counsellee details</h1>
          <Link to="/counsellee">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Counsellees
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
        <MainNavigation />
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

export default CounselleeDetail;