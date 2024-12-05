import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { mockDocuments } from "@/utils/mockData";
import { ArrowLeft } from "lucide-react";

const DetailView = () => {
  const { id } = useParams();
  const document = mockDocuments.find(doc => doc.id === Number(id));

  if (!document) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-red-600">Document not found</h1>
          <Link to="/data">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documents
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const fields = Object.entries(document).filter(([key]) => key !== 'id');

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="container max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/fea97e0c-ca99-4275-aa6e-653e80cd7ec1.png" 
              alt="YMR Global Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-xl md:text-2xl font-bold text-purple-800">Counselling Details</h1>
          </div>
          <Link to="/data">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documents
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {fields.map(([key, value]) => (
              <div key={key} className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500 capitalize">
                  {key.replace(/_/g, ' ')}
                </h3>
                <p className="text-lg text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;