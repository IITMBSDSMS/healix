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
  const teamMemberId = formData.get("teamMemberId") as string;

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const fileName = `${teamMemberId || 'temp'}-${Date.now()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const adminSupabase = createAdminClient();

  // 2. Programmatically verify & create 'team-photos' bucket if it doesn't exist
  try {
    const { data: buckets } = await adminSupabase.storage.listBuckets();
    const hasBucket = buckets?.some(b => b.id === 'team-photos');
    if (!hasBucket) {
      await adminSupabase.storage.createBucket('team-photos', {
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
    .from("team-photos")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: urlData } = adminSupabase.storage
    .from("team-photos")
    .getPublicUrl(fileName);

  // If teamMemberId is a real UUID, update the record
  if (teamMemberId && teamMemberId !== "temp" && teamMemberId !== "") {
    await adminSupabase
      .from("team_members")
      .update({ photo_url: urlData.publicUrl })
      .eq("id", teamMemberId);
  }

  return NextResponse.json({ url: urlData.publicUrl });
}
