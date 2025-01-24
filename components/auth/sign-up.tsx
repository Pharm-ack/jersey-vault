"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { register } from "@/lib/actions";
import { RegisterSchema } from "@/lib/zodSchemas";
import { Eye, EyeOff } from "lucide-react";
import PendingButton from "./pending-button";
import { useRouter } from "next/navigation";
import Social from "./socials";
import { useToast } from "@/hooks/use-toast";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type FormState = {
  status: "success" | "error" | undefined;
  message: string;
};

export default function SignUpForm() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const [formState, action] = useActionState<FormState, FormData>(
    async (prevState, formData) => {
      const result = await register(prevState, formData);
      if (result.status === "success") {
        toast({
          title: "Success",
          description: `${result.message}`,
          variant: "default",
        });
        router.push("/auth/sign-in");
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
      return parseWithZod(formData, { schema: RegisterSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get("error");
    if (error === "OAuthAccountNotLinked") {
      setUrlError("Email already in use with different provider!");
    }
    router.replace("/auth/sign-up");
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
                  autoFocus
                  required
                  placeholder="Name"
                  type="text"
                  key={fields.name.key}
                  name={fields.name.name}
                  defaultValue={fields.name.initialValue}
                  className={cn(
                    "h-11 bg-muted px-4",
                    fields.name.errors ? "border-red-500" : ""
                  )}
                />
                {fields.name.errors && (
                  <p className="mt-1 text-xs text-red-500">
                    {fields.name.errors}
                  </p>
                )}
              </div>

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

              <div className="relative">
                <Input
                  required
                  placeholder="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  key={fields.confirmPassword.key}
                  name={fields.confirmPassword.name}
                  defaultValue={fields.confirmPassword.initialValue}
                  className={cn(
                    "h-11 bg-muted px-4",
                    fields.confirmPassword.errors ? "border-red-500" : ""
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                {fields.confirmPassword.errors && (
                  <p className="mt-1 text-xs text-red-500">
                    {fields.confirmPassword.errors}
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
              Already have an account?&nbsp;
              <Link
                href="/auth/sign-in"
                className="text-primary hover:underline"
              >
                Sign In
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
