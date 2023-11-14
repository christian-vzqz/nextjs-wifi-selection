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

    const disconnected = await new Promise((resolve) => {
      wifi.disconnect((error) => {
        if (error) {
          console.error(error);
          return resolve({ success: false });
        }
        resolve({ success: true });
      });
    });

    const statusCode = disconnected.success ? 201 : 500;
    return NextResponse.json(disconnected, { status: statusCode });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
