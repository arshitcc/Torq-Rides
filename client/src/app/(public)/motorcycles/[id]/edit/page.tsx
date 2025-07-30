"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMotorcycleStore } from "@/store/motorcycle-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import {
  addMotorcycleSchema,
  type AddMotorcycleFormData,
} from "@/schemas/motorcycles.schema";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  X,
  Loader2,
  ChevronsUpDown,
  Check,
  PlusCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { UserRolesEnum, type File as IFile } from "@/types";
import type { AxiosError } from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Reusable Numeric Input Component
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

export default function EditMotorcyclePage() {
  const { user, isAuthenticated } = useAuthStore();
  const {
    motorcycle,
    getMotorcycleById,
    updateMotorcycleDetails,
    deleteMotorcycleImage,
    loading,
    filters,
  } = useMotorcycleStore();
  const router = useRouter();
  const params = useParams();
  const motorcycleId = params.id as string;

  // State for image management
  const [existingImages, setExistingImages] = useState<IFile[]>([]);
  const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>(
    []
  );
  const [largePreview, setLargePreview] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imageToDelete, setImageToDelete] = useState<IFile | null>(null);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<AddMotorcycleFormData>({
    resolver: zodResolver(addMotorcycleSchema),
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
      availableInCities: [],
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
    replace: replaceBranches,
  } = useFieldArray({
    control: form.control,
    name: "availableInCities",
  });

  // Fetch data on component mount
  useEffect(() => {
    if (motorcycleId) {
      getMotorcycleById(motorcycleId);
    }
  }, [motorcycleId, getMotorcycleById]);

  // Populate form with fetched data
  useEffect(() => {
    if (motorcycle) {
      form.reset({
        make: motorcycle.make,
        vehicleModel: motorcycle.vehicleModel,
        pricePerDayMonThu: motorcycle.pricePerDayMonThu,
        pricePerDayFriSun: motorcycle.pricePerDayFriSun,
        pricePerWeek: motorcycle.pricePerWeek,
        description: motorcycle.description,
        categories: motorcycle.categories,
        variant: motorcycle.variant,
        color: motorcycle.color,
        securityDeposit: motorcycle.securityDeposit,
        kmsLimitPerDay: motorcycle.kmsLimitPerDay,
        extraKmsCharges: motorcycle.extraKmsCharges,
        specs: motorcycle.specs,
      });
      replaceBranches(motorcycle.availableInCities);
      setExistingImages(motorcycle.images || []);
      setSelectedCategories(motorcycle.categories);
    }
  }, [motorcycle, form, replaceBranches]);

  // Auth check
  useEffect(() => {
    if (isAuthenticated === false) return;

    if (user && user.role !== UserRolesEnum.ADMIN) {
      toast.warning("Access Denied: Admins only.");
      router.push("/");
    }
  }, [user, isAuthenticated, router]);

  // Cleanup new image preview URLs
  useEffect(() => {
    return () => {
      newImages.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [newImages]);

  const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + newImages.length + files.length;
    if (totalImages > 5) {
      toast.error("Cannot have more than 5 images in total.");
      return;
    }
    const newImageFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewImages((prev) => [...prev, ...newImageFiles]);
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newImages[index].preview);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleConfirmDelete = async () => {
    if (existingImages.length <= 1) {
      toast.error(
        "Cannot delete the last image. At least one image is required."
      );
      return;
    }
    if (!imageToDelete) return;

    try {
      await deleteMotorcycleImage(motorcycleId, imageToDelete.public_id);
      setExistingImages((prev) =>
        prev.filter((img) => img.public_id !== imageToDelete.public_id)
      );
      toast.success("Image deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete image.");
    } finally {
      setImageToDelete(null);
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category]);
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category));
    }
  };

  const onSubmit = async (data: AddMotorcycleFormData) => {
    if (existingImages.length + newImages.length === 0) {
      toast.error("At least one image is required.");
      return;
    }
    setUpdating(true);
    try {
      const formData = new FormData();
      newImages.forEach((img) => formData.append("images", img.file));

      Object.entries(data).forEach(([key, value]) => {
        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value)
        );
      });

      await updateMotorcycleDetails(motorcycleId, formData);
      toast.success("Motorcycle updated successfully!");
      router.push(`/dashboard?tab=motorcycles`);
    } catch (error: AxiosError | any) {
      toast.error(
        error.response?.data?.message ?? "Failed to update motorcycle."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading && !motorcycle) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-primary" />
      </div>
    );
  }

  const availableCategories = filters.categories.some((c) => c === "ELECTRIC")
    ? filters.categories
    : [...filters.categories, "ELECTRIC"];
  const availableMakes = filters.makes;
  const availableBranches = filters.distinctCities;
  const availableModels = filters.models;

  if (!user || user.role !== UserRolesEnum.ADMIN) return null;

  return (
    <div
      className={`container mx-auto max-w-4xl px-4 py-8 ${
        loading ? "opacity-50" : ""
      }`}
    >
      {/* Large Image Preview Dialog */}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!imageToDelete}
        onOpenChange={() => setImageToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              image from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mb-8">
        <Link href="/dashboard?tab=motorcycles">
          <Button variant="outline" className="mb-4 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-yellow-primary">
          Edit Motorcycle
        </h1>
        <p className="text-muted-foreground">
          Update details for {motorcycle?.make} {motorcycle?.vehicleModel}
        </p>
      </div>

      <Card className="border-yellow-primary/20">
        <CardHeader>
          <CardTitle>Motorcycle Details</CardTitle>
          <CardDescription>
            Make changes and click save when you're done.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* --- All form sections are identical to NewMotorcyclePage --- */}
              {/* --- The key difference is the Image Management section below --- */}

              {/* Basic Information */}
              <div className="space-y-6 rounded-lg border p-4">
                <h3 className="text-lg font-semibold text-yellow-primary">
                  Basic Information
                </h3>
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

              {/* Pricing & Limits */}
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

              {/* Specifications */}
              <div className="space-y-6 rounded-lg border p-4">
                <h3 className="text-lg font-semibold text-yellow-primary">
                  Specifications
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                </div>
              </div>

              {/* Branch Availability */}
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
                          <FormItem className="w-32">
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
                        variant="ghost"
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

              {/* --- Image Management Section --- */}
              <div className="space-y-6 rounded-lg border p-4">
                <h3 className="text-lg font-semibold text-yellow-primary">
                  Images (Total {existingImages.length + newImages.length} of 5)
                </h3>
                {/* Display Existing Images */}
                {existingImages.length > 0 && (
                  <div className="space-y-2">
                    <Label>Current Images</Label>
                    <div className="flex flex-wrap gap-4">
                      {existingImages.map((image) => (
                        <div key={image.public_id} className="relative group">
                          <Image
                            src={image.url}
                            alt="Existing motorcycle image"
                            width={100}
                            height={100}
                            className="rounded-md object-cover h-24 w-24 cursor-pointer"
                            onClick={() => setLargePreview(image.url)}
                          />
                          <button
                            type="button"
                            onClick={() => setImageToDelete(image)}
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Display New Image Previews */}
                {newImages.length > 0 && (
                  <div className="space-y-2">
                    <Label>New Images to Upload</Label>
                    <div className="flex flex-wrap gap-4">
                      {newImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image.preview}
                            alt={`New preview ${index}`}
                            width={100}
                            height={100}
                            className="rounded-md object-cover h-24 w-24 cursor-pointer"
                            onClick={() => setLargePreview(image.preview)}
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Upload Button */}
                {existingImages.length + newImages.length < 5 && (
                  <div className="border-2 border-dashed border-yellow-primary/30 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleNewImagesChange}
                      className="hidden"
                      id="images"
                      ref={fileInputRef}
                    />
                    <label htmlFor="images" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-yellow-primary mx-auto mb-2" />
                      <p>Click to upload new images</p>
                    </label>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-yellow-primary hover:bg-yellow-600 text-white"
                >
                  {updating ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    "Save Changes"
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
