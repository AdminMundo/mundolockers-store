import type { ReactNode } from "react";
import { requireStaff } from "@/lib/auth/admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const { user, role } = await requireStaff();

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="mx-auto flex w-full max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden xl:block xl:w-[290px] xl:shrink-0">
          <AdminSidebar userEmail={user.email ?? ""} role={role} />
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}