"use client";

import { motion } from "framer-motion";
import { Users, FolderKanban, TrendingUp, AlertCircle, Clock, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Aktywne Leady",
      value: "12",
      change: "+2 w tym tygodniu",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    {
      title: "Projekty w toku",
      value: "5",
      change: "3 na ukończeniu",
      icon: FolderKanban,
      color: "text-accent",
      bg: "bg-accent/10",
      border: "border-accent/20"
    },
    {
      title: "Przychód (Msc)",
      value: "45.2k PLN",
      change: "+12% vs ostatni msc",
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20"
    },
    {
      title: "Zgłoszenia",
      value: "3",
      change: "1 wymaga uwagi",
      icon: AlertCircle,
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20"
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "lead",
      message: "Nowy lead: TechCorp Sp. z o.o.",
      time: "2 godz. temu",
      icon: Users,
      color: "text-blue-400"
    },
    {
      id: 2,
      type: "project",
      message: "Projekt 'System CRM' zaktualizowany do fazy 'Development'",
      time: "4 godz. temu",
      icon: FolderKanban,
      color: "text-accent"
    },
    {
      id: 3,
      type: "alert",
      message: "Wygasa certyfikat SSL dla klienta X",
      time: "1 dzień temu",
      icon: AlertCircle,
      color: "text-red-400"
    },
    {
      id: 4,
      type: "success",
      message: "Zakończono wdrożenie dla Firma Y",
      time: "2 dni temu",
      icon: CheckCircle,
      color: "text-green-400"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Dashboard</h1>
        <p className="text-gray-400">Witaj w panelu zarządzania. Oto podsumowanie Twoich działań.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-2xl border ${stat.border} bg-[#111] relative overflow-hidden group`}
          >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
              <stat.icon className="w-16 h-16" />
            </div>
            <div className="relative z-10">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-4`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {stat.change}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#111] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Ostatnia Aktywność</h2>
            <button className="text-sm text-accent hover:text-accent/80 transition-colors">Zobacz wszystkie</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <div className={`p-2 rounded-lg bg-black border border-white/10 ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Status */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Status Systemu</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Wykorzystanie Serwera</span>
                <span className="text-white">45%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[45%] rounded-full"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Aktywne API</span>
                <span className="text-white">98%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[98%] rounded-full"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Pamięć Masowa</span>
                <span className="text-white">12%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[12%] rounded-full"></div>
              </div>
            </div>
            
            <div className="pt-6 mt-6 border-t border-white/10">
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-colors">
                Wygeneruj Raport Systemowy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
