"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { LucideLoader2 } from "lucide-react";

export default function PendingButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <div>
      {pending ? (
        <Button className="w-full" type="submit">
          <LucideLoader2 className="animate-spin h-4 w-4 mr-2" /> Please Wait...
        </Button>
      ) : (
        <Button
          className="h-11 w-full bg-[#e4e1f9] text-black hover:bg-[#e4e1f9]/90"
          type="submit"
        >
          {children}
        </Button>
      )}
    </div>
  );
}
