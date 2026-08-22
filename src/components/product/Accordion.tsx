"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function Accordion({
  items,
}: {
  items: { title: string; content: React.ReactNode }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="border-t border-line">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.title} className="border-b border-line">
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="text-sm tracking-wide">{item.title}</span>
              {open ? (
                <Minus size={15} strokeWidth={1.5} />
              ) : (
                <Plus size={15} strokeWidth={1.5} />
              )}
            </button>
            {open ? (
              <div className="pb-5 text-sm text-charcoal leading-relaxed">
                {item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
