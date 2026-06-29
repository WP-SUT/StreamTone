interface AuthLayoutProps {
  title: string;
  subtitle?: string;
}

export default function AuthHeader({title, subtitle }: AuthLayoutProps) {
  return (
    <>
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </>
  );
}
