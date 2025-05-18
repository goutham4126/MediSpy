import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { amount } = await request.json();

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).substring(2, 10)}`,
    });

    return Response.json({ orderId: order.id });
  } catch (error) {
    console.error("Error creating order:", error);
    return Response.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}