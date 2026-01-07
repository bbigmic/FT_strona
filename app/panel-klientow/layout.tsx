import Sidebar from "./components/Sidebar";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen bg-[#050505]">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
