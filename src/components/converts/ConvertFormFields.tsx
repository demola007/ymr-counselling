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
  <div className="space-y-2">
    <Label htmlFor={id} className="flex flex-col gap-1">
      {label}
      {hint && (
        <span className="text-sm text-muted-foreground">
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
      className={`${className} bg-white`}
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
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Select required={required}>
      <SelectTrigger id={id} className="bg-white">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);