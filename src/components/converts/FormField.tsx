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
      rules={{ required: "This field is required" }}
      render={({ field }) => (
        <FormItem className="space-y-2 w-full">
          <FormLabel className="text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
            {hint && (
              <span className="block text-sm text-muted-foreground mt-0.5">
                {hint}
              </span>
            )}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              defaultValue={value}
              required={required}
              className={cn(
                "w-full bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200",
                className
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};