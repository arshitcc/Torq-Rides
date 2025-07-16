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
  UpdateMotorcycleFormData,
  updateMotorcycleSchema,
  type AddMotorcycleFormData,
} from "@/schemas/motorcycles.schema";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeftIcon,
  PlusIcon,
  XIcon,
  Loader2Icon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { File as IFile, UserRolesEnum } from "@/types";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function EditMotorcyclePage() {
  const { user, isAuthenticated } = useAuthStore();
  const {
    motorcycle,
    updateMotorcycleDetails,
    filters,
    deleteMotorcycleImage,
    getMotorcycleById,
    loading,
  } = useMotorcycleStore();
  const router = useRouter();
  const params = useParams();
  const motorcycleId = params.id as string;

  const [selectedImages, setSelectedImages] = useState<IFile[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [mainImage, setMainImage] = useState<IFile | null>(null);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [branchQuantities, setBranchQuantities] = useState<
    { branch: string; quantity: number }[]
  >([]);

  const form = useForm<AddMotorcycleFormData>({
    resolver: zodResolver(addMotorcycleSchema),
    defaultValues: {
      make: motorcycle?.make || "",
      vehicleModel: motorcycle?.vehicleModel || "",
      availableInCities: motorcycle?.availableInCities || [],
      rentPerDay: motorcycle?.rentPerDay || 0,
      description: motorcycle?.description || "",
      categories: motorcycle?.categories || [],
      variant: motorcycle?.variant || "",
      color: motorcycle?.color || "",
      securityDeposit: motorcycle?.securityDeposit || 0,
      kmsLimitPerDay: motorcycle?.kmsLimitPerDay || 0,
      extraKmsCharges: motorcycle?.extraKmsCharges || 0,
      specs: {
        engine: motorcycle?.specs.engine || 0,
        power: motorcycle?.specs.power || 0,
        weight: motorcycle?.specs.weight || 0,
        seatHeight: motorcycle?.specs.seatHeight || 0,
      },
    },
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!user || user.role !== UserRolesEnum.ADMIN) {
      router.push("/");
      return;
    }

    if (motorcycleId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      getMotorcycleById(motorcycleId.toString());
    }
  }, [motorcycleId, user]);

  useEffect(() => {
    if (!motorcycle) return;

    // reset all the form fields to match the store
    form.reset({
      make: motorcycle.make,
      vehicleModel: motorcycle.vehicleModel,
      categories: motorcycle.categories,
      rentPerDay: motorcycle.rentPerDay,
      description: motorcycle.description,
      variant: motorcycle.variant,
      color: motorcycle.color,
      securityDeposit: motorcycle.securityDeposit,
      kmsLimitPerDay: motorcycle.kmsLimitPerDay,
      extraKmsCharges: motorcycle.extraKmsCharges,
      specs: {
        engine: motorcycle.specs.engine,
        power: motorcycle.specs.power,
        weight: motorcycle.specs.weight,
        seatHeight: motorcycle.specs.seatHeight,
      },
    });

    // populate your image state

    setBranchQuantities(motorcycle.availableInCities);
    setSelectedCategories(motorcycle.categories);
    if (motorcycle?.images?.length) {
      setSelectedImages(motorcycle?.images);
    } else {
      setSelectedImages([]);
      setMainImage(null);
    }
  }, [motorcycle, form]);

  const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (imagePublicId: string) => {
    if (selectedImages.length <= 1) {
      toast.error(
        "Cannot delete the last image. At least one image is required."
      );
      return;
    }

    setDeletingImage(imagePublicId);
    try {
      await deleteMotorcycleImage(motorcycleId, imagePublicId);
      // Update local state
      const updatedImages = selectedImages.filter(
        (img) => img.public_id !== imagePublicId
      );
      setSelectedImages(updatedImages);

      // If deleted image was main image, set new main image
      if (mainImage?.public_id === imagePublicId && updatedImages.length > 0) {
        setMainImage(updatedImages[0]);
      }
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
    } finally {
      setDeletingImage(null);
    }
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

  const removeBranch = (branch: string) => {
    setBranchQuantities((prev) =>
      prev.filter((item) => item.branch !== branch)
    );
  };

  const onSubmit = async (data: UpdateMotorcycleFormData) => {
    try {
      const res = updateMotorcycleSchema.safeParse(data);
      if (!res.success) {
        toast.error(res.error.issues[0].message);
        return;
      }

      const validBranches = branchQuantities.filter(
        (item) => item.quantity > 0
      );
      if (validBranches.length === 0) {
        toast.error("Please set quantity for at least one branch.");
        return;
      }
      const formData = new FormData();

      // Add new images if any
      newImages.forEach((image) => {
        formData.append(`images`, image);
      });

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

      await updateMotorcycleDetails(motorcycleId, formData);
      toast.success("Motorcycle updated successfully!");
      router.push(`/motorcycles/${motorcycleId}`);
    } catch (error) {
      toast.error("Failed to update motorcycle. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <Loader2Icon className="h-8 w-8 animate-spin text-yellow-primary" />
        </div>
      </div>
    );
  }

  if (!user || user.role !== UserRolesEnum.ADMIN) {
    return null;
  }

  const availableCategories = filters.categories;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="outline" className="mb-4 bg-transparent">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-semibold mb-2 bg-clip-text text-yellow-primary">
          Edit Motorcycle
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Update motorcycle details and manage images
        </p>
      </div>

      <Card className="border-yellow-primary/20">
        <CardHeader>
          <CardTitle>Motorcycle Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(form.getValues());
              }}
              className="space-y-6"
            >
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
                        <FormLabel>Make *</FormLabel>
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
                            <XIcon className="h-3 w-3" />
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
                            min="0"
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
                            min="0"
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
                            min="1"
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
                            min="0"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="specs.engine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 749cc"
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
                    name="specs.power"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Power *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 53 HP"
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
                    name="specs.weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 233 kg"
                            {...field}
                            className="border-yellow-primary/30 focus:border-yellow-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-yellow-primary">
                    Branch Availability
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {branchQuantities.map((item) => (
                    <div
                      key={item.branch}
                      className="flex items-center space-x-3"
                    >
                      <Label className="w-1/2">{item.branch}</Label>
                      <Input
                        min="0"
                        placeholder="0"
                        value={item.quantity}
                        onChange={(e) =>
                          handleBranchQuantityChange(
                            item.branch,
                            Number(e.target.value)
                          )
                        }
                        className="border-yellow-primary/30 focus:border-yellow-primary"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeBranch(item.branch)}
                        className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images Management */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-primary">
                  Images Management
                </h3>

                {/* Current Images */}
                {selectedImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Current Images
                    </label>

                    {/* Other Images */}
                    {selectedImages.length > 0 && (
                      <div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {selectedImages.map((image, index) => (
                            <div
                              key={image.public_id}
                              className="relative group"
                            >
                              <Image
                                src={image.url || "/placeholder.svg"}
                                alt={`Motorcycle image ${index + 2}`}
                                width={200}
                                height={200}
                                className="rounded-lg object-fit w-full h-24"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteExistingImage(image.public_id)
                                }
                                disabled={deletingImage === image.public_id}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                              >
                                {deletingImage === image.public_id ? (
                                  <Loader2Icon className="h-3 w-3 animate-spin" />
                                ) : (
                                  <XIcon className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Add New Images */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Add New Images
                  </label>
                  <div className="border-2 border-dashed border-yellow-primary/30 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleNewImagesChange}
                      className="hidden"
                      id="new-images"
                    />
                    <label htmlFor="new-images" className="cursor-pointer">
                      <PlusIcon className="h-8 w-8 text-yellow-primary mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to add new images
                      </p>
                    </label>
                  </div>

                  {newImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">
                        New Images to Upload:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {newImages.map((image, index) => (
                          <div
                            key={index}
                            className="relative bg-gray-100 rounded-lg p-2 text-xs"
                          >
                            <span>{image.name}</span>
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Link href="/dashboard">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 cursor-pointer bg-yellow-primary hover:bg-yellow-600 text-white"
                >
                  {loading ? "Updating..." : "Update Motorcycle"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
