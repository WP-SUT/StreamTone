"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthField } from "@/components/auth/auth-field";
import { AuthDivider } from "@/components/auth/auth-divider";
import AuthHeader from "@/components/auth/Auth-Header";

const artistRegisterSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  artistName: z.string().min(2, "Artist name is required"),
  portfolio: z
    .any()
    .refine((files) => files?.length > 0, "Please upload at least one sample")
    .refine(
      (files) => files?.length <= 10,
      "Maximum 10 files allowed"
    ),
});

type ArtistRegisterFormData = z.infer<typeof artistRegisterSchema>;

const inputClass = (hasError: boolean) =>
  `bg-background/60 border-border/60 text-foreground placeholder:text-muted-foreground/50
   focus-visible:ring-primary/50 focus-visible:border-primary/60
   transition-colors h-11 ${hasError ? "border-destructive focus-visible:ring-destructive/50" : ""}`;

export default function ArtistRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ArtistRegisterFormData>({
    resolver: zodResolver(artistRegisterSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...uploadedFiles, ...files].slice(0, 10);
    setUploadedFiles(newFiles);
    setValue("portfolio", newFiles, { shouldValidate: true });
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setValue("portfolio", newFiles, { shouldValidate: true });
  };

  const onSubmit = async (data: ArtistRegisterFormData) => {
    setIsLoading(true);
    try {
      // TODO: upload portfolio files and send artist registration request
      console.log({
        email: data.email,
        password: data.password,
        artistName: data.artistName,
        portfolioCount: uploadedFiles.length,
      });

      await new Promise((res) => setTimeout(res, 1500));

      toast.success("Application submitted!", {
        description: "Your account is pending approval. We'll notify you via email.",
      });

      router.push("/auth/login");
    } catch {
      toast.error("Registration failed", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthHeader
        title="Artist Application"
        subtitle="Join our community of creators"
      />

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

        {/* Artist Name */}
        <AuthField
          id="artistName"
          label="Artist Name"
          error={errors.artistName?.message}
        >
          <Input
            id="artistName"
            type="text"
            placeholder="Your stage or artist name"
            autoComplete="off"
            disabled={isLoading}
            className={inputClass(!!errors.artistName)}
            {...register("artistName")}
          />
        </AuthField>

        {/* Password */}
        <AuthField
          id="password"
          label="Password"
          error={errors.password?.message}
        >
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
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </AuthField>

        {/* Portfolio / Samples */}
        <AuthField
          id="portfolio"
          label="Portfolio / Samples"
          error={errors.portfolio?.message as string}
        >
          <div className="space-y-2">
            <label
              htmlFor="portfolio-upload"
              className={`flex items-center justify-center gap-2 h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${
                  errors.portfolio
                    ? "border-destructive bg-destructive/5 hover:bg-destructive/10"
                    : "border-border/60 bg-background/40 hover:bg-background/60"
                }
                ${isLoading ? "opacity-50 pointer-events-none" : ""}
              `}
            >
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Upload samples (max 10)
              </span>
              <input
                id="portfolio-upload"
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf"
                disabled={isLoading}
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>

            {uploadedFiles.length > 0 && (
              <ul className="space-y-1">
                {uploadedFiles.map((file, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 bg-background/60 rounded border border-border/40"
                  >
                    <span className="text-xs text-foreground truncate flex-1">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      disabled={isLoading}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </AuthField>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 mt-2 bg-primary hover:bg-primary/90 text-white font-medium transition-all glow-primary hover:shadow-primary/50 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </form>

      <AuthDivider />

      <div className="space-y-3 text-center">
        <p className="text-sm text-muted-foreground">
          Already applied?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign in here
          </Link>
        </p>
        <p className="text-sm text-muted-foreground">
          Regular user?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </>
  );
}
