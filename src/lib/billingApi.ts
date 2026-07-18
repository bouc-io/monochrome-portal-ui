import { useState, useEffect, useCallback } from "react";
import { portalApiClient } from "./api";

export interface Subscription {
  id: string;
  plan: string;
  status: string;
  price: string;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

function mapSubscription(raw: Record<string, unknown>): Subscription {
  return {
    id: raw.id as string,
    plan: raw.plan as string,
    status: raw.status as string,
    price: raw.price as string,
    startedAt: raw.started_at as string,
    endedAt: (raw.ended_at as string | null) ?? null,
    createdAt: raw.created_at as string,
    updatedAt: raw.updated_at as string,
  };
}

function mapInvoice(raw: Record<string, unknown>): Invoice {
  return {
    id: raw.id as string,
    date: raw.date as string,
    description: raw.description as string,
    amount: raw.amount as string,
    status: raw.status as string,
    createdAt: raw.created_at as string,
    updatedAt: raw.updated_at as string,
  };
}

function mapPaymentMethod(raw: Record<string, unknown>): PaymentMethod {
  return {
    id: raw.id as string,
    brand: raw.brand as string,
    last4: raw.last4 as string,
    expiry: raw.expiry as string,
    isDefault: raw.is_default as boolean,
    createdAt: raw.created_at as string,
    updatedAt: raw.updated_at as string,
  };
}

export function useBillingApi() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      portalApiClient.get("/v1/portal/billings/subscription"),
      portalApiClient.get("/v1/portal/billings/invoices"),
      portalApiClient.get("/v1/portal/payments"),
    ])
      .then(([subRes, invRes, payRes]) => {
        const current = subRes.data.current;
        setSubscription(current ? mapSubscription(current as Record<string, unknown>) : null);
        setInvoices(
          (invRes.data.invoices as Record<string, unknown>[]).map(mapInvoice)
        );
        const methods = payRes.data.payment_methods as Record<string, unknown>[];
        const defaultMethod = methods.find((m) => m.is_default) ?? methods[0] ?? null;
        setPaymentMethod(defaultMethod ? mapPaymentMethod(defaultMethod) : null);
      })
      .catch((err) => console.error("Failed to load billing data", err))
      .finally(() => setLoading(false));
  }, []);

  const changePlan = useCallback(async (plan: string, price: string): Promise<void> => {
    const res = await portalApiClient.put("/v1/portal/billings/subscription", { plan, price });
    const current = res.data.current;
    setSubscription(current ? mapSubscription(current as Record<string, unknown>) : null);
  }, []);

  const cancelSubscription = useCallback(async (): Promise<void> => {
    const res = await portalApiClient.put("/v1/portal/billings/subscription", { cancel: true });
    const current = res.data.current;
    setSubscription(current ? mapSubscription(current as Record<string, unknown>) : null);
  }, []);

  const upsertPayment = useCallback(async (brand: string, last4: string, expiry: string): Promise<void> => {
    const res = await portalApiClient.put("/v1/portal/payments", { brand, last4, expiry });
    setPaymentMethod(mapPaymentMethod(res.data as Record<string, unknown>));
  }, []);

  return { subscription, invoices, paymentMethod, loading, changePlan, cancelSubscription, upsertPayment };
}
