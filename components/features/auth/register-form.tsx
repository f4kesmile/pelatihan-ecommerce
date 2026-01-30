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

// Background effects component for consistency
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
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      {/* Left Side (Desktop Visuals) */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-950 p-12 relative overflow-hidden text-white">
        <BackgroundEffects />

        <div className="relative z-10">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 relative rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 overflow-hidden">
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
          <p className="text-lg text-zinc-400 leading-relaxed">
            Create an account to unlock exclusive deals, track orders, and
            experience personalized recommendations.
          </p>
          <ul className="space-y-4 text-zinc-300">
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

        <div className="relative z-10 text-sm text-zinc-600">
          © {new Date().getFullYear()} {storeName} Inc. All rights reserved.
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="relative flex items-center justify-center p-4 sm:p-8 bg-zinc-950 lg:bg-background overflow-hidden min-h-screen lg:min-h-0">
        {/* Mobile Background: Solid Dark with Grid (No Gradient) */}
        <div className="absolute inset-0 lg:hidden bg-zinc-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Mobile: Removed Logo completely as requested */}

        <div className="relative z-20 w-full max-w-[400px]">
          {/* Card Container: 3D Hover & Full Width Feel */}
          <div className="group bg-zinc-900/50 lg:bg-transparent backdrop-blur-none p-8 rounded-2xl border border-white/10 lg:border-0 shadow-2xl lg:shadow-none transition-all duration-500 hover:scale-[1.02] hover:shadow-primary/10 hover:border-primary/20">
            <div className="space-y-6">
              <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-white lg:text-foreground">
                  Create account
                </h2>
                <p className="text-zinc-400 lg:text-muted-foreground">
                  Enter your information below to get started
                </p>
              </div>

              <form action={formAction} className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-zinc-200 lg:text-foreground"
                    >
                      Full Name
                    </Label>
                    <div className="relative group/input">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within/input:text-primary transition-colors" />
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Mamat Gentong"
                        required
                        className="pl-9 h-12 bg-zinc-800/50 lg:bg-muted/50 border-zinc-700 lg:border-input text-white lg:text-foreground placeholder:text-zinc-600 focus:ring-2 ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-zinc-200 lg:text-foreground"
                    >
                      Email
                    </Label>
                    <div className="relative group/input">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within/input:text-primary transition-colors" />
                      <Input
                        id="email"
                        name="email"
                        placeholder="budi@email.com"
                        type="email"
                        required
                        className="pl-9 h-12 bg-zinc-800/50 lg:bg-muted/50 border-zinc-700 lg:border-input text-white lg:text-foreground placeholder:text-zinc-600 focus:ring-2 ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-zinc-200 lg:text-foreground"
                    >
                      Password
                    </Label>
                    <div className="relative group/input">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within/input:text-primary transition-colors" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="pl-9 pr-9 h-12 bg-zinc-800/50 lg:bg-muted/50 border-zinc-700 lg:border-input text-white lg:text-foreground placeholder:text-zinc-600 focus:ring-2 ring-primary/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1"
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
                      className="text-zinc-200 lg:text-foreground"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative group/input">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within/input:text-primary transition-colors" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className="pl-9 pr-9 h-12 bg-zinc-800/50 lg:bg-muted/50 border-zinc-700 lg:border-input text-white lg:text-foreground placeholder:text-zinc-600 focus:ring-2 ring-primary/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1"
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
                  className="w-full h-12 text-base font-bold bg-white text-black hover:bg-zinc-200 lg:bg-primary lg:text-primary-foreground lg:hover:bg-primary/90 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] lg:shadow-primary/30 transition-all transform hover:-translate-y-0.5"
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

              <p className="px-8 text-center text-sm text-zinc-400 lg:text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="hover:text-white lg:hover:text-primary underline underline-offset-4 font-bold text-white lg:text-primary transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
