import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  try {
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

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const ext = file.name.split(".").pop();
    const fileName = `news-cover-${Date.now()}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const adminSupabase = createAdminClient();

    // Ensure bucket exists
    try {
      const { data: buckets } = await adminSupabase.storage.listBuckets();
      const hasBucket = buckets?.some(b => b.id === "public_media");
      if (!hasBucket) {
        await adminSupabase.storage.createBucket("public_media", {
          public: true,
          allowedMimeTypes: ["image/*"],
          fileSizeLimit: 10485760 // 10MB
        });
      }
    } catch (bucketErr) {
      console.error("Error checking bucket:", bucketErr);
    }

    const { error: uploadError } = await adminSupabase.storage
      .from("public_media")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = adminSupabase.storage
      .from("public_media")
      .getPublicUrl(fileName);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
