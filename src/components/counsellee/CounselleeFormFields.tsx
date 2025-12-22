import { FormField } from "@/components/converts/FormField";
import { SelectField } from "@/components/converts/SelectField";
import { Textarea } from "@/components/ui/textarea";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { User, Mail, Phone, Calendar, MapPin, Briefcase, GraduationCap, Heart, MessageSquare } from "lucide-react";

export const CounselleeFormFields = () => {
  const form = useFormContext();
  
  return (
    <div className="space-y-8">
      {/* Personal Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-army-gold/20">
          <User className="h-4 w-4 text-army-gold" />
          <h3 className="text-sm font-medium text-army-gold uppercase tracking-wider">Personal Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <FormField 
            label="Full Name"
            id="name" 
            required 
            className="bg-background/50 border-border/40 focus:border-army-gold/50"
          />
          <FormField 
            label="Email Address"
            id="email" 
            type="email" 
            required 
            className="bg-background/50 border-border/40 focus:border-army-gold/50"
          />
          <FormField 
            label="Phone Number" 
            id="phone_number" 
            required 
            placeholder="+234 *********"
            hint="WhatsApp Enabled (e.g. +234 *********) Include country code"
            className="bg-background/50 border-border/40 focus:border-army-gold/50"
          />
          <FormField 
            label="Date of Birth" 
            id="date_of_birth" 
            type="date" 
            className="bg-background/50 border-border/40 focus:border-army-gold/50"
          />
          <SelectField
            label="Gender"
            id="gender"
            required
            placeholder="Select gender"
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" }
            ]}
          />
          <SelectField
            label="Relationship Status"
            id="relationship_status"
            placeholder="Select status"
            options={[
              { value: "single", label: "Single" },
              { value: "married", label: "Married" },
              { value: "other", label: "Other" }
            ]}
          />
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-army-gold/20">
          <MapPin className="h-4 w-4 text-army-gold" />
          <h3 className="text-sm font-medium text-army-gold uppercase tracking-wider">Location Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <FormField 
            label="Country" 
            id="country" 
            className="bg-background/50 border-border/40 focus:border-army-gold/50"
          />
          <FormField 
            label="State" 
            id="state" 
            className="bg-background/50 border-border/40 focus:border-army-gold/50"
          />
          <FormField 
            label="Address" 
            id="address" 
            className="bg-background/50 border-border/40 focus:border-army-gold/50"
          />
          <FormField 
            label="Nearest Bus Stop" 
            id="nearest_bus_stop" 
            className="bg-background/50 border-border/40 focus:border-army-gold/50"
          />
        </div>
      </div>

      {/* Education & Occupation Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-army-gold/20">
          <Briefcase className="h-4 w-4 text-army-gold" />
          <h3 className="text-sm font-medium text-army-gold uppercase tracking-wider">Education & Occupation</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <SelectField
            label="Are you a student?"
            id="is_student"
            placeholder="Select option"
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" }
            ]}
          />
          <SelectField
            label="Age Group"
            id="age_group"
            placeholder="Select age group"
            options={[
              { value: "under-18", label: "Under 18" },
              { value: "18-24", label: "18-24" },
              { value: "25-34", label: "25-34" },
              { value: "35-44", label: "35-44" },
              { value: "45+", label: "45+" }
            ]}
          />
          <FormField 
            label="School (if applicable)" 
            id="school"
            className="bg-background/50 border-border/40 focus:border-army-gold/50"
          />
          <FormField 
            label="Occupation" 
            id="occupation" 
            className="bg-background/50 border-border/40 focus:border-army-gold/50"
          />
          <FormField 
            label="Denomination" 
            id="denomination" 
            className="bg-background/50 border-border/40 focus:border-army-gold/50"
          />
        </div>
      </div>

      {/* Counselling Details Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-army-gold/20">
          <MessageSquare className="h-4 w-4 text-army-gold" />
          <h3 className="text-sm font-medium text-army-gold uppercase tracking-wider">Counselling Details</h3>
        </div>
        <div className="col-span-1 md:col-span-2">
          <FormItem className="space-y-2">
            <FormLabel className="text-foreground/80 font-medium">
              Reason for Counselling <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                {...form.register("counselling_reason")}
                className="min-h-[120px] bg-background/50 border-border/40 focus:border-army-gold/50 focus:ring-army-gold/20 resize-none text-foreground placeholder:text-muted-foreground"
                placeholder="Please describe the reason you're seeking counselling..."
                required
              />
            </FormControl>
            <p className="text-xs text-muted-foreground">
              Your information is kept strictly confidential
            </p>
          </FormItem>
        </div>
      </div>
    </div>
  );
};