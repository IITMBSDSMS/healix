"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitApplication(formData: FormData) {
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data: { user } } = await supabase.auth.getUser();
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const idea_title = formData.get("ideaTitle") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;

  if (!name || !email || !idea_title || !description || !category) {
    return { error: "All fields are required." };
  }

  const isMock =
    process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (isMock) {
    console.log("[MOCK DB] BioLab Application Submitted:", { name, email, idea_title, category });
    
    // Simulate email
    try {
      await fetch(`${siteUrl}/api/send-biolab`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, idea_title }),
      });
    } catch (e) {}

    return { success: true };
  }

  if (!user) {
    return { error: "You must be logged in to submit an application." };
  }

  const { error } = await supabase.from("biolab_applications").insert({
    user_id: user.id,
    name,
    email,
    idea_title,
    description,
    category,
    status: "pending",
  });

  if (error) {
    console.error("BioLab Submission Error:", error);
    return { error: error.message };
  }

  try {
    await fetch(`${siteUrl}/api/send-biolab`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, idea_title }),
    });
  } catch (err) {
    console.error("Failed to trigger BioLab email:", err);
  }

  revalidatePath("/biolabs");
  return { success: true };
}

export async function getBiolabData() {
  const supabase = await createClient();

  const isMock =
    process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (isMock) {
    return {
      metrics: { total_applications: 142, accepted_projects: 3, active_researchers: 28 },
      projects: [
        { id: "1", title: "CRISPR Target Mapping", description: "Advanced mapping of potential off-target effects in novel CRISPR-Cas9 therapies using AI prediction models.", category: "Healthcare", status: "Research", progress: 65 },
        { id: "2", title: "Synthetic Antibody Gen", description: "Generating synthetic antibodies for emerging viral strains using generative adversarial networks.", category: "AI", status: "Prototype", progress: 85 },
        { id: "3", title: "Neural Link Biomaterials", description: "Developing biocompatible materials for safe, long-term neural implant integration.", category: "Healthcare", status: "Idea", progress: 20 },
      ]
    };
  }

  // Fetch real projects
  const { data: projects } = await supabase
    .from("biolab_projects")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch mock counts for metrics to make dashboard look good, or run actual count queries
  const { count: applicationsCount } = await supabase
    .from("biolab_applications")
    .select("*", { count: 'exact', head: true });

  return {
    metrics: { 
      total_applications: (applicationsCount || 0) + 120, // Add base number for demo
      accepted_projects: projects?.length || 0,
      active_researchers: 24
    },
    projects: projects || []
  };
}

export async function getUserApplications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Fetch applications for the logged in user
  const { data: applications, error: appError } = await supabase
    .from("biolab_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (appError) {
    return { error: appError.message };
  }

  // To get the progress of active projects, we'll fetch biolab_projects 
  // where the title matches the application's idea_title (since that's how we linked them in the MVP admin panel).
  const ideaTitles = applications?.map(app => app.idea_title) || [];
  
  let projects = [];
  if (ideaTitles.length > 0) {
    const { data: projData } = await supabase
      .from("biolab_projects")
      .select("*")
      .in("title", ideaTitles);
    if (projData) projects = projData;
  }

  return { applications: applications || [], projects };
}

