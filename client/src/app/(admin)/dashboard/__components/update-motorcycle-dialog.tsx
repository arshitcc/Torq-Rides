import { UpdateMotorcycleFormData } from "@/schemas/motorcycles.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface UpdateMotorcycleDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateMotorcycleForm: UseFormReturn<UpdateMotorcycleFormData>;
  onUpdateMotorcycle: (data: UpdateMotorcycleFormData) => void;
}

function UpdateMotorcycleDialog({
  open,
  setOpen,
  updateMotorcycleForm,
  onUpdateMotorcycle,
}: UpdateMotorcycleDialogProps) {
  useFormContext();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Motorcycle</DialogTitle>
          <DialogDescription>
            Update the motorcycle details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...updateMotorcycleForm}>
          <form
            onSubmit={updateMotorcycleForm.handleSubmit(onUpdateMotorcycle)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={updateMotorcycleForm.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Harley Davidson"
                        {...field}
                        className="border-yellow-primary/30 focus:border-yellow-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateMotorcycleForm.control}
                name="vehicleModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Street 750"
                        {...field}
                        className="border-yellow-primary/30 focus:border-yellow-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={updateMotorcycleForm.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="border-yellow-primary/30 focus:border-yellow-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateMotorcycleForm.control}
                name="rentPerDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rent per Day (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="border-yellow-primary/30 focus:border-yellow-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateMotorcycleForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-yellow-primary/30 focus:border-yellow-primary">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TOURING">Touring</SelectItem>
                        <SelectItem value="SPORTS">Sports</SelectItem>
                        <SelectItem value="CRUISER">Cruiser</SelectItem>
                        <SelectItem value="ADVENTURE">Adventure</SelectItem>
                        <SelectItem value="SCOOTER">Scooter</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={updateMotorcycleForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the motorcycle..."
                      {...field}
                      className="border-yellow-primary/30 focus:border-yellow-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-yellow-primary hover:bg-yellow-600 text-black"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateMotorcycleDialog;
