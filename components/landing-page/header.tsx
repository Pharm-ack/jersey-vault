"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logout } from "@/lib/actions";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Cart } from "../cart/cart";
import { useCart } from "../cart/cart-context";
import { SearchBar } from "../searchbar";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { items } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Search Overlay */}
        {isMobileSearchOpen && (
          <div className="fixed inset-0 z-50 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <SearchBar />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Logo */}
            <Link href="/" className="text-xl font-bold">
              JERSEY VAULT
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Navigation - Moved to right */}
            <div className="hidden lg:flex items-center gap-4">
              {/* <SearchBar /> */}

              {session?.user.role === "ADMIN" ? (
                <Link
                  className={cn(buttonVariants({ variant: "ghost" }))}
                  href="/dashboard/overview"
                >
                  Overview
                </Link>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost">Dashboard</Button>
                  </DialogTrigger>

                  <DialogContent className="w-[500px] max-h-[150px]">
                    <DialogHeader>
                      <DialogTitle>
                        Log in as Admin to view dashboard
                      </DialogTitle>
                      <DialogDescription>
                        You have to log in as an admin in order to view the
                        admin dashboard.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-end gap-3 justify-end">
                      <DialogClose asChild>
                        <button
                          className="bg-primary px-3 py-2 rounded-md shadow-sm text-white font-semibold text-sm"
                          onClick={() => {
                            session && logout();
                            router.push("/auth/sign-in?role=admin");
                          }}
                        >
                          Log in as Admin
                        </button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Mobile Search Button */}
            {/* <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <Search className="h-6 w-6" />
            </Button> */}

            {/* Cart Button */}
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative"
              aria-label="Cart"
              variant="ghost"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Button>

            {/* Desktop Auth Button */}
            <div className="hidden lg:block">
              {session ? (
                <Button
                  onClick={() => {
                    logout();
                  }}
                >
                  Sign Out
                </Button>
              ) : (
                <Button asChild>
                  <Link prefetch href="/auth/sign-in">
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  Dashboard
                </Button>
              </DialogTrigger>
              <DialogTitle></DialogTitle>
              <DialogContent className="rounded w-[350px] max-h-[200px]">
                <DialogHeader>
                  <DialogTitle>Log in as Admin to view dashboard</DialogTitle>
                  <DialogDescription>
                    You have to log in as an admin in order to view the admin
                    dashboard.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-end gap-3 justify-end">
                  <DialogClose asChild>
                    <button
                      className="bg-primary px-3 py-2 rounded-md shadow-sm text-white font-semibold text-sm"
                      onClick={() => {
                        session && logout();
                        router.push("/auth/sign-in?role=admin");
                      }}
                    >
                      Log in as Admin
                    </button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>

            {session ? (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
              >
                Sign Out
              </Button>
            ) : (
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link prefetch href="/auth/sign-in">
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Cart Sidebar */}
      <Cart isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </nav>
  );
}
