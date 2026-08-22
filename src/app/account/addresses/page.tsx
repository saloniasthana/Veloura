"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Star } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormField, { inputClass } from "@/components/auth/FormField";
import { useAuth } from "@/lib/auth-context";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type Address,
} from "@/lib/addresses";

const PHONE_RE = /^[6-9]\d{9}$/;
const PINCODE_RE = /^\d{6}$/;

type Errors = Partial<Record<"fullName" | "phone" | "addressLine" | "city" | "state" | "pincode", string>>;

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
};

export default function AddressesPage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (ready && !user) {
      router.replace("/account/login?redirect=/account/addresses");
      return;
    }
    if (user) getAddresses().then(setAddresses);
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="w-full mx-auto max-w-7xl px-6 lg:px-10 py-32" />
        <Footer />
      </>
    );
  }

  function refresh() {
    if (user) getAddresses().then(setAddresses);
  }

  function openNewForm() {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
    setFormOpen(true);
  }

  function openEditForm(addr: Address) {
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine: addr.addressLine,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setErrors({});
    setEditingId(addr.id);
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const nextErrors: Errors = {};
    if (form.fullName.trim().length < 2) nextErrors.fullName = "Enter a full name.";
    if (!PHONE_RE.test(form.phone)) nextErrors.phone = "Enter a valid 10-digit phone number.";
    if (!form.addressLine.trim()) nextErrors.addressLine = "Address is required.";
    if (!form.city.trim()) nextErrors.city = "City is required.";
    if (!form.state.trim()) nextErrors.state = "State is required.";
    if (!PINCODE_RE.test(form.pincode)) nextErrors.pincode = "Enter a valid 6-digit pincode.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (editingId) {
      await updateAddress(editingId, form);
    } else {
      await addAddress({ ...form, isDefault: addresses.length === 0 });
    }
    setFormOpen(false);
    refresh();
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="w-full mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <p className="text-xs text-stone mb-6">
          <Link href="/account" className="hover:text-ink transition-colors">
            My Account
          </Link>{" "}
          <span className="mx-1.5">/</span> <span className="text-ink">Addresses</span>
        </p>

        <div className="flex items-center justify-between mb-10">
          <h1 className="font-display text-3xl md:text-4xl">Addresses</h1>
          {!formOpen ? (
            <button
              onClick={openNewForm}
              className="flex items-center gap-2 text-xs tracking-luxe uppercase border border-ink px-5 py-3 hover:bg-ink hover:text-ivory transition-colors duration-300"
            >
              <Plus size={14} strokeWidth={1.5} />
              Add Address
            </button>
          ) : null}
        </div>

        {formOpen ? (
          <form
            onSubmit={handleSave}
            className="max-w-2xl border border-line p-6 mb-10 space-y-5"
          >
            <h2 className="font-display text-xl mb-2">
              {editingId ? "Edit Address" : "New Address"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Full Name" error={errors.fullName}>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Phone" error={errors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                  }
                  className={inputClass}
                />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Address" error={errors.addressLine}>
                  <input
                    type="text"
                    value={form.addressLine}
                    onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
                    className={inputClass}
                  />
                </FormField>
              </div>
              <FormField label="City" error={errors.city}>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className={inputClass}
                />
              </FormField>
              <FormField label="State" error={errors.state}>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Pincode" error={errors.pincode}>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) =>
                    setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })
                  }
                  className={inputClass}
                />
              </FormField>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-ink text-ivory text-xs tracking-luxe uppercase px-8 py-3.5 hover:bg-charcoal transition-colors duration-300"
              >
                Save Address
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="text-xs tracking-luxe uppercase border-b border-ink pb-0.5"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {addresses.length === 0 && !formOpen ? (
          <div className="py-16 text-center border border-line max-w-2xl">
            <p className="font-display text-2xl mb-2">No saved addresses</p>
            <p className="text-sm text-stone mb-6">
              Add an address to speed up checkout next time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            {addresses.map((addr) => (
              <div key={addr.id} className="border border-line p-6">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm">{addr.fullName}</p>
                  {addr.isDefault ? (
                    <span className="flex items-center gap-1 text-[10px] tracking-luxe uppercase text-gold">
                      <Star size={11} fill="currentColor" strokeWidth={0} />
                      Default
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-stone leading-relaxed mb-4">
                  {addr.addressLine}
                  <br />
                  {addr.city}, {addr.state} {addr.pincode}
                  <br />
                  {addr.phone}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs tracking-wide uppercase">
                  <button
                    onClick={() => openEditForm(addr)}
                    className="border-b border-ink pb-0.5"
                  >
                    Edit
                  </button>
                  {!addr.isDefault ? (
                    <button
                      onClick={async () => {
                        await setDefaultAddress(addr.id);
                        refresh();
                      }}
                      className="border-b border-ink pb-0.5"
                    >
                      Set as Default
                    </button>
                  ) : null}
                  <button
                    onClick={async () => {
                      await deleteAddress(addr.id);
                      refresh();
                    }}
                    className="border-b border-red-700 text-red-700 pb-0.5"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
