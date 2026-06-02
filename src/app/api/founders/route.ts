import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

// Hardcoded fallback seed data for the 4 founders in case the DB table is not created yet
export const DEFAULT_FOUNDERS = [
  {
    id: "f1",
    name: "Avnish",
    role: "Founder & CEO",
    quote: "Precision health data infrastructure is the foundation of modern clinical safety and AI diagnostics. At Healix, we are commoditizing the complex engineering required to unify fragmented health datasets so innovators can build clinical products at scale.",
    photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    display_order: 0,
    active: true
  },
  {
    id: "f2",
    name: "Debraghya Bag",
    role: "Co-Founder & Chief Medical Officer (CMO)",
    quote: "Precision medicine starts with precise data engineering. Ensuring scientific credibility, medical correctness, and healthcare system reliability is not a post-hoc check—it is built into every telemetry model we run at Healix.",
    photo_url: "https://chdujpvwawaqgaenrgms.supabase.co/storage/v1/object/public/mentor-photos/2354710c-6edf-459f-9e26-09a96d274a9d-1779985736208.png",
    display_order: 1,
    active: true
  },
  {
    id: "f3",
    name: "Mahima Sharma",
    role: "COO",
    quote: "Reliability is not a feature; it is the core foundation. Scaling operations, securing strategic partnerships, and building sustainable ecosystem networks are key to translating Healix's clinical tech into tangible community outcomes.",
    photo_url: "https://chdujpvwawaqgaenrgms.supabase.co/storage/v1/object/public/mentor-photos/7dbf680f-f5d2-4967-b1bb-1bdc40edd29c-1779985889408.png",
    display_order: 2,
    active: true
  },
  {
    id: "f4",
    name: "Sudiksha Sharma",
    role: "Behavioral Psychology & Human Systems Strategist",
    quote: "Technology must serve the human experience. Designing healthcare systems that people emotionally trust, feel safe using, and find reassuring is critical for securing widespread public health adoption.",
    photo_url: "https://chdujpvwawaqgaenrgms.supabase.co/storage/v1/object/public/mentor-photos/9e91e2a2-6910-4254-aeca-5fdc074ebb05-1779985539265.png",
    display_order: 3,
    active: true
  }
];

export async function GET(req: Request) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  let query = supabase
    .from("founders")
    .select("*")
    .order("display_order", { ascending: true });

  if (!all) query = query.eq("active", true);

  const { data, error } = await query;

  if (error) {
    console.warn("Could not fetch founders from database, falling back to static defaults:", error.message);
    // If the table founders doesn't exist, return the static defaults
    const filteredDefaults = all ? DEFAULT_FOUNDERS : DEFAULT_FOUNDERS.filter(f => f.active);
    return NextResponse.json(filteredDefaults);
  }

  // If query succeeded but table is empty, return the seed data
  if (!data || data.length === 0) {
    return NextResponse.json(DEFAULT_FOUNDERS);
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
    .from("founders")
    .insert([body])
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST204" || error.message?.includes("relation \"founders\" does not exist")) {
      return NextResponse.json(
        { error: "DB_TABLE_MISSING", message: "The database table 'founders' does not exist yet. Please run 'supabase_founders_schema.sql' in your Supabase SQL editor first." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
