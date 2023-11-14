import Image from "next/image";
import WifiList from "./components/WifiList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <WifiList />
    </main>
  );
}
