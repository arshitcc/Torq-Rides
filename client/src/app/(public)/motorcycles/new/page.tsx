"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMotorcycleStore } from "@/store/motorcycle-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import {
  addMotorcycleSchema,
  type AddMotorcycleFormData,
} from "@/schemas/motorcycles.schema";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  X,
  Loader2Icon,
  ChevronsUpDown,
  Check,
  PlusCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { UserRolesEnum } from "@/types";
import type { AxiosError } from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";

// A more reusable and robust numeric input component
const NumericInput = ({
  field,
  isFloat = false,
  placeholder,
}: {
  field: any;
  isFloat?: boolean;
  placeholder?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = isFloat ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;
    if (regex.test(value)) {
      // For react-hook-form, it's better to pass the coerced number or undefined
      const numericValue = value === "" ? undefined : Number(value);
      field.onChange(numericValue);
    }
  };

  return (
    <Input
      {...field}
      value={field.value ?? ""}
      onChange={handleChange}
      placeholder={placeholder}
      className="border-yellow-primary/30 focus:border-yellow-primary"
    />
  );
};

export default function NewMotorcyclePage() {
  const { user, isAuthenticated } = useAuthStore();
  const { addMotorcycle, loading, filters } = useMotorcycleStore();
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<
    { file: File; preview: string }[]
  >([]);
  const [largePreview, setLargePreview] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<AddMotorcycleFormData>({
    resolver: zodResolver(addMotorcycleSchema),
    // Set undefined for numbers to allow empty inputs
    defaultValues: {
      make: "",
      vehicleModel: "",
      pricePerDayMonThu: undefined,
      pricePerDayFriSun: undefined,
      pricePerWeek: undefined,
      description: "",
      categories: [],
      variant: "",
      color: "",
      securityDeposit: undefined,
      kmsLimitPerDay: undefined,
      extraKmsCharges: undefined,
      availableInCities: [{ branch: "", quantity: undefined }], // Start with one
      specs: {
        engine: undefined,
        power: undefined,
        weight: undefined,
        seatHeight: undefined,
      },
    },
  });

  const {
    fields: branchFields,
    append: appendBranch,
    remove: removeBranch,
  } = useFieldArray({
    control: form.control,
    name: "availableInCities",
  });

  useEffect(() => {
    // Auth check
    if (!user) {
      return;
    }
    if (isAuthenticated === false) {
      router.push("/login");
    } else if (user && user.role !== UserRolesEnum.ADMIN) {
      toast.warning("Access Denied: Admins only.");
      router.push("/");
    }
  }, [user, isAuthenticated, router]);

  useEffect(() => {
    // Cleanup image preview URLs
    return () => {
      selectedImages.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [selectedImages]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category]);
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category));
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (selectedImages.length + files.length > 5) {
      toast.error("A maximum of 5 images are allowed.");
      return;
    }
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(selectedImages[index].preview);
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: AddMotorcycleFormData) => {
    if (selectedImages.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    // RHF + Zod already validates this, but an extra check is fine
    if (
      data.availableInCities.length === 0 ||
      !data.availableInCities.some((b) => b.quantity > 0)
    ) {
      toast.error("Please specify availability for at least one branch.");
      return;
    }

    setAdding(true);
    try {
      const formData = new FormData();
      selectedImages.forEach((image) => formData.append("images", image.file));

      // Append other data
      const submitData = {
        ...data,
        categories: selectedCategories,
      };

      Object.entries(submitData).forEach(([key, value]) => {
        const valueToAppend =
          typeof value === "object" ? JSON.stringify(value) : String(value);
        formData.append(key, valueToAppend);
      });

      await addMotorcycle(formData);
      toast.success("Motorcycle added successfully!");
      router.push("/dashboard?tab=motorcycles");
    } catch (error: AxiosError | any) {
      toast.error(error.response?.data?.message ?? "Failed to add motorcycle.");
    } finally {
      setAdding(false);
    }
  };

  const availableCategories = filters.categories.some((c) => c === "ELECTRIC")
    ? filters.categories
    : [...filters.categories, "ELECTRIC"];
  const availableMakes = filters.makes;
  const availableBranches = filters.distinctCities;
  const availableModels = filters.models;

  if (!user || user.role !== UserRolesEnum.ADMIN) return null;

  return (
    <div
      className={`container mx-auto max-w-4xl px-4 py-8 ${loading} && "opacity-50" `}
    >
      <Dialog open={!!largePreview} onOpenChange={() => setLargePreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="relative h-[70vh] w-full">
            {largePreview && (
              <Image
                src={largePreview}
                alt="Large preview"
                layout="fill"
                objectFit="contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ... (Header and Back button as in the previous example) ... */}
      <div className="mb-8">
        <Link href="/dashboard?tab=motorcycles">
          <Button variant="outline" className="mb-4 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-yellow-primary">
          Add New Motorcycle
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Add a new motorcycle to your fleet
        </p>
      </div>

      <Card className="border-yellow-primary/20">
        <CardHeader>
          <CardTitle>Add New Motorcycle</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Info Accordion */}
              {/* Using collapsible sections for better UI on smaller screens */}
              <div className="space-y-6 rounded-lg border p-4">
                <h3 className="text-lg font-semibold text-yellow-primary">
                  Basic Information
                </h3>
                {/* ... (Make Combobox and other basic fields as in previous example) ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="make"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Make *</FormLabel>
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
                                {field.value || "Select or type a make"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[250px] lg:w-[300px] max-h-60 p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search or add new make..."
                                onValueChange={(search) => {
                                  // Allow free text entry
                                  field.onChange(search);
                                }}
                                value={field.value}
                              />
                              <CommandEmpty>No make found.</CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                  {availableMakes.map((make) => (
                                    <CommandItem
                                      value={make}
                                      key={make}
                                      onSelect={() => {
                                        form.setValue("make", make);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          make === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {make}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vehicleModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model *</FormLabel>
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
                                {field.value || "Select or type a model"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[250px] lg:w-[300px] max-h-60 p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search or add new model..."
                                onValueChange={(search) => {
                                  // Allow free text entry
                                  field.onChange(search);
                                }}
                                value={field.value}
                              />
                              <CommandEmpty>No make found.</CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                  {availableModels.map((model) => (
                                    <CommandItem
                                      value={model}
                                      key={model}
                                      onSelect={() => {
                                        form.setValue("vehicleModel", model);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          model === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {model}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="variant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variant *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Standard"
                            {...field}
                            className="border-yellow-primary/30 focus:border-yellow-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Black"
                            {...field}
                            className="border-yellow-primary/30 focus:border-yellow-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Categories *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableCategories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) =>
                            handleCategoryChange(category, checked as boolean)
                          }
                          className="data-[state=checked]:border-transparent data-[state=checked]:bg-yellow-500"
                        />
                        <Label
                          htmlFor={`category-${category}`}
                          className="text-sm"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedCategories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedCategories.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() =>
                              handleCategoryChange(category, false)
                            }
                            className="ml-1 text-yellow-600 hover:text-yellow-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the motorcycle features, comfort, and riding experience..."
                          {...field}
                          className="border-yellow-primary/30 focus:border-yellow-primary min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Pricing & Limits Section */}
              <div className="space-y-6 rounded-lg border p-4">
                <h3 className="text-lg font-semibold text-yellow-primary">
                  Pricing & Limits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pricePerDayMonThu"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Price for Days (Monday to Thursday) (₹) *
                        </FormLabel>
                        <FormControl>
                          <NumericInput
                            field={field}
                            placeholder="e.g., 2000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pricePerDayFriSun"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Price for Days (Friday to Sunday) (₹) *
                        </FormLabel>
                        <FormControl>
                          <NumericInput
                            field={field}
                            placeholder="e.g., 2000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pricePerWeek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weekly Rental Price (₹) *</FormLabel>
                        <FormControl>
                          <NumericInput
                            field={field}
                            placeholder="e.g., 2000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="securityDeposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security Deposit (₹) *</FormLabel>
                        <FormControl>
                          <NumericInput
                            field={field}
                            placeholder="e.g., 12000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="kmsLimitPerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KMS Limit per Day (kms) *</FormLabel>
                        <FormControl>
                          <NumericInput field={field} placeholder="e.g., 100" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="extraKmsCharges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extra KMS Charges (₹/km) *</FormLabel>
                        <FormControl>
                          <NumericInput field={field} placeholder="e.g., 10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Specifications Section */}
              <div className="space-y-6 rounded-lg border p-4">
                <h3 className="text-lg font-semibold text-yellow-primary">
                  Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="specs.engine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine (cc)*</FormLabel>
                        <FormControl>
                          <NumericInput
                            field={field}
                            isFloat
                            placeholder="e.g., 349.5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="specs.power"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Power (ps)*</FormLabel>
                        <FormControl>
                          <NumericInput
                            field={field}
                            isFloat
                            placeholder="e.g., 57.5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="specs.weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)*</FormLabel>
                        <FormControl>
                          <NumericInput
                            field={field}
                            isFloat
                            placeholder="e.g., 194.5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="specs.seatHeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seat Height (mm)*</FormLabel>
                        <FormControl>
                          <NumericInput
                            field={field}
                            isFloat
                            placeholder="e.g., 760 mm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* ... other spec fields using NumericInput with isFloat */}
                </div>
              </div>

              {/* Branch Availability with useFieldArray */}
              <div className="space-y-6 rounded-lg border p-4">
                <h3 className="text-lg font-semibold text-yellow-primary">
                  Branch Availability
                </h3>
                <div className="space-y-4">
                  {branchFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex flex-col md:flex-row items-start gap-2"
                    >
                      <FormField
                        control={form.control}
                        name={`availableInCities.${index}.branch`}
                        render={({ field }) => (
                          <FormItem className="w-full md:w-3/4">
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
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                                        {availableBranches.map((branch) => (
                                          <CommandItem
                                            value={branch}
                                            key={branch}
                                            onSelect={() => {
                                              form.setValue(
                                                `availableInCities.${index}.branch`,
                                                branch
                                              );
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                branch === field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {branch}
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
                        control={form.control}
                        name={`availableInCities.${index}.quantity`}
                        render={({ field: qtyField }) => (
                          <FormItem className="w-full md:w-1/4">
                            <FormControl>
                              <NumericInput
                                field={qtyField}
                                placeholder="Quantity"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeBranch(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendBranch({ branch: "", quantity: 0 })}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Branch
                </Button>
              </div>

              {/* ... (Image upload and preview section is identical to the first example) ... */}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-primary">
                  Images * (Max 5)
                </h3>
                <div className="border-2 border-dashed border-yellow-primary/30 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                    className="hidden"
                    id="images"
                    ref={fileInputRef}
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-yellow-primary mx-auto mb-2" />
                    <p>Click to upload</p>
                  </label>
                </div>
                {selectedImages.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={image.preview}
                          alt={`preview ${index}`}
                          width={100}
                          height={100}
                          className="rounded-md object-cover h-24 w-24 cursor-pointer"
                          onClick={() => setLargePreview(image.preview)}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-75 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-6">
                {/* ... (Submit and Cancel buttons are identical) ... */}
                <Link href="/dashboard?tab=motorcycles" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={adding}
                  className="flex-1 bg-yellow-primary hover:bg-yellow-600 text-white"
                >
                  {adding ? (
                    <Loader2Icon className="animate-spin h-4 w-4" />
                  ) : (
                    "Add Motorcycle"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
