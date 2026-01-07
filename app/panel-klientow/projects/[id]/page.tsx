"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCRM } from "../../../context/CRMContext";
import { ArrowLeft, Calendar, AlertCircle, Tag, Check, MoreHorizontal, Github, Pencil, X, MessageSquare, Send, User, ListTodo, Trash2, Plus, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { projects, setProjects, updateProject } = useCRM();
  const projectId = Number(params.id);
  const project = projects.find(p => p.id === projectId);
  const [openTasks, setOpenTasks] = useState<number[]>([]);
  const [openSubtaskMenu, setOpenSubtaskMenu] = useState<string | null>(null);
  const [isEditingGithub, setIsEditingGithub] = useState(false);
  const [githubInput, setGithubInput] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "IN_PROGRESS": return { color: "text-blue-400", bg: "bg-blue-400/10", label: "W toku" };
      case "REVIEW": return { color: "text-purple-400", bg: "bg-purple-400/10", label: "Review" };
      case "COMPLETED": return { color: "text-green-400", bg: "bg-green-400/10", label: "Zakończony" };
      case "PENDING": return { color: "text-gray-400", bg: "bg-gray-400/10", label: "Oczekujący" };
      case "ABANDONED": return { color: "text-red-400", bg: "bg-red-400/10", label: "Porzucony" };
      default: return { color: "text-gray-400", bg: "bg-gray-400/10", label: status };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "MEDIUM": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "LOW": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };
  
  const updateProjectTasks = (updater: (tasks: any[]) => any[]) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const nextTasks = updater(p.productTasks || []);
      const stats = computeSubtaskStats(nextTasks);
      return { ...p, productTasks: nextTasks, tasks: { completed: stats.completed, total: stats.total }, progress: stats.progress };
    }));
  };
  
  const updateTaskDeadline = (taskId: number, value: string) => {
    updateProjectTasks(tasks => tasks.map(t => t.id === taskId ? { ...t, deadline: value || undefined } : t));
  };
  
  const toggleTaskOpen = (taskId: number) => {
    setOpenTasks(prev => prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]);
  };
  
  const assignSelfToSubtask = (taskId: number, subName: string) => {
    const me = "Admin User";
    updateProjectTasks(tasks => tasks.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subcategories: t.subcategories.map((s: any) => s.name === subName ? { ...s, assignedTo: me } : s)
      };
    }));
  };
  
  const unassignSubtask = (taskId: number, subName: string) => {
    updateProjectTasks(tasks => tasks.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subcategories: t.subcategories.map((s: any) => s.name === subName ? { ...s, assignedTo: undefined } : s)
      };
    }));
  };
  
  const toggleSubtaskCompleted = (taskId: number, subName: string, value: boolean) => {
    updateProjectTasks(tasks => tasks.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subcategories: t.subcategories.map((s: any) => s.name === subName ? { ...s, completed: value } : s)
      };
    }));
  };
  
  const subBadgeClass = (name: string) => {
    const palette = [
      "bg-purple-500/15 text-purple-300 border-purple-500/30",
      "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      "bg-amber-500/15 text-amber-300 border-amber-500/30",
      "bg-rose-500/15 text-rose-300 border-rose-500/30",
      "bg-blue-500/15 text-blue-300 border-blue-500/30",
      "bg-green-500/15 text-green-300 border-green-500/30"
    ];
    const hash = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return palette[hash % palette.length];
  };
  
  const hoursBadgeClass = "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  
  const categoryBadgeClass = (cat: string) => {
    if (cat === "Agent_AI") return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    if (cat === "Automatyzacja") return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    if (cat === "Rozwój SaaS") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (cat === "System_Web") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (cat === "Zmiany w produkcie") return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };
  
  const computeSubtaskStats = (tasks: any[]) => {
    const total = tasks.reduce((acc, t) => acc + ((t.subcategories || []).length), 0);
    const completed = tasks.reduce((acc, t) => acc + ((t.subcategories || []).filter((s: any) => s.completed).length), 0);
    const progress = Math.round((completed / Math.max(1, total)) * 100);
    return { total, completed, progress };
  };

  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);
  const [showAbandonConfirmation, setShowAbandonConfirmation] = useState(false);
  const [abandonReason, setAbandonReason] = useState("");

  const handleFinishProject = () => {
    setShowFinishConfirmation(true);
  };

  const confirmFinishProject = () => {
    updateProject(project!.id, { status: "COMPLETED" });
    setShowFinishConfirmation(false);
    router.push("/panel-klientow/projects");
  };

  const handleAbandonProject = () => {
    setShowAbandonConfirmation(true);
  };

  const confirmAbandonProject = () => {
    if (!abandonReason.trim()) return;
    updateProject(project!.id, { 
      status: "ABANDONED",
      abandonReason: abandonReason
    });
    setShowAbandonConfirmation(false);
    router.push("/panel-klientow/projects");
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      sender: "Admin User", // W przyszłości pobierane z kontekstu użytkownika
      text: newMessage,
      date: new Date().toLocaleString("pl-PL", { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isSystem: false
    };

    updateProject(project!.id, { 
      messages: [...(project!.messages || []), msg] 
    });
    setNewMessage("");
  };

  const toggleChecklistItem = (itemId: number, completed: boolean) => {
    const updatedChecklist = (project!.checklist || []).map(item => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        completed,
        completedBy: completed ? "Admin User" : undefined,
        completedAt: completed ? new Date().toLocaleString("pl-PL", { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : undefined
      };
    });
    updateProject(project!.id, { checklist: updatedChecklist });
  };

  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [editingChecklistItem, setEditingChecklistItem] = useState<number | null>(null);
  const [editingChecklistText, setEditingChecklistText] = useState("");

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    const newItem = {
      id: Date.now(),
      text: newChecklistItem,
      completed: false
    };
    updateProject(project!.id, {
      checklist: [...(project!.checklist || []), newItem]
    });
    setNewChecklistItem("");
  };

  const deleteChecklistItem = (itemId: number) => {
    if (confirm("Czy na pewno chcesz usunąć ten element?")) {
      const updatedChecklist = (project!.checklist || []).filter(item => item.id !== itemId);
      updateProject(project!.id, { checklist: updatedChecklist });
    }
  };

  const startEditingChecklistItem = (item: any) => {
    setEditingChecklistItem(item.id);
    setEditingChecklistText(item.text);
  };

  const saveChecklistItem = (itemId: number) => {
    if (!editingChecklistText.trim()) return;
    const updatedChecklist = (project!.checklist || []).map(item => {
      if (item.id !== itemId) return item;
      return { ...item, text: editingChecklistText };
    });
    updateProject(project!.id, { checklist: updatedChecklist });
    setEditingChecklistItem(null);
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Nie znaleziono projektu</h2>
        <p className="text-gray-400 mb-8">Projekt o podanym ID nie istnieje lub został usunięty.</p>
        <button 
          onClick={() => router.back()}
          className="px-6 py-3 bg-[#111] border border-white/10 rounded-xl text-white hover:bg-white/5 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Wróć</span>
        </button>
      </div>
    );
  }

  const statusStyle = getStatusStyle(project.status);
  const stats = computeSubtaskStats(project.productTasks || []);
  const totalEstimatedHours = (project.productTasks || []).reduce((acc, task) => acc + (task.estimateHours || 0), 0);

  const allTasksCompleted = (project.productTasks || []).every(task => 
    (task.subcategories || []).every((sub: any) => sub.completed)
  );
  const allChecklistItemsCompleted = (project.checklist || []).length > 0 && (project.checklist || []).every(item => item.completed);
  const canFinishProject = allTasksCompleted && allChecklistItemsCompleted;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-3 bg-[#111] border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{project.title}</h1>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border border-white/5 ${statusStyle.bg} ${statusStyle.color}`}>
                {statusStyle.label}
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Deadline: {project.deadline || "Brak"}
              </span>
            </div>
          </div>
        </div>

        {project.status !== "COMPLETED" && project.status !== "ABANDONED" && (
          <div className="flex items-center gap-3">
            <button 
              onClick={handleAbandonProject}
              className="px-4 py-2 border border-red-500/20 rounded-xl transition-all text-sm font-medium flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
              Porzuć projekt
            </button>

            <div className="relative group/btn">
              <button 
                onClick={handleFinishProject}
                disabled={!canFinishProject}
                className={`px-4 py-2 border rounded-xl transition-all text-sm font-medium flex items-center gap-2 ${
                  canFinishProject 
                    ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20 cursor-pointer" 
                    : "bg-gray-500/10 text-gray-500 border-gray-500/20 opacity-50 cursor-not-allowed"
                }`}
              >
                <Check className="w-4 h-4" />
                Zakończ projekt
              </button>
              {!canFinishProject && (
                <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl text-xs text-gray-400 z-20 hidden group-hover/btn:block">
                  <p className="font-bold text-white mb-1">Nie można zakończyć projektu</p>
                  <ul className="space-y-1 list-disc list-inside">
                    {!allTasksCompleted && <li>Nie wszystkie zadania są zakończone</li>}
                    {!allChecklistItemsCompleted && <li>Checklista nie jest kompletna</li>}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {project.status === "ABANDONED" && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Projekt porzucony</h3>
            <p className="text-gray-300">
              <span className="text-gray-500 text-sm block mb-1">Powód:</span>
              {project.abandonReason || "Nie podano powodu."}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Informacje</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400 text-sm">Klient</span>
                  <span className="text-white font-medium">{project.client}</span>
                </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-gray-400 text-sm">Priorytet</span>
                <div className="relative group/priority">
                   <button className={`px-2 py-1 rounded text-xs font-bold border uppercase tracking-wider transition-all ${getPriorityColor(project.priority || "MEDIUM")}`}>
                     {project.priority || "MEDIUM"}
                   </button>
                   <div className="absolute right-0 top-full mt-1 z-10 w-32 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden hidden group-hover/priority:block">
                      {["HIGH", "MEDIUM", "LOW"].map(p => (
                        <button 
                            key={p}
                            onClick={() => updateProject(project.id, { priority: p as any })}
                            className="w-full text-left px-3 py-2 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                        >
                            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(p)}`}>{p}</span>
                        </button>
                      ))}
                   </div>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-gray-400 text-sm">Budżet</span>
                <span className="text-white font-medium">{project.budget || "Brak"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-gray-400 text-sm">Szacowany czas</span>
                <span className="text-white font-medium">{totalEstimatedHours} h</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-gray-400 text-sm">Podzadania</span>
                <span className="text-white font-mono">{stats.completed}/{stats.total}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400 text-sm">Repozytorium</span>
                <div className="flex items-center gap-2">
                  {isEditingGithub ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={githubInput}
                        onChange={(e) => setGithubInput(e.target.value)}
                        placeholder="https://github.com/..."
                        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-accent w-48"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          updateProject(project.id, { githubUrl: githubInput });
                          setIsEditingGithub(false);
                        }}
                        className="p-1 hover:bg-green-500/20 rounded text-green-400 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsEditingGithub(false)}
                        className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      {project.githubUrl ? (
                        <a 
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-white hover:text-accent transition-colors group"
                        >
                          <span className="text-sm font-medium underline decoration-white/20 group-hover:decoration-accent/50 underline-offset-4">Otwórz</span>
                          <Github className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-gray-600 text-sm">Brak</span>
                      )}
                      <button
                        onClick={() => {
                          setGithubInput(project.githubUrl || "");
                          setIsEditingGithub(true);
                        }}
                        className="p-1 text-gray-500 hover:text-white transition-colors"
                        title="Edytuj link"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              {project.clientId ? (
                <div className="pt-2">
                  <Link href={`/panel-klientow/clients/${project.clientId}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors">
                    <span>Przejdź do klienta</span>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 h-fit">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-accent" />
              Checklista wdrożeniowa
            </h3>
            <div className="space-y-3">
              {(project.checklist || []).length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Brak elementów na liście.
                </div>
              ) : (
                (project.checklist || []).map((item) => (
                  <div 
                    key={item.id}
                    className={`p-3 rounded-xl border transition-all group ${
                      item.completed 
                        ? "bg-green-500/5 border-green-500/20" 
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleChecklistItem(item.id, !item.completed)}
                        className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all flex-shrink-0 ${
                          item.completed 
                            ? "bg-green-500 border-green-500 text-black" 
                            : "border-white/30 hover:border-white/50 bg-transparent"
                        }`}
                      >
                        {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        {editingChecklistItem === item.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingChecklistText}
                              onChange={(e) => setEditingChecklistText(e.target.value)}
                              className="flex-1 bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-accent"
                              autoFocus
                            />
                            <button
                              onClick={() => saveChecklistItem(item.id)}
                              className="p-1 hover:bg-green-500/20 rounded text-green-400 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingChecklistItem(null)}
                              className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className={`text-sm transition-colors ${item.completed ? "text-gray-400 line-through" : "text-gray-200"}`}>
                                {item.text}
                              </p>
                              {item.completed && item.completedBy && (
                                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-green-400/80">
                                  <User className="w-3 h-3" />
                                  <span>{item.completedBy}</span>
                                  <span className="text-gray-500">•</span>
                                  <span>{item.completedAt}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => startEditingChecklistItem(item)}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteChecklistItem(item.id)}
                                className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                <input
                  type="text"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addChecklistItem()}
                  placeholder="Dodaj nowy element..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  onClick={addChecklistItem}
                  disabled={!newChecklistItem.trim()}
                  className="p-2 bg-accent text-black rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Postęp</h3>
              <div className={`flex items-center gap-1 text-xs font-bold ${getPriorityColor(project.priority)}`}>
                <AlertCircle className="w-3 h-3" />
                {project.priority} PRIORITY
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Procent ukończenia</span>
                <span className="text-white font-mono">{stats.progress}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${stats.progress === 100 ? 'bg-green-500' : 'bg-accent'}`} 
                  style={{ width: `${stats.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Tag className="w-5 h-5 text-accent" />
              Zadania projektu
            </h3>
            <div className="space-y-3">
              {(project.productTasks || []).length === 0 ? (
                <div className="text-gray-500">Brak zadań.</div>
              ) : (
                (project.productTasks || []).map(task => (
                  <div key={task.id} className={`bg-white/5 border rounded-xl transition-all ${task.subcategories?.length && task.subcategories.every((s:any) => s.completed) ? "border-white/5 opacity-60" : "border-white/10"}`}>
                    <div className="flex items-start justify-between p-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <button
                            onClick={() => toggleTaskOpen(task.id)}
                            className="px-2 py-1 rounded-lg text-xs font-bold bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30"
                          >
                            {openTasks.includes(task.id) ? "Zwiń" : "Rozwiń"}
                          </button>
                          <span className={`font-bold transition-all ${task.subcategories?.length && task.subcategories.every((s:any) => s.completed) ? "text-gray-500 line-through" : "text-white"}`}>{task.title}</span>
                          <span className={`px-2 py-1 rounded text-[10px] font-mono border ${categoryBadgeClass(task.category)}`}>{task.category}</span>
                          {task.deadline && (
                            <span className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border ${new Date(task.deadline) < new Date() ? "bg-rose-500/10 border-rose-500/20 text-rose-300" : "bg-amber-500/10 border-amber-500/20 text-amber-300"}`}>
                              <Calendar className="w-3 h-3" />
                              {task.deadline}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <input
                          type="date"
                          value={task.deadline || ""}
                          onChange={(e) => updateTaskDeadline(task.id, e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent transition-colors"
                        />
                        <div className="text-gray-400 text-sm">
                          {task.estimateHours} h
                        </div>
                      </div>
                    </div>
                    {openTasks.includes(task.id) && (
                      <div className="border-t border-white/10 p-4 space-y-2">
                        {task.subcategories.map(s => (
                          <div key={s.name} className="flex items-center justify-between bg-[#0f0f0f] border border-white/10 rounded-xl p-3 group relative">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => toggleSubtaskCompleted(task.id, s.name, !s.completed)}
                                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                                  s.completed 
                                    ? "bg-green-500 border-green-500 text-[#111]" 
                                    : "border-white/20 hover:border-white/40 bg-white/5"
                                }`}
                              >
                                {s.completed && <Check className="w-4 h-4 stroke-[3]" />}
                              </button>
                              
                              <div className={`flex items-center gap-2 transition-all duration-300 ${s.completed ? "opacity-50 line-through grayscale" : ""}`}>
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${subBadgeClass(s.name)}`}>{s.name}</span>
                                <span className={`px-2 py-1 rounded-full text-[10px] font-mono border ${hoursBadgeClass}`}>{s.hours} h</span>
                                {s.assignedTo ? (
                                  <span className="px-2 py-1 rounded text-[10px] border bg-green-500/10 text-green-400 border-green-500/20">Przypisane: {s.assignedTo}</span>
                                ) : (
                                  <span className="px-2 py-1 rounded text-[10px] border bg-white/5 text-gray-300 border-white/10">Nieprzypisane</span>
                                )}
                              </div>
                            </div>

                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenSubtaskMenu(openSubtaskMenu === `${task.id}-${s.name}` ? null : `${task.id}-${s.name}`);
                                }}
                                className={`p-2 rounded-lg transition-colors ${openSubtaskMenu === `${task.id}-${s.name}` ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                              >
                                <MoreHorizontal className="w-5 h-5" />
                              </button>

                              {openSubtaskMenu === `${task.id}-${s.name}` && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                  <button
                                    onClick={() => {
                                      assignSelfToSubtask(task.id, s.name);
                                      setOpenSubtaskMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                  >
                                    Przypisz mnie
                                  </button>
                                  {s.assignedTo && (
                                    <button
                                      onClick={() => {
                                        unassignSubtask(task.id, s.name);
                                        setOpenSubtaskMenu(null);
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/5"
                                    >
                                      Usuń przypisanie
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 h-fit">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-accent" />
                Komunikator
              </h3>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4 pr-2 custom-scrollbar">
                {(project.messages || []).length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-white/5 rounded-xl border border-white/5">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Brak wiadomości w projekcie</p>
                  </div>
                ) : (
                  (project.messages || []).map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col gap-1 ${msg.sender === "Admin User" ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400 font-medium">{msg.sender}</span>
                        <span className="text-[10px] text-gray-600">{msg.date}</span>
                      </div>
                      <div 
                        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.isSystem 
                            ? "bg-white/5 border border-white/10 text-gray-400 w-full text-center italic" 
                            : msg.sender === "Admin User"
                              ? "bg-accent/20 text-white border border-accent/20 rounded-tr-none"
                              : "bg-[#1a1a1a] text-gray-300 border border-white/10 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Napisz wiadomość..."
                  className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent text-black rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
        </div>
      </div>
      
      {showFinishConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-accent" />
                Zakończenie projektu
              </h3>
              <button 
                onClick={() => setShowFinishConfirmation(false)}
                className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-300 mb-8 leading-relaxed">
              Czy na pewno chcesz zakończyć ten projekt? 
              <br />
              <span className="text-sm text-gray-500 mt-2 block">
                Upewnij się, że wszystkie prace zostały wykonane, a klient zaakceptował efekt końcowy. Tej operacji nie można łatwo cofnąć.
              </span>
            </p>

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowFinishConfirmation(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium"
              >
                Anuluj
              </button>
              <button
                onClick={confirmFinishProject}
                className="px-5 py-2.5 rounded-xl bg-accent text-black hover:bg-accent/90 transition-colors text-sm font-bold flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Potwierdź zakończenie
              </button>
            </div>
          </div>
        </div>
      )}

      {showAbandonConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                Porzucenie projektu
              </h3>
              <button 
                onClick={() => setShowAbandonConfirmation(false)}
                className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-300 mb-4 leading-relaxed">
              Czy na pewno chcesz porzucić ten projekt? 
              <br />
              <span className="text-sm text-gray-500 mt-2 block">
                Projekt zostanie oznaczony jako porzucony. Wymagane jest podanie powodu.
              </span>
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Powód porzucenia</label>
              <textarea
                value={abandonReason}
                onChange={(e) => setAbandonReason(e.target.value)}
                placeholder="Np. Klient zrezygnował z usług..."
                className="w-full h-24 bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500/50 resize-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowAbandonConfirmation(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium"
              >
                Anuluj
              </button>
              <button
                onClick={confirmAbandonProject}
                disabled={!abandonReason.trim()}
                className="px-5 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-bold flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Potwierdź porzucenie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
