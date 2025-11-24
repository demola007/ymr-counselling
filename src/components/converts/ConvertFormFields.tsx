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
            hint="WhatsApp enabled (include your country code)"
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
            required 
            placeholder="Enter your country"
          />
          <FormField 
            label="State" 
            id="state" 
            required 
            placeholder="Enter your state"
          />
          <FormField 
            label="Address" 
            id="address" 
            required 
            placeholder="Enter your address"
            className="md:col-span-2"
          />
          <FormField 
            label="Nearest Bus Stop" 
            id="nearest_bus_stop" 
            required 
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
          <FormField 
            label="School" 
            id="school"
            placeholder="Enter your school (if applicable)"
          />
          <FormField 
            label="Occupation" 
            id="occupation" 
            required 
            placeholder="Enter your occupation"
          />
          <FormField 
            label="Denomination" 
            id="denomination" 
            required 
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
            defaultValue={isOnlineConvert ? "true" : "false"}
          />
        </div>
      </div>
    </div>
  );
};