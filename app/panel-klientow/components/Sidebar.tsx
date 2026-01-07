"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FolderKanban, LogOut, Activity, Building2, Calendar, Phone, DollarSign } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/panel-klientow",
    },
    {
      title: "Leady (CRM)",
      icon: Users,
      href: "/panel-klientow/leads",
    },
    {
      title: "Rozmowy",
      icon: Phone,
      href: "/panel-klientow/calls",
    },
    {
      title: "Klienci",
      icon: Users,
      href: "/panel-klientow/customers",
    },
    {
      title: "Potencjalni klienci",
      icon: Building2,
      href: "/panel-klientow/clients",
    },
    {
      title: "Kalendarz",
      icon: Calendar,
      href: "/panel-klientow/calendar",
    },
    {
      title: "Wydatki",
      icon: DollarSign,
      href: "/panel-klientow/expenses",
    },
    {
      title: "Projekty",
      icon: FolderKanban,
      href: "/panel-klientow/projects",
    },
    {
      title: "Zespół",
      icon: Users,
      href: "/panel-klientow/employees",
    },
  ];

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/50 group-hover:bg-accent/30 transition-colors">
            <Activity className="w-5 h-5 text-accent" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            FELIZ<span className="text-accent">.PANEL</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-accent" : "group-hover:text-white transition-colors"}`} />
              <span className="font-medium text-sm tracking-wide">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center text-black font-bold text-xs">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@feliz.com</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-sm">
          <LogOut className="w-4 h-4" />
          <span>Wyloguj</span>
        </button>
      </div>
    </aside>
  );
}
