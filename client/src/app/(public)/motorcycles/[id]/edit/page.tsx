"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  UpdateMotorcycleFormData,
  type AddMotorcycleFormData,
} from "@/schemas/motorcycles.schema";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeftIcon, PlusIcon, XIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { File as IFile, UserRolesEnum } from "@/types";

export default function EditMotorcyclePage() {
  const { user, isAuthenticated } = useAuthStore();
  const {
    motorcycle,
    updateMotorcycleDetails,
    updateMotorcycleAvailability,
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

  const form = useForm<AddMotorcycleFormData>({
    resolver: zodResolver(addMotorcycleSchema),
    defaultValues: {
      make: motorcycle?.make || "",
      vehicleModel: motorcycle?.vehicleModel || "",
      year: motorcycle?.year || new Date().getFullYear(),
      rentPerDay: motorcycle?.rentPerDay || 0,
      description: motorcycle?.description || "",
      category: motorcycle?.category || "TOURING",
      variant: motorcycle?.variant || "",
      color: motorcycle?.color || "",
      securityDeposit: motorcycle?.securityDeposit || 0,
      kmsLimitPerDay: motorcycle?.kmsLimitPerDay || 100,
      extraKmsCharges: motorcycle?.extraKmsCharges || 5,
      availableQuantity: motorcycle?.availableQuantity || 1,
      specs: {
        engine: motorcycle?.specs.engine || "",
        power: motorcycle?.specs.power || "",
        weight: motorcycle?.specs.weight || "",
      },
      isAvailable: motorcycle?.isAvailable || true,
    },
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!user || user.role !== UserRolesEnum.ADMIN) {
      router.push("/");
      return;
    }

    if (motorcycleId) {
      getMotorcycleById(motorcycleId.toString());
    }
  }, [motorcycleId, user]);

  useEffect(() => {
    if (!motorcycle) return;

    // reset all the form fields to match the store
    form.reset({
      make: motorcycle.make,
      vehicleModel: motorcycle.vehicleModel,
      year: motorcycle.year,
      rentPerDay: motorcycle.rentPerDay,
      description: motorcycle.description,
      category: motorcycle.category,
      variant: motorcycle.variant,
      color: motorcycle.color,
      securityDeposit: motorcycle.securityDeposit,
      kmsLimitPerDay: motorcycle.kmsLimitPerDay,
      extraKmsCharges: motorcycle.extraKmsCharges,
      availableQuantity: motorcycle.availableQuantity,
      specs: {
        engine: motorcycle.specs.engine,
        power: motorcycle.specs.power,
        weight: motorcycle.specs.weight,
      },
      isAvailable: motorcycle.isAvailable,
    });

    // populate your image state
    if (motorcycle.images?.length) {
      setSelectedImages(motorcycle.images);
      setMainImage(motorcycle.images[0]);
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

  const handleAvailabilityChange = async (isAvailable: boolean) => {
    try {
      await updateMotorcycleAvailability(motorcycleId, { isAvailable });
      form.setValue("isAvailable", isAvailable);
      toast.success(
        `Motorcycle ${isAvailable ? "enabled" : "disabled"} successfully`
      );
    } catch (error) {
      toast.error("Failed to update availability");
    }
  };

  const onSubmit = async (data: UpdateMotorcycleFormData) => {
    try {
      const formData = new FormData();

      // Add new images if any
      newImages.forEach((image) => {
        formData.append(`images`, image);
      });

      // Add form data
      Object.entries(data).forEach(([key, value]) => {
        if (key === "specs" && typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else if (key !== "isAvailable") {
          // Handle availability separately
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="outline" className="mb-4 bg-transparent">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-primary to-yellow-600 bg-clip-text text-transparent">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="border-yellow-primary/30 focus:border-yellow-primary"
                          />
                        </FormControl>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
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
                  <FormField
                    control={form.control}
                    name="availableQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available Quantity *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="border-yellow-primary/30 focus:border-yellow-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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

                    {/* Main Image */}
                    {mainImage && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Main Image:
                        </p>
                        <div className="relative inline-block">
                          <Image
                            src={mainImage.url || "/placeholder.svg"}
                            alt="Main motorcycle image"
                            width={200}
                            height={150}
                            className="rounded-lg object-cover border-2 border-yellow-primary/50"
                          />
                          <div className="absolute top-2 left-2 bg-yellow-primary text-black px-2 py-1 rounded text-xs font-medium">
                            Main
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Other Images */}
                    {selectedImages.length > 1 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Other Images:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {selectedImages.slice(1).map((image, index) => (
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

              {/* Availability */}
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-yellow-primary/20 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Available for Rent
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Make this motorcycle available for customers to book
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          handleAvailabilityChange(checked);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

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
                  className="flex-1 bg-yellow-primary hover:bg-yellow-600 text-black"
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
