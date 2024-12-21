import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/converts/FormField";
import { useFormContext } from "react-hook-form";

export const CounsellorRemarks = () => {
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <FormField 
        label="Counsellor Name" 
        id="counsellor_name"
      />
      <FormItem className="space-y-2">
        <FormLabel className="text-gray-700">Counsellor Comments</FormLabel>
        <FormControl>
          <Textarea
            {...form.register("counsellor_comments")}
            className="min-h-[150px] bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200"
          />
        </FormControl>
      </FormItem>
    </div>
  );
};