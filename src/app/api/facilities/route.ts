import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const DEFAULT_FACILITIES = [
  {
    id: "f1",
    name: "AIIMS Delhi",
    city: "New Delhi",
    facility: "Healix Clinical Diagnostics Hub",
    image_url: "https://images.unsplash.com/photo-1586773860418-d3b969c73059?q=80&w=1200&auto=format&fit=crop",
    description: "Serves as the primary clinical validation center. Focuses on real-time telemetry analytics, cardiovascular risk profiling, and patient diagnostics testing workflows.",
    mentors: [
      { name: "Dr. Amitabha Bandyopadhyay", role: "Clinical Genetics Consultant", photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop" },
      { name: "Dr. Randeep Guleria", role: "Pulmonology Lead & Telemetry Advisor", photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop" }
    ],
    projects: ["Cardio Diagnostics AI", "Rural Outreach Telemetry Node", "Low-latency SOS Integration"],
    display_order: 0,
    active: true
  },
  {
    id: "f2",
    name: "IIT Delhi",
    city: "New Delhi",
    facility: "Genomics Compute Center",
    image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    description: "Hosts the distributed genomic sequence compute cluster. Drives explainable machine learning models for risk analysis and DNA sequence validation.",
    mentors: [
      { name: "Prof. James Gomes", role: "Biomedical Engineering Chair", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
      { name: "Dr. Sonia Gandhi", role: "Neurogenomics Research Fellow", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" }
    ],
    projects: ["Distributed DNA Sequence Models", "Explainable Risk Prediction Pipeline", "HPC Clusters Cluster-1"],
    display_order: 1,
    active: true
  },
  {
    id: "f3",
    name: "IIT Madras",
    city: "Chennai",
    facility: "Clinical Systems Research Lab",
    image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
    description: "Specializes in clinical IoT hardware architecture. Integrates hardware sensory fail-safes and edge network coordinates tracking arrays.",
    mentors: [
      { name: "Prof. Guhan Jayaraman", role: "Biotechnology Director", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
      { name: "Dr. K. VijayRaghavan", role: "Computational Biology Advisor", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" }
    ],
    projects: ["Sensor Failsafe Telemetry Systems", "Low-latency Edge Sockets", "SheSecure Emergency Gateway"],
    display_order: 2,
    active: true
  },
  {
    id: "f4",
    name: "IIT Bombay",
    city: "Mumbai",
    facility: "Public Health Biosensors Hub",
    image_url: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=1200&auto=format&fit=crop",
    description: "Develops bio-sensory diagnostic hardware. Specializes in low-cost paper diagnostic sensors and secure telemetry transmitters.",
    mentors: [
      { name: "Prof. Rohit Srivastava", role: "Biosensors Innovation Chair", photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop" },
      { name: "Dr. Deepa Bhartiya", role: "Stem Cell Biology Fellow", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop" }
    ],
    projects: ["Paper Biosensor Transmitters", "Autonomous Health Sync Protocol", "Urban Telemetry Hubs"],
    display_order: 3,
    active: true
  },
  {
    id: "f5",
    name: "IISc Bangalore",
    city: "Bengaluru",
    facility: "Molecular Dynamics & Biochemistry Hub",
    image_url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=1200&auto=format&fit=crop",
    description: "Focuses on advanced biochemical dynamics, CRISPR off-target mutation models, and high-reliability data integration failsafes.",
    mentors: [
      { name: "Prof. Sandeep Verma", role: "Chemical Biology Lead", photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" },
      { name: "Dr. G. Padmanaban", role: "Biochemistry Advisor", photo: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop" }
    ],
    projects: ["CRISPR Mutation Analytics", "Molecular Simulation Telemetry", "High-reliability DB Failsafes"],
    display_order: 4,
    active: true
  }
];

export async function GET(req: Request) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  let query = supabase
    .from("global_facilities")
    .select("*")
    .order("display_order", { ascending: true });

  if (!all) query = query.eq("active", true);

  const { data, error } = await query;

  if (error) {
    console.warn("Could not fetch facilities from database, falling back to static defaults:", error.message);
    const filteredDefaults = all ? DEFAULT_FACILITIES : DEFAULT_FACILITIES.filter(f => f.active);
    return NextResponse.json(filteredDefaults);
  }

  if (!data || data.length === 0) {
    try {
      const { data: seeded, error: seedError } = await supabase
        .from("global_facilities")
        .insert(DEFAULT_FACILITIES.map(({ id, ...rest }) => rest))
        .select();
      if (!seedError && seeded && seeded.length > 0) {
        return NextResponse.json(seeded);
      }
    } catch (e) {
      console.warn("Auto-seeding facilities failed:", e);
    }
    return NextResponse.json(DEFAULT_FACILITIES);
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
    .from("global_facilities")
    .insert([body])
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST204" || error.message?.includes("relation \"global_facilities\" does not exist")) {
      return NextResponse.json(
        { error: "DB_TABLE_MISSING", message: "The database table 'global_facilities' does not exist yet. Please run the SQL schema first." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
