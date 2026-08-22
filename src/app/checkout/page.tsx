"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderSummary from "@/components/checkout/OrderSummary";
import FormField, { inputClass } from "@/components/auth/FormField";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { createOrder } from "@/lib/orders";
import { getAddresses, addAddress, type Address } from "@/lib/addresses";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;
const PINCODE_RE = /^\d{6}$/;

type ShippingMethod = "standard" | "express";
type PaymentMethod = "card" | "upi" | "cod";

type Errors = Partial<{
  email: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, ready, subtotal, clear } = useCart();
  const { user } = useAuth();

  const [email, setEmail] = useState(user?.email ?? "");
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [saveAddress, setSaveAddress] = useState(false);

  useEffect(() => {
    if (!user) return;
    setEmail((prev) => prev || user.email);
    setFullName((prev) => prev || user.name);

    getAddresses().then((addresses) => {
      setSavedAddresses(addresses);
      const defaultAddress = addresses.find((a) => a.isDefault);
      if (defaultAddress) {
        setPhone((prev) => prev || defaultAddress.phone);
        setAddressLine((prev) => prev || defaultAddress.addressLine);
        setCity((prev) => prev || defaultAddress.city);
        setState((prev) => prev || defaultAddress.state);
        setPincode((prev) => prev || defaultAddress.pincode);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function clearError(field: keyof Errors) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  function applyAddress(addr: Address) {
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setAddressLine(addr.addressLine);
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
    setErrors({});
  }

  const shippingCost =
    shippingMethod === "express" ? 499 : subtotal >= 4999 ? 0 : 199;
  const total = subtotal + shippingCost;

  if (ready && items.length === 0) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="w-full mx-auto max-w-7xl px-6 lg:px-10 py-32 text-center">
          <p className="font-display text-2xl mb-2">Your bag is empty</p>
          <p className="text-sm text-stone mb-6">
            Add something you love before checking out.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center border border-ink text-xs tracking-luxe uppercase px-8 py-3.5 hover:bg-ink hover:text-ivory transition-colors duration-300"
          >
            Continue Shopping
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors: Errors = {};
    if (!EMAIL_RE.test(email)) nextErrors.email = "Enter a valid email address.";
    if (fullName.trim().length < 2) nextErrors.fullName = "Enter your full name.";
    if (!PHONE_RE.test(phone)) nextErrors.phone = "Enter a valid 10-digit phone number.";
    if (!addressLine.trim()) nextErrors.addressLine = "Address is required.";
    if (!city.trim()) nextErrors.city = "City is required.";
    if (!state.trim()) nextErrors.state = "State is required.";
    if (!PINCODE_RE.test(pincode)) nextErrors.pincode = "Enter a valid 6-digit pincode.";

    if (paymentMethod === "card") {
      if (!/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(cardNumber))
        nextErrors.cardNumber = "Enter a valid 16-digit card number.";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry))
        nextErrors.expiry = "Use MM/YY format.";
      if (!/^\d{3}$/.test(cvv)) nextErrors.cvv = "Enter a valid CVV.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      const order = await createOrder({
        items: items.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
          seed: i.seed,
        })),
        subtotal,
        shippingCost,
        total,
        shippingMethod,
        paymentMethod,
        address: { fullName, email, phone, addressLine, city, state, pincode },
      });

      if (user && saveAddress) {
        await addAddress({
          fullName,
          phone,
          addressLine,
          city,
          state,
          pincode,
          isDefault: savedAddresses.length === 0,
        });
      }
      clear();
      router.push(`/order-confirmation?orderId=${order.id}`);
    } catch {
      setSubmitting(false);
      setErrors({ addressLine: "Something went wrong placing your order. Please try again." });
    }
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="w-full mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <p className="text-xs text-stone mb-6">
          <Link href="/shop" className="hover:text-ink transition-colors">
            Shop
          </Link>{" "}
          <span className="mx-1.5">/</span> <span className="text-ink">Checkout</span>
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 xl:gap-16"
        >
          <div className="space-y-12">
            <section>
              <p className="text-xs tracking-luxe uppercase text-gold mb-4">
                01 — Contact
              </p>
              <FormField label="Email" error={errors.email}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  className={inputClass}
                  autoComplete="email"
                />
              </FormField>
            </section>

            <section>
              <p className="text-xs tracking-luxe uppercase text-gold mb-4">
                02 — Shipping Address
              </p>

              {savedAddresses.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-5">
                  {savedAddresses.map((addr) => (
                    <button
                      type="button"
                      key={addr.id}
                      onClick={() => applyAddress(addr)}
                      className="text-xs px-3 py-2 border border-line hover:border-ink transition-colors text-left"
                    >
                      {addr.fullName} — {addr.city}
                      {addr.isDefault ? (
                        <span className="text-gold"> (Default)</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Full Name" error={errors.fullName}>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      clearError("fullName");
                    }}
                    className={inputClass}
                    autoComplete="name"
                  />
                </FormField>
                <FormField label="Phone" error={errors.phone}>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                      clearError("phone");
                    }}
                    className={inputClass}
                    autoComplete="tel"
                  />
                </FormField>
                <div className="sm:col-span-2">
                  <FormField label="Address" error={errors.addressLine}>
                    <input
                      type="text"
                      value={addressLine}
                      onChange={(e) => {
                        setAddressLine(e.target.value);
                        clearError("addressLine");
                      }}
                      className={inputClass}
                      autoComplete="address-line1"
                    />
                  </FormField>
                </div>
                <FormField label="City" error={errors.city}>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      clearError("city");
                    }}
                    className={inputClass}
                    autoComplete="address-level2"
                  />
                </FormField>
                <FormField label="State" error={errors.state}>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      clearError("state");
                    }}
                    className={inputClass}
                    autoComplete="address-level1"
                  />
                </FormField>
                <FormField label="Pincode" error={errors.pincode}>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                      clearError("pincode");
                    }}
                    className={inputClass}
                    autoComplete="postal-code"
                  />
                </FormField>
              </div>

              {user ? (
                <label className="flex items-center gap-2.5 mt-5 text-sm text-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="h-4 w-4 accent-[#1a1815]"
                  />
                  Save this address for future orders
                </label>
              ) : null}
            </section>

            <section>
              <p className="text-xs tracking-luxe uppercase text-gold mb-4">
                03 — Shipping Method
              </p>
              <div className="space-y-3">
                {(
                  [
                    {
                      id: "standard" as const,
                      label: "Standard Shipping",
                      eta: "5–7 business days",
                      price: subtotal >= 4999 ? 0 : 199,
                    },
                    {
                      id: "express" as const,
                      label: "Express Shipping",
                      eta: "2–3 business days",
                      price: 499,
                    },
                  ]
                ).map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between border px-5 py-4 cursor-pointer transition-colors ${
                      shippingMethod === option.id
                        ? "border-ink"
                        : "border-line hover:border-charcoal"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === option.id}
                        onChange={() => setShippingMethod(option.id)}
                        className="accent-[#1a1815]"
                      />
                      <div>
                        <p className="text-sm">{option.label}</p>
                        <p className="text-xs text-stone">{option.eta}</p>
                      </div>
                    </div>
                    <p className="text-sm">
                      {option.price === 0 ? "Free" : `₹${option.price}`}
                    </p>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-xs tracking-luxe uppercase text-gold">
                  04 — Payment
                </p>
                <span className="text-[10px] tracking-wide uppercase text-stone border border-line px-2 py-0.5">
                  Test Mode
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {(
                  [
                    { id: "card" as const, label: "Card" },
                    { id: "upi" as const, label: "UPI" },
                    { id: "cod" as const, label: "Cash on Delivery" },
                  ]
                ).map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => setPaymentMethod(option.id)}
                    className={`text-xs px-3 py-3 border transition-colors ${
                      paymentMethod === option.id
                        ? "border-ink bg-ink text-ivory"
                        : "border-line text-charcoal hover:border-ink"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {paymentMethod === "card" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <FormField label="Card Number" error={errors.cardNumber}>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => {
                          setCardNumber(e.target.value);
                          clearError("cardNumber");
                        }}
                        className={inputClass}
                        autoComplete="cc-number"
                      />
                    </FormField>
                  </div>
                  <FormField label="Expiry (MM/YY)" error={errors.expiry}>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => {
                        setExpiry(e.target.value);
                        clearError("expiry");
                      }}
                      className={inputClass}
                      autoComplete="cc-exp"
                    />
                  </FormField>
                  <FormField label="CVV" error={errors.cvv}>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => {
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 3));
                        clearError("cvv");
                      }}
                      className={inputClass}
                      autoComplete="cc-csc"
                    />
                  </FormField>
                </div>
              ) : paymentMethod === "upi" ? (
                <p className="text-sm text-stone">
                  You'll be redirected to your UPI app to complete payment.
                </p>
              ) : (
                <p className="text-sm text-stone">
                  Pay with cash when your order is delivered.
                </p>
              )}
            </section>
          </div>

          <div className="space-y-6">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              total={total}
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-ink text-ivory text-xs tracking-luxe uppercase py-4 hover:bg-charcoal transition-colors duration-300 disabled:opacity-60"
            >
              {submitting ? "Placing Order…" : `Place Order — ₹${total.toLocaleString("en-IN")}`}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
