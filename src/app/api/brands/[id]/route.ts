import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Authenticate user
  const clientSupabase = await createClient();
  const { data: { user } } = await clientSupabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Perform update
  const adminSupabase = createAdminClient();
  const body = await req.json();
  const { id } = await params;

  const { data, error } = await adminSupabase
    .from("brands")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Authenticate user
  const clientSupabase = await createClient();
  const { data: { user } } = await clientSupabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Perform delete
  const adminSupabase = createAdminClient();
  const { id } = await params;

  const { error } = await adminSupabase
    .from("brands")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
