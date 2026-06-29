import { Logo } from "@/components/ui/logo";

export default function AuthRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen flex items-center py-8 px-4">
      {/* Background glow blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm mx-auto">
        <div className="glass rounded-2xl px-8 py-6 shadow-2xl shadow-black/40">
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <Logo size="sm" />
          </div>

          {children}
        </div>

        <p className="text-center text-xs text-muted-foreground/40 mt-4">
          By continuing you agree to our Terms &amp; Privacy Policy
        </p>
      </div>
    </div>
  );
}
