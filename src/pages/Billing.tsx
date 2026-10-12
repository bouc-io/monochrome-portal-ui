import { useState } from "react";
import { CreditCard, Download, CheckCircle, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useToast } from "@/hooks/use-toast";
import { useBillingApi } from "@/lib/billingApi";

const PLANS = [
  { plan: "Starter", price: "$9.00" },
  { plan: "Pro", price: "$29.00" },
  { plan: "Enterprise", price: "$99.00" },
];

const statusVariant = (s: string) => {
  if (s === "paid" || s === "active") return "default";
  if (s === "pending") return "secondary";
  return "destructive";
};

export default function Billing() {
  const {
    subscription,
    invoices,
    paymentMethod,
    loading,
    changePlan,
    cancelSubscription,
    upsertPayment,
  } = useBillingApi();
  const { toast } = useToast();

  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [planBusy, setPlanBusy] = useState(false);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    brand: "",
    last4: "",
    expiry: "",
  });

  const handleChangePlan = async (plan: string, price: string) => {
    setPlanBusy(true);
    try {
      await changePlan(plan, price);
      toast({ title: "Plan updated", description: `Switched to ${plan}` });
      setPlanDialogOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to change plan.",
        variant: "destructive",
      });
    } finally {
      setPlanBusy(false);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelSubscription();
      toast({ title: "Subscription cancelled" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to cancel subscription.",
        variant: "destructive",
      });
    }
  };

  const handleUpsertPayment = async () => {
    if (!paymentForm.brand || !paymentForm.last4 || !paymentForm.expiry) {
      toast({
        title: "Validation error",
        description: "All payment fields are required.",
        variant: "destructive",
      });
      return;
    }
    setPaymentBusy(true);
    try {
      await upsertPayment(
        paymentForm.brand,
        paymentForm.last4,
        paymentForm.expiry,
      );
      toast({ title: "Payment method updated" });
      setPaymentDialogOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to update payment method.",
        variant: "destructive",
      });
    } finally {
      setPaymentBusy(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <CreditCard className="h-6 w-6" /> Billing
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription, payment method, and view invoices.
        </p>
      </div>

      {/* Subscription + Payment Method */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current Plan</CardTitle>
            <CardDescription>Your active subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-40" />
              </div>
            ) : subscription ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {subscription.plan}
                  </span>
                  <Badge
                    variant={
                      subscription.status === "active"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {subscription.status === "active" ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Active
                      </span>
                    ) : (
                      "Cancelled"
                    )}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    Monthly price:{" "}
                    <span className="font-medium text-foreground">
                      {subscription.price}
                    </span>
                  </p>
                  {subscription.endedAt && (
                    <p>
                      Ended:{" "}
                      <span className="font-medium text-foreground">
                        {new Date(subscription.endedAt).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPlanDialogOpen(true)}
                  >
                    Change Plan
                  </Button>
                  {subscription.status === "active" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          Cancel
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Cancel subscription?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will cancel your current plan. You will retain
                            access until the end of the billing period.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep plan</AlertDialogCancel>
                          <AlertDialogAction onClick={handleCancel}>
                            Cancel subscription
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No active subscription.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Method</CardTitle>
            <CardDescription>Card on file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : paymentMethod ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-14 rounded border border-border bg-muted flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {paymentMethod.brand} •••• {paymentMethod.last4}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expires {paymentMethod.expiry}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setPaymentForm({
                      brand: paymentMethod.brand,
                      last4: paymentMethod.last4,
                      expiry: paymentMethod.expiry,
                    });
                    setPaymentDialogOpen(true);
                  }}
                >
                  Update Payment Method
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  No payment method on file.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPaymentForm({ brand: "", last4: "", expiry: "" });
                    setPaymentDialogOpen(true);
                  }}
                >
                  Add Payment Method
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice History</CardTitle>
          <CardDescription>
            Your past invoices and payment records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invoices yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="text-sm">
                      {new Date(inv.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm">{inv.description}</TableCell>
                    <TableCell className="text-sm font-medium">
                      {inv.amount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariant(inv.status)}
                        className="text-xs capitalize"
                      >
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <Download className="h-3.5 w-3.5 mr-1" /> PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Change Plan Dialog */}
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {PLANS.map(({ plan, price }) => (
              <div
                key={plan}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{plan}</p>
                  <p className="text-xs text-muted-foreground">{price}/month</p>
                </div>
                <Button
                  size="sm"
                  variant={subscription?.plan === plan ? "default" : "outline"}
                  disabled={planBusy || subscription?.plan === plan}
                  onClick={() => handleChangePlan(plan, price)}
                >
                  {planBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : subscription?.plan === plan ? (
                    "Current"
                  ) : (
                    "Select"
                  )}
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Payment Method Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment Method</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-sm font-medium">Card Brand</label>
              <Input
                placeholder="Visa"
                value={paymentForm.brand}
                onChange={(e) =>
                  setPaymentForm((f) => ({ ...f, brand: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last 4 digits</label>
              <Input
                placeholder="4242"
                maxLength={4}
                value={paymentForm.last4}
                onChange={(e) =>
                  setPaymentForm((f) => ({ ...f, last4: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Expiry</label>
              <Input
                placeholder="12/27"
                value={paymentForm.expiry}
                onChange={(e) =>
                  setPaymentForm((f) => ({ ...f, expiry: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpsertPayment} disabled={paymentBusy}>
              {paymentBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
