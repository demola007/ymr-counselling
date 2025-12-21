import { FormField } from "./FormField";
import { SelectField } from "./SelectField";

export { FormField, SelectField };

export const ConvertFormFields = ({ isOnlineConvert }: { isOnlineConvert: boolean }) => {
  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-army-green-light mb-4 pb-2 border-b border-army-green/20">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <FormField 
            label="Full Name"
            id="name" 
            placeholder="Enter your full name"
          />
          <FormField 
            label="Email Address"
            id="email" 
            type="email" 
            placeholder="your.email@example.com"
          />
          <FormField 
            label="Phone Number" 
            id="phone_number" 
            placeholder="+234 *********"
            hint="WhatsApp enabled (include your country code)"
          />
          <FormField 
            label="Date of Birth" 
            id="date_of_birth" 
            type="date" 
          />
          <SelectField
            label="Gender"
            id="gender"
            placeholder="Select gender"
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" }
            ]}
          />
          <SelectField
            label="Age Group"
            id="age_group"
            placeholder="Select age group"
            options={[
              { value: "18-24", label: "18-24" },
              { value: "25-34", label: "25-34" },
              { value: "35-44", label: "35-44" },
              { value: "45+", label: "45+" }
            ]}
          />
        </div>
      </div>

      {/* Location Information */}
      <div>
        <h3 className="text-lg font-semibold text-army-green-light mb-4 pb-2 border-b border-army-green/20">
          Location Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <FormField 
            label="Country" 
            id="country" 
            placeholder="Enter your country"
          />
          <FormField 
            label="State" 
            id="state" 
            placeholder="Enter your state"
          />
          <FormField 
            label="Address" 
            id="address" 
            placeholder="Enter your address"
            className="md:col-span-2"
          />
          <FormField 
            label="Nearest Bus Stop" 
            id="nearest_bus_stop" 
            placeholder="Enter nearest bus stop"
          />
        </div>
      </div>

      {/* Background Information */}
      <div>
        <h3 className="text-lg font-semibold text-army-green-light mb-4 pb-2 border-b border-army-green/20">
          Background Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <SelectField
            label="Relationship Status"
            id="relationship_status"
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
            placeholder="Select option"
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" }
            ]}
          />
          <FormField 
            label="School" 
            id="school"
            placeholder="Enter your school (if applicable)"
          />
          <FormField 
            label="Occupation" 
            id="occupation" 
            placeholder="Enter your occupation"
          />
          <FormField 
            label="Denomination" 
            id="denomination" 
            placeholder="Enter your denomination"
          />
        </div>
      </div>

      {/* Follow-up Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-army-green-light mb-4 pb-2 border-b border-army-green/20">
          Follow-up Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <SelectField
            label="Available for Follow-up"
            id="availability_for_follow_up"
            placeholder="Select option"
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" }
            ]}
          />
          <SelectField
            label="Online Convert"
            id="online"
            placeholder="Select option"
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" }
            ]}
            defaultValue={isOnlineConvert ? "true" : "false"}
          />
        </div>
      </div>
    </div>
  );
};