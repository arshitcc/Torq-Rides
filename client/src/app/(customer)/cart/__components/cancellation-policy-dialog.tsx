import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CancellationPolicyDialogProps {
  children: React.ReactNode;
}

export function CancellationPolicyDialog({
  children,
}: CancellationPolicyDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Cancellation & Refund Policy</DialogTitle>
          <DialogDescription>
            Please read our policy carefully before booking.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72 md:h-96 w-full rounded-md border p-2">
          <div className="space-y-4 text-sm">
            <h4 className="font-semibold">Key Points:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                The <strong>Security Deposit</strong>, if paid, is always 100%
                refundable upon cancellation.
              </li>
              <li>
                Cancellation charges are calculated on the{" "}
                <strong>Amount Paid by the Customer</strong>, excluding the
                security deposit.
              </li>
            </ul>

            <h4 className="font-semibold">Cancellation Slabs:</h4>
            <div className="space-y-2">
              <p>
                <strong>More than 7 days before any bike pick-up:</strong>
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Cancellation Charge:</strong> ₹
                  {Number(process.env.NEXT_PUBLIC_CANCELLATION_CHARGE) || 199} will be deducted
                  from the amount paid and remaining amount will be refunded.
                </li>
                <li>
                  <strong>Refund:</strong> 100% of the rental amount paid.
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p>
                <strong>Between 3 to 7 days before any bike pick-up:</strong>
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Cancellation Charge:</strong> 50% of the amount paid.
                </li>
                <li>
                  <strong>Refund:</strong> 50% of the amount paid.
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p>
                <strong>Within 3 days before any bike pick-up:</strong>
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Cancellation Charge:</strong> 100% of the amount paid.
                </li>
                <li>
                  <strong>Refund:</strong> 0% of the amount paid.
                </li>
              </ul>
            </div>
            <p className="pt-2 border-t">
              All refunds will be processed to the original payment method
              within 3-5 business days.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
