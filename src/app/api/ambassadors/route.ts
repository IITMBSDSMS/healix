import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

export const DEFAULT_AMBASSADORS = [
  {
    name: "Rohan Verma",
    role: "Global Brand Ambassador",
    institution: "IIT Delhi",
    logo_url: "/iit_delhi_logo.svg",
    email: "ambassador@iitd.ac.in",
    phone: "+91 98765 43210",
    address: "IIT Delhi, Hauz Khas, New Delhi - 110016",
    quote: "Being part of a global network means more than connections—it's about collaborating for a better tomorrow.",
    photo_url: "/ambassador_1.png",
    accent_color: "#0B4A9E",
    accent_color_sec: "#E60717",
    display_order: 0,
    active: true
  },
  {
    name: "Aditi Rao",
    role: "Clinical IoT Lead",
    institution: "IIT Bombay",
    logo_url: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg/500px-Indian_Institute_of_Technology_Bombay_Logo.svg.png",
    email: "ambassador@iitb.ac.in",
    phone: "+91 98123 45678",
    address: "IIT Bombay, Powai, Mumbai, Maharashtra - 400076",
    quote: "Standardizing real-time biosensors and edge devices enables us to bring diagnostic care directly to rural communities.",
    photo_url: "/ambassador_2.png",
    accent_color: "#003A70",
    accent_color_sec: "#E60717",
    display_order: 1,
    active: true
  },
  {
    name: "Karthik Swaminathan",
    role: "Hardware & Protocols Advisor",
    institution: "IIT Madras",
    logo_url: "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/IIT_Madras_Logo.svg/500px-IIT_Madras_Logo.svg.png",
    email: "ambassador@iitm.ac.in",
    phone: "+91 98234 56789",
    address: "IIT Madras, Adyar, Chennai, Tamil Nadu - 600036",
    quote: "Distributed hardware networks and fail-safe communication protocols are the backbone of next-gen clinical triage.",
    photo_url: "/ambassador_3.png",
    accent_color: "#004B87",
    accent_color_sec: "#E60717",
    display_order: 2,
    active: true
  },
  {
    name: "Dr. Meera Nair",
    role: "Genomics Research Lead",
    institution: "IISc Bangalore",
    logo_url: "https://upload.wikimedia.org/wikipedia/en/thumb/7/79/Indian_Institute_of_Science_logo.svg/500px-Indian_Institute_of_Science_logo.svg.png",
    email: "ambassador@iisc.ac.in",
    phone: "+91 98345 67890",
    address: "IISc Bangalore, Malleshwaram, Bengaluru, Karnataka - 560012",
    quote: "Deep learning models for molecular classification open new frontiers in identifying mutation pathways rapidly.",
    photo_url: "/ambassador_4.png",
    accent_color: "#0F4C81",
    accent_color_sec: "#E60717",
    display_order: 3,
    active: true
  }
];

export async function GET(req: Request) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  let query = supabase
    .from("global_ambassadors")
    .select("*")
    .order("display_order", { ascending: true });

  if (!all) query = query.eq("active", true);

  const { data, error } = await query;

  if (error) {
    console.warn("Could not fetch global network ambassadors from database, falling back to static defaults:", error.message);
    const filteredDefaults = all ? DEFAULT_AMBASSADORS : DEFAULT_AMBASSADORS.filter(a => a.active);
    // Add mock/temp ids to defaults
    const defaultsWithIds = filteredDefaults.map((d, idx) => ({ ...d, id: `amb-fallback-${idx}` }));
    return NextResponse.json(defaultsWithIds);
  }

  // If table exists but empty, auto-seed the defaults
  if (!data || data.length === 0) {
    try {
      const { data: seeded, error: seedError } = await supabase
        .from("global_ambassadors")
        .insert(DEFAULT_AMBASSADORS)
        .select();
      if (!seedError && seeded && seeded.length > 0) {
        return NextResponse.json(seeded);
      }
    } catch (e) {
      console.warn("Auto-seeding ambassadors failed:", e);
    }
    const defaultsWithIds = DEFAULT_AMBASSADORS.map((d, idx) => ({ ...d, id: `amb-fallback-${idx}` }));
    return NextResponse.json(defaultsWithIds);
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  // 1. Authenticate user
  const clientSupabase = await createClient();
  const { data: { user } } = await clientSupabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Perform write with admin client
  const adminSupabase = createAdminClient();
  const body = await req.json();

  const { data, error } = await adminSupabase
    .from("global_ambassadors")
    .insert([body])
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST204" || error.message?.includes("relation \"global_ambassadors\" does not exist")) {
      return NextResponse.json(
        { error: "DB_TABLE_MISSING", message: "The database table 'global_ambassadors' does not exist yet. Please run the SQL schema first." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
