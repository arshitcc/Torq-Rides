"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMotorcycleStore } from "@/store/motorcycle-store";
import { useMotorcycleLogStore } from "@/store/motorcycle-log-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import {
  createMotorcycleLogSchema,
  updateMotorcycleLogSchema,
  type CreateMotorcycleLogFormData,
  type UpdateMotorcycleLogFormData,
} from "@/schemas/motorcycle-logs.schema";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PlusIcon,
  EditIcon,
  Trash2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  WrenchIcon,
  FileTextIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XCircleIcon,
  CalendarIcon,
  Loader2Icon,
} from "lucide-react";
import { UserRolesEnum } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

export default function MotorcycleLogsPage() {
  const params = useParams();
  const motorcycleId = params.id as string;
  const { user, isAuthenticated } = useAuthStore();
  const { motorcycle, getMotorcycleById } = useMotorcycleStore();
  const {
    logs,
    loading,
    metadata,
    getMotorcycleLogs,
    createMotorcycleLog,
    updateMotorcycleLog,
    deleteMotorcycleLog,
  } = useMotorcycleLogStore();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [showAddLogDialog, setShowAddLogDialog] = useState(false);
  const [showUpdateLogDialog, setShowUpdateLogDialog] = useState(false);
  const itemsPerPage = 10;

  const addLogForm = useForm<CreateMotorcycleLogFormData>({
    resolver: zodResolver(createMotorcycleLogSchema),
    defaultValues: {
      registrationNumber: "",
      branch: "",
      dateIn: undefined,
      serviceCentreName: "",
      thingsToDo: {
        scheduledService: false,
        odoReading: 0,
        brakePads: false,
        chainSet: false,
        damageRepair: false,
        damageDetails: "",
        clutchWork: false,
        clutchDetails: "",
        other: false,
        otherDetails: "",
      },
      status: "IN-SERVICE",
      isAvailable: false,
      billAmount: 0,
      dateOut: undefined,
    },
  });

  const updateLogForm = useForm<UpdateMotorcycleLogFormData>({
    resolver: zodResolver(updateMotorcycleLogSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== UserRolesEnum.ADMIN) {
      toast.warning("Access Denied");
      router.push("/");
      return;
    }

    // Fetch logs
    getMotorcycleById(motorcycleId);
    getMotorcycleLogs(motorcycleId, {
      page: currentPage,
      offset: itemsPerPage,
    });
  }, [
    user,
    motorcycleId,
    currentPage,
    getMotorcycleById,
    getMotorcycleLogs,
    router,
    toast,
  ]);

  const handleAddLog = async (data: CreateMotorcycleLogFormData) => {
    try {
      data.dateIn = addLogForm.getValues("dateIn");
      data.dateOut = addLogForm.getValues("dateOut");
      await createMotorcycleLog(motorcycleId, data);
      toast.success("Service Log Added !!");
      setShowAddLogDialog(false);
      addLogForm.reset();
    } catch (error) {
      toast.error("Failed to add service log!! Please try again.");
    }
  };

  const handleUpdateLog = async (data: UpdateMotorcycleLogFormData) => {
    if (!selectedLog) return;

    try {
      await updateMotorcycleLog(motorcycleId, selectedLog._id, data);
      toast.success("Service Log Updated !!");
      setShowUpdateLogDialog(false);
      setSelectedLog(null);
    } catch (error) {
      toast.error("Failed to update maintenance log!! Please try again.");
    }
  };

  const handleDeleteLog = async (logId: string) => {
    try {
      await deleteMotorcycleLog(motorcycleId, logId);
      toast.success("Service Log Deleted !!");
    } catch (error) {
      toast.error("Failed to delete maintenance log!! Please try again.");
    }
  };

  const handleEditLog = (log: any) => {
    setSelectedLog(log);
    updateLogForm.reset({
      dateIn: log?.dateIn ? new Date(log.dateIn) : undefined,
      serviceCentreName: log.serviceCentreName,
      thingsToDo: log.thingsToDo,
      status: log.status,
      dateOut: log?.dateOut ? new Date(log.dateOut) : undefined,
      billAmount: log.billAmount,
      isAvailable: log.isAvailable,
    });
    setShowUpdateLogDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OK":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "DUE-SERVICE":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "IN-SERVICE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "IN-REPAIR":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OK":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "DUE-SERVICE":
        return <ClockIcon className="h-4 w-4" />;
      case "IN-SERVICE":
        return <WrenchIcon className="h-4 w-4" />;
      case "IN-REPAIR":
        return <AlertTriangleIcon className="h-4 w-4" />;
      default:
        return <XCircleIcon className="h-4 w-4" />;
    }
  };

  const totalPages = Math.ceil((metadata?.total || 0) / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2Icon className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== UserRolesEnum.ADMIN) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="outline" className="mb-4 bg-transparent">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-primary to-yellow-600 bg-clip-text text-yellow-primary">
          Maintenance Logs
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage maintenance logs for this motorcycle
        </p>
      </div>

      {/* Motorcycle Details */}
      {motorcycle && (
        <Card className="border-yellow-primary/20 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden ">
                <Image
                  src={
                    motorcycle?.images[0]?.url ||
                    "/placeholder.svg?height=80&width=80"
                  }
                  alt={`${motorcycle.make} ${motorcycle.vehicleModel}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">
                  {motorcycle.make} {motorcycle.vehicleModel}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                  <div>
                    <span className="text-gray-500">Status:</span>
                    {/* <Badge
                      className={`ml-1 ${
                        motorcycle.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {motorcycle.isAvailable ? "Available" : "Unavailable"}
                    </Badge> */}
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <span className="ml-1 font-medium">
                      {motorcycle.categories.join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Rent/Day:</span>
                    <span className="ml-1 font-medium">
                      ₹{motorcycle.rentPerDay}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logs Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Service Logs</h2>
        <Dialog open={showAddLogDialog} onOpenChange={setShowAddLogDialog}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-primary hover:bg-yellow-600 text-black">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Log
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Maintenance Log</DialogTitle>
              <DialogDescription>
                Create a new maintenance log for this motorcycle.
              </DialogDescription>
            </DialogHeader>
            <Form {...addLogForm}>
              <form
                onSubmit={addLogForm.handleSubmit(handleAddLog)}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addLogForm.control}
                    name="registrationNumber"
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
                  {/* <FormField
                    control={addLogForm.control}
                    name="branch"
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
                  /> */}
                  <div className="flex flex-col gap-2">
                    <Label>Branch</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {motorcycle?.availableInCities.map((city) => (
                          <SelectItem key={city.branch} value={city.branch}>
                            {city.branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormField
                    control={addLogForm.control}
                    name="dateIn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date In</FormLabel>
                        <FormControl>
                          <Popover>
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
                            <PopoverContent
                              align="start"
                              className="w-auto p-0"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
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
                    control={addLogForm.control}
                    name="dateOut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Out</FormLabel>
                        <FormControl>
                          <Popover>
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
                            <PopoverContent
                              align="start"
                              className="w-auto p-0"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
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
                    control={addLogForm.control}
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
                    control={addLogForm.control}
                    name="thingsToDo.odoReading"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ODO Reading (km)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 15000"
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addLogForm.control}
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
                            <SelectItem value="OK">OK</SelectItem>
                            <SelectItem value="DUE-SERVICE">
                              Due Service
                            </SelectItem>
                            <SelectItem value="IN-SERVICE">
                              In Service
                            </SelectItem>
                            <SelectItem value="IN-REPAIR">In Repair</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addLogForm.control}
                    name="billAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bill Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 15000"
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
                {/* Service Checklist */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-yellow-primary">
                    Service Checklist
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={addLogForm.control}
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
                      control={addLogForm.control}
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
                      control={addLogForm.control}
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
                      control={addLogForm.control}
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
                      control={addLogForm.control}
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
                    {addLogForm.watch("thingsToDo.damageRepair") && (
                      <FormField
                        control={addLogForm.control}
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
                      control={addLogForm.control}
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
                    {addLogForm.watch("thingsToDo.other") && (
                      <FormField
                        control={addLogForm.control}
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
                  control={addLogForm.control}
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
                    onClick={() => setShowAddLogDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-yellow-primary hover:bg-yellow-600 text-black"
                  >
                    Add Log
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-yellow-primary/20">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date In</TableHead>
                <TableHead>Date Out</TableHead>
                <TableHead>Service Centre</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>ODO Reading</TableHead>
                <TableHead>Bill Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 &&
                logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>
                      {log?.dateIn &&
                        format(new Date(log.dateIn), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {log?.dateOut &&
                        format(new Date(log.dateOut), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{log.serviceCentreName}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(log?.status)}>
                        {getStatusIcon(log?.status)}
                        <span className="ml-1">{log?.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log?.thingsToDo?.odoReading.toLocaleString()} km
                    </TableCell>
                    <TableCell>
                      {log?.billAmount
                        ? `₹${log.billAmount.toLocaleString()}`
                        : "Pending"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditLog(log)}
                                className="border-yellow-primary/30 hover:bg-yellow-primary/10 bg-transparent"
                              >
                                <EditIcon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Update Log</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 bg-transparent"
                                  >
                                    <Trash2Icon className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Log
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this
                                      maintenance log? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteLog(log._id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Log</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {logs.length === 0 && (
            <div className="text-center py-12">
              <FileTextIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No maintenance logs found
              </h3>
              <p className="text-gray-600 mb-4">
                This motorcycle doesn't have any maintenance logs yet.
              </p>
              <Button
                onClick={() => setShowAddLogDialog(true)}
                className="bg-yellow-primary hover:bg-yellow-600 text-black"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add First Log
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Page {metadata?.page || 1} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Update Log Dialog */}
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
                  name="dateIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date In</FormLabel>
                      <FormControl>
                        <Popover>
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
                              onSelect={field.onChange}
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
                        <Popover>
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
                              onSelect={field.onChange}
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
                        <Input
                          type="number"
                          placeholder="e.g., 15000"
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
                          <SelectItem value="OK">OK</SelectItem>
                          <SelectItem value="DUE-SERVICE">
                            Due Service
                          </SelectItem>
                          <SelectItem value="IN-SERVICE">In Service</SelectItem>
                          <SelectItem value="IN-REPAIR">In Repair</SelectItem>
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
                        <Input
                          type="number"
                          placeholder="e.g., 5000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          className="border-yellow-primary/30 focus:border-yellow-primary"
                        />
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
                  className="bg-yellow-primary hover:bg-yellow-600 text-black"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
