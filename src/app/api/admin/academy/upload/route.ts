import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const clientSupabase = await createClient();
    const { data: { user } } = await clientSupabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && user.email !== adminEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const mentorId = formData.get("mentorId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const ext = file.name.split(".").pop();
    const uniqueId = mentorId || Math.floor(Math.random() * 1000000).toString();
    const fileName = `academy-${uniqueId}-${Date.now()}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // 2. Upload with admin client (bypasses RLS issues)
    const adminSupabase = createAdminClient();
    
    // Ensure bucket exists
    try {
      const { data: buckets } = await adminSupabase.storage.listBuckets();
      const hasBucket = buckets?.some(b => b.id === 'mentor-photos');
      if (!hasBucket) {
        await adminSupabase.storage.createBucket('mentor-photos', {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 5242880 // 5MB
        });
      }
    } catch (bucketErr) {
      console.error("Error creating bucket mentor-photos:", bucketErr);
    }

    const { error: uploadError } = await adminSupabase.storage
      .from("mentor-photos")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = adminSupabase.storage
      .from("mentor-photos")
      .getPublicUrl(fileName);

    // If mentorId is supplied, update the academy_mentors table
    if (mentorId) {
      await adminSupabase
        .from("academy_mentors")
        .update({ photoUrl: urlData.publicUrl })
        .eq("id", mentorId);
    }

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
