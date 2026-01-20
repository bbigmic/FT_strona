"use client";

import { useParams, useRouter } from "next/navigation";
import { useCRM } from "../../../context/CRMContext";
import { ArrowLeft, User, Calendar, Save, Check, Pencil, Clock, AlertCircle, CheckCircle2, Circle, UserPlus, FileText, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ClientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { clients, updateClient, addClientTask, deleteClientTask, updateClientTask } = useCRM();
  
  // params.id is a string, convert to number
  const clientId = Number(params.id);
  const client = clients.find((c) => c.id === clientId);

  const [clientNote, setClientNote] = useState("");
  const [projectChanges, setProjectChanges] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<"Agent_AI" | "Automatyzacja" | "Rozwój SaaS" | "System_Web" | "Zmiany w produkcie">("Agent_AI");
  const [newTaskSub, setNewTaskSub] = useState<string>("");
  const [newTaskSubHours, setNewTaskSubHours] = useState<number>(0);
  const [newTaskSubs, setNewTaskSubs] = useState<{ name: string; hours: number }[]>([]);
  const [newTaskEstimate, setNewTaskEstimate] = useState<number>(0);
  const [newTaskDeadline, setNewTaskDeadline] = useState<string>("");
  
  // Client Edit State
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editClientData, setEditClientData] = useState({
    company: "",
    name: "",
    nip: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    if (client) {
      setEditClientData({
        company: client.company || "",
        name: client.name || "",
        nip: client.nip || "",
        email: client.email || "",
        phone: client.phone || ""
      });
      setClientNote(client.clientNote || "");
      setProjectChanges(client.projectChanges || "");
    }
  }, [client]);

  const handleSaveClientData = () => {
    if (!client) return;
    updateClient(client.id, editClientData);
    setIsEditingClient(false);
  };

  const handleSave = () => {
    if (!client) return;
    setIsSaving(true);
    updateClient(client.id, {
      clientNote,
      projectChanges
    });
    setTimeout(() => setIsSaving(false), 500);
  };
  
  const addSubcategory = () => {
    const v = newTaskSub.trim();
    if (!v) return;
    if (newTaskSubs.some(s => s.name === v)) return;
    setNewTaskSubs([...newTaskSubs, { name: v, hours: Math.max(0, Number(newTaskSubHours) || 0) }]);
    setNewTaskSub("");
    setNewTaskSubHours(0);
  };
  
  const removeSubcategory = (s: string) => {
    setNewTaskSubs(newTaskSubs.filter(x => x.name !== s));
  };
  
  useEffect(() => {
    const total = newTaskSubs.reduce((acc, cur) => acc + (Number(cur.hours) || 0), 0);
    setNewTaskEstimate(Number(total.toFixed(2)));
  }, [newTaskSubs]);
  
  const handleAddTask = () => {
    if (!client) return;
    if (!newTaskTitle.trim()) return;
    addClientTask(client.id, {
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      subcategories: newTaskSubs,
      estimateHours: newTaskEstimate,
      deadline: newTaskDeadline || undefined
    });
    setNewTaskTitle("");
    setNewTaskCategory("Agent_AI");
    setNewTaskSubs([]);
    setNewTaskEstimate(0);
    setNewTaskDeadline("");
  };
  
  const categoryBadgeClass = (cat: string) => {
    if (cat === "Agent_AI") return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    if (cat === "Automatyzacja") return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    if (cat === "Rozwój SaaS") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (cat === "System_Web") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (cat === "Zmiany w produkcie") return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Nie znaleziono klienta</h2>
        <p className="text-gray-400 mb-8">Klient o podanym ID nie istnieje lub został usunięty.</p>
        <button 
          onClick={() => router.back()}
          className="px-6 py-3 bg-[#111] border border-white/10 rounded-xl text-white hover:bg-white/5 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Wróć do listy</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-3 bg-[#111] border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{client.company}</h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold border bg-green-500/10 text-green-400 border-green-500/20">
                {client.status}
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Klient od: {client.clientSince}
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => {
            updateClient(client.id, { type: "CUSTOMER" });
            router.push(`/panel-klientow/customers/${client.id}`);
          }}
          className="px-4 py-2 bg-accent text-black rounded-lg font-bold hover:bg-accent/90 transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>Przenieś do Klientów</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Content): Notes & Tasks */}
        <div className="lg:col-span-2 space-y-8">
          {/* Notes */}
          <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Save className="w-5 h-5 text-accent" />
                Notatki i Ustalenia
              </h2>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">Notatki o kliencie</label>
                <textarea
                  value={clientNote}
                  onChange={(e) => setClientNote(e.target.value)}
                  className="w-full h-40 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-accent resize-none transition-colors"
                  placeholder="Wpisz ważne informacje o kliencie..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">Ustalenia projektowe</label>
                <textarea
                  value={projectChanges}
                  onChange={(e) => setProjectChanges(e.target.value)}
                  className="w-full h-40 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-accent resize-none transition-colors"
                  placeholder="Wpisz ustalenia dotyczące projektu..."
                />
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-xl space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Check className="w-5 h-5 text-accent" />
              Zadania i Planowanie
            </h2>

            {/* Add Task Form */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Tytuł zadania..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value as any)}
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                >
                  <option value="Agent_AI">Agent AI</option>
                  <option value="Automatyzacja">Automatyzacja</option>
                  <option value="Rozwój SaaS">Rozwój SaaS</option>
                  <option value="System_Web">System Web</option>
                  <option value="Zmiany w produkcie">Zmiany w produkcie</option>
                </select>
              </div>

              {/* Subtasks */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskSub}
                    onChange={(e) => setNewTaskSub(e.target.value)}
                    placeholder="Podzadanie..."
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-accent"
                  />
                  <input
                    type="number"
                    value={newTaskSubHours}
                    onChange={(e) => setNewTaskSubHours(Number(e.target.value))}
                    placeholder="h"
                    className="w-20 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-accent"
                  />
                  <button
                    onClick={addSubcategory}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    Dodaj
                  </button>
                </div>
                
                {newTaskSubs.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {newTaskSubs.map((sub, idx) => (
                      <span key={idx} className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                        {sub.name} ({sub.hours}h)
                        <button onClick={() => removeSubcategory(sub.name)} className="hover:text-red-400">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-400">
                    Szacowany czas: <span className="text-white font-bold">{newTaskEstimate}h</span>
                  </div>
                  <input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <button
                  onClick={handleAddTask}
                  disabled={!newTaskTitle.trim()}
                  className="px-6 py-2 bg-accent hover:bg-accent/90 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Dodaj zadanie
                </button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              {client.productTasks?.map((task) => (
                <div key={task.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${categoryBadgeClass(task.category)}`}>
                          {task.category}
                        </span>
                        {task.deadline && (
                          <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border ${
                            new Date(task.deadline) < new Date() && !task.completed
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                          }`}>
                            <Clock className="w-3 h-3" />
                            {task.deadline}
                          </span>
                        )}
                      </div>
                      <h3 className={`font-medium text-white ${task.completed ? "line-through text-gray-500" : ""}`}>
                        {task.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateClientTask(client.id, task.id, { completed: !task.completed })}
                        className={`p-2 rounded-lg transition-colors ${
                          task.completed 
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" 
                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => deleteClientTask(client.id, task.id)}
                        className="p-2 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <AlertCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {task.subcategories && task.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pl-4 border-l-2 border-white/5">
                      {task.subcategories.map((sub, idx) => (
                        <span key={idx} className="text-xs text-gray-500 bg-black/20 px-2 py-1 rounded">
                          {sub.name} <span className="text-gray-600">({sub.hours}h)</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {(!client.productTasks || client.productTasks.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  Brak zadań dla tego klienta
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar): Client Data */}
        <div className="space-y-8">
          <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-accent" />
                Dane klienta
              </h2>
              <button 
                onClick={() => isEditingClient ? handleSaveClientData() : setIsEditingClient(true)}
                className={`p-2 rounded-lg transition-colors ${
                  isEditingClient 
                    ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" 
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {isEditingClient ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Nazwa firmy</div>
                {isEditingClient ? (
                  <input
                    type="text"
                    value={editClientData.company}
                    onChange={(e) => setEditClientData({ ...editClientData, company: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-accent"
                  />
                ) : (
                  <div className="text-white font-medium">{client.company}</div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Osoba kontaktowa</div>
                {isEditingClient ? (
                  <input
                    type="text"
                    value={editClientData.name}
                    onChange={(e) => setEditClientData({ ...editClientData, name: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-accent"
                  />
                ) : (
                  <div className="text-white font-medium">{client.name}</div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wider">NIP</div>
                {isEditingClient ? (
                  <input
                    type="text"
                    value={editClientData.nip}
                    onChange={(e) => setEditClientData({ ...editClientData, nip: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm font-mono focus:outline-none focus:border-accent"
                    placeholder="Wpisz NIP"
                  />
                ) : (
                  <div className="text-white font-medium font-mono">{client.nip || "—"}</div>
                )}
              </div>
              
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Email</div>
                {isEditingClient ? (
                  <input
                    type="text"
                    value={editClientData.email}
                    onChange={(e) => setEditClientData({ ...editClientData, email: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-accent"
                  />
                ) : (
                  <a href={`mailto:${client.email}`} className="text-accent hover:underline block truncate">
                    {client.email}
                  </a>
                )}
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Telefon</div>
                {isEditingClient ? (
                  <input
                    type="text"
                    value={editClientData.phone}
                    onChange={(e) => setEditClientData({ ...editClientData, phone: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-accent"
                  />
                ) : (
                  <a href={`tel:${client.phone}`} className="text-white hover:text-accent transition-colors">
                    {client.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold text-white">Informacje</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Szczegóły</div>
                <div className="text-white">{client.details || "—"}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Produkt</div>
                <div className="text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-accent" />
                  <span>{client.product || "—"}</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Źródło</div>
                <div className="text-white">{client.source || "—"}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Data</div>
                  <div className="text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{client.date || "—"}</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Czas</div>
                  <div className="text-white flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{client.time || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
