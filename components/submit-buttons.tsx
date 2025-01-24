"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Loader2,
  LucideLoader2,
  ShoppingBag,
} from "lucide-react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteProduct } from "@/lib/actions";

interface buttonProps {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
}

export function SubmitButton({ text, variant }: buttonProps) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled variant={variant}>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please Wait
        </Button>
      ) : (
        <Button variant={variant} type="submit">
          {text}
        </Button>
      )}
    </>
  );
}

export function ShoppingBagButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled size="lg" className="w-full mt-5">
          <Loader2 className="mr-4 h-5 w-5 animate-spin" /> Please Wait
        </Button>
      ) : (
        <Button size="lg" className="w-full mt-5" type="submit">
          <ShoppingBag className="mr-4 h-5 w-5" /> Add to Cart
        </Button>
      )}
    </>
  );
}

export function DeleteItem() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <button disabled className="font-medium text-primary text-end">
          Removing...
        </button>
      ) : (
        <button type="submit" className="font-medium text-primary text-end">
          Delete
        </button>
      )}
    </>
  );
}

export function CheckoutButton({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleCheckout = () => {
    if (!session) {
      localStorage.setItem("returnTo", "/checkout");
      router.push("/auth/sign-in");
      return;
    }
    router.push("/checkout");
    onClose();
  };

  return (
    <button
      onClick={handleCheckout}
      className="w-full transition-all ease-in-out flex items-center justify-between bg-black text-white p-4 font-mono"
    >
      CONTINUE
      <ChevronRight className="h-4 w-4" />
    </button>
  );
}

export function DeleteProductModal({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteProduct(productId);
      toast({
        title: "Success",
        description: `Product "${productName}" deleted successfully`,
        variant: "default",
      });
      setIsOpen(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="px-2 flex items-center gap-x-1">
          Delete
          <Trash2 className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="w-[500px] max-h-[180px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete "
            {productName}" and remove all related data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            {loading ? <LucideLoader2 className="animate-spin" /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
