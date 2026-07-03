import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

export const DEFAULT_PROFESSIONALS = [
  {
    id: "p1",
    name: "Dr. Samir K Kalra",
    role: "Senior Neuro & Spine Surgeon",
    institution: "Shri Gangaram Hospital",
    photo_url: "/dr_samir_kalra.png",
    description: "Leading Neurosurgeon specialist with over so many years of experience in clinical diagnostics and edge safety telemetry integration for rural health outreach programs.",
    qualifications: [
      "MBBS, MS, MCh (Neurosurgery)",
      "Fellowship in Advanced Spine Surgery"
    ],
    hospital_name: "SHRI GANGARAM HOSPITAL",
    hospital_image: "/hospital_gangaram.png",
    hospital_location: "New Delhi, India",
    display_order: 0,
    active: true
  },
  {
    id: "p2",
    name: "Dr. Rajesh Kumar",
    role: "Senior Cardiologist",
    institution: "AIIMS Delhi",
    photo_url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
    description: "Leading cardiovascular specialist with over 15 years of experience in clinical diagnostics and edge safety telemetry integration for rural health outreach programs.",
    qualifications: [
      "MBBS, MD, DM (Cardiology)",
      "Fellow of American College of Cardiology (FACC)"
    ],
    hospital_name: "AIIMS Delhi",
    hospital_image: "https://upload.wikimedia.org/wikipedia/commons/b/b2/AIIMS_DELHI.jpg",
    hospital_location: "New Delhi, India",
    display_order: 1,
    active: true
  },
  {
    id: "p3",
    name: "Dr. Priya Sharma",
    role: "Professor of Genomics",
    institution: "IIT Madras Research Park",
    photo_url: "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=400&auto=format&fit=crop",
    description: "Academic researcher specializing in CRISPR gene drive modeling and distributed laboratory sequence analysis frameworks for predicting genetic mutation metrics.",
    qualifications: [
      "B.Tech (Biotech), MS (Genomics)",
      "Ph.D. in CRISPR Gene Drive Modeling"
    ],
    hospital_name: "IIT Madras Research Park",
    hospital_image: "https://upload.wikimedia.org/wikipedia/commons/2/23/IIT_Madras_campus_main_gate.jpg",
    hospital_location: "Chennai, India",
    display_order: 2,
    active: true
  },
  {
    id: "p4",
    name: "Dr. Amit Patel",
    role: "Director of Public Health",
    institution: "IIT Bombay Health Center",
    photo_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop",
    description: "Pioneering researcher focused on low-latency IoT health monitoring streams and developing indigenous community safety systems in collaboration with municipal corporations.",
    qualifications: [
      "MBBS, MD (Community Medicine)",
      "Fellowship in Epidemiology & Public Health"
    ],
    hospital_name: "IIT Bombay Health Center",
    hospital_image: "https://upload.wikimedia.org/wikipedia/commons/5/50/Main_building_in_IIT_Bombay.jpg",
    hospital_location: "Mumbai, India",
    display_order: 3,
    active: true
  }
];

export async function GET(req: Request) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  let query = supabase
    .from("global_professionals")
    .select("*")
    .order("display_order", { ascending: true });

  if (!all) query = query.eq("active", true);

  const { data, error } = await query;

  if (error) {
    console.warn("Could not fetch global network professionals from database, falling back to static defaults:", error.message);
    const filteredDefaults = all ? DEFAULT_PROFESSIONALS : DEFAULT_PROFESSIONALS.filter(p => p.active);
    return NextResponse.json(filteredDefaults);
  }

  if (!data || data.length === 0) {
    try {
      const { data: seeded, error: seedError } = await supabase
        .from("global_professionals")
        .insert(DEFAULT_PROFESSIONALS.map(({ id, ...rest }) => rest))
        .select();
      if (!seedError && seeded && seeded.length > 0) {
        return NextResponse.json(seeded);
      }
    } catch (e) {
      console.warn("Auto-seeding professionals failed:", e);
    }
    return NextResponse.json(DEFAULT_PROFESSIONALS);
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
    .from("global_professionals")
    .insert([body])
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST204" || error.message?.includes("relation \"global_professionals\" does not exist")) {
      return NextResponse.json(
        { error: "DB_TABLE_MISSING", message: "The database table 'global_professionals' does not exist yet. Please run 'supabase_global_network_schema.sql' in your Supabase SQL editor first." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
