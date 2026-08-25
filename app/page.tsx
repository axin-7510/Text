import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "北境环线｜挪威 × 瑞典 × 冰岛旅行攻略",
  description: "2026年9月26日至10月6日，挪威、瑞典与冰岛北境环线旅行攻略。",
};

export default function Home() {
  return (
    <main className="guide-shell">
      <iframe
        title="北境环线旅行攻略"
        src="/nordic-guide.html"
        className="guide-frame"
      />
    </main>
  );
}
