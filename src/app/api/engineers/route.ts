import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const DEFAULT_ENGINEERS = [
  {
    id: "e1",
    name: "IIT Delhi",
    logo_url: "https://upload.wikimedia.org/wikipedia/en/f/fd/IIT_Delhi_Logo.svg",
    fallback_text: "IITD",
    team_name: "Genomics Systems Group",
    specialization: "AI Diagnostics & Genomics Arrays",
    display_order: 0,
    active: true
  },
  {
    id: "e2",
    name: "IIT Bombay",
    logo_url: "https://upload.wikimedia.org/wikipedia/en/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg",
    fallback_text: "IITB",
    team_name: "Sensors & Telemetry Labs",
    specialization: "IoT Systems & Emergency Telemetry",
    display_order: 1,
    active: true
  },
  {
    id: "e3",
    name: "IIT Madras",
    logo_url: "https://upload.wikimedia.org/wikipedia/en/8/81/Indian_Institute_of_Technology_Madras_Logo.svg",
    fallback_text: "IITM",
    team_name: "Distributed Hardware Unit",
    specialization: "Edge Node Security & Socket Protocols",
    display_order: 2,
    active: true
  },
  {
    id: "e4",
    name: "IISc Bangalore",
    logo_url: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/Indian_Science_logo.svg/440px-Indian_Science_logo.svg.png",
    fallback_text: "IISc",
    team_name: "Bio-Computation Center",
    specialization: "Molecular Modeling & Failsafe DBs",
    display_order: 3,
    active: true
  }
];

export async function GET(req: Request) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  let query = supabase
    .from("global_engineers")
    .select("*")
    .order("display_order", { ascending: true });

  if (!all) query = query.eq("active", true);

  const { data, error } = await query;

  if (error) {
    console.warn("Could not fetch engineering nodes from database, falling back to static defaults:", error.message);
    const filteredDefaults = all ? DEFAULT_ENGINEERS : DEFAULT_ENGINEERS.filter(e => e.active);
    return NextResponse.json(filteredDefaults);
  }

  if (!data || data.length === 0) {
    return NextResponse.json(DEFAULT_ENGINEERS);
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
    .from("global_engineers")
    .insert([body])
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST204" || error.message?.includes("relation \"global_engineers\" does not exist")) {
      return NextResponse.json(
        { error: "DB_TABLE_MISSING", message: "The database table 'global_engineers' does not exist yet. Please run the SQL schema first." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
