"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditIcon, InfoIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { MotorcycleLog } from "@/types";
import { format } from "date-fns";
import MaintenanceInfoDialog from "./logs/maintenance-info-dialog";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import MotorcycleLogEditDialog from "./logs/motorcycle-log-edit-dialog";
import { useForm } from "react-hook-form";
import {
  UpdateMotorcycleLogFormData,
  updateMotorcycleLogSchema,
} from "@/schemas/motorcycle-logs.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  getStatusIcon,
  getStatusColor,
  MaintenanceTableRowSkeleton,
} from "./utils";
import MaintenanceTableRow from "./logs/maintenance-table-row";
import { useMotorcycleLogStore } from "@/store/motorcycle-log-store";
import UpdateMotorcycleLogDialog from "@/app/(public)/motorcycles/[id]/logs/__components/update-log-dialog";

interface MaintenanceTabProps {
  logs: MotorcycleLog[];
  filters: {
    statuses: string[];
    serviceCentres: string[];
    makes: string[];
    distinctCities: string[];
    categories: string[];
  };
  handleDeleteLog: (logId: string) => void;
  logSearchTerm: string;
  setLogSearchTerm: (term: string) => void;
  logStatusFilter: string | "All Status";
  setLogStatusFilter: (status: string | "All Status") => void;
  logBranchFilter: string | "All Branches";
  setLogBranchFilter: (branch: string | "All Branches") => void;
  logServiceCentreFilter: string | "All Service Centers";
  setLogServiceCentreFilter: (
    serviceCentre: string | "All Service Centers"
  ) => void;
  logsCurrentPage: number;
  setLogsCurrentPage: (page: number) => void;
  totalLogPages: number;
  logMetadata: any;
  updateMotorcycleLog: (logId: string, data: any) => Promise<void>;
}

export default function MaintenanceTab({
  logs,
  filters,
  handleDeleteLog,
  logSearchTerm,
  setLogSearchTerm,
  logStatusFilter,
  setLogStatusFilter,
  logBranchFilter,
  setLogBranchFilter,
  logServiceCentreFilter,
  setLogServiceCentreFilter,
  logsCurrentPage,
  setLogsCurrentPage,
  totalLogPages,
  logMetadata,
  updateMotorcycleLog,
}: MaintenanceTabProps) {
  const [selectedLog, setSelectedLog] = useState<MotorcycleLog | null>(null);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [showUpdateLogDialog, setShowUpdateLogDialog] = useState(false);

  const updateLogForm = useForm<UpdateMotorcycleLogFormData>({
    resolver: zodResolver(updateMotorcycleLogSchema),
  });

  const { loading } = useMotorcycleLogStore();

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

  const handleEditLog = (log: MotorcycleLog) => {
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

  const { distinctCities = [], serviceCentres = [], statuses = [] } = filters;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Maintenance Logs</h2>
        <div className="text-sm text-gray-600">
          Total Logs: {logMetadata?.total || 0}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="lg:col-span-2">
          <Label className="block text-sm font-medium text-muted-foreground mb-1">
            Search Logs
          </Label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search by make, model, or service center..."
              value={logSearchTerm}
              onChange={(e) => setLogSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="lg:col-span-3 flex flex-col sm:flex-row gap-4 justify-around">
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-1">
              Status
            </Label>
            <Select
              value={logStatusFilter}
              onValueChange={(value) => setLogStatusFilter(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-1">
              Branch
            </Label>
            <Select
              value={logBranchFilter}
              onValueChange={(value) => setLogBranchFilter(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Branches">All Branches</SelectItem>
                {distinctCities.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-1">
              Service Center
            </Label>
            <Select
              value={logServiceCentreFilter}
              onValueChange={(value) => setLogServiceCentreFilter(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by Service Center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Service Centers">
                  All Service Centers
                </SelectItem>
                {serviceCentres.map((serviceCentre) => (
                  <SelectItem key={serviceCentre} value={serviceCentre}>
                    {serviceCentre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Motorcycle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date In</TableHead>
                <TableHead>Date Out</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 9 }).map((_, index) => (
                  <MaintenanceTableRowSkeleton key={index} />
                ))
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <MaintenanceTableRow
                    key={log._id}
                    log={log}
                    setSelectedLog={setSelectedLog}
                    setIsInfoDialogOpen={setIsInfoDialogOpen}
                    handleDeleteLog={handleDeleteLog}
                    handleEditLog={handleEditLog}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No maintenance logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalLogPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setLogsCurrentPage(Math.max(logsCurrentPage - 1, 1))
                  }
                  className={
                    logsCurrentPage === 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalLogPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setLogsCurrentPage(i + 1)}
                    isActive={logsCurrentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setLogsCurrentPage(
                      Math.min(logsCurrentPage + 1, totalLogPages)
                    )
                  }
                  className={
                    logsCurrentPage === totalLogPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
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
    </>
  );
}
