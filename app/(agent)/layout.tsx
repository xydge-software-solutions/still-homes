import AgentSidebar from "@/components/agent/AgentSidebar";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(201,149,76,0.12),transparent_28%),linear-gradient(180deg,#faf7f2_0%,#f5f1ea_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-6 lg:px-8 lg:py-8">
        <aside className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
          <AgentSidebar />
        </aside>
        <main className="mt-4 lg:mt-0">{children}</main>
      </div>
    </div>
  );
}