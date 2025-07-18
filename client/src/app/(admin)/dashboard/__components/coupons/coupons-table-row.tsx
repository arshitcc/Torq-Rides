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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditIcon, Trash2Icon } from "lucide-react";
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { UpdateCouponFormData } from "@/schemas/coupons.schema";

interface CouponsTableRowProps {
  coupon: PromoCode;
  updateCouponForm: UseFormReturn<UpdateCouponFormData>;
  showUpdateCouponDialog: boolean;
  setShowUpdateCouponDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateCoupon: (coupon: PromoCode) => void;
  handleDeleteCoupon: (couponId: string) => void;
  onUpdateCoupon: (data: UpdateCouponFormData) => void;
  handleToggleCoupon: (couponId: string, isActive: boolean) => void;
}

function CouponsTableRow({
  coupon,
  updateCouponForm,
  handleToggleCoupon,
  showUpdateCouponDialog,
  setShowUpdateCouponDialog,
  handleUpdateCoupon,
  handleDeleteCoupon,
  onUpdateCoupon,
}: CouponsTableRowProps) {
  return (
    <TableRow key={coupon._id}>
      <TableCell className="font-medium">{coupon.name}</TableCell>
      <TableCell>
        <Badge variant="outline" className="font-mono">
          {coupon.promoCode}
        </Badge>
      </TableCell>
      <TableCell>
        {coupon.type === "PERCENTAGE"
          ? `${coupon.discountValue}%`
          : `₹${coupon.discountValue}`}
      </TableCell>
      <TableCell>
        <Badge
          className={
            coupon.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        >
          {coupon.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-4 items-center">
          <Switch
            checked={coupon.isActive}
            onCheckedChange={(checked) =>
              handleToggleCoupon(coupon._id, checked)
            }
          />

          <Dialog
            open={showUpdateCouponDialog}
            onOpenChange={setShowUpdateCouponDialog}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleUpdateCoupon({
                    ...coupon,
                    type: coupon.type as "FLAT" | "PERCENTAGE",
                  })
                }
              >
                <EditIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Coupon</DialogTitle>
                <DialogDescription>
                  Update the details of this coupon
                </DialogDescription>
              </DialogHeader>
              <Form {...updateCouponForm}>
                <form
                  onSubmit={updateCouponForm.handleSubmit(onUpdateCoupon)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={updateCouponForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coupon Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Summer Sale" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateCouponForm.control}
                      name="promoCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Promo Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., SUMMER20" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={updateCouponForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="FLAT">Flat Amount</SelectItem>
                              <SelectItem value="PERCENTAGE">
                                Percentage
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateCouponForm.control}
                      name="discountValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Value</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 500 or 20"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={updateCouponForm.control}
                      name="minimumCartValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Cart Value</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 500 or 20"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={updateCouponForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={
                                field.value
                                  ? format(field.value, "yyyy-MM-dd")
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(new Date(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateCouponForm.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={
                                field.value
                                  ? format(field.value, "yyyy-MM-dd")
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(new Date(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={updateCouponForm.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Make this coupon active immediately
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
                      onClick={() => setShowUpdateCouponDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Update Coupon</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
                <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this coupon? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteCoupon(coupon._id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default CouponsTableRow;
