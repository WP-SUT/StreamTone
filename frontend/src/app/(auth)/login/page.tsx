// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthField } from "@/components/auth/auth-field";
import { AuthDivider } from "@/components/auth/auth-divider";
import AuthHeader from "@/components/auth/Auth-Header";
import { authService } from "@/services/auth-service";
import { UserRole } from "@/types/models";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const roleRedirectMap: Record<UserRole, string> = {
  listener: "/home",
  artist: "/artist/dashboard",
  admin: "/admin/dashboard",
  support: "/support/dashboard",
};

const inputClass = (hasError: boolean) =>
  `bg-background/60 border-border/60 text-foreground placeholder:text-muted-foreground/50
   focus-visible:ring-primary/50 focus-visible:border-primary/60
   transition-colors h-11 ${hasError ? "border-destructive focus-visible:ring-destructive/50" : ""}`;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const account = await authService.login(data.email, data.password);
      console.log(account);
      
      toast.success("Welcome back!");
      router.push(roleRedirectMap[account.role]);
    } catch (error) {
      console.error(error);
      toast.error("Login failed", { 
        description: error instanceof Error ? error.message : "Invalid email or password." 
      });
    } finally {
      console.log("debug");
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthHeader title="Sign in" subtitle="Welcome back" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email */}
        <AuthField id="email" label="Email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isLoading}
            className={inputClass(!!errors.email)}
            {...register("email")}
          />
        </AuthField>

        {/* Password */}
        <AuthField id="password" label="Password" error={errors.password?.message}>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
              className={`${inputClass(!!errors.password)} pr-10`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              disabled={isLoading}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </AuthField>

        {/* Forgot password */}
        <div className="flex justify-end -mt-1">
          <Link
            href="/auth/forgot-password"
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 mt-2 bg-primary hover:bg-primary/90 text-white font-medium transition-all glow-primary hover:shadow-primary/50 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <AuthDivider />

      <div className="space-y-3 text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Create one
          </Link>
        </p>
        <p className="text-sm text-muted-foreground">
          Are you an artist?{" "}
          <Link href="/register-artist" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Apply here
          </Link>
        </p>
      </div>
    </>
  );
}
