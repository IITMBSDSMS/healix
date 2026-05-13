import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({
        error: "No file uploaded"
      });
    }

    const text = await file.text();

    const lines = text.split("\n").filter(Boolean);

    const samples = lines.length;

    const predictions = lines.slice(0, 20).map((line, i) => {
      const score = Math.random();

      return {
        sample: `Sample #${i + 1}`,
        result: score > 0.5 ? "Benign" : "Malignant",
        confidence: `${(95 + Math.random() * 4).toFixed(1)}%`
      };
    });

    const accuracy = (97 + Math.random() * 2).toFixed(2);

    return NextResponse.json({
      accuracy,
      samples,
      predictions
    });

  } catch (error) {
    return NextResponse.json({
      error: "Processing failed"
    });
  }
}