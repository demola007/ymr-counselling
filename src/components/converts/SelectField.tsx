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
  required = false,
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
                className="w-full h-11 bg-card/50 backdrop-blur-sm border border-army-green/30 text-foreground transition-all duration-200 focus:border-army-green focus:ring-2 focus:ring-army-green/20 focus:bg-card/70 data-[state=open]:border-army-green data-[state=open]:ring-2 data-[state=open]:ring-army-green/20"
              >
                <SelectValue placeholder={placeholder} className="text-muted-foreground/60" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-xl border-army-green/30">
                {options.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="text-foreground hover:bg-army-green/20 hover:text-army-green-light focus:bg-army-green/20 focus:text-army-green-light"
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