"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
export default function Social() {
  const onClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: "/",
    });
  };
  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <Icon className="mr-2 h-4 w-4" icon="flat-color-icons:google" />
        Continue with Google
      </Button>
    </div>
  );
}
