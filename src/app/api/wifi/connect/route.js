import { NextResponse } from "next/server";
import wifi from "node-wifi";

export async function POST(req) {
  try {
    const { ssid, password } = await req.json();
    wifi.init({
      iface: null,
    });

    await wifi.connect({ ssid, password });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
