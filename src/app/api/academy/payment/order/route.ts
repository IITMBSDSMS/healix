import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { courseId, amount } = await req.json();

    // In a real app, you would initialize Razorpay here:
    // const razorpay = new Razorpay({ key_id: ..., key_secret: ... });
    // const order = await razorpay.orders.create({ amount, currency: "INR", receipt: "receipt_1" });

    // For now, we simulate a successful order creation
    const mockOrder = {
      id: `order_${Math.random().toString(36).substr(2, 9)}`,
      amount: amount * 100, // Razorpay expects paise
      currency: "INR",
      status: "created",
    };

    return NextResponse.json(mockOrder);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
