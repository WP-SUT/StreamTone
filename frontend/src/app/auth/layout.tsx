export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 to-black px-4">
      {children}
    </main>
  );
}
