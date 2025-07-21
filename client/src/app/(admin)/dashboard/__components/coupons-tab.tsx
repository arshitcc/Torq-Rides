import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CouponFormData,
  couponSchema,
  UpdateCouponFormData,
  updateCouponSchema,
} from "@/schemas/coupons.schema";
import AddCouponDialog from "./coupons/add-coupon-dialog";
import CouponsTable from "./coupons/coupons-table";
import { PromoCode } from "@/types";
import { toast } from "sonner";
import { useCouponStore } from "@/store/coupon-store";
import type { AxiosError } from "axios";

interface CouponsTabProps {
  coupons: PromoCode[];
  handleToggleCoupon: (couponId: string, isActive: boolean) => void;
  handleDeleteCoupon: (couponId: string) => void;
}

export default function CouponsTab({
  coupons,
  handleToggleCoupon,
  handleDeleteCoupon,
}: CouponsTabProps) {
  const { createCoupon, updateCoupon } = useCouponStore();
  const [showAddCouponDialog, setShowAddCouponDialog] = useState(false);
  const [showUpdateCouponDialog, setShowUpdateCouponDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

  const couponForm = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      name: "",
      promoCode: "",
      type: "FLAT",
      startDate: new Date(),
      expiryDate: new Date(),
      discountValue: 0,
      isActive: true,
      minimumCartValue: 0,
    },
  });

  const updateCouponForm = useForm<UpdateCouponFormData>({
    resolver: zodResolver(updateCouponSchema),
  });

  const onAddCoupon = async (data: CouponFormData) => {
    try {
      await createCoupon(data);
      toast.success(`Coupon ${data.promoCode} is Live Now !!`);
      setShowAddCouponDialog(false);
      couponForm.reset();
    } catch (error: AxiosError | any) {
      toast.error(
        error?.response?.data?.message ??
          `Failed to add coupon ${data.promoCode}.`
      );
    }
  };

  const onUpdateCoupon = async (data: UpdateCouponFormData) => {
    try {
      if (!selectedCoupon) return;
      await updateCoupon(selectedCoupon._id, data);
      toast.success(`Coupon ${data.promoCode} is Updated Successfully !!`);
      setShowUpdateCouponDialog(false);
      updateCouponForm.reset();
    } catch (error: AxiosError | any) {
      toast.error(
        error?.response?.data?.message ??
          `Failed to update coupon ${data.promoCode}.`
      );
    }
  };

  const handleUpdateCoupon = (coupon: CouponFormData) => {
    setSelectedCoupon(coupon);
    updateCouponForm.reset({
      name: coupon.name,
      promoCode: coupon.promoCode,
      type: coupon.type as "FLAT" | "PERCENTAGE",
      startDate: new Date(coupon.startDate),
      expiryDate: new Date(coupon.expiryDate),
      discountValue: coupon.discountValue,
      isActive: coupon.isActive,
      minimumCartValue: coupon.minimumCartValue,
    });
    setShowUpdateCouponDialog(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Coupon Management</h2>
        <AddCouponDialog
          open={showAddCouponDialog}
          setOpen={setShowAddCouponDialog}
          couponForm={couponForm}
          onAddCoupon={onAddCoupon}
        />
      </div>
      <CouponsTable
        open={showUpdateCouponDialog}
        setOpen={setShowUpdateCouponDialog}
        coupons={coupons}
        updateCouponForm={updateCouponForm}
        onUpdateCoupon={onUpdateCoupon}
        handleUpdateCoupon={handleUpdateCoupon}
        handleToggleCoupon={handleToggleCoupon}
        handleDeleteCoupon={handleDeleteCoupon}
      />
    </>
  );
}
