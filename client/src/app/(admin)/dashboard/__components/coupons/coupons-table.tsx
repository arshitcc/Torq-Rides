import { PromoCode } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash2Icon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CouponFormData, UpdateCouponFormData } from "@/schemas/coupons.schema";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import CouponsTableRow from "./coupons-table-row";
import { useCouponStore } from "@/store/coupon-store";
import { CouponsTableRowSkeleton } from "../utils";

interface CouponsTableProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  coupons: PromoCode[];
  updateCouponForm: UseFormReturn<UpdateCouponFormData>;
  onUpdateCoupon: (data: UpdateCouponFormData) => void;
  handleUpdateCoupon: (coupon: CouponFormData) => void;
  handleToggleCoupon: (couponId: string, isActive: boolean) => void;
  handleDeleteCoupon: (couponId: string) => void;
}

function CouponsTable({
  open: showUpdateCouponDialog,
  setOpen: setShowUpdateCouponDialog,
  coupons,
  updateCouponForm,
  onUpdateCoupon,
  handleUpdateCoupon,
  handleToggleCoupon,
  handleDeleteCoupon,
}: CouponsTableProps) {
  const { loading } = useCouponStore();
  return (
    <Card className="border-yellow-primary/20">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Coupon Name</TableHead>
              <TableHead>Promo Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 9 }).map((_, index) => (
                  <CouponsTableRowSkeleton key={index} />
                ))
              : coupons.map((coupon) => (
                  <CouponsTableRow
                    key={coupon._id}
                    {...{
                      coupon,
                      updateCouponForm,
                      handleToggleCoupon,
                      showUpdateCouponDialog,
                      setShowUpdateCouponDialog,
                      handleUpdateCoupon,
                      handleDeleteCoupon,
                      onUpdateCoupon,
                    }}
                  />
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default CouponsTable;
