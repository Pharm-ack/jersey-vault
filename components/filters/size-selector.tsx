"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SizeSelectorProps {
  sizes: string[];
}

export function SizeSelector({ sizes }: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Select Size</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Button
            key={size}
            variant={selectedSize === size ? "default" : "outline"}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
}
