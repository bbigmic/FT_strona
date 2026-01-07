"use client";

import { useCRM } from "../../context/CRMContext";
import { Calendar, Clock, Phone, User, Building2, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const CURRENT_USER = "Jan Kowalski"; // Symulacja zalogowanego użytkownika

export default function CallsPage() {
  const { leads } = useCRM();
  
  // Filtrujemy leady przypisane do aktualnego użytkownika
  const myCalls = leads
    .filter(lead => lead.assignedEmployee === CURRENT_USER)
    .map(lead => {
      // Dla leadów DEMO parsujemy datę z details
      if (lead.source === "DEMO") {
        const match = lead.details.match(/Rezerwacja: (\d{4}-\d{2}-\d{2}), (\d{2}:\d{2})/);
        if (match) {
          return {
            ...lead,
            displayDate: match[1],
            displayTime: match[2]
          };
        }
      }
      return {
        ...lead,
        displayDate: lead.date,
        displayTime: lead.time
      };
    })
    .sort((a, b) => {
      // Sortowanie po dacie i godzinie (najbliższe najpierw - rosnąco)
      const dateA = new Date(`${a.displayDate}T${a.displayTime}`);
      const dateB = new Date(`${b.displayDate}T${b.displayTime}`);
      return dateA.getTime() - dateB.getTime(); // Od najstarszych (najbliższych)
    });

  const upcomingCalls = myCalls.filter(lead => {
    const callDate = new Date(`${lead.displayDate}T${lead.displayTime}`);
    const now = new Date();
    return callDate >= now;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Moje Rozmowy
        </h1>
        <div className="flex items-center gap-2 text-gray-400">
          <User className="w-4 h-4" />
          <span>Zalogowany jako: <span className="text-accent font-medium">{CURRENT_USER}</span></span>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-4">
        {upcomingCalls.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Phone className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Brak nadchodzących rozmów.</p>
          </div>
        ) : (
          upcomingCalls.map((lead) => (
            <Link
              href={`/panel-klientow/calls/${lead.id}`}
              key={lead.id}
              className="group bg-[#111] border border-white/10 rounded-xl p-6 hover:border-accent/50 transition-all hover:shadow-[0_0_20px_rgba(0,255,159,0.05)] flex items-center justify-between gap-6 block"
            >
              <div className="flex items-center gap-6 flex-1">
                {/* Date & Time */}
                <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl border transition-colors ${
                  lead.status === "ROZMOWA ODBYTA"
                    ? "bg-green-500/10 border-green-500/30 group-hover:border-green-500/50"
                    : "bg-white/5 border-white/10 group-hover:border-accent/30"
                }`}>
                  <span className={`text-xs font-medium uppercase ${
                    lead.status === "ROZMOWA ODBYTA" ? "text-green-400/70" : "text-gray-400"
                  }`}>
                    {new Date(lead.displayDate).toLocaleDateString('pl-PL', { month: 'short' })}
                  </span>
                  <span className={`text-2xl font-bold ${
                    lead.status === "ROZMOWA ODBYTA" ? "text-green-400" : "text-white"
                  }`}>
                    {new Date(lead.displayDate).getDate()}
                  </span>
                  <div className={`flex items-center gap-1 text-xs mt-1 ${
                    lead.status === "ROZMOWA ODBYTA" ? "text-green-400" : "text-accent"
                  }`}>
                    {lead.status === "ROZMOWA ODBYTA" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        {lead.displayTime}
                      </>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider font-medium">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      lead.source === "DEMO" ? "bg-purple-500/20 text-purple-300" :
                      lead.source === "KONTAKT" ? "bg-blue-500/20 text-blue-300" :
                      "bg-green-500/20 text-green-300"
                    }`}>
                      {lead.source}
                    </span>
                    <span>•</span>
                    <span>{lead.status}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">
                    {lead.company}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      {lead.contact}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4" />
                      {lead.phone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-4 rounded-xl bg-white/5 text-gray-400 group-hover:bg-accent group-hover:text-black transition-all">
                <ArrowRight className="w-6 h-6" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
