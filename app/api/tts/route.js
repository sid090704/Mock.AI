import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { text } = await request.json();

    const response = await fetch("https://api.deepgram.com/v1/speak?model=aura-2-juno-en", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    return NextResponse.json({ error: "Failed to generate TTS" }, { status: 500 });
  }
}
