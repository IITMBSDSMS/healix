import { NextResponse } from "next/server";
import axios from "axios";

// Production Backend URL (Render)
const FLASK_URL = process.env.FLASK_API_URL ?? "https://healix-biolabs.onrender.com";

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    const response = await axios.post(`${FLASK_URL}/predict`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000, // 60s — large genomic files or Render cold start
    });

    return NextResponse.json(response.data);
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: unknown; status?: number }; message?: string };

    console.error("[/api/predict] Flask error:", axiosErr?.response?.data ?? axiosErr?.message);

    return NextResponse.json(
      {
        error:
          axiosErr?.response?.data ??
          axiosErr?.message ??
          "Could not reach AI engine. Make sure the Flask server is running.",
      },
      { status: axiosErr?.response?.status ?? 502 }
    );
  }
}