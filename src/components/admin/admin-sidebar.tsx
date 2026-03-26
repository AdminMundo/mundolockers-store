"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminSidebarProps = {
  userEmail?: string;
};

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
  },
];

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="sticky top-6 rounded-[32px] border border-black/10 bg-white p-5 shadow-sm">
      <div className="border-b border-black/10 pb-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/40">
          Mundo Lockers
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black">
          Admin
        </h2>
        <p className="mt-2 text-sm text-black/55">
          Panel interno de gestión
        </p>
      </div>

      <nav className="mt-5 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-black text-white"
                  : "border border-black/8 text-black/70 hover:border-black/20 hover:bg-black/3",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl border border-dashed border-black/10 bg-[#F7F7F8] p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-black/35">
          Sesión
        </p>
        <p className="mt-2 break-all text-sm text-black/65">
          {userEmail ?? "admin"}
        </p>
      </div>
    </div>
  );
}