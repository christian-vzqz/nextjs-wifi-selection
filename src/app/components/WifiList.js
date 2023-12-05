"use client";
import { useEffect, useState } from "react";
import styles from "./WifiList.module.css";

export default function WifiList() {
  const [availableNetworks, setAvailableNetworks] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function getNetworkList() {
    fetch("/api/wifi/networks")
      .then((res) => res.json())
      .then((data) => {
        setAvailableNetworks(data.map((d) => ({ ...d, show: false })));
      });
  }

  useEffect(() => {
    getNetworkList();
  }, []);

  async function disconnect(autoDisconnect) {
    const disconnectionFetch = await fetch("/api/wifi/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const res = await disconnectionFetch.json();
    if (!res.success) {
      setErrorMessage("Error trying to disconnect, please try again");
    } else {
      setErrorMessage("");
      if (!autoDisconnect) {
        getNetworkList();
      }
    }

    return res;
  }

  async function connect(ssid) {
    if (!password) {
      setErrorMessage(
        "Password is required, please write the password and try again"
      );
      return;
    }

    const hasAnyConnected = availableNetworks.find(
      (network) => network.connected
    );
    if (hasAnyConnected) {
      const disconnected = await disconnect(true);
      if (!disconnected.success) {
        setErrorMessage("Error trying to disconnect, please try again");
        return;
      }
    }

    const connectionFetch = await fetch("/api/wifi/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ssid, password }),
    });

    const res = await connectionFetch.json();
    if (!res.success) {
      setErrorMessage(
        "Error trying to connect, verify your password and try again"
      );
    } else {
      setErrorMessage("");
      getNetworkList();
    }
  }

  function handleShow(ssid) {
    const networks = availableNetworks.map((network) => ({
      ...network,
      show: network.ssid === ssid,
    }));
    setAvailableNetworks(networks);
  }

  function handleChangePassword(event) {
    setPassword(event.target.value);
  }

  return (
    <>
      <ul role="list" className="divide-y divide-gray-100">
        <li
          key={"refresh-pewpew"}
          className="flex justify-between gap-x-6 py-5"
        >
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={getNetworkList}
            >
              Refresh
            </button>
          </div>
        </li>
        {availableNetworks.map((network) => (
          <li key={network.ssid} className="flex justify-between gap-x-6 py-5">
            <div
              className="flex min-w-0 gap-x-4"
              onClick={() => handleShow(network.ssid)}
            >
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {network.ssid}
                </p>
              </div>
            </div>
            {network.show && !network.connected ? (
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    <input
                      className={styles.input_text}
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={handleChangePassword}
                    />
                  </p>
                </div>
              </div>
            ) : null}
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              {network.connected ? (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={(_) => disconnect(false)}
                  >
                    Disconnect
                  </button>
                </div>
              ) : !network.connected && network.show ? (
                <div className="mt-1 flex items-center gap-x-1.5">
                  {errorMessage ? (
                    <>
                      <div className="flex-none rounded-full bg-red-500/20 p-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      </div>
                      <p className="text-xs leading-5 text-gray-500">
                        {errorMessage}
                      </p>
                    </>
                  ) : null}
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => connect(network.ssid)}
                  >
                    Connect
                  </button>
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
