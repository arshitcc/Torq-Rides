"use client";

import type React from "react";
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
  CheckIcon,
  XIcon,
  CheckCircleIcon,
  UserRoundCheckIcon,
  UserRoundXIcon,
} from "lucide-react";
import { format } from "date-fns";
import {
  type ChangeCurrentPasswordFormData,
  changeCurrentPasswordSchema,
  type UpdateProfileFormData,
  updateProfileSchema,
  type UploadDocumentFormData,
  uploadDocumentSchema,
} from "@/schemas/users.schema";
import { type DocumentTypes, UserRolesEnum } from "@/types";
import type { AxiosError } from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Loading from "@/app/loading";

const availableDocuments: { type: DocumentTypes; name: string }[] = [
  {
    type: "DRIVING-LICENSE",
    name: "Driving License",
  },
  {
    type: "AADHAR-CARD",
    name: "Aadhar Card",
  },
  {
    type: "PAN-CARD",
    name: "PAN Card",
  },
  {
    type: "E-KYC",
    name: "e-KYC",
  },
];

export default function ProfilePage() {
  const {
    user,
    isAuthenticated,
    changeCurrentPassword,
    uploadDocument,
    getCurrentUser,
    changeAvatar,
    updateUserProfile,
    deleteUserAccount,
    deleteUserDocument,
    loading,
    resendEmailVerification,
  } = useAuthStore();
  const { bookings, getAllBookings } = useBookingStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const profileForm = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
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

  // Calculate selectable documents based on user's current documents
  const getSelectableDocuments = () => {
    if (!user?.documents) return availableDocuments;
    return availableDocuments.filter(
      (doc) => !user.documents?.find((userDoc) => userDoc.type === doc.type)
    );
  };

  const [selectableDocuments, setSelectableDocuments] = useState<
    { type: DocumentTypes; name: string }[]
  >([]);

  const documentForm = useForm<UploadDocumentFormData>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      type: undefined,
      name: "",
    },
  });

  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [documentError, setDocumentError] = useState<string | null>(null);

  // Update selectable documents whenever user data changes
  useEffect(() => {
    const newSelectableDocuments = getSelectableDocuments();
    setSelectableDocuments(newSelectableDocuments);

    // Reset document form with new selectable documents
    if (newSelectableDocuments.length > 0) {
      documentForm.reset({
        type: newSelectableDocuments[0].type,
        name: "",
      });
    } else {
      documentForm.reset({
        type: undefined,
        name: "",
      });
    }
  }, [user?.documents]);

  useEffect(() => {
    getCurrentUser();
  }, []);

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
        phone: user.phone,
        address: user.address,
      });
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const onProfileSubmit = async (data: UpdateProfileFormData) => {
    try {
      setProfileError("");
      await updateUserProfile(data);
      toast.success("Profile Updated Successfully !!");
      setProfileError("");
      setIsEditing(false);
    } catch (error: AxiosError | any) {
      setProfileError(error.response?.data?.message || "Failed !!");
    }
  };

  const onPasswordSubmit = async (data: ChangeCurrentPasswordFormData) => {
    let loadingId;
    try {
      const { currentPassword, newPassword, confirmNewPassword } = data;
      if (currentPassword === newPassword) {
        setPasswordError("New password cannot be same as Current password");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setPasswordError("New password and Confirm password do not match");
        return;
      }
      loadingId = toast.loading("Changing password...");
      await changeCurrentPassword(data);
      passwordForm.reset();
    } catch (error: AxiosError | any) {
      toast.error(error.response?.data?.message || "Change password failed");
    } finally {
      toast.dismiss(loadingId);
    }
  };

  const onDocumentSubmit = async (data: UploadDocumentFormData) => {
    if (!selectedFile) {
      setDocumentError("Please select a file to upload !!");
      return;
    }

    setIsUploading(true);
    setDocumentError("");

    try {
      await uploadDocument(data, selectedFile);
      toast.success("Your document has been uploaded successfully.");

      // Clear form and file selection
      setSelectedFile(null);
    } catch (error: AxiosError | any) {
      setDocumentError(
        error.response?.data?.message ||
          "Failed to upload document. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    setIsUploadingAvatar(true);
    try {
      await changeAvatar(avatarFile, user?.avatar?.public_id);

      toast.success("Profile Picture Updated Successfully !!");
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error: AxiosError | any) {
      toast.error(error.response?.data?.message || "Failed !!");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const removeDocument = async (
    documentId: string,
    documentType: DocumentTypes
  ) => {
    try {
      setIsUploading(true);
      await deleteUserDocument(documentId);
      toast.success("Document removed successfully");

      // The useEffect will automatically update selectableDocuments and reset the form
      // when user.documents changes after successful deletion
    } catch (error: AxiosError | any) {
      toast.error(error.response?.data?.message || "Failed to remove document");
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return <Loading />;
  }

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

  const resendEmailVerificationLink = async () => {
    try {
      setIsResending(true);
      await resendEmailVerification();
      toast.success(`Email verification link has been sent to ${user.email}`);
    } catch (error: AxiosError | any) {
      toast.error(error.response?.data?.message || "Failed to resend link");
    } finally {
      setIsResending(false);
    }
  };

  const userDocuments = user.documents || [];

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
              {/* avatar + upload… */}

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
                    <div className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full shadow-lg transition-colors">
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
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    {isUploadingAvatar ? (
                      <Loader2Icon className="animate-spin h-4 w-4" />
                    ) : (
                      "Update Avatar"
                    )}
                  </Button>
                </div>
              )}

              <h3 className="text-xl font-semibold mb-1">{user.fullname}</h3>
              <p className="text-gray-600 mb-2">@{user.username}</p>

              {/* Role badge */}
              <Badge
                variant={
                  user.role === UserRolesEnum.ADMIN ? "default" : "secondary"
                }
                className="mb-4"
              >
                {user.role === UserRolesEnum.ADMIN ? "Admin" : "Customer"}
              </Badge>

              {/* ← New email‑verified badge */}
              <div className="mb-4">
                <Badge
                  variant="outline"
                  className={`inline-flex items-center ${
                    user.isEmailVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.isEmailVerified ? (
                    <UserRoundCheckIcon className="w-4 h-4 mr-1" />
                  ) : (
                    <UserRoundXIcon className="w-4 h-4 mr-1" />
                  )}
                  {user.isEmailVerified ? "Verified" : "Not Verified"}
                </Badge>
              </div>

              {/* ← If not yet verified, show resend button */}
              {!user.isEmailVerified && (
                <div className="mb-6">
                  <Button
                    size="sm"
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    onClick={resendEmailVerificationLink}
                    disabled={isResending}
                  >
                    {isResending ? (
                      <Loader2Icon className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      "Resend Verification Link"
                    )}
                  </Button>
                </div>
              )}

              {/* customer stats */}
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
            <TabsList className="flex items-center justify-start flex-wrap h-auto space-y-1">
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
                    className="bg-yellow-500 hover:bg-yellow-600 hover:text-white text-white cursor-pointer"
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
                      {profileError && (
                        <p className="text-red-500 p-2 bg-red-100 rounded-lg border-2 border-red-500">
                          {profileError}
                        </p>
                      )}
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
                          <Button
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white"
                          >
                            Save Changes
                          </Button>
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
                      {passwordError && (
                        <p className="text-red-500 bg-red-50 rounded-lg p-2 border-1 text-sm w-fit border-red-500">
                          {passwordError}
                        </p>
                      )}
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

                      <Button
                        type="submit"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer"
                      >
                        Change Password
                      </Button>
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
                  {userDocuments?.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">
                        Your Documents
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                        {userDocuments.map((doc, index) => (
                          <div
                            key={index}
                            className="flex flex-col lg:flex-row items-start sm:items-center justify-between p-4 border rounded-lg space-y-3 sm:space-y-0"
                          >
                            <div className="flex items-center space-x-4 flex-1">
                              <div className="bg-yellow-500/10 p-2 rounded-full flex-shrink-0">
                                <FileTextIcon className="h-5 w-5 text-yellow-500" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium truncate">
                                  {doc.type}
                                </p>
                                {doc.name && (
                                  <p className="text-sm text-gray-600 truncate">
                                    {doc.name}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 w-full sm:w-auto">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(doc.file.url, "_blank")
                                }
                                className="flex-1 sm:flex-none"
                              >
                                <EyeIcon className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 flex-1 sm:flex-none bg-transparent"
                                  >
                                    <Trash2Icon className="h-4 w-4 mr-1" />
                                    Remove
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Document
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete your{" "}
                                      {doc.name || doc.type}?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        removeDocument(doc._id, doc.type)
                                      }
                                      className="bg-red-600 hover:bg-red-700 dark:text-white"
                                    >
                                      Delete Document
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">
                        No documents uploaded yet
                      </p>
                    </div>
                  )}

                  {selectableDocuments.length > 0 && (
                    <div className="mt-8 border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Upload New Document{" "}
                        <span className="text-muted-foreground text-sm">
                          ( * Only PDFs &amp; Image files are allowed)
                        </span>
                      </h3>
                      <Form {...documentForm}>
                        <form
                          onSubmit={documentForm.handleSubmit(onDocumentSubmit)}
                          className="space-y-4"
                        >
                          {documentError && (
                            <p className="text-red-500 bg-red-50 rounded-lg p-2 border-1 text-sm w-fit border-red-500">
                              {documentError}
                            </p>
                          )}
                          <FormField
                            control={documentForm.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Document Type</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value || ""}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select document type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {selectableDocuments.map((document) => (
                                      <SelectItem
                                        key={document.type}
                                        value={document.type}
                                      >
                                        {document.name}
                                      </SelectItem>
                                    ))}
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
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                              <label
                                htmlFor="document-upload"
                                className="cursor-pointer w-full sm:w-auto"
                              >
                                <div className="flex items-center justify-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:border-yellow-500 transition-colors">
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
                                <span className="text-sm text-gray-600 truncate max-w-xs">
                                  {selectedFile.name}
                                </span>
                              )}
                            </div>
                          </div>

                          {selectedFile && (
                            <div className="mt-4">
                              <p className="text-sm font-medium mb-2">
                                File To Upload:
                              </p>
                              <div className="border rounded-lg p-4 bg-gray-100 dark:bg-[#18181B]">
                                <p className="text-sm truncate">
                                  {selectedFile.name}
                                </p>
                              </div>
                            </div>
                          )}

                          <Button
                            type="submit"
                            disabled={!selectedFile || isUploading}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer w-full sm:w-auto"
                          >
                            {isUploading ? (
                              <>
                                <Loader2Icon className="animate-spin h-4 w-4 mr-2" />
                                Uploading
                              </>
                            ) : (
                              "Upload Document"
                            )}
                          </Button>
                        </form>
                      </Form>
                    </div>
                  )}

                  {selectableDocuments.length === 0 &&
                    userDocuments.length > 0 && (
                      <div className="mt-8 border-t pt-6 text-center">
                        <p className="text-gray-500">
                          All document types have been uploaded.
                        </p>
                      </div>
                    )}
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
                              <p className="font-medium">
                                Booking #{booking._id.slice(-6)}
                              </p>
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
