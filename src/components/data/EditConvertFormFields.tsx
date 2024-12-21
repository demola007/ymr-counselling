import { FormField } from "@/components/converts/FormField";
import { SelectField } from "@/components/converts/SelectField";

export const EditConvertFormFields = () => {
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
        label="Phone Number" 
        id="phone_number" 
        required 
      />
      <FormField 
        label="Date of Birth" 
        id="date_of_birth" 
        type="date" 
        required 
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
        label="Relationship Status" 
        id="relationship_status" 
        required 
      />
      <FormField 
        label="Nearest B.Stop" 
        id="nearest_bus_stop" 
        required 
      />
      <FormField 
        label="Occupation" 
        id="occupation" 
        required 
      />
      <FormField 
        label="Address" 
        id="address" 
        required 
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
      <FormField 
        label="School" 
        id="school" 
        required 
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
        label="Denomination" 
        id="denomination" 
        required 
      />
      <SelectField
        label="Available for Follow-up"
        id="availability_for_follow_up"
        required
        placeholder="Select option"
        options={[
          { value: "true", label: "Yes" },
          { value: "false", label: "No" }
        ]}
      />
      <SelectField
        label="Online Convert"
        id="online"
        required
        placeholder="Select option"
        options={[
          { value: "true", label: "Yes" },
          { value: "false", label: "No" }
        ]}
      />
    </div>
  );
};