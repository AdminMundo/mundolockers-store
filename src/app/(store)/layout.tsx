import type { ReactNode } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createSupabaseServerAuthClient } from "@/lib/supabase/auth-server";
import { isAdminEmailAsync } from "@/lib/auth/roles";

type StoreLayoutProps = {
  children: ReactNode;
};

export default async function StoreLayout({ children }: StoreLayoutProps) {
  const supabase = await createSupabaseServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const navUser = user
    ? { email: user.email ?? null, isAdmin: await isAdminEmailAsync(user.email) }
    : null;

  return (
    <>
      <Navbar user={navUser} />
      {children}
      <Footer />
    </>
  );
}
