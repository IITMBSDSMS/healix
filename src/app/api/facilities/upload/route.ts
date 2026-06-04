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
  const facilityId = formData.get("facilityId") as string;
  const type = formData.get("type") as string; // "campus" or "mentor"
  const mentorIndexStr = formData.get("mentorIndex") as string; // e.g. "0", "1"

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const timestamp = Date.now();
  const filePrefix = type === "mentor" ? `mentor-${mentorIndexStr}` : "campus";
  const fileName = `${facilityId || 'temp'}-${filePrefix}-${timestamp}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const adminSupabase = createAdminClient();

  // 2. Verify & create 'facility-photos' bucket if it doesn't exist
  try {
    const { data: buckets } = await adminSupabase.storage.listBuckets();
    const hasBucket = buckets?.some(b => b.id === 'facility-photos');
    if (!hasBucket) {
      await adminSupabase.storage.createBucket('facility-photos', {
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
    .from("facility-photos")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: urlData } = adminSupabase.storage
    .from("facility-photos")
    .getPublicUrl(fileName);

  // If facilityId is a real DB record, update it
  if (facilityId && facilityId !== "temp" && !facilityId.startsWith("f")) {
    if (type === "campus") {
      const { error: updateError } = await adminSupabase
        .from("global_facilities")
        .update({ image_url: urlData.publicUrl })
        .eq("id", facilityId);
      
      if (updateError) {
        console.error("Failed to update facility campus photo in DB:", updateError);
        return NextResponse.json({ error: `Database update failed: ${updateError.message}` }, { status: 500 });
      }
    } else if (type === "mentor" && mentorIndexStr !== null && mentorIndexStr !== undefined) {
      const mentorIndex = parseInt(mentorIndexStr, 10);
      // Fetch current mentors JSON
      const { data: facility, error: fetchError } = await adminSupabase
        .from("global_facilities")
        .select("mentors")
        .eq("id", facilityId)
        .single();

      if (fetchError) {
        console.error("Failed to fetch facility mentors for photo update:", fetchError);
        return NextResponse.json({ error: `Database fetch failed: ${fetchError.message}` }, { status: 500 });
      }

      if (facility && Array.isArray(facility.mentors)) {
        const updatedMentors = [...facility.mentors];
        if (updatedMentors[mentorIndex]) {
          updatedMentors[mentorIndex].photo = urlData.publicUrl;
          updatedMentors[mentorIndex].photo_url = urlData.publicUrl;
          
          const { error: updateError } = await adminSupabase
            .from("global_facilities")
            .update({ mentors: updatedMentors })
            .eq("id", facilityId);
            
          if (updateError) {
            console.error("Failed to update facility mentors list in DB:", updateError);
            return NextResponse.json({ error: `Database update failed: ${updateError.message}` }, { status: 500 });
          }
        }
      }
    }
  }

  return NextResponse.json({ url: urlData.publicUrl });
}
