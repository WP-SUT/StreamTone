import { Label } from "@/components/ui/label";

interface AuthFieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function AuthField({ id, label, error, children }: AuthFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-foreground/80">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
