import { NextResponse } from "next/server";
import wifi from "node-wifi";

export async function GET(req) {
  wifi.init({
    iface: null,
  });

  const networkList = await new Promise((resolve) => {
    wifi.scan((error, networks) => {
      if (error) {
        console.log(error);
      } else {
        wifi.getCurrentConnections((error, currentConnections) => {
          if (error) {
            console.log(error);
          } else {
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

              mappedNetworks.push({
                ssid: network.ssid,
                connected: connectedNetwork !== undefined,
              });
            });
            resolve(mappedNetworks);
          }
        });
      }
    });
  });

  return NextResponse.json(networkList, { status: 200 });
}
