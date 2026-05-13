import { NextResponse } from "next/server";
import axios from "axios";

// Flask API runs on 8080 — macOS ControlCenter permanently blocks 5000 & 5001
const FLASK_URL = process.env.FLASK_API_URL ?? "http://127.0.0.1:5000";

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    const response = await axios.post(`${FLASK_URL}/predict`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 30000, // 30s — large genomic files may take time
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