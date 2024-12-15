import { FormField, SelectField } from "./ConvertFormFields";

export const PersonalInfoSection = () => (
  <>
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
      id="phone" 
      required 
      placeholder="+234 *********"
      hint="WhatsApp Enabled (e.g. +234 *********) Kindly include your country code"
    />
    <FormField 
      label="Date of Birth" 
      id="dob" 
      type="date" 
      required 
      placeholder="DD/MM/YYYY"
    />
    <SelectField
      label="Gender"
      id="gender"
      required
      placeholder="Select gender"
      options={[
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" }
      ]}
    />
  </>
);

export const LocationSection = () => (
  <>
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
      id="busStop" 
      required 
    />
  </>
);

export const StatusSection = () => (
  <>
    <SelectField
      label="Relationship Status"
      id="relationship"
      required
      placeholder="Select status"
      options={[
        { value: "Single", label: "Single" },
        { value: "Married", label: "Married" },
        { value: "Divorced", label: "Divorced" }
      ]}
    />
    <SelectField
      label="Are you a student?"
      id="isStudent"
      required
      placeholder="Select option"
      options={[
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" }
      ]}
    />
    <SelectField
      label="Age Group"
      id="ageGroup"
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
  </>
);

export const AdditionalInfoSection = () => (
  <>
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
    <SelectField
      label="Available for Follow-up"
      id="followUp"
      required
      placeholder="Select option"
      options={[
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" }
      ]}
    />
  </>
);