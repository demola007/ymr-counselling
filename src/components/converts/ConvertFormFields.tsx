import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  className?: string;
  hint?: string;
}

export const FormField = ({ 
  label, 
  id, 
  type = "text", 
  required = false,
  placeholder,
  disabled,
  value,
  className,
  hint
}: FormFieldProps) => {
  const { register } = useFormContext();
  
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={id} className="text-gray-700">
        {label}
        {hint && (
          <span className="block text-sm text-muted-foreground mt-0.5">
            {hint}
          </span>
        )}
      </Label>
      <Input
        {...register(id, { required })}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        defaultValue={value}
        className={cn(
          "w-full bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200",
          className
        )}
      />
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  id: string;
  required?: boolean;
  options: { value: string; label: string; }[];
  placeholder?: string;
}

export const SelectField = ({
  label,
  id,
  required = false,
  options,
  placeholder
}: SelectFieldProps) => {
  const { register } = useFormContext();
  
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={id} className="text-gray-700">{label}</Label>
      <Select {...register(id, { required })}>
        <SelectTrigger 
          className="w-full bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="hover:bg-purple-50"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export const ConvertFormFields = ({ form, isOnlineConvert }: { form: any, isOnlineConvert: boolean }) => {
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
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" }
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
          { value: "Single", label: "Single" },
          { value: "Married", label: "Married" },
          { value: "Other", label: "Other" }
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
      <FormField 
        label="Online Convert" 
        id="online_convert" 
        value={isOnlineConvert ? "Yes" : "No"} 
        disabled 
        className="bg-gray-100"
      />
    </div>
  );
};