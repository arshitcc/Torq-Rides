import React from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CouponFormData } from "@/schemas/coupons.schema";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";

interface AddCouponDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  couponForm: UseFormReturn<CouponFormData>;
  onAddCoupon: (data: CouponFormData) => void;
}

function AddCouponDialog({
  open,
  setOpen,
  couponForm,
  onAddCoupon,
}: AddCouponDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Coupon</DialogTitle>
          <DialogDescription>
            Create a new discount coupon for customers.
          </DialogDescription>
        </DialogHeader>
        <Form {...couponForm}>
          <form
            onSubmit={couponForm.handleSubmit(onAddCoupon)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={couponForm.control}
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
                control={couponForm.control}
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
                control={couponForm.control}
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
                        <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={couponForm.control}
                name="discountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 500 or 20"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={couponForm.control}
                name="minimumCartValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Cart Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 500 or 20"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={couponForm.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value ? format(field.value, "yyyy-MM-dd") : ""
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
                control={couponForm.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value ? format(field.value, "yyyy-MM-dd") : ""
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
              control={couponForm.control}
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
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Coupon</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddCouponDialog;
