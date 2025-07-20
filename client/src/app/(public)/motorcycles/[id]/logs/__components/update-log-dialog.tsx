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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { UseFormReturn } from "react-hook-form";
import { UpdateMotorcycleLogFormData } from "@/schemas/motorcycle-logs.schema";
import { Input } from "@/components/ui/input";
import { NumericInput } from "../utils";
import { AvailableMotorcycleStatus } from "@/types";
import { cn } from "@/lib/utils";
import { useMotorcycleStore } from "@/store/motorcycle-store";
import { useState } from "react";

interface UpdateMotorcycleLogDialogProps {
  showUpdateLogDialog: boolean;
  handleUpdateLog: (data: UpdateMotorcycleLogFormData) => void;
  setShowUpdateLogDialog: React.Dispatch<React.SetStateAction<boolean>>;
  updateLogForm: UseFormReturn<UpdateMotorcycleLogFormData>;
}

function UpdateMotorcycleLogDialog({
  showUpdateLogDialog,
  setShowUpdateLogDialog,
  updateLogForm,
  handleUpdateLog,
}: UpdateMotorcycleLogDialogProps) {
  const { motorcycle } = useMotorcycleStore();
  const [dateInOpen, setDateInOpen] = useState(false);
  const [dateOutOpen, setDateOutOpen] = useState(false);
  return (
    <Dialog open={showUpdateLogDialog} onOpenChange={setShowUpdateLogDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Maintenance Log</DialogTitle>
          <DialogDescription>
            Update the maintenance log details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...updateLogForm}>
          <form
            onSubmit={updateLogForm.handleSubmit(handleUpdateLog)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={updateLogForm.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., UP62K3703"
                        {...field}
                        className="border-yellow-primary/30 focus:border-yellow-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateLogForm.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between border-yellow-primary/30",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value || "Select or type a Branch"}
                              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] lg:w-[300px] max-h-60 p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search or add new Branch..."
                              onValueChange={(search) => {
                                // Allow free text entry
                                field.onChange(search);
                              }}
                              value={field.value}
                            />
                            <CommandEmpty>No make found.</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {motorcycle?.availableInCities.map((city) => (
                                  <CommandItem
                                    value={city.branch}
                                    key={city.branch}
                                    onSelect={() => {
                                      updateLogForm.setValue(
                                        "branch",
                                        city.branch
                                      );
                                    }}
                                  >
                                    <CheckIcon
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        city.branch === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {city.branch}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateLogForm.control}
                name="dateIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date In</FormLabel>
                    <FormControl>
                      <Popover open={dateInOpen} onOpenChange={setDateInOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(field.value, "MMM dd, yyyy")
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setDateInOpen(false);
                            }}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateLogForm.control}
                name="dateOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Out</FormLabel>
                    <FormControl>
                      <Popover open={dateOutOpen} onOpenChange={setDateOutOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(field.value, "MMM dd, yyyy")
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setDateOutOpen(false);
                            }}
                            disabled={(date) =>
                              date < new Date() ||
                              (updateLogForm.watch("dateIn") ?? new Date(0)) >
                                date
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateLogForm.control}
                name="serviceCentreName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Centre Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Royal Enfield Service Center"
                        {...field}
                        className="border-yellow-primary/30 focus:border-yellow-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateLogForm.control}
                name="thingsToDo.odoReading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ODO Reading (km)</FormLabel>
                    <FormControl>
                      <NumericInput field={field} placeholder="e.g., 2000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={updateLogForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full border-yellow-primary/30 focus:border-yellow-primary">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AvailableMotorcycleStatus.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateLogForm.control}
                name="billAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bill Amount (₹)</FormLabel>
                    <FormControl>
                      <NumericInput field={field} placeholder="e.g., 2000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Service Checklist */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-primary">
                Service Checklist
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={updateLogForm.control}
                  name="thingsToDo.scheduledService"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-yellow-primary/20 p-4">
                      <FormControl>
                        <Checkbox
                          className="border-1 border-yellow-400 data-[state=checked]:border-transparent data-[state=checked]:bg-yellow-500"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Scheduled Service</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateLogForm.control}
                  name="thingsToDo.brakePads"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-yellow-primary/20 p-4">
                      <FormControl>
                        <Checkbox
                          className="border-1 border-yellow-400 data-[state=checked]:border-transparent data-[state=checked]:bg-yellow-500"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Brake Pads</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateLogForm.control}
                  name="thingsToDo.chainSet"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-yellow-primary/20 p-4">
                      <FormControl>
                        <Checkbox
                          className="border-1 border-yellow-400 data-[state=checked]:border-transparent data-[state=checked]:bg-yellow-500"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Chain Set</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateLogForm.control}
                  name="thingsToDo.clutchWork"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-yellow-primary/20 p-4">
                      <FormControl>
                        <Checkbox
                          className="border-1 border-yellow-400 data-[state=checked]:border-transparent data-[state=checked]:bg-yellow-500"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Clutch Work</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={updateLogForm.control}
                  name="thingsToDo.damageRepair"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-yellow-primary/20 p-4">
                      <FormControl>
                        <Checkbox
                          className="border-1 border-yellow-400 data-[state=checked]:border-transparent data-[state=checked]:bg-yellow-500"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Damage Repair</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                {updateLogForm.watch("thingsToDo.damageRepair") && (
                  <FormField
                    control={updateLogForm.control}
                    name="thingsToDo.damageDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Damage Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the damage..."
                            {...field}
                            className="border-yellow-primary/30 focus:border-yellow-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={updateLogForm.control}
                  name="thingsToDo.other"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-yellow-primary/20 p-4">
                      <FormControl>
                        <Checkbox
                          className="border-1 border-yellow-400 data-[state=checked]:border-transparent data-[state=checked]:bg-yellow-500"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Other</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                {updateLogForm.watch("thingsToDo.other") && (
                  <FormField
                    control={updateLogForm.control}
                    name="thingsToDo.otherDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe other work..."
                            {...field}
                            className="border-yellow-primary/30 focus:border-yellow-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <FormField
              control={updateLogForm.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-yellow-primary/20 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Make Available in Inventory
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Toggle this when the motorcycle is ready to be rented
                      again
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUpdateLogDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-yellow-primary hover:bg-yellow-600 text-white"
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

export default UpdateMotorcycleLogDialog;
