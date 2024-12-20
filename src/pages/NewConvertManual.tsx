import { ConvertFormContainer } from "@/components/converts/ConvertFormContainer";
import { PageHeader } from "@/components/PageHeader";

const NewConvertManual = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container max-w-3xl px-4 py-8 mx-auto">
        <PageHeader 
          title="Manual Convert Entry" 
          description="Enter convert details manually into the system."
        />
        <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6 md:p-8">
          <ConvertFormContainer isOnlineConvert={false} />
        </div>
      </div>
    </div>
  );
};

export default NewConvertManual;