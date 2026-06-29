// src/app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/ui/logo";

const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(1, "Display name is required")
      .min(2, "Display name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.string().min(1, "Gender is required"),
    acceptPrivacy: z.boolean().refine((val) => val === true, {
      message: "You must accept the privacy policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

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
    defaultValues: {
      acceptPrivacy: false,
    },
  });

  const acceptPrivacy = watch("acceptPrivacy");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1500));

      toast.success("Account created!", {
        description: "Welcome to the platform",
      });

      // Redirect to home (per PDF, page 5)
      router.push("/home");
    } catch {
      toast.error("Registration failed", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center p-4 py-12">
        {/* Background glow blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Card */}
          <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/40">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <Logo size="md" />
              <h1 className="text-2xl font-semibold text-foreground mt-4">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Join us and start listening
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Display Name */}
              <div className="space-y-1.5">
                <Label htmlFor="displayName" className="text-sm font-medium text-foreground/80">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  disabled={isLoading}
                  className={`
                    bg-background/60 border-border/60 text-foreground placeholder:text-muted-foreground/50
                    focus-visible:ring-primary/50 focus-visible:border-primary/60
                    transition-colors h-11
                    ${errors.displayName ? "border-destructive focus-visible:ring-destructive/50" : ""}
                  `}
                  {...register("displayName")}
                />
                {errors.displayName && (
                  <p className="text-xs text-destructive">{errors.displayName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={isLoading}
                  className={`
                    bg-background/60 border-border/60 text-foreground placeholder:text-muted-foreground/50
                    focus-visible:ring-primary/50 focus-visible:border-primary/60
                    transition-colors h-11
                    ${errors.email ? "border-destructive focus-visible:ring-destructive/50" : ""}
                  `}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-foreground/80">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isLoading}
                    className={`
                      bg-background/60 border-border/60 text-foreground placeholder:text-muted-foreground/50
                      focus-visible:ring-primary/50 focus-visible:border-primary/60
                      transition-colors h-11 pr-10
                      ${errors.password ? "border-destructive focus-visible:ring-destructive/50" : ""}
                    `}
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
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground/80">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isLoading}
                    className={`
                      bg-background/60 border-border/60 text-foreground placeholder:text-muted-foreground/50
                      focus-visible:ring-primary/50 focus-visible:border-primary/60
                      transition-colors h-11 pr-10
                      ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive/50" : ""}
                    `}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    disabled={isLoading}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground/80">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  disabled={isLoading}
                  className={`
                    bg-background/60 border-border/60 text-foreground
                    focus-visible:ring-primary/50 focus-visible:border-primary/60
                    transition-colors h-11
                    ${errors.dateOfBirth ? "border-destructive focus-visible:ring-destructive/50" : ""}
                  `}
                  {...register("dateOfBirth")}
                />
                {errors.dateOfBirth && (
                  <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <Label htmlFor="gender" className="text-sm font-medium text-foreground/80">
                  Gender
                </Label>
                <Select
                  onValueChange={(value) => setValue("gender", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    className={`
                      bg-background/60 border-border/60 text-foreground
                      focus:ring-primary/50 focus:border-primary/60
                      transition-colors h-11
                      ${errors.gender ? "border-destructive" : ""}
                    `}
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
                {errors.gender && (
                  <p className="text-xs text-destructive">{errors.gender.message}</p>
                )}
              </div>

              {/* Privacy Policy */}
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <input
                    id="acceptPrivacy"
                    type="checkbox"
                    disabled={isLoading}
                    checked={acceptPrivacy}
                    onChange={(e) => setValue("acceptPrivacy", e.target.checked)}
                    className="
                      mt-0.5 w-4 h-4 rounded border-border/60 
                      text-primary focus:ring-primary/50 focus:ring-offset-0
                      bg-background/60 cursor-pointer
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
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
                </div>
                {errors.acceptPrivacy && (
                  <p className="text-xs text-destructive">{errors.acceptPrivacy.message}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="
                  w-full h-11 mt-2
                  bg-primary hover:bg-primary/90
                  text-white font-medium
                  transition-all duration-200
                  glow-primary hover:shadow-primary/50
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
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
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground/60 tracking-wider">or</span>
              </div>
            </div>

            {/* Sign in / Artist link */}
            <div className="space-y-3 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
              <p className="text-sm text-muted-foreground">
                Are you an artist?{" "}
                <Link
                  href="/register-artist"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Apply here
                </Link>
              </p>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-muted-foreground/40 mt-6">
            By creating an account you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Privacy Policy</h2>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="prose prose-sm prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                This is a placeholder for the privacy policy. Replace this with your actual privacy
                policy content, including data collection practices, user rights, and legal
                compliance information.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <Button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full mt-6 bg-primary hover:bg-primary/90"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
