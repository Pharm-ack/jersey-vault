import Link from "next/link";
import { Command } from "lucide-react";
import SignInForm from "@/components/auth/sign-in";

export default function SignInPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left panel */}
      <div
        className="relative hidden flex-col p-10 text-white lg:flex"
        style={{
          backgroundImage:
            "url(https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/black-background-texture.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex items-center gap-2 text-lg font-medium">
          <Command className="h-6 w-6" />
          <span>JerseyShop</span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              “Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              eget augue nec massa volutpat aliquet.”
            </p>
            <footer className="text-sm">Pharmack</footer>
          </blockquote>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Hi, Welcome back 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to sign in your account
            </p>
          </div>

          <SignInForm />

          <p className="text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
