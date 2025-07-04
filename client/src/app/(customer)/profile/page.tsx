"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";
import { useBookingStore } from "@/store/booking-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  CalendarIcon,
  CreditCardIcon,
  SettingsIcon,
  ShieldIcon,
  CameraIcon,
  FileTextIcon,
  EyeIcon,
  Trash2Icon,
  UploadIcon,
  Loader2Icon,
} from "lucide-react";
import { format } from "date-fns";
import {
  ChangeCurrentPasswordFormData,
  changeCurrentPasswordSchema,
  ProfileFormData,
  profileSchema,
  UploadDocumentFormData,
  uploadDocumentSchema,
} from "@/schemas/users.schema";
import { UserRolesEnum } from "@/types";
import { AxiosError } from "axios";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProfilePage() {
  const {
    user,
    isAuthenticated,
    changeCurrentPassword,
    uploadDocument,
    getCurrentUser,
    changeAvatar,
    loading,
    resendEmailVerification,
  } = useAuthStore();
  const { bookings, getAllBookings } = useBookingStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullname: "",
      email: "",
      username: "",
      phone: "",
      address: "",
    },
  });

  const passwordForm = useForm<ChangeCurrentPasswordFormData>({
    resolver: zodResolver(changeCurrentPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const documentForm = useForm<UploadDocumentFormData>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      type: "AADHAR-CARD",
      name: "",
    },
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!user) {
      router.push("/login");
      return;
    }

    if (user) {
      profileForm.reset({
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        // phone: user.phone || "",
        // address: user.address || "",
      });
    }

    // Fetch user's bookings if customer
    if (user.role === UserRolesEnum.CUSTOMER) {
      getAllBookings({ customerId: user._id });
    }
  }, [user, profileForm, getAllBookings, router]);

  const getInitials = (fullname: string) => {
    const names = fullname?.split(" ");
    return names?.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : names?.[0][0].toUpperCase();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      // API call to update profile would go here
      console.log("Profile update:", data);

      toast("Profile Updated Successfully !!");
      setIsEditing(false);
    } catch (error) {
      toast("Failed !!");
    }
  };

  const onPasswordSubmit = async (data: ChangeCurrentPasswordFormData) => {
    try {
      const { currentPassword, newPassword, confirmNewPassword } = data;
      if (currentPassword === newPassword) {
        toast.error("New password cannot be same as Current password");
        return;
      }

      if (newPassword !== confirmNewPassword) {
        toast.error("New password and Confirm password do not match");
        return;
      }

      const loadingId = toast.loading("Changing password...");

      await changeCurrentPassword(data);

      toast.dismiss(loadingId);
      passwordForm.reset();
    } catch (error: AxiosError | any) {
      toast.error(error.response?.data?.message || "Change password failed");
    }
  };

  const onDocumentSubmit = async (data: UploadDocumentFormData) => {
    if (!selectedFile) {
      toast.error("Please select a file to upload !!");
      return;
    }

    setIsUploading(true);
    try {
      // API call to upload document would go here
      await uploadDocument(data, selectedFile);
      toast.success("Your document has been uploaded successfully.");
      documentForm.reset();
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error: AxiosError | any) {
      toast("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    setIsUploadingAvatar(true);
    try {
      await changeAvatar(avatarFile, user?.avatar?.public_id);

      toast("Profile Picture Updated Successfully !!");

      setAvatarFile(null);
      setAvatarPreview(null);
      getCurrentUser();
    } catch (error: AxiosError | any) {
      toast.error("Failed !!");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const removeDocument = async (documentType: string) => {
    try {
      // API call to remove document would go here
      toast.success("Document removed successfully !!");
      getCurrentUser();
    } catch (error: AxiosError | any) {
      toast.error(error.response?.data?.message || "Failed to remove document");
    }
  };

  if (!user) return null;

  const userBookings = bookings.filter(
    (booking) => booking.customerId === user._id
  );
  const completedBookings = userBookings.filter(
    (booking) => booking.status === "COMPLETED"
  );
  const totalSpent = completedBookings.reduce(
    (sum, booking) => sum + booking.discountedTotal,
    0
  );

  const documents = user.documents || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Profile</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage
                    src={
                      avatarPreview || user?.avatar?.url || "/placeholder.svg"
                    }
                    alt={user.fullname}
                  />
                  <AvatarFallback className="text-2xl">
                    {getInitials(user.fullname)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="bg-yellow-primary hover:bg-yellow-600 text-black p-2 rounded-full shadow-lg transition-colors">
                      <CameraIcon className="h-4 w-4" />
                    </div>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {avatarFile && (
                <div className="mb-4">
                  <Button
                    onClick={handleAvatarUpload}
                    disabled={isUploadingAvatar}
                    size="sm"
                    className="bg-yellow-primary hover:bg-yellow-600 text-black"
                  >
                    {isUploadingAvatar ? "Uploading..." : "Update Avatar"}
                  </Button>
                </div>
              )}

              <h3 className="text-xl font-semibold mb-1">{user.fullname}</h3>
              <p className="text-gray-600 mb-2">@{user.username}</p>
              <Badge
                variant={
                  user.role === UserRolesEnum.ADMIN ? "default" : "secondary"
                }
                className="mb-4"
              >
                {user.role === UserRolesEnum.ADMIN ? "Admin" : "Customer"}
              </Badge>

              {user.role === UserRolesEnum.CUSTOMER && (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Bookings:</span>
                    <span className="font-semibold">{userBookings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-semibold">
                      {completedBookings.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Spent:</span>
                    <span className="font-semibold">₹{totalSpent}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="cursor-pointer">
                Profile Info
              </TabsTrigger>
              <TabsTrigger value="security" className="cursor-pointer">
                Security
              </TabsTrigger>
              <TabsTrigger value="documents" className="cursor-pointer">
                Documents
              </TabsTrigger>
              <TabsTrigger value="activity" className="cursor-pointer">
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Profile Information */}
            <TabsContent value="profile">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="fullname"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder="Enter phone number"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder="Enter your address"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {isEditing && (
                        <div className="flex space-x-4">
                          <Button type="submit">Save Changes</Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShieldIcon className="h-5 w-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form
                      onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter current password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Enter new password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmNewPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Confirm new password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit">Change Password</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileTextIcon className="h-5 w-5" />
                    <span>Documents</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {documents?.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">
                        Your Documents
                      </h3>
                      {documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="bg-yellow-primary/10 p-2 rounded-full">
                              <FileTextIcon className="h-5 w-5 text-yellow-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.type}</p>
                              {doc.name && (
                                <p className="text-sm text-gray-600">
                                  {doc.name}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(doc.file.url, "_blank")
                              }
                            >
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeDocument(doc.type)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2Icon className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">
                        No documents uploaded yet
                      </p>
                    </div>
                  )}

                  <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Upload New Document
                    </h3>
                    <Form {...documentForm}>
                      <form
                        onSubmit={documentForm.handleSubmit(onDocumentSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={documentForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Document Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select document type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="AADHAR-CARD">
                                    Aadhaar Card
                                  </SelectItem>
                                  <SelectItem value="DRIVING-LICENSE">
                                    Driving Licence
                                  </SelectItem>
                                  <SelectItem value="PAN-CARD">
                                    PAN Card
                                  </SelectItem>
                                  <SelectItem value="e-KYC">e-KYC</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={documentForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Document Name (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter document name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Upload File
                          </label>
                          <div className="flex items-center space-x-4">
                            <label
                              htmlFor="document-upload"
                              className="cursor-pointer"
                            >
                              <div className="flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:border-yellow-primary transition-colors">
                                <UploadIcon className="h-4 w-4" />
                                <span>Choose File</span>
                              </div>
                            </label>
                            <input
                              id="document-upload"
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                            {selectedFile && (
                              <span className="text-sm text-gray-600">
                                {selectedFile.name}
                              </span>
                            )}
                          </div>
                        </div>

                        {previewUrl && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Preview:</p>
                            <div className="border rounded-lg p-4">
                              <Image
                                src={previewUrl || "/placeholder.svg"}
                                alt="Document preview"
                                width={200}
                                height={200}
                                className="max-w-full h-auto rounded"
                              />
                            </div>
                          </div>
                        )}

                        <Button
                          type="submit"
                          disabled={!selectedFile || isUploading}
                          className="bg-yellow-primary hover:bg-yellow-600 text-black"
                        >
                          {isUploading ? "Uploading..." : "Upload Document"}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.role === UserRolesEnum.CUSTOMER ? (
                    <div className="space-y-4">
                      {userBookings.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No recent activity
                        </p>
                      ) : (
                        userBookings.slice(0, 5).map((booking) => (
                          <div
                            key={booking._id}
                            className="flex items-center space-x-4 p-4 border rounded-lg"
                          >
                            <div className="bg-primary/10 p-2 rounded-full">
                              <CreditCardIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              {/* <p className="font-medium">
                                Booked {booking.motorcycle?.make}{" "}
                                {booking.motorcycle?.vehicleModel}
                              </p> */}
                              <p className="text-sm text-gray-600">
                                {format(
                                  new Date(booking.bookingDate),
                                  "MMM dd, yyyy"
                                )}{" "}
                                • ₹{booking.discountedTotal}
                              </p>
                            </div>
                            <Badge
                              className={`${
                                booking.status === "COMPLETED"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "CONFIRMED"
                                  ? "bg-blue-100 text-blue-800"
                                  : booking.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <SettingsIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Admin activity tracking coming soon
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
