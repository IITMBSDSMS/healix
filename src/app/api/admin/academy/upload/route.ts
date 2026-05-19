import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
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

    // Upload to 'mentor-photos' storage bucket (making sure it exists or fallback)
    const { error: uploadError } = await supabase.storage
      .from("mentor-photos")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("mentor-photos")
      .getPublicUrl(fileName);

    // If mentorId is supplied, update the academy_mentors table
    if (mentorId) {
      await supabase
        .from("academy_mentors")
        .update({ photoUrl: urlData.publicUrl })
        .eq("id", mentorId);
    }

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
