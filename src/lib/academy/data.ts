export const mentors = [
  {
    id: "m1",
    name: "Dr. Arvind Rao",
    role: "AI Systems Architect",
    institution: "IIT Madras Alumni",
    specialization: "Neural Networks & Distributed Systems",
    experience: "12+ Years",
    photoUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80",
    linkedinUrl: "https://linkedin.com",
    companies: ["Google", "Healix", "DeepMind"],
    bio: "Pioneered scalable AI inference engines used in clinical diagnostics. Passionate about teaching engineers how to build systems that scale to millions of users.",
  },
  {
    id: "m2",
    name: "Dr. Sarah Chen",
    role: "Head of Bioinformatics",
    institution: "Stanford Research",
    specialization: "Genomic AI & Computational Biology",
    experience: "10+ Years",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    linkedinUrl: "https://linkedin.com",
    companies: ["Healix BioLabs", "Illumina"],
    bio: "Leads the core research team at Healix BioLabs. Expert in applying machine learning to multi-omic datasets for precision oncology.",
  },
  {
    id: "m3",
    name: "Vikram Sharma",
    role: "Staff Product Engineer",
    institution: "BITS Pilani Alumni",
    specialization: "Full-Stack TS & Cloud Infrastructure",
    experience: "8+ Years",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    linkedinUrl: "https://linkedin.com",
    companies: ["Stripe", "Healix"],
    bio: "Specializes in building high-performance, fault-tolerant web applications and enterprise-grade APIs using modern TypeScript stacks.",
  },
  {
    id: "m4",
    name: "Priya Patel",
    role: "Lead Hardware Systems Engineer",
    institution: "IISc Bangalore",
    specialization: "IoT & Embedded Failsafes",
    experience: "9+ Years",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    linkedinUrl: "https://linkedin.com",
    companies: ["Tesla", "Healix Suraksha"],
    bio: "Architect behind the Project Suraksha telemetry system. Teaches hardware-software integration for life-critical IoT applications.",
  }
];

export const courses = [
  {
    id: "c1",
    slug: "ai-systems-engineering",
    title: "AI Systems Engineering",
    shortDescription: "Build and deploy production-grade AI inference pipelines.",
    longDescription: "Learn to architect, deploy, and scale machine learning models in production. We cover everything from model quantization and API design to Kubernetes deployments and latency optimization, using real-world clinical AI case studies.",
    price: 7999,
    originalPrice: 12999,
    duration: "12 Weeks",
    difficulty: "Advanced",
    seatsRemaining: 15,
    mentors: ["m1"],
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    modules: [
      "Fundamentals of ML Ops",
      "Model Quantization & TensorRT",
      "Building High-Concurrency Inference APIs",
      "Kubernetes & Distributed Scaling",
      "Monitoring & Drift Detection"
    ],
    outcomes: [
      "Deploy models with <50ms latency",
      "Build fault-tolerant API gateways",
      "Master Docker & K8s for AI",
      "Implement real-time model telemetry"
    ],
    projects: [
      "Real-time Medical Image Classification API",
      "Distributed Chatbot Backend"
    ]
  },
  {
    id: "c2",
    slug: "full-stack-product-engineering",
    title: "Full Stack Product Engineering",
    shortDescription: "Master modern TypeScript, Next.js, and Cloud architectures.",
    longDescription: "A comprehensive deep dive into building enterprise-grade SaaS products. Learn the exact stack and design patterns used by top startups: Next.js App Router, tRPC, Prisma, Supabase, and advanced React patterns.",
    price: 5999,
    originalPrice: 9999,
    duration: "10 Weeks",
    difficulty: "Intermediate",
    seatsRemaining: 24,
    mentors: ["m3"],
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    modules: [
      "Advanced TypeScript & Type-Safe APIs",
      "Next.js App Router & Server Actions",
      "PostgreSQL & ORM Mastery",
      "Authentication & Zero-Trust Security",
      "CI/CD & Vercel Deployments"
    ],
    outcomes: [
      "Build complex SaaS dashboards",
      "Implement secure auth flows",
      "Design normalized database schemas",
      "Master edge rendering techniques"
    ],
    projects: [
      "Multi-tenant SaaS Platform",
      "Real-time Collaborative Editor"
    ]
  },
  {
    id: "c3",
    slug: "genomic-ai-research-systems",
    title: "Genomic AI Research Systems",
    shortDescription: "Apply Deep Learning to Bioinformatics and Genomics.",
    longDescription: "Bridge the gap between computer science and biology. Learn to process massive genomic datasets, build predictive models for disease susceptibility, and design tools for clinical researchers.",
    price: 9999,
    originalPrice: 15999,
    duration: "14 Weeks",
    difficulty: "Expert",
    seatsRemaining: 8,
    mentors: ["m2"],
    thumbnail: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80",
    modules: [
      "Introduction to Computational Biology",
      "Processing DNA/RNA Sequencing Data",
      "Deep Learning for Sequence Analysis",
      "Protein Structure Prediction (AlphaFold)",
      "Building Clinical Dashboards"
    ],
    outcomes: [
      "Analyze microarray & RNA-seq data",
      "Build CNNs/Transformers for genomics",
      "Deploy bioinformatics pipelines",
      "Understand regulatory compliance"
    ],
    projects: [
      "Cancer Biomarker Discovery Engine",
      "Interactive Genome Visualizer"
    ]
  },
  {
    id: "c4",
    slug: "startup-engineering-fellowship",
    title: "Startup Engineering Fellowship",
    shortDescription: "From 0 to 1: Build, Launch, and Scale.",
    longDescription: "Designed for aspiring technical founders and early engineers. Learn rapid prototyping, MVP architecture, growth engineering, and how to scale systems when user traction hits.",
    price: 4999,
    originalPrice: 8999,
    duration: "8 Weeks",
    difficulty: "Beginner/Intermediate",
    seatsRemaining: 42,
    mentors: ["m1", "m3"],
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    modules: [
      "MVP Architecture & Tech Stack Selection",
      "Rapid Prototyping with No/Low Code + Custom Code",
      "Integrating Payments (Stripe/Razorpay)",
      "Analytics, Telemetry & Growth Loops",
      "Handling the First 10,000 Users"
    ],
    outcomes: [
      "Launch a fully functional product",
      "Implement monetization",
      "Set up product analytics",
      "Design for scale"
    ],
    projects: [
      "Launch your own micro-SaaS",
      "Implement a viral waitlist system"
    ]
  }
];

export const testimonials = [
  {
    id: "t1",
    name: "Rohan Kapoor",
    role: "SDE-II at Amazon",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    quote: "The AI Systems Engineering course completely changed how I think about architecture. The mentorship from Dr. Rao was invaluable in helping me crack my senior engineering interviews."
  },
  {
    id: "t2",
    name: "Neha Gupta",
    role: "Founder, MedTech Startup",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    quote: "The Startup Engineering Fellowship gave me the technical foundation to build my MVP in just 4 weeks. The modules on Stripe integration and Next.js are gold."
  },
  {
    id: "t3",
    name: "Aman Desai",
    role: "Research Fellow, AIIMS",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    quote: "Coming from a biology background, the Genomic AI course bridged the gap perfectly. I'm now deploying deep learning models on my own research datasets."
  }
];
