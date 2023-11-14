import { NextResponse } from "next/server";
import wifi from "node-wifi";

export async function POST(req) {
  try {
    const { ssid, password } = await req.json();
    wifi.init({
      iface: null,
    });

    const connected = await new Promise((resolve) => {
      wifi.connect({ ssid, password }, (error) => {
        if (error) {
          console.error(error);
          return resolve({ success: false });
        }

        resolve({ success: true });
      });
    });

    const statusCode = connected.success ? 201 : 500;
    return NextResponse.json(connected, { status: statusCode });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
