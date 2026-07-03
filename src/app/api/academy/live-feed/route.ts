import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

const FALLBACK_CONFIG = {
  id: "main_session",
  tag: "Live Session • Healix Academy",
  title: "Interactive Research & learning Discussion in Progress",
  subtitle: "Healix main auditorium / Session ID: HSF-ACAD-2026",
  image_url: "/academy-classroom.jpg"
};

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("academy_live_feed")
      .select("*")
      .eq("id", "main_session")
      .maybeSingle();

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json(FALLBACK_CONFIG);
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(FALLBACK_CONFIG);
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(FALLBACK_CONFIG);
  }
}
