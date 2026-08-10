import type { Metadata } from "next";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getAdminEmailSet, isEnvAdminEmail } from "@/lib/auth/roles";
import { promoteToAdminAction, demoteAdminAction } from "./actions";
import { ResetPasswordControl } from "./reset-password-form";
import { EditEmailControl } from "./edit-email-form";

export const metadata: Metadata = {
  title: "Usuarios | Admin",
  description: "Cuentas de clientes registradas en la tienda.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminUsuariosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = (params.q ?? "").trim().toLowerCase();

  const supabase = createSupabaseServer();

  const { data: usersRes, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  const allUsers = usersRes?.users ?? [];

  const [{ data: pedidos }, { data: cotizaciones }] = await Promise.all([
    supabase.from("pedidos").select("user_id").not("user_id", "is", null),
    supabase.from("cotizaciones").select("user_id").not("user_id", "is", null),
  ]);

  const pedidosCount = new Map<string, number>();
  for (const p of pedidos ?? []) {
    if (!p.user_id) continue;
    pedidosCount.set(p.user_id, (pedidosCount.get(p.user_id) ?? 0) + 1);
  }
  const cotizacionesCount = new Map<string, number>();
  for (const c of cotizaciones ?? []) {
    if (!c.user_id) continue;
    cotizacionesCount.set(c.user_id, (cotizacionesCount.get(c.user_id) ?? 0) + 1);
  }

  const users = allUsers
    .filter((u) => {
      if (!q) return true;
      const name = (u.user_metadata?.full_name as string | undefined) ?? "";
      return u.email?.toLowerCase().includes(q) || name.toLowerCase().includes(q);
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const adminEmails = await getAdminEmailSet();
  const totalAdmins = allUsers.filter((u) => u.email && adminEmails.has(u.email.toLowerCase())).length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-[36px] border border-black/10 bg-[#0F172A] text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
        <div className="relative flex min-h-40 flex-col justify-end gap-2 p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
            Panel de administración
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Usuarios</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-white/80">
            {allUsers.length} cuenta{allUsers.length !== 1 ? "s" : ""} registrada
            {allUsers.length !== 1 ? "s" : ""} · {totalAdmins} con acceso admin
          </p>
        </div>
      </section>

      {/* Nota sobre rol admin */}
      <section className="rounded-[28px] border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-900">
        Puedes hacer admin a cualquier cliente registrado desde la tabla de abajo. Los admins
        definidos por la variable de entorno{" "}
        <code className="rounded bg-amber-100 px-1.5 py-0.5">ADMIN_EMAILS</code> son fijos y no se
        pueden quitar desde aquí.
      </section>

      {/* Filtro */}
      <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-sm">
        <form className="flex flex-wrap items-end gap-4">
          <div className="flex-1 space-y-2 min-w-[220px]">
            <label htmlFor="q" className="text-sm font-medium text-black/70">
              Buscar por nombre o correo
            </label>
            <input
              id="q"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="cliente@correo.cl"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Filtrar
          </button>
          {params.q && (
            <a
              href="/admin/usuarios"
              className="inline-flex items-center rounded-2xl border border-black/10 px-4 py-3 text-sm font-medium text-black/75 transition hover:border-black/20"
            >
              Limpiar
            </a>
          )}
        </form>
      </section>

      {/* Listado */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-black/45">
            {users.length === 0 ? "Sin resultados" : `${users.length} usuario${users.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error cargando usuarios: {error.message}
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-[32px] border border-black/10 bg-white px-6 py-16 text-center">
            <p className="text-sm text-black/45">
              {q ? "No se encontraron usuarios con esa búsqueda." : "Aún no hay clientes registrados."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/8 bg-black/[0.02] text-xs font-semibold uppercase tracking-wide text-black/45">
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Registrado</th>
                  <th className="px-6 py-4">Último acceso</th>
                  <th className="px-6 py-4 text-right">Pedidos</th>
                  <th className="px-6 py-4 text-right">Cotizaciones</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const name = (u.user_metadata?.full_name as string | undefined) || null;
                  const email = u.email ?? null;
                  const admin = !!email && adminEmails.has(email.toLowerCase());
                  const fixedAdmin = isEnvAdminEmail(email);
                  return (
                    <tr key={u.id} className="border-b border-black/5 last:border-0">
                      <td className="px-6 py-4">
                        <p className="font-medium text-black">{name || u.email}</p>
                        {name && <p className="text-xs text-black/45">{u.email}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={[
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                            admin
                              ? "bg-[#0477BF]/10 text-[#0477BF]"
                              : "bg-black/5 text-black/70",
                          ].join(" ")}
                        >
                          {admin ? (fixedAdmin ? "Admin (fijo)" : "Admin") : "Cliente"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-black/60">{formatDate(u.created_at)}</td>
                      <td className="px-6 py-4 text-black/60">{formatDate(u.last_sign_in_at)}</td>
                      <td className="px-6 py-4 text-right text-black/70">
                        {pedidosCount.get(u.id) ?? 0}
                      </td>
                      <td className="px-6 py-4 text-right text-black/70">
                        {cotizacionesCount.get(u.id) ?? 0}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-end gap-2">
                          {email && !fixedAdmin ? (
                            admin ? (
                              <form action={demoteAdminAction.bind(null, email)}>
                                <button
                                  type="submit"
                                  className="inline-flex items-center rounded-xl border border-black/10 px-3 py-1.5 text-xs font-medium text-black/70 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                                >
                                  Quitar admin
                                </button>
                              </form>
                            ) : (
                              <form action={promoteToAdminAction.bind(null, email)}>
                                <button
                                  type="submit"
                                  className="inline-flex items-center rounded-xl bg-[#0477BF] px-3 py-1.5 text-xs font-medium text-white transition hover:brightness-110"
                                >
                                  Hacer admin
                                </button>
                              </form>
                            )
                          ) : null}
                          {email && <EditEmailControl userId={u.id} email={email} />}
                          <ResetPasswordControl userId={u.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
