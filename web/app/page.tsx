import MessagingDemo from "@/components/MessagingDemo";
import MarketingDemo from "@/components/MarketingDemo";

export default function Home() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)] max-w-7xl mx-auto">
      <header className="mb-12 text-center">
        <div className="inline-block p-2 bg-white rounded-2xl shadow-sm border border-slate-100 mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text font-bold px-2">
            v1.0.0
          </span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">TikTok Business Suite</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Unified platform for Business Messaging and Marketing API integration.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <section className="sticky top-8">
          <MessagingDemo />
        </section>
        <section>
          <MarketingDemo />
        </section>
      </main>
    </div>
  );
}
