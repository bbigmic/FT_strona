"use client";

import { useCRM } from "../../context/CRMContext";
import { Users, Mail, Phone } from "lucide-react";
import { useState } from "react";

export default function EmployeesPage() {
  const { employees, leads, clients } = useCRM();
  const [activeCategory, setActiveCategory] = useState<"ALL" | "PROGRAMISCI" | "PM" | "SPRZEDAZ">("ALL");
  const employeesMeta: Record<string, { role: "PROGRAMISCI" | "PM" | "SPRZEDAZ"; title: string; email: string; phone: string }> = {
    "Jan Kowalski": { role: "PM", title: "Project Manager", email: "jan.kowalski@feliz.com", phone: "+48 600 000 001" },
    "Anna Nowak": { role: "SPRZEDAZ", title: "Specjalista ds. sprzedaży", email: "anna.nowak@feliz.com", phone: "+48 600 000 002" },
    "Piotr Zieliński": { role: "PROGRAMISCI", title: "Programista", email: "piotr.zielinski@feliz.com", phone: "+48 600 000 003" },
    "Katarzyna Wiśniewska": { role: "PROGRAMISCI", title: "Programista", email: "katarzyna.wisniewska@feliz.com", phone: "+48 600 000 004" },
    "Tomasz Kot": { role: "PROGRAMISCI", title: "Programista", email: "tomasz.kot@feliz.com", phone: "+48 600 000 005" },
  };

  const palette = [
    { bg: "bg-rose-500/15", border: "border-rose-500/30", text: "text-rose-400", solid: "bg-rose-500" },
    { bg: "bg-blue-500/15", border: "border-blue-500/30", text: "text-blue-400", solid: "bg-blue-500" },
    { bg: "bg-green-500/15", border: "border-green-500/30", text: "text-green-400", solid: "bg-green-500" },
    { bg: "bg-purple-500/15", border: "border-purple-500/30", text: "text-purple-400", solid: "bg-purple-500" },
    { bg: "bg-amber-500/15", border: "border-amber-500/30", text: "text-amber-400", solid: "bg-amber-500" },
    { bg: "bg-cyan-500/15", border: "border-cyan-500/30", text: "text-cyan-400", solid: "bg-cyan-500" },
    { bg: "bg-lime-500/15", border: "border-lime-500/30", text: "text-lime-400", solid: "bg-lime-500" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center">
            <Users className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Zespół</h1>
            <p className="text-gray-400 text-sm">Wszyscy pracownicy i ich aktywne sprawy</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 bg-[#111] p-1 rounded-xl border border-white/10 w-fit">
        <button
          onClick={() => setActiveCategory("ALL")}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeCategory === "ALL" ? "bg-white/10 text-white shadow-sm border border-white/5" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"}`}
        >
          Wszyscy
        </button>
        <button
          onClick={() => setActiveCategory("PROGRAMISCI")}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeCategory === "PROGRAMISCI" ? "bg-white/10 text-white shadow-sm border border-white/5" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"}`}
        >
          Programiści
        </button>
        <button
          onClick={() => setActiveCategory("PM")}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeCategory === "PM" ? "bg-white/10 text-white shadow-sm border border-white/5" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"}`}
        >
          Project Manager
        </button>
        <button
          onClick={() => setActiveCategory("SPRZEDAZ")}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeCategory === "SPRZEDAZ" ? "bg-white/10 text-white shadow-sm border border-white/5" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"}`}
        >
          Specjalista ds. sprzedaży
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="bg-[#111] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-white font-bold text-xl mb-2">Brak pracowników</h2>
          <p className="text-gray-400">Dodaj pracowników w panelu administracyjnym.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees
            .filter((name) => {
              const meta = employeesMeta[name];
              if (!meta) return activeCategory === "ALL";
              if (activeCategory === "ALL") return true;
              return meta.role === activeCategory;
            })
            .map((name) => {
            const colorIdx = employees.indexOf(name);
            const color = palette[(colorIdx >= 0 ? colorIdx : 0) % palette.length];
            const leadCount = leads.filter((l) => l.assignedEmployee === name).length;
            const clientCount = clients.filter((c) => c.assignedEmployee === name).length;
            const initials = name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            return (
              <div
                key={name}
                className="group bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-accent/50 transition-all hover:shadow-[0_0_20px_rgba(0,255,159,0.05)] relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 h-1 w-full ${color.solid}`}></div>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${color.bg} border ${color.border} flex items-center justify-center ${color.text} font-bold`}>
                      {initials}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg group-hover:text-accent transition-colors">
                        {name}
                      </h3>
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                        {employeesMeta[name]?.title || "Stanowisko"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Leady</div>
                    <div className="text-2xl font-bold text-white">{leadCount}</div>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Klienci</div>
                    <div className="text-2xl font-bold text-white">{clientCount}</div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Mail className="w-4 h-4" />
                    <span>{employeesMeta[name]?.email || "brak@feliz.com"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
                    <Phone className="w-4 h-4" />
                    <span>{employeesMeta[name]?.phone || "Brak numeru"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
