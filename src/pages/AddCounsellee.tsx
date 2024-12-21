import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { FormField, SelectField } from "@/components/converts/ConvertFormFields";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CounselleeFormFields } from "@/components/counsellee/CounselleeFormFields";

const AddCounsellee = () => {
  const { toast } = useToast();
  const form = useForm();
  const isLoading = false;

  const onSubmit = async (data: any) => {
    // Handle form submission logic here
    try {
      // Submit data to your API or backend
      toast({
        title: "Success",
        description: "Counsellee registered successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error registering the counsellee.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Register for Counselling</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Welcome to YMR Counselling Unit - Please fill this short form providing your details, thereafter you can schedule your counselling session. God bless you
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Counsellee Information</CardTitle>
            </CardHeader>
            <CardContent>
              <CounselleeFormFields />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Counsellor Remarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FormField
                  label="Counsellor Name"
                  id="counsellor_name"
                  required
                />
                <div className="space-y-2">
                  <label className="text-gray-700">Counsellor Comments</label>
                  <textarea
                    {...form.register("counsellor_comments")}
                    className="w-full min-h-[100px] p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddCounsellee;