export async function getBiolabsContent() {
  const supabase = await createClient();

  const isMock =
    process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Default hardcoded data to prevent breaking the layout if DB is not set up
  const defaultAnnouncements = [
    { content: "Important Announcement: Proposal submission for 2026 BioLabs Incubator will start from 15th June." },
    { content: "Advertisement No. 04/2026: Healix BioLabs invites applications for Junior Research Fellows (JRF)." },
    { content: "High Performance Computing (HPC) Workshop scheduled for 10th-12th July 2026. Apply Here." },
    { content: "Online Registration Open for Summer Training Programme - 2026 at Healix BioLabs." }
  ];

  const defaultEvents = [
    {
      title: "School on Characterization of AI Models in Healthcare: Structure and Diagnostics",
      description: "AI Models have proven to be a strong tool to engineer predictive pathways for potential clinical applications. This school will focus on the deployment of generative algorithms with specific attention to ethics...",
      image_url: "/biolabs/ai_medical.png",
      start_date: "2026-05-12T09:00:00",
      end_date: "2026-05-15T17:30:00"
    }
  ];

  const defaultNews = [
    { title: "Director Interview on Health Tech Morning Show | BioLabs India 2026", link_url: "#", is_document: false },
    { title: "BioLabs PhD Course Module, Semester II (January–June 2026)", link_url: "#", is_document: true, file_size: "308.81 KB" },
    { title: "National Workshop on Data Interoperability and Clinical Workflows", link_url: "#", is_document: true, file_size: "1.27 MB" },
    { title: "Workshop on In-Silico Quantum Modeling Studies - 2026", link_url: "#", is_document: false }
  ];

  const defaultPhotos = [
    { title: "Healix BioLabs Foundation Day 2026", image_url: "/biolabs/hero_dna.png" }
  ];

  const defaultPrograms = [
    { title: "Ph.D. Training Programme", description: "For doctoral candidates exploring AI-driven medical tech." },
    { title: "Summer Training Programme", description: "4-week intensive project training for B.Sc/B.Tech students." },
    { title: "Facilities Visit", description: "Guided tours of our HPC and AI Modeling clusters for institutions." }
  ];

  const defaultPublications = [
    {
      id: "pub-1",
      title: "INCUBATING DEEP TECH",
      subtitle: "National Hub for Deep Tech Startups - Economic Times feature on 30.05.2026",
      description: "With 240 startups valued at ₹10.5k cr incubated over 8 years, Healix is India's hi-tech haven.",
      image_url: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=800&auto=format&fit=crop",
      label: "Featured",
      ribbon_color: "",
      is_featured: true,
      link_url: "#"
    },
    {
      id: "pub-2",
      title: "June 2026 Newsletter",
      subtitle: "Latest Research Edition",
      description: "Quarterly update on our genomics research and AI diagnostics breakthroughs.",
      image_url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop",
      label: "June 26",
      ribbon_color: "from-green-600 to-emerald-900",
      is_featured: false,
      link_url: "#"
    },
    {
      id: "pub-3",
      title: "April 2026 Edition",
      subtitle: "BioLabs Research Digest",
      description: "Highlights from our quarterly AI health research program.",
      image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop",
      label: "Apr 26",
      ribbon_color: "from-[#ca8a04] to-amber-900",
      is_featured: false,
      link_url: "#"
    },
    {
      id: "pub-4",
      title: "February 2026 Edition",
      subtitle: "BioLabs Research Digest",
      description: "Highlights from our quarterly AI health research program.",
      image_url: "https://images.unsplash.com/photo-1614947942704-5827be95b369?q=80&w=600&auto=format&fit=crop",
      label: "Feb 26",
      ribbon_color: "from-blue-600 to-indigo-900",
      is_featured: false,
      link_url: "#"
    }
  ];

  if (isMock) {
    return { announcements: defaultAnnouncements, events: defaultEvents, news: defaultNews, photos: defaultPhotos, programs: defaultPrograms, publications: defaultPublications };
  }

  // Fetch real content
  const [
    { data: announcements },
    { data: events },
    { data: news },
    { data: photos },
    { data: programs },
    { data: publications }
  ] = await Promise.all([
    supabase.from("biolab_announcements").select("*").eq("is_active", true).order("created_at", { ascending: false }),
    supabase.from("biolab_events").select("*").eq("is_active", true).order("created_at", { ascending: false }),
    supabase.from("biolab_news").select("*").eq("is_active", true).order("created_at", { ascending: false }),
    supabase.from("biolab_photos").select("*").eq("is_active", true).order("created_at", { ascending: false }),
    supabase.from("biolab_programs").select("*").eq("is_active", true).order("created_at", { ascending: true }),
    supabase.from("biolab_publications").select("*").order("created_at", { ascending: false })
  ]);

  return {
    announcements: announcements?.length ? announcements : defaultAnnouncements,
    events: events?.length ? events : defaultEvents,
    news: news?.length ? news : defaultNews,
    photos: photos?.length ? photos : defaultPhotos,
    programs: programs?.length ? programs : defaultPrograms,
    publications: publications?.length ? publications : defaultPublications
  };
}
