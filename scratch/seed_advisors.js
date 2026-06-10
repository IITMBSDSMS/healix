const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

let supabaseUrl = "";
let supabaseKey = "";

if (fs.existsSync(".env.local")) {
  const content = fs.readFileSync(".env.local", "utf8");
  content.split("\n").forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const parts = trimmed.split("=");
    const key = parts[0].trim();
    const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
    if (key === "NEXT_PUBLIC_SUPABASE_URL") {
      supabaseUrl = value;
    }
    if (key === "SUPABASE_SERVICE_ROLE_KEY" || key === "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
      if (!supabaseKey || key === "SUPABASE_SERVICE_ROLE_KEY") {
        supabaseKey = value;
      }
    }
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in env.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_ADVISORS = [
  {
    name: "Dr. Partha Pratim",
    role: "MD",
    organization: "AIIMS New Delhi",
    bio: "Genomics sequencing diagnostics & risk profiling",
    category: "clinical",
    photo_url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
    linkedin_url: "https://www.linkedin.com/company/quick-healix/",
    display_order: 1,
    active: true
  },
  {
    name: "Dr. Sarah Chen",
    role: "MD, PhD",
    organization: "Stanford Medicine",
    bio: "Clinical decision support & triaging pipelines",
    category: "clinical",
    photo_url: "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=400&auto=format&fit=crop",
    linkedin_url: "https://www.linkedin.com/company/quick-healix/",
    display_order: 2,
    active: true
  },
  {
    name: "Dr. A. C. Roy",
    role: "MD, FACC",
    organization: "Mayo Clinic",
    bio: "Cardiovascular telemetry & remote monitoring",
    category: "clinical",
    photo_url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop",
    linkedin_url: "https://www.linkedin.com/company/quick-healix/",
    display_order: 3,
    active: true
  },
  {
    name: "Dr. Rajesh K. Sharma",
    role: "PhD",
    organization: "IISc Bangalore",
    bio: "Distributed algorithms & database reliability",
    category: "research",
    photo_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400&auto=format&fit=crop",
    linkedin_url: "https://www.linkedin.com/company/quick-healix/",
    display_order: 4,
    active: true
  },
  {
    name: "Prof. Michael Sterling",
    role: "PhD",
    organization: "MIT Media Lab",
    bio: "Wearable biosensors & edge compute arrays",
    category: "research",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    linkedin_url: "https://www.linkedin.com/company/quick-healix/",
    display_order: 5,
    active: true
  },
  {
    name: "Dr. Ananya Ray",
    role: "PhD",
    organization: "IIT Madras",
    bio: "In-silico molecular modeling & cancer targets",
    category: "research",
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    linkedin_url: "https://www.linkedin.com/company/quick-healix/",
    display_order: 6,
    active: true
  },
  {
    name: "Prof. R. Sharma",
    role: "Senior Faculty",
    organization: "IIT Delhi",
    bio: "Telemetry synchronization & network protocols",
    category: "academic",
    photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    linkedin_url: "https://www.linkedin.com/company/quick-healix/",
    display_order: 7,
    active: true
  },
  {
    name: "Dr. Vikram Sen",
    role: "Professor",
    organization: "AIIMS New Delhi",
    bio: "Community health diagnostics & survey design",
    category: "academic",
    photo_url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop",
    linkedin_url: "https://www.linkedin.com/company/quick-healix/",
    display_order: 8,
    active: true
  },
  {
    name: "Dr. Helen Rostova",
    role: "Faculty",
    organization: "Cambridge University",
    bio: "Explainable deep learning models in healthcare",
    category: "academic",
    photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
    linkedin_url: "https://www.linkedin.com/company/quick-healix/",
    display_order: 9,
    active: true
  },
  {
    name: "Sudiksha Sharma",
    role: "Human Systems Strategist",
    organization: "CU Delhi",
    bio: "Behavioral psychology & interface trust dynamics",
    category: "industry",
    photo_url: "https://chdujpvwawaqgaenrgms.supabase.co/storage/v1/object/public/mentor-photos/9e91e2a2-6910-4254-aeca-5fdc074ebb05-1779985539265.png",
    linkedin_url: "https://www.linkedin.com/company/quick-healix/",
    display_order: 10,
    active: true
  },
  {
    name: "Siddharth Bose",
    role: "Partner",
    organization: "Biotech Capital",
    bio: "Commercialization & intellectual property structures",
    category: "industry",
    photo_url: "https://images.unsplash.com/photo-1519085186480-b8553f4b2a44?q=80&w=400&auto=format&fit=crop",
    linkedin_url: "https://www.linkedin.com/company/quick-healix/",
    display_order: 11,
    active: true
  },
  {
    name: "Elena Petrova",
    role: "Director",
    organization: "Global Pharma Solutions",
    bio: "Clinical trial designs & regulatory compliance",
    category: "industry",
    photo_url: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&auto=format&fit=crop",
    linkedin_url: "https://www.linkedin.com/company/quick-healix/",
    display_order: 12,
    active: true
  }
];

async function seed() {
  console.log("Seeding default advisors...");
  
  // 1. Fetch current mentors
  const { data: existingMentors, error: fetchErr } = await supabase
    .from("mentors")
    .select("name");
    
  if (fetchErr) {
    console.error("Error fetching existing mentors:", fetchErr.message);
    process.exit(1);
  }
  
  const existingNames = new Set((existingMentors || []).map(m => m.name.toLowerCase().trim()));
  
  // 2. Filter out already existing mentors
  const toInsert = DEFAULT_ADVISORS.filter(adv => !existingNames.has(adv.name.toLowerCase().trim()));
  
  if (toInsert.length === 0) {
    console.log("All advisors already exist in the database.");
    return;
  }
  
  console.log(`Inserting ${toInsert.length} missing advisors...`);
  const { data, error } = await supabase
    .from("mentors")
    .insert(toInsert)
    .select();
    
  if (error) {
    console.error("Error inserting advisors:", error.message);
  } else {
    console.log(`Successfully inserted ${data.length} advisors:`);
    data.forEach(m => console.log(`- ${m.name} (${m.category})`));
  }
}

seed();
