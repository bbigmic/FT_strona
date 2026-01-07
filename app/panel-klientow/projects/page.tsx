"use client";

import Link from "next/link";
import { Plus, MoreHorizontal, AlertCircle, Calendar, Search, ChevronDown } from "lucide-react";
import { useCRM } from "../../context/CRMContext";
import { useState } from "react";

export default function ProjectsPage() {
  const { projects } = useCRM();
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("DEFAULT");

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "IN_PROGRESS": return { color: "text-blue-400", bg: "bg-blue-400/10", label: "W toku" };
      case "REVIEW": return { color: "text-purple-400", bg: "bg-purple-400/10", label: "Review" };
      case "COMPLETED": return { color: "text-green-400", bg: "bg-green-400/10", label: "Zakończony" };
      case "PENDING": return { color: "text-gray-400", bg: "bg-gray-400/10", label: "Oczekujący" };
      case "ABANDONED": return { color: "text-red-500", bg: "bg-red-500/10", label: "Porzucony" };
      default: return { color: "text-gray-400", bg: "bg-gray-400/10", label: status };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "text-red-400";
      case "MEDIUM": return "text-yellow-400";
      case "LOW": return "text-blue-400";
      default: return "text-gray-400";
    }
  };

  const filteredProjects = projects.filter(project => {
    // Status Filter
    if (filter !== "ALL" && project.status !== filter) return false;

    // Search Filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = project.title.toLowerCase().includes(searchLower) || 
                          project.client.toLowerCase().includes(searchLower);
    if (!matchesSearch) return false;

    return true;
  }).sort((a, b) => {
    if (sortOrder === "DEFAULT") return 0;

    const getTime = (date?: string) => {
      if (!date) return 0;
      const d = new Date(date).getTime();
      return isNaN(d) ? 0 : d;
    };

    const timeA = getTime(a.deadline);
    const timeB = getTime(b.deadline);

    // Projects without deadline go to the bottom
    if (timeA === 0 && timeB === 0) return 0;
    if (timeA === 0) return 1;
    if (timeB === 0) return -1;

    if (sortOrder === "DATE_ASC") {
      return timeA - timeB;
    }
    if (sortOrder === "DATE_DESC") {
      return timeB - timeA;
    }
    return 0;
  });

  const filters = [
    { id: "ALL", label: "Wszystkie" },
    { id: "IN_PROGRESS", label: "W toku" },
    { id: "COMPLETED", label: "Zakończone" },
    { id: "ABANDONED", label: "Porzucone" }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Projekty</h1>
            <p className="text-gray-400">Monitoruj postępy prac i zarządzaj terminami.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex items-center gap-2 bg-[#111] border border-white/5 p-1 rounded-xl w-fit overflow-x-auto max-w-full">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  filter === f.id 
                    ? "bg-white/10 text-white shadow-sm" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
             <div className="relative flex-1 lg:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
               <input 
                 type="text" 
                 placeholder="Szukaj projektu..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors"
               />
             </div>
             
             <div className="relative">
               <select 
                 value={sortOrder}
                 onChange={(e) => setSortOrder(e.target.value)}
                 className="bg-[#111] border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors min-w-[150px] appearance-none cursor-pointer"
               >
                 <option value="DEFAULT">Domyślne</option>
                 <option value="DATE_ASC">Data: Najstarsze</option>
                 <option value="DATE_DESC">Data: Najnowsze</option>
               </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const statusStyle = getStatusStyle(project.status);
          return (
            <Link key={project.id} href={`/panel-klientow/projects/${project.id}`} className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold border border-white/5 ${statusStyle.bg} ${statusStyle.color}`}>
                  {statusStyle.label}
                </div>
                <span className="text-gray-500 group-hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors">{project.title}</h3>
              <p className="text-sm text-gray-500 mb-6">{project.client}</p>

              <div className="space-y-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Postęp</span>
                  <span className="text-white font-mono">{project.progress}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${project.progress === 100 ? 'bg-green-500' : 'bg-accent'}`} 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{project.deadline}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${getPriorityColor(project.priority)}`}>
                    <AlertCircle className="w-3 h-3" />
                    {project.priority} PRIORITY
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs font-mono text-gray-500 pt-2">
                  <span>BUDGET: {project.budget}</span>
                  <span>TASKS: {project.tasks.completed}/{project.tasks.total}</span>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Add New Project Card */}
        <button className="bg-[#111]/50 border border-white/5 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-white/5 hover:border-accent/30 transition-all group min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-accent/10">
            <Plus className="w-8 h-8 text-gray-400 group-hover:text-accent transition-colors" />
          </div>
          <span className="text-gray-400 font-medium group-hover:text-white transition-colors">Utwórz nowy projekt</span>
        </button>
      </div>
    </div>
  );
}
