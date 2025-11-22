import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ message: "Hello from Next.js 14" });
}

export async function POST(request: Request) {
  try {
    const { term, response_limit = 10 } = await request.json();
    

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ term, response_limit }),
    signal: controller.signal,
  });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Backend request failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Backend search error:', error);
    return NextResponse.json(
      { error: 'Backend timeout or failed' },
      { status: 408 }
    );
  }
}