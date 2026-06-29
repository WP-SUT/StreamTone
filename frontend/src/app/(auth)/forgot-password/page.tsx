"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthField } from "@/components/auth/auth-field";
import AuthHeader from "@/components/auth/Auth-Header";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const inputClass = (hasError: boolean) =>
  `bg-background/60 border-border/60 text-foreground placeholder:text-muted-foreground/50
   focus-visible:ring-primary/50 focus-visible:border-primary/60
   transition-colors h-11 ${hasError ? "border-destructive focus-visible:ring-destructive/50" : ""}`;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      // TODO: call reset-password endpoint
      console.log({ email: data.email });
      await new Promise((res) => setTimeout(res, 1200));

      setIsSent(true);
      toast.success("Recovery email sent!", {
        description: "Check your inbox for a password reset link.",
      });
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-primary"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Check your email</h3>
          <p className="text-sm text-muted-foreground mt-1">
            We've sent a password reset link to your email address.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="inline-block text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <AuthHeader
        title="Forgot password?"
        subtitle="Enter your email and we'll send a recovery link"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 mt-2 bg-primary hover:bg-primary/90 text-white font-medium transition-all glow-primary hover:shadow-primary/50 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Recovery Link"
          )}
        </Button>
      </form>

      <div className="pt-2 text-center">
        <Link
          href="/login"
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          ← Back to sign in
        </Link>
      </div>
    </>
  );
}
