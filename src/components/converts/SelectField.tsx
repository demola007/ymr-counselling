import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectFieldProps } from "./types";
import { FormField as FormFieldUI, FormItem, FormLabel, FormControl } from "@/components/ui/form";

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
      render={({ field }) => (
        <FormItem className="space-y-2 w-full">
          <FormLabel className="text-gray-700">{label}</FormLabel>
          <FormControl>
            <Select 
              onValueChange={field.onChange} 
              value={field.value} 
              defaultValue={defaultValue}
            >
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
          </FormControl>
        </FormItem>
      )}
    />
  );
};