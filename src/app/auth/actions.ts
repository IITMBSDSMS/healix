"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();

  // If dummy URL is used, we mock success for demonstration purposes
  if (process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log("[MOCK LOGIN] Logged in as:", email);
    // Set a dummy cookie so middleware allows access to protected routes
    (await cookies()).set("dummy-mock-token", "1", { path: "/" });
    redirect("/dashboard");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    return { error: "All fields are required" };
  }

  const supabase = await createClient();

  if (process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log("[MOCK SIGNUP] Signed up as:", email);
    
    // Simulate welcome email
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "YOUR_RESEND_API_KEY") {
        // Send email via API route or directly here
        // For now, we will hit our API route
        try {
            await fetch(process.env.NEXT_PUBLIC_SITE_URL + "/api/send-welcome" || "http://localhost:3000/api/send-welcome", {
                method: "POST",
                body: JSON.stringify({ email, name })
            });
        } catch (e) {}
    } else {
        console.log("[MOCK RESEND] Sent welcome email to:", email);
    }
    (await cookies()).set("dummy-mock-token", "1", { path: "/" });
    redirect("/dashboard");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Trigger welcome email via our API route
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    await fetch(`${siteUrl}/api/send-welcome`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name }),
    });
  } catch (err) {
    console.error("Failed to send welcome email:", err);
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // Clear mock session cookie if present
  (await cookies()).set("dummy-mock-token", "", { path: "/", maxAge: 0 });
  redirect("/");
}
