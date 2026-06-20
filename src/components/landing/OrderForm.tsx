import { CheckCircle2, Loader2, MessageCircle, Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { currency } from "../../lib/format";
import { hasErrors, validateOrderForm, type ValidationErrors } from "../../lib/validation";
import type { OrderFormFields, OrderInsert, Product } from "../../types";
import { AnimatedSection } from "../ui/AnimatedSection";
import { Button } from "../ui/Button";

type OrderFormProps = {
  products: Product[];
  selectedProduct: Product;
  initialQuantity: number;
  onProductChange: (product: Product) => void;
  onQuantityChange: (quantity: number) => void;
};

const emptyFields: OrderFormFields = {
  customer_name: "",
  mobile_number: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export function OrderForm({
  products,
  selectedProduct,
  initialQuantity,
  onProductChange,
  onQuantityChange,
}: OrderFormProps) {
  const [fields, setFields] = useState<OrderFormFields>(emptyFields);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<OrderInsert | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const quantity = Math.max(1, initialQuantity || 1);
  const total = useMemo(() => selectedProduct.price * quantity, [quantity, selectedProduct.price]);

  const updateField = (name: keyof OrderFormFields, value: string) => {
    setFields((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const submitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSuccess(null);

    const nextErrors = validateOrderForm(fields);
    setErrors(nextErrors);
    if (hasErrors(nextErrors) || !selectedProduct?.product_name || quantity < 1) return;

    const payload: OrderInsert = {
      customer_name: fields.customer_name.trim(),
      mobile_number: fields.mobile_number.trim(),
      address: fields.address.trim(),
      city: fields.city.trim(),
      state: fields.state.trim(),
      pincode: fields.pincode.trim(),
      product_name: selectedProduct.product_name,
      quantity,
      payment_method: "Cash on Delivery",
      total_amount: total,
      status: "New",
    };

    setSubmitting(true);
    const { error } = await supabase.from("orders").insert(payload);
    setSubmitting(false);

    if (error) {
      setSubmitError(
        error.message.includes("row-level security")
          ? "Order could not be placed because Supabase RLS is not configured. Please run the SQL setup script."
          : error.message,
      );
      return;
    }

    setSuccess(payload);
    setFields(emptyFields);
  };

  return (
    <AnimatedSection id="order" className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
      <div className="sticky top-28">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-teal-700">COD Order Form</p>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-6xl">
          Order FurEase in under a minute.
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          No login. No prepaid payment. Enter your delivery details and our team will process your COD order.
        </p>
        <div className="mt-7 rounded-[2rem] bg-emerald-50 p-5 text-emerald-950 ring-1 ring-emerald-100">
          <div className="flex gap-3">
            <MessageCircle className="mt-1 h-5 w-5 shrink-0" />
            <p className="text-sm font-semibold leading-6">
              Use your active WhatsApp number for faster order confirmation and delivery updates.
            </p>
          </div>
        </div>
      </div>

      <form className="rounded-[2rem] bg-white p-5 shadow-2xl shadow-slate-950/[0.06] ring-1 ring-slate-100 sm:p-8" onSubmit={submitOrder}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            error={errors.customer_name}
            label="Full Name"
            name="customer_name"
            onChange={(value) => updateField("customer_name", value)}
            value={fields.customer_name}
          />
          <Field
            error={errors.mobile_number}
            inputMode="numeric"
            label="Mobile Number / WhatsApp Number"
            maxLength={10}
            name="mobile_number"
            onChange={(value) => updateField("mobile_number", value.replace(/\D/g, ""))}
            value={fields.mobile_number}
          />
          <div className="sm:col-span-2">
            <label className="text-sm font-black text-slate-800" htmlFor="address">
              Complete Address
            </label>
            <textarea
              className="mt-2 min-h-28 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
              id="address"
              name="address"
              onChange={(event) => updateField("address", event.target.value)}
              placeholder="House number, street, area, landmark"
              value={fields.address}
            />
            {errors.address ? <p className="mt-2 text-xs font-semibold text-rose-600">{errors.address}</p> : null}
          </div>
          <Field error={errors.city} label="City" name="city" onChange={(value) => updateField("city", value)} value={fields.city} />
          <Field error={errors.state} label="State" name="state" onChange={(value) => updateField("state", value)} value={fields.state} />
          <Field
            error={errors.pincode}
            inputMode="numeric"
            label="Pincode"
            maxLength={6}
            name="pincode"
            onChange={(value) => updateField("pincode", value.replace(/\D/g, ""))}
            value={fields.pincode}
          />
          <div>
            <label className="text-sm font-black text-slate-800" htmlFor="product_name">
              Product
            </label>
            <select
              className="mt-2 h-12 w-full rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
              id="product_name"
              name="product_name"
              onChange={(event) => {
                const next = products.find((product) => product.id === event.target.value);
                if (next) onProductChange(next);
              }}
              value={selectedProduct.id}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.product_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-black text-slate-800">Quantity</label>
            <div className="mt-2 flex h-12 items-center justify-between rounded-full border border-slate-200 bg-slate-50 px-2">
              <button className="rounded-full p-2 hover:bg-white" onClick={() => onQuantityChange(quantity - 1)} type="button">
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm font-black">{quantity}</span>
              <button className="rounded-full p-2 hover:bg-white" onClick={() => onQuantityChange(quantity + 1)} type="button">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-black text-slate-800" htmlFor="payment_method">
              Payment Method
            </label>
            <input
              className="mt-2 h-12 w-full rounded-full border border-slate-200 bg-slate-100 px-4 text-sm font-bold text-slate-700"
              id="payment_method"
              name="payment_method"
              readOnly
              value="Cash on Delivery"
            />
          </div>
          <div className="rounded-3xl bg-slate-950 p-5 text-white sm:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-white/60">Total Amount</p>
                <p className="text-3xl font-black">{currency.format(total)}</p>
              </div>
              <p className="max-w-40 text-right text-xs font-semibold leading-5 text-teal-100">
                Status will be created as New with Supabase order timestamp.
              </p>
            </div>
          </div>
        </div>

        {submitError ? <p className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{submitError}</p> : null}

        {success ? (
          <div className="mt-5 rounded-3xl bg-teal-50 p-5 text-teal-950 ring-1 ring-teal-100">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0" />
              <div>
                <p className="font-black">Order placed successfully.</p>
                <p className="mt-1 text-sm leading-6">
                  {success.customer_name}, your COD order for {success.quantity} x {success.product_name} is confirmed as New.
                  Total payable on delivery: {currency.format(success.total_amount)}.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <Button className="mt-6 w-full py-4" disabled={submitting} type="submit">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {submitting ? "Placing COD Order" : "Place COD Order"}
        </Button>
      </form>
    </AnimatedSection>
  );
}

type FieldProps = {
  error?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  label: string;
  maxLength?: number;
  name: keyof OrderFormFields;
  onChange: (value: string) => void;
  value: string;
};

function Field({ error, inputMode, label, maxLength, name, onChange, value }: FieldProps) {
  return (
    <div>
      <label className="text-sm font-black text-slate-800" htmlFor={name}>
        {label}
      </label>
      <input
        className="mt-2 h-12 w-full rounded-full border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
        id={name}
        inputMode={inputMode}
        maxLength={maxLength}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
      {error ? <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p> : null}
    </div>
  );
}