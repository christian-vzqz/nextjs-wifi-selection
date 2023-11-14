import "./globals.css";

export const metadata = {
  title: "Wifi Management",
  description: "next js application to manage wifi connections",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
