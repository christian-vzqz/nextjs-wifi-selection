import { NextResponse } from "next/server";
import wifi from "node-wifi";
import { resolve } from "styled-jsx/css";

function res(messageBody, statusCode) {
  return NextResponse.json(messageBody, { status: statusCode });
}

export async function POST() {
  try {
    wifi.init({
      iface: null,
    });

    await wifi.disconnect();
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
