import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  // 1. Authenticate user
  const clientSupabase = await createClient();
  const { data: { user } } = await clientSupabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const ambassadorId = formData.get("ambassadorId") as string;
  const type = formData.get("type") as string; // "photo" or "logo"

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const fileName = `${type || 'photo'}-${ambassadorId || 'temp'}-${Date.now()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const adminSupabase = createAdminClient();

  // 2. Verify & create 'ambassador-assets' bucket if it doesn't exist
  try {
    const { data: buckets } = await adminSupabase.storage.listBuckets();
    const hasBucket = buckets?.some(b => b.id === 'ambassador-assets');
    if (!hasBucket) {
      await adminSupabase.storage.createBucket('ambassador-assets', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880 // 5MB
      });
    }
  } catch (bucketErr) {
    console.error("Error creating bucket:", bucketErr);
  }

  // 3. Upload file
  const { error: uploadError } = await adminSupabase.storage
    .from("ambassador-assets")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: urlData } = adminSupabase.storage
    .from("ambassador-assets")
    .getPublicUrl(fileName);

  // If ambassadorId is a real UUID, update the record in db
  if (ambassadorId && ambassadorId !== "temp" && !ambassadorId.startsWith("amb-fallback-")) {
    const updatePayload: Record<string, string> = {};
    if (type === "logo") {
      updatePayload.logo_url = urlData.publicUrl;
    } else {
      updatePayload.photo_url = urlData.publicUrl;
    }

    await adminSupabase
      .from("global_ambassadors")
      .update(updatePayload)
      .eq("id", ambassadorId);
  }

  return NextResponse.json({ url: urlData.publicUrl });
}
