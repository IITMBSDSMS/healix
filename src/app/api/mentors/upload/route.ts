import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const mentorId = formData.get("mentorId") as string;

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const fileName = `${mentorId}-${Date.now()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("mentor-photos")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: urlData } = supabase.storage
    .from("mentor-photos")
    .getPublicUrl(fileName);

  // Update mentor record with new photo_url
  await supabase
    .from("mentors")
    .update({ photo_url: urlData.publicUrl })
    .eq("id", mentorId);

  return NextResponse.json({ url: urlData.publicUrl });
}
