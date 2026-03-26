import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <AdminSidebar userEmail={user.email ?? ""} />
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}