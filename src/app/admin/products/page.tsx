"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import FormField, { inputClass } from "@/components/auth/FormField";
import ProductImage from "@/components/ProductImage";
import { useRequireAdmin } from "@/lib/admin";
import { ALL_SIZES, ALL_COLORS, CATEGORIES, type Product } from "@/lib/products";

type Errors = Partial<Record<"name" | "description" | "price" | "category" | "sizes" | "colors", string>>;

const MAX_IMAGES = 4;

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  compareAt: "",
  category: "Women" as string,
  sizes: [] as string[],
  colors: [] as string[],
  images: [] as string[],
  isNew: false,
};

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/products");
  if (!res.ok) return [];
  const data = await res.json();
  return data.products;
}

export default function AdminProductsPage() {
  const ready = useRequireAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ready) fetchProducts().then(setProducts);
  }, [ready]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [products, query, category]);

  if (!ready) return null;

  function refresh() {
    fetchProducts().then(setProducts);
  }

  function openNewForm() {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
    setFormOpen(true);
  }

  function openEditForm(p: Product) {
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      compareAt: p.compareAt != null ? String(p.compareAt) : "",
      category: p.category,
      sizes: p.sizes,
      colors: p.colors.map((c) => c.name),
      images: p.images,
      isNew: p.isNew,
    });
    setErrors({});
    setEditingId(p.id);
    setFormOpen(true);
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    setUploadError("");
    setUploading(true);
    for (const file of files) {
      if (form.images.length >= MAX_IMAGES) break;
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      if (res.ok) {
        const data = await res.json();
        setForm((f) => ({ ...f, images: [...f.images, data.url] }));
      } else {
        const data = await res.json().catch(() => ({}));
        setUploadError(data?.error ?? "Upload failed.");
      }
    }
    setUploading(false);
  }

  function removeImage(url: string) {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));
  }

  function toggleSize(size: string) {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }));
  }

  function toggleColor(name: string) {
    setForm((f) => ({
      ...f,
      colors: f.colors.includes(name) ? f.colors.filter((c) => c !== name) : [...f.colors, name],
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors: Errors = {};
    if (form.name.trim().length < 2) nextErrors.name = "Enter a product name.";
    if (form.description.trim().length < 10) nextErrors.description = "Enter a longer description.";
    if (!Number(form.price) || Number(form.price) <= 0) nextErrors.price = "Enter a valid price.";
    if (form.sizes.length === 0) nextErrors.sizes = "Select at least one size.";
    if (form.colors.length === 0) nextErrors.colors = "Select at least one color.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      compareAt: form.compareAt ? Number(form.compareAt) : null,
      category: form.category,
      sizes: form.sizes,
      colors: form.colors.map((name) => ALL_COLORS.find((c) => c.name === name)!),
      images: form.images,
      isNew: form.isNew,
    };

    const res = editingId
      ? await fetch(`/api/products/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    setSaving(false);
    if (res.ok) {
      setFormOpen(false);
      refresh();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this product from the catalog?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs tracking-luxe uppercase text-gold mb-3">Dashboard</p>
          <h1 className="font-display text-3xl">Products</h1>
        </div>
        {!formOpen ? (
          <button
            onClick={openNewForm}
            className="flex items-center gap-2 text-xs tracking-luxe uppercase border border-ink px-5 py-3 hover:bg-ink hover:text-ivory transition-colors duration-300"
          >
            <Plus size={14} strokeWidth={1.5} />
            Add Product
          </button>
        ) : null}
      </div>

      {formOpen ? (
        <form
          onSubmit={handleSave}
          className="max-w-2xl border border-line p-6 mb-10 space-y-5"
        >
          <h2 className="font-display text-xl mb-2">
            {editingId ? "Edit Product" : "New Product"}
          </h2>

          <FormField label="Name" error={errors.name}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </FormField>

          <FormField label="Description" error={errors.description}>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${inputClass} min-h-24 resize-y`}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <FormField label="Price (₹)" error={errors.price}>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="Compare-at Price (optional)">
              <input
                type="number"
                value={form.compareAt}
                onChange={(e) => setForm({ ...form, compareAt: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="Category">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Sizes" error={errors.sizes}>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`text-xs px-3 py-2 border transition-colors ${
                    form.sizes.includes(size)
                      ? "border-ink bg-ink text-ivory"
                      : "border-line text-charcoal hover:border-ink"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="Colors" error={errors.colors}>
            <div className="flex flex-wrap gap-3">
              {ALL_COLORS.map((color) => (
                <button
                  type="button"
                  key={color.name}
                  title={color.name}
                  onClick={() => toggleColor(color.name)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    form.colors.includes(color.name) ? "border-gold" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </FormField>

          <FormField label={`Photos (${form.images.length}/${MAX_IMAGES})`}>
            <div className="flex flex-wrap gap-3 mb-3">
              {form.images.map((url) => (
                <div key={url} className="relative h-24 w-20 overflow-hidden bg-ivory-dim">
                  <ProductImage src={url} seed={0} alt="Product photo" className="h-full w-full" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-ink/80 text-ivory flex items-center justify-center"
                  >
                    <X size={12} strokeWidth={2} />
                  </button>
                </div>
              ))}
              {form.images.length < MAX_IMAGES ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="h-24 w-20 border border-dashed border-line text-stone text-xs flex items-center justify-center hover:border-ink transition-colors disabled:opacity-60"
                >
                  {uploading ? "…" : <Plus size={16} strokeWidth={1.5} />}
                </button>
              ) : null}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            {uploadError ? <p className="text-xs text-red-700">{uploadError}</p> : null}
          </FormField>

          <label className="flex items-center gap-2.5 text-sm text-charcoal cursor-pointer">
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
              className="h-4 w-4 accent-[#1a1815]"
            />
            Mark as New
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-ink text-ivory text-xs tracking-luxe uppercase px-8 py-3.5 hover:bg-charcoal transition-colors duration-300 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Product"}
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-xs px-3 py-2 border transition-colors ${
                category === c
                  ? "border-ink bg-ink text-ivory"
                  : "border-line text-charcoal hover:border-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-line px-4 py-2.5 text-sm bg-ivory focus:outline-none focus:border-ink transition-colors w-full sm:w-64"
        />
      </div>

      <div className="border border-line overflow-x-auto">
        <table className="w-full text-sm min-w-180">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="px-6 py-3 text-xs tracking-luxe uppercase text-stone font-normal" />
              <th className="px-6 py-3 text-xs tracking-luxe uppercase text-stone font-normal">
                Product
              </th>
              <th className="px-6 py-3 text-xs tracking-luxe uppercase text-stone font-normal">
                Category
              </th>
              <th className="px-6 py-3 text-xs tracking-luxe uppercase text-stone font-normal">
                Price
              </th>
              <th className="px-6 py-3 text-xs tracking-luxe uppercase text-stone font-normal">
                Sizes
              </th>
              <th className="px-6 py-3 text-xs tracking-luxe uppercase text-stone font-normal" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="pl-6 py-4 w-16">
                  <div className="relative h-12 w-10 overflow-hidden bg-ivory-dim">
                    <ProductImage src={p.images[0]} seed={p.seed} alt={p.name} className="h-full w-full" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  {p.name}
                  {p.isNew ? (
                    <span className="ml-2 text-[10px] tracking-luxe uppercase text-gold">
                      New
                    </span>
                  ) : null}
                </td>
                <td className="px-6 py-4 text-stone">{p.category}</td>
                <td className="px-6 py-4">₹{p.price.toLocaleString("en-IN")}</td>
                <td className="px-6 py-4 text-stone">{p.sizes.join(", ")}</td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <button
                    onClick={() => openEditForm(p)}
                    className="text-xs tracking-wide uppercase border-b border-ink pb-0.5 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-xs tracking-wide uppercase border-b border-red-700 text-red-700 pb-0.5"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
