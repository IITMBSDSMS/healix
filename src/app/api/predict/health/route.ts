import { NextResponse } from "next/server";
import axios from "axios";

// Production Backend URL (Render)
const FLASK_URL = process.env.FLASK_API_URL ?? "https://healix-biolabs.onrender.com";

export async function GET() {
  try {
    const response = await axios.get(`${FLASK_URL}/health`, {
      timeout: 5000,
    });
    return NextResponse.json(response.data);
  } catch (err: any) {
    return NextResponse.json(
      { status: "offline", error: err.message },
      { status: 503 }
    );
  }
}
