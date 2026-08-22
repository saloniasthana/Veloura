export type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

export type AddressInput = Omit<Address, "id" | "isDefault"> & {
  isDefault?: boolean;
};

export async function getAddresses(): Promise<Address[]> {
  const res = await fetch("/api/addresses");
  if (!res.ok) return [];
  const data = await res.json();
  return data.addresses;
}

export async function addAddress(input: AddressInput): Promise<Address | null> {
  const res = await fetch("/api/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.address;
}

export async function updateAddress(
  id: string,
  input: Omit<AddressInput, "isDefault">
): Promise<Address | null> {
  const res = await fetch(`/api/addresses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.address;
}

export async function setDefaultAddress(id: string): Promise<Address | null> {
  const res = await fetch(`/api/addresses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ setDefault: true }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.address;
}

export async function deleteAddress(id: string): Promise<boolean> {
  const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
  return res.ok;
}
