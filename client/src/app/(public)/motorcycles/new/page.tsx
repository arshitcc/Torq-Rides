"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMotorcycleStore } from "@/store/motorcycle-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import {
  addMotorcycleSchema,
  type AddMotorcycleFormData,
} from "@/schemas/motorcycles.schema";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2, X, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { UserRolesEnum } from "@/types";
import type { AxiosError } from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function NewMotorcyclePage() {
  const { user, isAuthenticated } = useAuthStore();
  const { addMotorcycle, loading, filters } = useMotorcycleStore();
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [branchQuantities, setBranchQuantities] = useState<
    { branch: string; quantity: number }[]
  >([]);

  const [adding, setAdding] = useState(false);

  const form = useForm<AddMotorcycleFormData>({
    resolver: zodResolver(addMotorcycleSchema),
    defaultValues: {
      make: "",
      vehicleModel: "",
      rentPerDay: 0,
      description: "",
      categories: [],
      variant: "",
      color: "",
      securityDeposit: 0,
      kmsLimitPerDay: 100,
      extraKmsCharges: 5,
      availableInCities: [],
      specs: {
        engine: 0,
        power: 0,
        weight: 0,
        seatHeight: 0,
      },
    },
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    if (!user || user.role !== UserRolesEnum.ADMIN) {
      toast.warning("Access Denied !!");
      router.push("/");
      return;
    }

    // Initialize branch quantities with available cities
    if (filters.distinctCities?.length > 0) {
      setBranchQuantities(
        filters.distinctCities.map((city) => ({ branch: city, quantity: 0 }))
      );
    }
  }, [user, router, toast, filters.distinctCities]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category]);
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category));
    }
  };

  const handleBranchQuantityChange = (branch: string, quantity: number) => {
    setBranchQuantities((prev) =>
      prev.map((item) =>
        item.branch === branch ? { ...item, quantity } : item
      )
    );
  };

  const onSubmit = async (data: AddMotorcycleFormData) => {
    if (selectedImages.length === 0) {
      toast.error("Please select at least one image for the motorcycle.");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category.");
      return;
    }

    const validBranches = branchQuantities.filter((item) => item.quantity > 0);
    if (validBranches.length === 0) {
      toast.error("Please set quantity for at least one branch.");
      return;
    }

    try {
      setAdding(true);
      const formData = new FormData();

      // Add images
      selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      // Add form data
      const submitData = {
        ...data,
        categories: selectedCategories,
        availableInCities: validBranches,
      };

      Object.entries(submitData).forEach(([key, value]) => {
        if (key === "specs" && typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "categories" || key === "availableInCities") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });

      await addMotorcycle(formData);
      toast.success("Motorcycle added successfully!");
      router.push("/dashboard?tab=motorcycles");
    } catch (error: AxiosError | any) {
      toast.error(
        error.response?.data?.message ??
          "Failed to add motorcycle. Please try again."
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-primary" />
        </div>
      </div>
    );
  }

  if (!user || user.role !== UserRolesEnum.ADMIN) {
    return null;
  }

  const availableCategories = filters.categories;
  const availableMakes = filters.makes;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
          <CardTitle>Motorcycle Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-primary">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Make * (Enter The Correct Brand Name)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Royal Enfield"
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
                    name="vehicleModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model *</FormLabel>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Categories */}
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

              {/* Pricing Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-primary">
                  Pricing & Limits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rentPerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rent per Day (₹) *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (isNaN(val)) field.onChange(1);
                              if (!isNaN(val) && val >= 0) field.onChange(val);
                              else field.onChange(0);
                            }}
                            className="border-yellow-primary/30 focus:border-yellow-primary"
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
                          <Input
                            {...field}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (isNaN(val)) field.onChange(1);
                              if (!isNaN(val) && val >= 0) field.onChange(val);
                              else field.onChange(0);
                            }}
                            className="border-yellow-primary/30 focus:border-yellow-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="kmsLimitPerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KMS Limit per Day *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (isNaN(val)) field.onChange(1);
                              if (!isNaN(val) && val >= 0) field.onChange(val);
                              else field.onChange(0);
                            }}
                            className="border-yellow-primary/30 focus:border-yellow-primary"
                          />
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
                          <Input
                            step="0.01"
                            {...field}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (isNaN(val)) field.onChange(1);
                              if (!isNaN(val) && val >= 0) field.onChange(val);
                              else field.onChange(0);
                            }}
                            className="border-yellow-primary/30 focus:border-yellow-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-primary">
                  Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="specs.engine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine (cc) *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="749"
                            {...field}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (isNaN(val)) field.onChange(1);
                              if (!isNaN(val) && val >= 0) field.onChange(val);
                              else field.onChange(0);
                            }}
                            className="border-yellow-primary/30 focus:border-yellow-primary"
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
                        <FormLabel>Power (ps) *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="53"
                            {...field}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (isNaN(val)) field.onChange(1);
                              if (!isNaN(val) && val >= 0) field.onChange(val);
                              else field.onChange(0);
                            }}
                            className="border-yellow-primary/30 focus:border-yellow-primary"
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
                        <FormLabel>Weight (kg) *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="233"
                            {...field}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (isNaN(val)) field.onChange(1);
                              if (!isNaN(val) && val >= 0) field.onChange(val);
                              else field.onChange(0);
                            }}
                            className="border-yellow-primary/30 focus:border-yellow-primary"
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
                        <FormLabel>Seat Height (mm) *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="765"
                            {...field}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (isNaN(val)) field.onChange(1);
                              if (!isNaN(val) && val >= 0) field.onChange(val);
                              else field.onChange(0);
                            }}
                            className="border-yellow-primary/30 focus:border-yellow-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Branch Quantities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-primary">
                  Branch Availability
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {branchQuantities.map((item) => (
                    <div
                      key={item.branch}
                      className="flex items-center space-x-3"
                    >
                      <Label className="w-1/2">{item.branch}</Label>
                      <Input
                        placeholder="0"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (isNaN(val)) return;
                          handleBranchQuantityChange(
                            item.branch,
                            Number(e.target.value)
                          );
                        }}
                        className="w-1/2 border-yellow-primary/30 focus:border-yellow-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-primary">
                  Images *
                </h3>
                <div className="border-2 border-dashed border-yellow-primary/30 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                    className="hidden"
                    id="images"
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-yellow-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload motorcycle images
                    </p>
                  </label>
                </div>

                {selectedImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Selected Images:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative dark:bg-[#18181B] rounded-lg p-2 text-xs flex items-center border-2 border-yellow-800"
                        >
                          <span className="mr-2">{image.name}</span>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-6">
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
