// src/app/(auth)/register/page.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { AuthField } from "@/components/auth/auth-field";
import { AuthDivider } from "@/components/auth/auth-divider";
import { PrivacyModal } from "@/components/auth/privacy-modal";
import AuthHeader from "@/components/auth/Auth-Header";




const registerSchema = z
  .object({
    displayName: z.string().min(2, "Display name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.string().min(1, "Gender is required"),
    acceptPrivacy: z.boolean().refine((v) => v, { message: "You must accept the privacy policy" }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const inputClass = (hasError: boolean) => `
  bg-background/60 border-border/60 text-foreground placeholder:text-muted-foreground/50
  focus-visible:ring-primary/50 focus-visible:border-primary/60
  transition-colors h-11
  ${hasError ? "border-destructive focus-visible:ring-destructive/50" : ""}
`;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { acceptPrivacy: false },
  });

  const acceptPrivacy = watch("acceptPrivacy");

  const onSubmit = async (_data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      toast.success("Account created!", { description: "Welcome!" });
      router.push("/home");
    } catch {
      toast.error("Registration failed", { description: "Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthHeader title="Create an account" subtitle="Join us and start listening"/>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Display Name */}
          <AuthField id="displayName" label="Display Name" error={errors.displayName?.message}>
            <Input
              id="displayName"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              disabled={isLoading}
              className={inputClass(!!errors.displayName)}
              {...register("displayName")}
            />
          </AuthField>

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
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <AuthField id="confirmPassword" label="Confirm Password" error={errors.confirmPassword?.message}>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isLoading}
                className={`${inputClass(!!errors.confirmPassword)} pr-10`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                disabled={isLoading}
                aria-label={showConfirmPassword ? "Hide" : "Show"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </AuthField>

          {/* Date of Birth */}
          <AuthField id="dateOfBirth" label="Date of Birth" error={errors.dateOfBirth?.message}>
            <Input
              id="dateOfBirth"
              type="date"
              disabled={isLoading}
              className={inputClass(!!errors.dateOfBirth)}
              {...register("dateOfBirth")}
            />
          </AuthField>

          {/* Gender */}
          <AuthField id="gender" label="Gender" error={errors.gender?.message}>
            <Select onValueChange={(v) => setValue("gender", v)} disabled={isLoading}>
              <SelectTrigger
                className={`bg-background/60 border-border/60 text-foreground h-11 ${
                  errors.gender ? "border-destructive" : ""
                }`}
              >
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </AuthField>

          {/* Privacy Policy */}
          <div className="space-y-1.5">
            <div className="flex items-start gap-2">
              <input
                id="acceptPrivacy"
                type="checkbox"
                disabled={isLoading}
                checked={acceptPrivacy}
                onChange={(e) => setValue("acceptPrivacy", e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-border/60 text-primary focus:ring-primary/50 focus:ring-offset-0 bg-background/60 cursor-pointer disabled:opacity-50"
              />
              <Label
                htmlFor="acceptPrivacy"
                className="text-sm text-muted-foreground leading-tight cursor-pointer"
              >
                I accept the{" "}
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-primary hover:text-primary/80 underline transition-colors"
                >
                  Privacy Policy
                </button>
              </Label>
            </div>{errors.acceptPrivacy && (
              <p className="text-xs text-destructive">{errors.acceptPrivacy.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 mt-2 bg-primary hover:bg-primary/90 text-white font-medium transition-all glow-primary hover:shadow-primary/50 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form><AuthDivider />

        <div className="space-y-3 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            Are you an artist?{" "}
            <Link href="/register-artist" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Apply here
            </Link>
          </p>
        </div>
      <PrivacyModal open={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </>
  );
}
