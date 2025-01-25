"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function Social() {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async (provider: "google") => {
    try {
      setIsLoading(true);
      await signIn(provider, {
        callbackUrl: "/",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Please Wait...
          </>
        ) : (
          <>
            <Icon className="mr-2 h-4 w-4" icon="flat-color-icons:google" />
            Continue with Google
          </>
        )}
      </Button>
    </div>
  );
}
