import { ConvertFormContainer } from "@/components/converts/ConvertFormContainer";
import { PageHeader } from "@/components/PageHeader";

const NewConvert = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="New Convert Registration" 
        description="Please fill in the details below to register a new convert."
      />
      <ConvertFormContainer isOnlineConvert={true} />
    </div>
  );
};

export default NewConvert;