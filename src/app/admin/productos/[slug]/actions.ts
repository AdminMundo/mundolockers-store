"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
export async function updateProductAction(formData: FormData) {
  const productId = String(formData.get("product_id") ?? "").trim();
  const originalSlug = String(formData.get("original_slug") ?? "").trim();
  const originalSku = String(formData.get("original_sku") ?? "").trim();
  const originalKey = originalSku || originalSlug;

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const skuRaw = String(formData.get("sku") ?? "").trim();
  const sku = skuRaw.length > 0 ? skuRaw : null;

  const descriptionRaw = String(formData.get("description") ?? "").trim();
  const description = descriptionRaw.length > 0 ? descriptionRaw : null;

  const specsRaw = String(formData.get("specs") ?? "").trim();
  let specs: unknown = null;
  if (specsRaw.length > 0) {
    try {
      specs = JSON.parse(specsRaw);
    } catch {
      redirect(`/admin/productos/${originalKey}?error=invalid_specs`);
    }
  }

  const imageUrlRaw = String(formData.get("image_url") ?? "").trim();
  const image_url = imageUrlRaw.length > 0 ? imageUrlRaw : null;

  const hoverImageUrlRaw = String(formData.get("hover_image_url") ?? "").trim();
  const hover_image_url = hoverImageUrlRaw.length > 0 ? hoverImageUrlRaw : null;

  const galleryRaw = String(formData.get("gallery_urls") ?? "").trim();
  const gallery_urls = galleryRaw
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const categoryIdRaw = String(formData.get("category_id") ?? "").trim();
  const category_id = categoryIdRaw.length > 0 ? categoryIdRaw : null;

  const priceRaw = String(formData.get("price_clp") ?? "").trim();
  const price_clp = priceRaw.length > 0 ? Number.parseInt(priceRaw, 10) : null;

  const isActive = formData.get("is_active") === "on";
  const isFeatured = formData.get("is_featured") === "on";
  const hasInStock = formData.get("has_in_stock") === "on";

  if (!productId || !name || !slug) {
    redirect(`/admin/productos/${originalKey}?error=missing_fields`);
  }

  if (priceRaw && Number.isNaN(price_clp)) {
    redirect(`/admin/productos/${originalKey}?error=invalid_price`);
  }

  const supabase = createSupabaseServer();

  const { data: slugExists } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .neq("id", productId)
    .maybeSingle();

  if (slugExists) {
    redirect(`/admin/productos/${originalKey}?error=slug_exists`);
  }

  if (sku) {
    const { data: skuExists } = await supabase
      .from("products")
      .select("id")
      .eq("sku", sku)
      .neq("id", productId)
      .maybeSingle();

    if (skuExists) {
      redirect(`/admin/productos/${originalKey}?error=sku_exists`);
    }
  }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug,
      sku,
      description,
      specs,
      price_clp,
      image_url,
      hover_image_url,
      gallery_urls,
      category_id,
      is_active: isActive,
      is_featured: isFeatured,
      has_in_stock: hasInStock,
    })
    .eq("id", productId);

  if (error) {
    redirect(`/admin/productos/${originalKey}?error=save_failed`);
  }

  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${originalKey}`);
  revalidatePath(`/admin/productos/${sku ?? slug}`);
  revalidatePath("/tienda");
  revalidatePath(`/producto/${slug}`);

  redirect(`/admin/productos/${sku ?? slug}?saved=1`);
}
export async function createProductAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();

  const skuRaw = String(formData.get("sku") ?? "").trim();
  const sku = skuRaw.length > 0 ? skuRaw : null;

  const descriptionRaw = String(formData.get("description") ?? "").trim();
  const description = descriptionRaw.length > 0 ? descriptionRaw : null;

  const specsRaw = String(formData.get("specs") ?? "").trim();
  let specs: unknown = null;
  if (specsRaw.length > 0) {
    try {
      specs = JSON.parse(specsRaw);
    } catch {
      redirect("/admin/productos/nuevo?error=invalid_specs");
    }
  }

  const imageUrlRaw = String(formData.get("image_url") ?? "").trim();
  const image_url = imageUrlRaw.length > 0 ? imageUrlRaw : null;

  const hoverImageUrlRaw = String(formData.get("hover_image_url") ?? "").trim();
  const hover_image_url = hoverImageUrlRaw.length > 0 ? hoverImageUrlRaw : null;

  const galleryRaw = String(formData.get("gallery_urls") ?? "").trim();
  const gallery_urls = galleryRaw
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const categoryIdRaw = String(formData.get("category_id") ?? "").trim();
  const category_id = categoryIdRaw.length > 0 ? categoryIdRaw : null;

  const priceRaw = String(formData.get("price_clp") ?? "").trim();
  const price_clp = priceRaw.length > 0 ? Number.parseInt(priceRaw, 10) : null;

  const hasInStock = formData.get("has_in_stock") === "on";
  const isActive = formData.get("is_active") === "on";
  const isFeatured = formData.get("is_featured") === "on";

  if (!name || !slug) {
    redirect("/admin/productos/nuevo?error=missing_fields");
  }

  if (priceRaw && Number.isNaN(price_clp)) {
    redirect("/admin/productos/nuevo?error=invalid_price");
  }

  const supabase = createSupabaseServer();

  const { data: slugExists } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (slugExists) {
    redirect("/admin/productos/nuevo?error=slug_exists");
  }

  if (sku) {
    const { data: skuExists } = await supabase
      .from("products")
      .select("id")
      .eq("sku", sku)
      .maybeSingle();

    if (skuExists) {
      redirect("/admin/productos/nuevo?error=sku_exists");
    }
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      sku,
      description,
      specs,
      price_clp,
      image_url,
      hover_image_url,
      gallery_urls,
      category_id,
      has_in_stock: hasInStock,
      is_active: isActive,
      is_featured: isFeatured,
    })
    .select("slug")
    .single();

  if (error || !data) {
    redirect("/admin/productos/nuevo?error=create_failed");
  }
  

  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
  revalidatePath(`/admin/productos/${data.slug}`);
  revalidatePath(`/producto/${data.slug}`);

  redirect(`/admin/productos/${data.slug}?created=1`);
}
export async function deleteProductAction(formData: FormData) {
  const sku = String(formData.get("sku") ?? "").trim();

  if (!sku) {
    redirect("/admin/productos?error=delete_failed");
  }

  const supabase = createSupabaseServer();

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, slug, sku")
    .eq("sku", sku)
    .maybeSingle();

  if (productError || !product) {
    redirect("/admin/productos?error=delete_failed");
  }

  const { error: variantsError } = await supabase
    .from("product_variants")
    .delete()
    .eq("product_id", product.id);

  if (variantsError) {
    redirect("/admin/productos?error=delete_failed");
  }

  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .eq("id", product.id);

  if (deleteError) {
    redirect("/admin/productos?error=delete_failed");
  }

  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
  revalidatePath(`/admin/productos/${product.slug}`);
  revalidatePath(`/producto/${product.slug}`);

  redirect("/admin/productos?deleted=1");
}