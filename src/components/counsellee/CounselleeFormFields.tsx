import { FormField } from "@/components/converts/FormField";
import { SelectField } from "@/components/converts/SelectField";
import { Textarea } from "@/components/ui/textarea";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

export const CounselleeFormFields = () => {
  const form = useFormContext();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField 
        label="Name"
        id="name" 
        required 
      />
      <FormField 
        label="Email"
        id="email" 
        type="email" 
        required 
      />
      <FormField 
        label="Phone Number" 
        id="phone_number" 
        required 
        placeholder="+234 *********"
        hint="WhatsApp Enabled (e.g. +234 *********) Kindly include your country code"
      />
      <FormField 
        label="Date of Birth" 
        id="date_of_birth" 
        type="date" 
        required 
      />
      <SelectField
        label="Gender"
        id="gender"
        required
        placeholder="Select gender"
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" }
        ]}
      />
      <FormField 
        label="Country" 
        id="country" 
        required 
      />
      <FormField 
        label="State" 
        id="state" 
        required 
      />
      <FormField 
        label="Address" 
        id="address" 
        required 
      />
      <FormField 
        label="Nearest Bus Stop" 
        id="nearest_bus_stop" 
        required 
      />
      <SelectField
        label="Relationship Status"
        id="relationship_status"
        required
        placeholder="Select status"
        options={[
          { value: "single", label: "Single" },
          { value: "married", label: "Married" },
          { value: "other", label: "Other" }
        ]}
      />
      <SelectField
        label="Are you a student?"
        id="is_student"
        required
        placeholder="Select option"
        options={[
          { value: "true", label: "Yes" },
          { value: "false", label: "No" }
        ]}
      />
      <SelectField
        label="Age Group"
        id="age_group"
        required
        placeholder="Select age group"
        options={[
          { value: "18-24", label: "18-24" },
          { value: "25-34", label: "25-34" },
          { value: "35-44", label: "35-44" },
          { value: "45+", label: "45+" }
        ]}
      />
      <FormField 
        label="School" 
        id="school"
      />
      <FormField 
        label="Occupation" 
        id="occupation" 
        required 
      />
      <FormField 
        label="Denomination" 
        id="denomination" 
        required 
      />
      <div className="col-span-2">
        <FormItem className="space-y-2">
          <FormLabel className="text-gray-700">Counselling Reason</FormLabel>
          <FormControl>
            <Textarea
              {...form.register("counselling_reason")}
              className="min-h-[100px] bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200"
              required
            />
          </FormControl>
        </FormItem>
      </div>
    </div>
  );
};