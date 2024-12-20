import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FormFieldProps } from "./types";

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