"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Loader2,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/server/actions/auth.actions";
import { toast } from "sonner";
import { useEffect } from "react";

const initialState = {
  error: "",
  success: false,
  message: "",
};

const BackgroundEffects = () => (
  <>
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[120px]" />
  </>
);

interface RegisterFormProps {
  storeName: string;
  storeLogo?: string | null;
}

export function RegisterForm({ storeName, storeLogo }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [state, formAction, isPending] = useActionState(
    async (prevState: typeof initialState, formData: FormData) => {
      try {
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
          return {
            error: "Passwords do not match",
            success: false,
            message: "",
          };
        }

        const result = await signup(formData);
        if (result?.error) {
          return { error: result.error, success: false, message: "" };
        }
        if (result?.success) {
          return {
            success: true,
            message: result.message || "Account created",
            error: "",
          };
        }
      } catch {
        return {
          error: "An unexpected error occurred",
          success: false,
          message: "",
        };
      }
      return { error: "", success: false, message: "" };
    },
    initialState,
  );

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success && state?.message) {
      toast.success(state.message);
    }
  }, [state]);

  if (state?.success) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
        <div className="max-w-md w-full bg-background border rounded-xl p-8 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">Check your email</h2>
          <p className="text-muted-foreground">
            We&apos;ve sent a confirmation link to your email address. Please
            verify your account to continue.
          </p>
          <div className="pt-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-zinc-100 dark:bg-zinc-950 p-12 relative overflow-hidden text-foreground">
        <BackgroundEffects />

        <div className="relative z-10">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 relative rounded-xl bg-primary/10 flex items-center justify-center backdrop-blur-md border border-primary/10 overflow-hidden">
              {storeLogo ? (
                <Image
                  src={storeLogo}
                  alt={storeName}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="font-bold text-lg">{storeName.charAt(0)}</span>
              )}
            </div>
            <span className="text-xl font-bold tracking-tight">
              {storeName}
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8 max-w-lg">
          <h1 className="text-5xl font-bold tracking-tight leading-tight">
            Join the <span className="text-primary">Future</span> of <br />{" "}
            Shopping
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Create an account to unlock exclusive deals, track orders, and
            experience personalized recommendations.
          </p>
          <ul className="space-y-4 text-foreground/80">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_0_rgba(var(--primary),0.5)]" />
              Exclusive member-only discounts
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_0_rgba(var(--primary),0.5)]" />
              Faster checkout with saved details
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_0_rgba(var(--primary),0.5)]" />
              Priority customer support
            </li>
          </ul>
        </div>

        <div className="relative z-10 text-sm text-muted-foreground">
          © {new Date().getFullYear()} {storeName} Inc. All rights reserved.
        </div>
      </div>

      <div className="relative flex items-center justify-center p-4 sm:p-8 bg-zinc-50 dark:bg-zinc-950 lg:bg-background overflow-hidden min-h-screen lg:min-h-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <div className="relative z-20 w-full max-w-[400px]">
          <div className="group bg-white/80 dark:bg-zinc-900/50 backdrop-blur-md p-8 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-xl dark:shadow-2xl lg:shadow-none transition-all duration-500 hover:scale-[1.02] hover:shadow-primary/10 hover:border-primary/20">
            <div className="space-y-6">
              <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Create account
                </h2>
                <p className="text-muted-foreground">
                  Enter your information below to get started
                </p>
              </div>

              <form action={formAction} className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-foreground">
                      Full Name
                    </Label>
                    <div className="relative group/input">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Mamat Gentong"
                        required
                        className="pl-9 h-12 bg-background/50 border-input text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email
                    </Label>
                    <div className="relative group/input">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                      <Input
                        id="email"
                        name="email"
                        placeholder="budi@email.com"
                        type="email"
                        required
                        className="pl-9 h-12 bg-background/50 border-input text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">
                      Password
                    </Label>
                    <div className="relative group/input">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="pl-9 pr-9 h-12 bg-background/50 border-input text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-foreground"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative group/input">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className="pl-9 pr-9 h-12 bg-background/50 border-input text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="px-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="hover:text-primary underline underline-offset-4 font-bold text-primary transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
