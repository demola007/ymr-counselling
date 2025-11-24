import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/converts/FormField";
import { SelectField } from "@/components/converts/SelectField";
import { PictureUploadField } from "./PictureUploadField";

export const CounselorFormFields = () => {
  const { watch, setValue } = useFormContext();
  const pictureUrl = watch("picture_url");

  return (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-army-gold-light pb-2 border-b border-army-gold/20">
          Profile Picture
        </h3>
        <PictureUploadField 
          value={pictureUrl}
          onChange={(value) => setValue("picture_url", value)}
          required
        />
      </div>

      {/* Personal Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-army-gold-light pb-2 border-b border-army-gold/20">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField 
            label="Full Name" 
            id="name" 
            required 
            placeholder="Enter your full name"
          />
          <FormField 
            label="Email Address" 
            id="email" 
            type="email" 
            required 
            placeholder="your.email@example.com"
          />
          <FormField 
            label="Phone Number" 
            id="phone_number" 
            required 
            placeholder="+234 *********"
            hint="WhatsApp enabled - include country code"
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
          />
          <FormField 
            label="Denomination" 
            id="denomination" 
            required 
            placeholder="Your church denomination"
          />
        </div>
      </div>

      {/* Location Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-army-gold-light pb-2 border-b border-army-gold/20">
          Location Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField 
            label="Country" 
            id="country" 
            required 
            placeholder="Your country"
          />
          <FormField 
            label="State/Province" 
            id="state" 
            required 
            placeholder="Your state or province"
          />
        </div>
        <FormField 
          label="Address" 
          id="address" 
          required 
          placeholder="Your full address"
        />
      </div>

      {/* Professional Background Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-army-gold-light pb-2 border-b border-army-gold/20">
          Professional Background
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Years of Experience"
            id="years_of_experience"
            type="number"
            required
            placeholder="Number of years"
          />
          <SelectField
            label="Professional Counselling Certification"
            id="has_certification"
            required
            placeholder="Select option"
            options={[
              { value: "true", label: "Yes, I have certification" },
              { value: "false", label: "No certification" }
            ]}
          />
        </div>
      </div>

      {/* Availability Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-army-gold-light pb-2 border-b border-army-gold/20">
          Availability & Commitment
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <SelectField
            label="Will you be present at YMR 2024 - FLOODGATES?"
            id="will_attend_ymr_2024"
            required
            placeholder="Select option"
            options={[
              { value: "true", label: "Yes, I will attend" },
              { value: "false", label: "No, I cannot attend" }
            ]}
          />
          <SelectField
            label="Are you available for interactions and further trainings?"
            id="is_available_for_training"
            required
            placeholder="Select option"
            options={[
              { value: "true", label: "Yes, I am available" },
              { value: "false", label: "No, I am not available" }
            ]}
          />
        </div>
      </div>
    </div>
  );
};