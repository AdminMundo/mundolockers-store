"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminSidebarProps = {
  userEmail?: string;
};

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/cotizaciones", label: "Cotizaciones" },
];

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="sticky top-6 overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
      <div className="border-b border-black/8 px-6 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
          Mundo Lockers
        </p>
        <h2 className="mt-2 text-[32px] font-semibold tracking-tight text-black">
          Admin
        </h2>
        <p className="mt-2 text-sm text-black/55">
          Panel interno de gestión
        </p>
      </div>

      <div className="px-4 py-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-[#0F172A] text-white shadow-[0_8px_20px_rgba(15,23,42,0.16)]"
                    : "text-black/70 hover:bg-black/[0.04] hover:text-black",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-5 rounded-[24px] border border-black/8 bg-[#F8F8FA] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/35">
            Sesión activa
          </p>
          <p className="mt-2 break-all text-sm text-black/65">
            {userEmail ?? "admin"}
          </p>
        </div>
      </div>
    </div>
  );
}