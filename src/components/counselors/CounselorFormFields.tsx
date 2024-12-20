import { FormField } from "@/components/converts/FormField";
import { SelectField } from "@/components/converts/SelectField";

export const CounselorFormFields = () => {
  return (
    <div className="space-y-6">
      <FormField 
        label="Full Name" 
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
        label="Date of Birth" 
        id="date_of_birth" 
        type="date" 
        required 
        placeholder="DD/MM/YYYY"
      />
      <FormField 
        label="Address" 
        id="address" 
        required 
      />
      <SelectField
        label="Years of Experience"
        id="years_of_experience"
        required
        placeholder="Select years of experience"
        options={[
          { value: "0-2", label: "0-2 years" },
          { value: "3-5", label: "3-5 years" },
          { value: "6-10", label: "6-10 years" },
          { value: "10+", label: "More than 10 years" }
        ]}
      />
      <SelectField
        label="Do you have a professional counselling certification?"
        id="has_certification"
        required
        placeholder="Select option"
        options={[
          { value: "true", label: "Yes" },
          { value: "false", label: "No" }
        ]}
      />
      <FormField 
        label="Denomination" 
        id="denomination" 
        required 
      />
      <SelectField
        label="Will you be present at YMR 2024 - FLOODGATES?"
        id="will_attend_ymr_2024"
        required
        placeholder="Select option"
        options={[
          { value: "true", label: "Yes" },
          { value: "false", label: "No" }
        ]}
      />
      <SelectField
        label="Are you available for interactions and further trainings?"
        id="is_available_for_training"
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