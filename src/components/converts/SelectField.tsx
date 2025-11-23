import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectFieldProps } from "./types";
import { FormField as FormFieldUI, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export const SelectField = ({
  label,
  id,
  required = true,
  options,
  placeholder,
  defaultValue
}: SelectFieldProps) => {
  const form = useFormContext();
  
  if (!form) {
    console.error('SelectField must be used within a FormProvider');
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
          <FormControl>
            <Select 
              onValueChange={field.onChange} 
              value={field.value} 
              defaultValue={defaultValue}
            >
              <SelectTrigger 
                className="w-full h-11 bg-background border-border transition-colors focus:border-army-green focus:ring-2 focus:ring-army-green/20"
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {options.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="hover:bg-accent hover:text-accent-foreground"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};