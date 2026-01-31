"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/server/actions/auth.actions";
import { toast } from "sonner";
import { useEffect } from "react";
import { AuthFormState } from "@/types";

const initialState = {
  error: "",
};

const BackgroundEffects = () => (
  <>
    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[120px]" />
  </>
);

interface LoginFormProps {
  storeName: string;
  storeLogo?: string | null;
}

export function LoginForm({ storeName, storeLogo }: LoginFormProps) {
  const [isVisible, setIsVisible] = useState(false);

  const [state, formAction, isPending] = useActionState(
    async (_prevState: AuthFormState, formData: FormData) => {
      try {
        const result = await login(formData);
        if (result?.error) {
          return { error: result.error };
        }
      } catch {
        return { error: "An unexpected error occurred" };
      }
      return { error: "" };
    },
    initialState,
  );

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

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
            Premium <span className="text-primary">E-Commerce</span> <br />{" "}
            Experience
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Join thousands of satisfied customers who trust {storeName} for
            quality products and exceptional service.
          </p>

          <div className="flex items-center gap-4 pt-4 bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/5 w-fit">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 relative rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-xs text-zinc-500 overflow-hidden"
                >
                  <Image
                    src={`https://i.pravatar.cc/150?u=${i + 20}`}
                    alt="User"
                    fill
                    className="object-cover grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-4 h-4 text-yellow-500 fill-yellow-500"
                  >
                    ★
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-zinc-300">
                Trusted by 10k+ users
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-zinc-400">
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
                  Welcome back
                </h2>
                <p className="text-zinc-400 lg:text-muted-foreground">
                  Enter your credentials to access your account
                </p>
              </div>

              <form action={formAction} className="space-y-5">
                <div className="space-y-4">
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
                        className="pl-9 h-12 bg-zinc-800/50 lg:bg-muted/50 border-zinc-700 lg:border-input text-white lg:text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-400 focus:ring-2 ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-zinc-200 lg:text-foreground"
                      >
                        Password
                      </Label>
                      <Link
                        href="#"
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative group/input">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within/input:text-primary transition-colors" />
                      <Input
                        id="password"
                        name="password"
                        type={isVisible ? "text" : "password"}
                        required
                        className="pl-9 pr-9 h-12 bg-zinc-800/50 lg:bg-muted/50 border-zinc-700 lg:border-input text-white lg:text-foreground placeholder:text-zinc-600 dark:placeholder:text-zinc-600 focus:ring-2 ring-primary/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setIsVisible(!isVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1"
                        aria-label={
                          isVisible ? "Hide password" : "Show password"
                        }
                      >
                        {isVisible ? (
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="px-8 text-center text-sm text-zinc-400 lg:text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="hover:text-white lg:hover:text-primary underline underline-offset-4 font-bold text-white lg:text-primary transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
