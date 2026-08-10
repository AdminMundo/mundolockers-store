import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Inicia sesión en tu cuenta LockerStore.",
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
  const next = typeof params.next === "string" ? params.next : "";

  return (
    <main className="min-h-screen bg-[#EEEDEB] px-6 py-16">
      <div className="mx-auto max-w-md">
        <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
          <p className="text-sm text-black/50">LockerStore</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Iniciar sesión
          </h1>

          <p className="mt-2 text-sm text-black/60">
            Ingresa con tu cuenta para ver tus pedidos, cotizaciones o
            administrar el panel.
          </p>

          <div className="mt-6">
            <LoginForm next={next} />
          </div>

          <p className="mt-6 text-center text-sm text-black/60">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="font-medium text-black hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
