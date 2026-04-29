"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { checkoutFormSchema, type CheckoutFormValues } from "@/lib/validators/orderValidator";

export type { CheckoutFormValues };

interface CheckoutFormProps {
  onSubmit: (values: CheckoutFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const fieldBase =
  "w-full rounded-xl border bg-black/20 px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition";

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    mode: "onChange",
    defaultValues: { name: "", phone: "", address: "" },
  });

  return (
    <form className="glass-card space-y-5 p-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h1 className="font-display text-4xl">Complete Your Order</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Almost there! Just a few details.</p>
      </div>

      <label className="block">
        <span className="mb-2 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)]">Full Name</span>
        <div className="relative">
          <input
            {...register("name")}
            className={`${fieldBase} ${
              errors.name
                ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
                : touchedFields.name
                  ? "border-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.18)]"
                  : "border-white/10 focus:border-[#FF5C1A] focus:shadow-[0_0_0_3px_rgba(255,92,26,0.2)]"
            }`}
            placeholder="John Carter"
          />
          {touchedFields.name && !errors.name ? (
            <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400" size={16} />
          ) : null}
        </div>
        {errors.name ? (
          <motion.p initial={{ x: 0 }} animate={{ x: [0, -4, 4, -3, 3, 0] }} className="mt-1 text-xs text-red-400">
            {errors.name.message}
          </motion.p>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-2 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)]">Phone Number</span>
        <div className="relative">
          <input
            {...register("phone")}
            className={`${fieldBase} ${
              errors.phone
                ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
                : touchedFields.phone
                  ? "border-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.18)]"
                  : "border-white/10 focus:border-[#FF5C1A] focus:shadow-[0_0_0_3px_rgba(255,92,26,0.2)]"
            }`}
            placeholder="+919999999999"
          />
          {touchedFields.phone && !errors.phone ? (
            <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400" size={16} />
          ) : null}
        </div>
        {errors.phone ? (
          <motion.p initial={{ x: 0 }} animate={{ x: [0, -4, 4, -3, 3, 0] }} className="mt-1 text-xs text-red-400">
            {errors.phone.message}
          </motion.p>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-2 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)]">Delivery Address</span>
        <textarea
          rows={3}
          {...register("address")}
          className={`${fieldBase} resize-none ${
            errors.address
              ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
              : touchedFields.address
                ? "border-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.18)]"
                : "border-white/10 focus:border-[#FF5C1A] focus:shadow-[0_0_0_3px_rgba(255,92,26,0.2)]"
          }`}
          placeholder="221B Baker Street, London..."
        />
        {errors.address ? (
          <motion.p initial={{ x: 0 }} animate={{ x: [0, -4, 4, -3, 3, 0] }} className="mt-1 text-xs text-red-400">
            {errors.address.message}
          </motion.p>
        ) : null}
      </label>

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Placing your order...
          </>
        ) : (
          "Place Order"
        )}
      </button>
    </form>
  );
}
