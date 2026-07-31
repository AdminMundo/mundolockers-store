import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Crear cuenta | LockerStore",
  description: "Crea tu cuenta LockerStore para ver tus pedidos y cotizaciones.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegistroPage() {
  return (
    <main className="min-h-screen bg-[#F5F5F7] px-6 py-16">
      <div className="mx-auto max-w-md">
        <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
          <p className="text-sm text-black/50">LockerStore</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Crear cuenta
          </h1>

          <p className="mt-2 text-sm text-black/60">
            Guarda tu historial de pedidos y cotizaciones en un solo lugar.
          </p>

          <div className="mt-6">
            <RegisterForm />
          </div>

          <p className="mt-6 text-center text-sm text-black/60">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-medium text-black hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
