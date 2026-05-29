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

  const { id } = await params;
  const body = await req.json();

  // 2. Perform write with admin client (bypasses RLS issues)
  const adminSupabase = createAdminClient();
  const { data, error } = await adminSupabase
    .from("team_members")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Authenticate user
  const clientSupabase = await createClient();
  const { data: { user } } = await clientSupabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // 2. Perform write with admin client (bypasses RLS issues)
  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase.from("team_members").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
