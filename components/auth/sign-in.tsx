"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@iconify/react";
import { Eye, EyeOff } from "lucide-react";
import { LoginSchema } from "@/lib/zodSchemas";
import { login } from "@/lib/actions";
import PendingButton from "./pending-button";
import { useRouter } from "next/navigation";
import Social from "./socials";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

type FormState = {
  status: "success" | "error" | undefined;
  message: string;
};

export default function SignInForm() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [formState, action] = useActionState<FormState, FormData>(
    async (prevState, formData) => {
      const result = await login(prevState, formData);
      if (result.status === "success") {
        toast({
          title: "Success",
          description: `${result.message}`,
          variant: "default",
        });
        const email = formData.get(fields.email.name) as string;
        if (email === "admin@gmail.com") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      } else if (result.status === "error") {
        toast({
          title: "Error",
          description: `${result.message}`,
          variant: "destructive",
        });
      }
      return result;
    },
    {
      status: undefined,
      message: "",
    }
  );

  const [form, fields] = useForm({
    lastResult: formState,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  useEffect(() => {
    if (session) {
      const searchParams = new URLSearchParams(window.location.search);
      const role = searchParams.get("role");
      const returnTo =
        localStorage.getItem("returnTo") ||
        (role === "admin" ? "/dashboard" : "/");

      localStorage.removeItem("returnTo");
      router.push(returnTo);
    }
  }, [session, router]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get("error");
    if (error === "OAuthAccountNotLinked") {
      setUrlError("Email already in use with different provider!");
    }
    router.replace("/auth/sign-in");
  }, [router]);

  useEffect(() => {
    if (urlError) {
      toast({
        title: "Error",
        description: `${urlError}`,
        variant: "destructive",
      });
      setUrlError(null);
    }
  }, [urlError, toast]);

  const variants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 10 },
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const role = searchParams.get("role");

    if (role === "admin") {
      setIsFormVisible(true);

      setTimeout(() => {
        const emailInput = document.querySelector(
          `input[name="${fields.email.name}"]`
        ) as HTMLInputElement;
        const passwordInput = document.querySelector(
          `input[name="${fields.password.name}"]`
        ) as HTMLInputElement;

        if (emailInput) emailInput.value = "admin@gmail.com";
        if (passwordInput) passwordInput.value = "admin1234";
      }, 100);
    }
  }, [fields.email.name, fields.password.name]);

  return (
    <div className="grid gap-6">
      <AnimatePresence initial={false} mode="popLayout">
        {isFormVisible ? (
          <motion.form
            id={form.id}
            onSubmit={form.onSubmit}
            action={action}
            noValidate
            animate="visible"
            className="space-y-4"
            exit="hidden"
            initial="hidden"
            variants={variants}
          >
            <div className="space-y-4">
              <div>
                <Input
                  required
                  placeholder="Email"
                  type="email"
                  key={fields.email.key}
                  name={fields.email.name}
                  defaultValue={fields.email.initialValue}
                  className={cn(
                    "h-11 bg-muted px-4",
                    fields.email.errors ? "border-red-500" : ""
                  )}
                />
                {fields.email.errors && (
                  <p className="mt-1 text-xs text-red-500">
                    {fields.email.errors}
                  </p>
                )}
              </div>

              <div className="relative">
                <Input
                  required
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  key={fields.password.key}
                  name={fields.password.name}
                  defaultValue={fields.password.initialValue}
                  className={cn(
                    "h-11 bg-muted px-4",
                    fields.password.errors ? "border-red-500" : ""
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                {fields.password.errors && (
                  <p className="mt-1 text-xs text-red-500">
                    {fields.password.errors}
                  </p>
                )}
              </div>
            </div>

            <PendingButton>Continue with Email</PendingButton>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="h-11 w-full"
              onClick={() => setIsFormVisible(false)}
            >
              <Icon className="mr-2 h-4 w-4" icon="solar:arrow-left-linear" />
              Other Sign Up options
            </Button>
          </motion.form>
        ) : (
          <motion.div
            animate="visible"
            className="space-y-4"
            exit="hidden"
            initial="hidden"
            variants={variants}
          >
            <Button
              className="h-11 w-full bg-[#e4e1f9] text-black hover:bg-[#e4e1f9]/90"
              onClick={() => setIsFormVisible(true)}
            >
              <Icon className="mr-2 h-4 w-4" icon="solar:letter-bold" />
              Continue with Email
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            <Social />
            <p className="mt-3 text-center text-sm">
              Don't have an account?&nbsp;
              <Link
                href="/auth/sign-up"
                className="text-primary hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
