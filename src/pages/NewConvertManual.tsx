import { ConvertForm } from "@/components/converts/ConvertForm";
import { PageHeader } from "@/components/PageHeader";

const NewConvertManual = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Manual Convert Entry" 
        description="Enter convert details manually into the system."
      />
      <ConvertForm isOnlineConvert={false} />
    </div>
  );
};

export default NewConvertManual;