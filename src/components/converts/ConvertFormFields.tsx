import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}: FormFieldProps) => (
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
      id={id}
      type={type}
      required={required}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      className={cn(
        "w-full bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200",
        className
      )}
    />
  </div>
);

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
}: SelectFieldProps) => (
  <div className="space-y-2 w-full">
    <Label htmlFor={id} className="text-gray-700">{label}</Label>
    <Select required={required}>
      <SelectTrigger 
        id={id} 
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