import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectFieldProps } from "./types";

export const SelectField = ({
  label,
  id,
  required = false,
  options,
  placeholder
}: SelectFieldProps) => {
  const { control } = useFormContext();
  
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={id} className="text-gray-700">{label}</Label>
      <Controller
        name={id}
        control={control}
        rules={{ required }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
        )}
      />
    </div>
  );
};