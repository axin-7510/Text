import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "北境环线｜挪威 × 瑞典 × 冰岛旅行攻略",
  description: "2026年9月26日至10月6日，挪威、瑞典与冰岛北境环线旅行攻略。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
