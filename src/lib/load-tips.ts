import { cache } from "react";
import { getSupabasePublicServerClient } from "@/lib/supabase";
import {
  PUBLISHED_TIP_STATUS,
  isTipSlug,
  sortTipsNewestFirst,
  toTip,
  type Tip,
  type TipRow,
} from "@/lib/tips";

const loadPublishedRows = cache(async (): Promise<TipRow[]> => {
  try {
    const supabase = getSupabasePublicServerClient();
    if (!supabase) {
      return [];
    }
    const { data, error } = await supabase
      .from("tips")
      .select("id, slug, title, body, category, status, published_at, created_at")
      .eq("status", PUBLISHED_TIP_STATUS)
      .order("published_at", { ascending: false });
    if (error) {
      console.error("Unable to load tips", error.message);
      return [];
    }
    return (data || []) as TipRow[];
  } catch (error) {
    console.error("Unable to load tips", error);
    return [];
  }
});

export async function getPublishedTips(): Promise<Tip[]> {
  const rows = await loadPublishedRows();
  return sortTipsNewestFirst(
    rows.map(toTip).filter((tip): tip is Tip => tip !== null),
  );
}

export async function getTip(slug: string) {
  if (!isTipSlug(slug)) {
    return null;
  }
  const tips = await getPublishedTips();
  return tips.find((tip) => tip.slug === slug) ?? null;
}
