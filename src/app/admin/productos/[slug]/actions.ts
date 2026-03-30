"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function updateProductAction(formData: FormData) {
  const productId = String(formData.get("product_id") ?? "").trim();
  const originalSlug = String(formData.get("original_slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const skuRaw = String(formData.get("sku") ?? "").trim();
  const sku = skuRaw.length > 0 ? skuRaw : null;

  const isActive = formData.get("is_active") === "on";
  const isFeatured = formData.get("is_featured") === "on";

  if (!productId || !name || !slug) {
    redirect(`/admin/productos/${originalSlug}?error=missing_fields`);
  }

  const supabase = createSupabaseServer();

  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug,
      sku,
      is_active: isActive,
      is_featured: isFeatured,
    })
    .eq("id", productId);

  if (error) {
    redirect(`/admin/productos/${originalSlug}?error=save_failed`);
  }

  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${originalSlug}`);
  revalidatePath(`/admin/productos/${slug}`);

  redirect(`/admin/productos/${slug}?saved=1`);
}