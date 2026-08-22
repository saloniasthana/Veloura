import Placeholder from "../Placeholder";

type LineItem = {
  key?: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  seed: number;
};

export default function OrderSummary({
  items,
  subtotal,
  shippingCost,
  total,
}: {
  items: LineItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}) {
  return (
    <div className="border border-line p-6">
      <h2 className="font-display text-xl mb-6">Order Summary</h2>

      <div className="space-y-5 mb-6">
        {items.map((item) => (
          <div key={item.key ?? item.name} className="flex gap-4">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-ivory-dim">
              <Placeholder seed={item.seed} className="h-full w-full" />
              <span className="absolute -top-2 -right-2 bg-ink text-ivory text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{item.name}</p>
              <p className="text-xs text-stone mt-1">
                {item.color} / {item.size}
              </p>
            </div>
            <p className="text-sm shrink-0">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-line pt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone">Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone">Shipping</span>
          <span>
            {shippingCost === 0 ? "Complimentary" : `₹${shippingCost.toLocaleString("en-IN")}`}
          </span>
        </div>
        <div className="flex items-center justify-between text-base pt-2 border-t border-line mt-2">
          <span>Total</span>
          <span>₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}
