import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Acceso administrador | Mundo Lockers",
  description: "Acceso al panel administrativo de Mundo Lockers.",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/admin";

  return (
    <main className="min-h-screen bg-[#F5F5F7] px-6 py-16">
      <div className="mx-auto max-w-md">
        <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
          <p className="text-sm text-black/50">Mundo Lockers</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Acceso administrador
          </h1>

          <p className="mt-2 text-sm text-black/60">
            Ingresa con tu cuenta autorizada para administrar el panel.
          </p>

          <div className="mt-6">
            <LoginForm next={next} />
          </div>
        </div>
      </div>
    </main>
  );
}