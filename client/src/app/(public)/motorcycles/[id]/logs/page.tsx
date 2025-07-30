"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  ChevronLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  Loader2Icon,
} from "lucide-react";
import { MotorcycleLog, UserRolesEnum } from "@/types";
import UpdateMotorcycleLogDialog from "./__components/update-log-dialog";
import { MaintenanceTableRowSkeleton } from "@/app/(admin)/dashboard/__components/utils";
import MaintenanceTableRow from "./__components/maintenance-table-row";
import AddMotorcycleLogDialog from "./__components/add-log-dialog";
import MaintenanceInfoDialog from "@/app/(admin)/dashboard/__components/logs/maintenance-info-dialog";
import { getTodayPrice } from "@/lib/utils";

export default function MotorcycleLogsPage() {
  const params = useParams();
  const motorcycleId = params.id as string;
  const { user, isAuthenticated } = useAuthStore();
  const { motorcycle, getMotorcycleById } = useMotorcycleStore();
  const {
    logs,
    loading,
    metadata,
    getMotorcycleLogFilters,
    getMotorcycleLogs,
    createMotorcycleLog,
    updateMotorcycleLog,
    deleteMotorcycleLog,
  } = useMotorcycleLogStore();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<MotorcycleLog | null>(null);
  const [showAddLogDialog, setShowAddLogDialog] = useState(false);
  const [showUpdateLogDialog, setShowUpdateLogDialog] = useState(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
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
    getMotorcycleLogFilters();
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
      await updateMotorcycleLog(selectedLog._id, data);
      toast.success("Service Log Updated !!");
      setShowUpdateLogDialog(false);
      setSelectedLog(null);
    } catch (error) {
      toast.error("Failed to update maintenance log!! Please try again.");
    }
  };

  const handleDeleteLog = async (logId: string) => {
    try {
      await deleteMotorcycleLog(logId);
      toast.success("Service Log Deleted !!");
    } catch (error) {
      toast.error("Failed to delete maintenance log!! Please try again.");
    }
  };

  const handleEditLog = (log: any) => {
    setSelectedLog(log);
    updateLogForm.reset({
      registrationNumber: log.registrationNumber,
      branch: log.branch,
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
                    <span className="text-gray-500">Category:</span>
                    <span className="ml-1 font-medium">
                      {motorcycle.categories.join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Rent/Day:</span>
                    <span className="ml-1 font-medium">
                      ₹{getTodayPrice(motorcycle)}
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

        <AddMotorcycleLogDialog
          showAddLogDialog={showAddLogDialog}
          setShowAddLogDialog={setShowAddLogDialog}
          addLogForm={addLogForm}
          handleAddLog={handleAddLog}
        />
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
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <MaintenanceTableRowSkeleton key={index} />
                ))
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <MaintenanceTableRow
                    key={log._id}
                    log={log}
                    handleEditLog={handleEditLog}
                    handleDeleteLog={handleDeleteLog}
                    setSelectedLog={setSelectedLog}
                    setIsInfoDialogOpen={setIsInfoDialogOpen}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
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
                        className="bg-yellow-primary hover:bg-yellow-600 text-white"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add First Log
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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

      <MaintenanceInfoDialog
        open={isInfoDialogOpen}
        setOpen={setIsInfoDialogOpen}
        log={selectedLog}
      />

      <UpdateMotorcycleLogDialog
        showUpdateLogDialog={showUpdateLogDialog}
        setShowUpdateLogDialog={setShowUpdateLogDialog}
        updateLogForm={updateLogForm}
        handleUpdateLog={handleUpdateLog}
      />
    </div>
  );
}
