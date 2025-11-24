import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FormFieldProps } from "./types";
import { FormField as FormFieldUI, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export const FormField = ({ 
  label, 
  id, 
  type = "text", 
  required = true,
  placeholder,
  disabled,
  value,
  className,
  hint
}: FormFieldProps) => {
  const form = useFormContext();
  
  if (!form) {
    console.error('FormField must be used within a FormProvider');
    return null;
  }

  return (
    <FormFieldUI
      control={form.control}
      name={id}
      rules={{ required: required ? "This field is required" : false }}
      render={({ field }) => (
        <FormItem className="space-y-2 w-full">
          <FormLabel className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          {hint && (
            <p className="text-xs text-muted-foreground mb-2">
              {hint}
            </p>
          )}
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              defaultValue={value}
              required={required}
              className={cn(
                "w-full h-11",
                className
              )}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};