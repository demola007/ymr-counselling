import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import apiClient from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";

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

  const fields = [
    { key: "name", label: "Name" },
    { key: "gender", label: "Gender" },
    { key: "email", label: "Email" },
    { key: "phone_number", label: "Phone Number" },
    { key: "date_of_birth", label: "Date of Birth" },
    { key: "relationship_status", label: "Relationship Status" },
    { key: "country", label: "Country" },
    { key: "state", label: "State" },
    { key: "address", label: "Address" },
    { key: "nearest_bus_stop", label: "Nearest Bus Stop" },
    { key: "is_student", label: "Is Student" },
    { key: "age_group", label: "Age Group" },
    { key: "school", label: "School" },
    { key: "occupation", label: "Occupation" },
    { key: "denomination", label: "Denomination" },
    { key: "counselling_reason", label: "Counselling Reason" },
    { key: "counsellor_name", label: "Counsellor Name" },
    { key: "counsellor_comments", label: "Counsellor Comments" },
    { key: "attended_to", label: "Attended To?" }
  ];

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
            <h1 className="text-xl md:text-2xl font-bold text-white">Counsellee Details</h1>
          </div>
          <Link to="/counsellee">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-[#1A1F2C] hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Counsellees
            </Button>
          </Link>
        </nav>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {fields.map(({ key, label }) => (
              <div
                key={key}
                className="space-y-2 p-4 bg-purple-50/50 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <h3 className="text-sm font-medium text-purple-600">
                  {label}
                </h3>
                <p className="text-lg text-gray-900">
                  {data[key] !== undefined && data[key] !== null 
                    ? String(data[key]) 
                    : "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselleeDetail;