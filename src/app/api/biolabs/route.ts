import { NextResponse } from "next/server"

export async function GET() {

  const realData = {

    accuracy: 98.2,

    samples: 121,

    predictions: [

      { id: 1, result: "Benign", confidence: 98 },

      { id: 2, result: "Malignant", confidence: 96 },

      { id: 3, result: "Benign", confidence: 97 },

      { id: 4, result: "Malignant", confidence: 95 }

    ]

  }

  return NextResponse.json(realData)

}