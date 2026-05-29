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
  const podcastId = formData.get("podcastId") as string;

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const fileName = `${podcastId || 'temp'}-${Date.now()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const adminSupabase = createAdminClient();

  // 2. Programmatically verify & create 'podcast-thumbnails' bucket if it doesn't exist
  try {
    const { data: buckets } = await adminSupabase.storage.listBuckets();
    const hasBucket = buckets?.some(b => b.id === 'podcast-thumbnails');
    if (!hasBucket) {
      await adminSupabase.storage.createBucket('podcast-thumbnails', {
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
    .from("podcast-thumbnails")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: urlData } = adminSupabase.storage
    .from("podcast-thumbnails")
    .getPublicUrl(fileName);

  // If podcastId is a real UUID, update the record
  if (podcastId && podcastId !== "temp" && podcastId !== "") {
    await adminSupabase
      .from("podcasts")
      .update({ thumbnail_url: urlData.publicUrl })
      .eq("id", podcastId);
  }

  return NextResponse.json({ url: urlData.publicUrl });
}
