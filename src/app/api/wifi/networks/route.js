import { NextResponse } from "next/server";
import wifi from "node-wifi";

export async function GET(req) {
  wifi.init({
    iface: null,
  });

  const networks = await wifi.scan();
  const currentConnections = await wifi.getCurrentConnections();

  const mappedNetworks = [];

  networks.map((network) => {
    if (!network.ssid) {
      return;
    }

    const connectedNetwork = currentConnections.find(
      (f) =>
        f.ssid === network.ssid ||
        f.bssid === network.ssid ||
        f.mac === network.ssid
    );

    const isDuplicated = mappedNetworks.find(
      (mapped) => mapped.ssid === network.ssid
    );

    if (!isDuplicated) {
      mappedNetworks.push({
        ssid: network.ssid,
        connected: connectedNetwork !== undefined,
      });
    }
  });

  mappedNetworks.sort((a, b) => {
    if (a.connected !== b.connected) {
      return a.connected ? -1 : 1;
    }
  });

  return NextResponse.json(mappedNetworks, { status: 200 });
}
