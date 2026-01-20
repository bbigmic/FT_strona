"use client";

import { useParams, useRouter } from "next/navigation";
import { useCRM } from "../../../context/CRMContext";
import { ArrowLeft, User, Calendar, FileText, Save, X, Plus, Trash2, Check, ChevronLeft, ChevronRight, Tag, Pencil, Eye, FileDown, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function DatePicker({ value, onChange, onClose }: { value?: string; onChange: (v: string) => void; onClose?: () => void }) {
  const init = value ? new Date(value) : new Date();
  const [year, setYear] = useState(init.getFullYear());
  const [month, setMonth] = useState(init.getMonth());
  const weekDays = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const cells = Array.from({ length: startOffset + daysInMonth }, (_, i) => (i < startOffset ? null : i - startOffset + 1));
  const select = (d: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    onChange(`${year}-${mm}-${dd}`);
    onClose && onClose();
  };
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute z-50 mt-2 w-80 rounded-2xl border border-white/10 bg-[#111] shadow-2xl">
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <button
          onClick={() => {
            if (month === 0) {
              setMonth(11);
              setYear(y => y - 1);
            } else {
              setMonth(m => m - 1);
            }
          }}
          className="p-2 rounded-lg hover:bg-white/10 text-gray-300"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-white font-bold">{new Date(year, month).toLocaleString("pl-PL", { month: "long", year: "numeric" })}</div>
        <button
          onClick={() => {
            if (month === 11) {
              setMonth(0);
              setYear(y => y + 1);
            } else {
              setMonth(m => m + 1);
            }
          }}
          className="p-2 rounded-lg hover:bg-white/10 text-gray-300"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 px-3 pt-3">
        {weekDays.map(w => (
          <div key={w} className="text-[10px] text-gray-500 text-center font-bold uppercase">{w}</div>
        ))}
        {cells.map((d, i) => (
          <button
            key={i}
            disabled={!d}
            onClick={() => d && select(d)}
            className={`h-9 rounded-lg text-sm ${d ? "hover:bg-white/10 text-white" : "opacity-0 cursor-default"}`}
          >
            {d || ""}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between p-3 border-t border-white/10">
        <button
          onClick={() => {
            const today = new Date();
            const mm = String(today.getMonth() + 1).padStart(2, "0");
            const dd = String(today.getDate()).padStart(2, "0");
            onChange(`${today.getFullYear()}-${mm}-${dd}`);
            onClose && onClose();
          }}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
        >
          Dziś
        </button>
        <button onClick={onClose} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10">
          Zamknij
        </button>
      </div>
    </motion.div>
  );
}

export default function LeadDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { leads, updateLead, moveLeadToClients } = useCRM();
  
  // params.id is a string, convert to number
  const leadId = Number(params.id);
  const lead = leads.find((l) => l.id === leadId);

  const [leadNote, setLeadNote] = useState("");
  const [projectChanges, setProjectChanges] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Task State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<"Agent_AI" | "Automatyzacja" | "Rozwój SaaS" | "System_Web" | "Zmiany w produkcie">("Agent_AI");
  const [newTaskSub, setNewTaskSub] = useState<string>("");
  const [newTaskSubHours, setNewTaskSubHours] = useState<number>(0);
  const [newTaskSubs, setNewTaskSubs] = useState<{ name: string; hours: number }[]>([]);
  const [newTaskEstimate, setNewTaskEstimate] = useState<number>(0);
  const [newTaskDeadline, setNewTaskDeadline] = useState<string>("");
  const [showNewTaskDeadlinePicker, setShowNewTaskDeadlinePicker] = useState(false);
  
  // Edit State
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [editLeadData, setEditLeadData] = useState({
    company: "",
    name: "",
    nip: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    if (lead) {
      setEditLeadData({
        company: lead.company || "",
        name: lead.name || "",
        nip: lead.nip || "",
        email: lead.email || "",
        phone: lead.phone || ""
      });
      setLeadNote(lead.clientNote || "");
      setProjectChanges(lead.projectChanges || "");
    }
  }, [lead]);

  const handleSaveLeadData = () => {
    if (!lead) return;
    updateLead(lead.id, editLeadData);
    setIsEditingLead(false);
  };

  const handleSave = () => {
    if (!lead) return;
    setIsSaving(true);
    updateLead(lead.id, {
      clientNote: leadNote,
      projectChanges: projectChanges
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
    if (!lead) return;
    if (!newTaskTitle.trim()) return;
    
    const newTask = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      subcategories: newTaskSubs,
      estimateHours: newTaskEstimate,
      deadline: newTaskDeadline || undefined,
      completed: false
    };

    const currentTasks = lead.productTasks || [];
    updateLead(lead.id, {
      productTasks: [...currentTasks, newTask]
    });

    setNewTaskTitle("");
    setNewTaskCategory("Agent_AI");
    setNewTaskSubs([]);
    setNewTaskEstimate(0);
    setNewTaskDeadline("");
  };

  const handleDeleteTask = (taskId: number) => {
    if (!lead || !lead.productTasks) return;
    const updatedTasks = lead.productTasks.filter(t => t.id !== taskId);
    updateLead(lead.id, { productTasks: updatedTasks });
  };

  const handleUpdateTask = (taskId: number, updates: any) => {
    if (!lead || !lead.productTasks) return;
    const updatedTasks = lead.productTasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
    updateLead(lead.id, { productTasks: updatedTasks });
  };

  const handleMoveToClients = () => {
    if (!lead) return;
    moveLeadToClients(lead.id);
    router.push('/panel-klientow/clients');
  };

  if (!lead) {
    return <div className="p-8 text-white">Lead nie znaleziony.</div>;
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            {lead.company}
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
              LEAD
            </span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">ID: {lead.id}</p>
        </div>
        <div className="ml-auto flex gap-3">
          {lead.source !== "DEMO" ? (
            <button
              onClick={handleMoveToClients}
              className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 text-accent rounded-xl hover:bg-accent/20 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Przenieś do Klientów</span>
            </button>
          ) : (
            <button
              onClick={() => router.push(`/panel-klientow/calls/${lead.id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <Phone className="w-4 h-4 text-accent" />
              <span>Przejdź do Rozmowy</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Info */}
        <div className="space-y-6">
          {/* Main Info Card */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Dane firmy</h2>
              <button 
                onClick={() => setIsEditingLead(!isEditingLead)}
                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            {isEditingLead ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Nazwa firmy</label>
                  <input
                    value={editLeadData.company}
                    onChange={(e) => setEditLeadData({...editLeadData, company: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Osoba kontaktowa</label>
                  <input
                    value={editLeadData.name}
                    onChange={(e) => setEditLeadData({...editLeadData, name: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">NIP</label>
                  <input
                    value={editLeadData.nip}
                    onChange={(e) => setEditLeadData({...editLeadData, nip: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Email</label>
                  <input
                    value={editLeadData.email}
                    onChange={(e) => setEditLeadData({...editLeadData, email: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Telefon</label>
                  <input
                    value={editLeadData.phone}
                    onChange={(e) => setEditLeadData({...editLeadData, phone: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveLeadData}
                    className="flex-1 bg-accent text-black font-medium py-2 rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    Zapisz
                  </button>
                  <button
                    onClick={() => setIsEditingLead(false)}
                    className="flex-1 bg-white/5 text-white font-medium py-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Nazwa firmy</div>
                    <div>{lead.company}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Osoba kontaktowa</div>
                    <div>{lead.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">NIP</div>
                    <div>{lead.nip || "—"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <div>{lead.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Telefon</div>
                    <div>{lead.phone}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Informacje o leadzie</h2>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Status</div>
                <span className={`px-2 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20`}>
                  {lead.status}
                </span>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Źródło</div>
                <div className="text-sm text-white">{lead.source}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Wartość</div>
                <div className="text-sm text-white">{lead.value}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Data pozyskania</div>
                <div className="text-sm text-white">{lead.date}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Tabs & Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notes Section */}
          <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                Notatki i Ustalenia
              </h3>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-3 py-1.5 bg-accent text-black text-xs font-bold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  "Zapisywanie..."
                ) : (
                  <>
                    <Save className="w-3 h-3" />
                    Zapisz zmiany
                  </>
                )}
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
                  Notatka o leadzie
                </label>
                <textarea
                  value={leadNote}
                  onChange={(e) => setLeadNote(e.target.value)}
                  placeholder="Wpisz notatki dotyczące leada..."
                  className="w-full h-64 bg-black/30 border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
                  Zmiany w projekcie / Ustalenia
                </label>
                <textarea
                  value={projectChanges}
                  onChange={(e) => setProjectChanges(e.target.value)}
                  placeholder="Opisz wymagane zmiany lub ustalenia..."
                  className="w-full h-32 bg-black/30 border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Check className="w-4 h-4 text-accent" />
                Zadania i Planowanie
              </h3>
            </div>
            <div className="p-6">
              {/* Add New Task */}
              <div className="mb-8 bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-sm font-bold text-white mb-4">Dodaj nowe zadanie</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Tytuł zadania"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                  />
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as any)}
                    className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                  >
                    <option value="Agent_AI">Agent AI</option>
                    <option value="Automatyzacja">Automatyzacja</option>
                    <option value="Rozwój SaaS">Rozwój SaaS</option>
                    <option value="System_Web">System Web</option>
                    <option value="Zmiany w produkcie">Zmiany w produkcie</option>
                  </select>
                </div>
                
                {/* Subtasks */}
                <div className="mb-4">
                  <label className="text-xs text-gray-500 mb-2 block">Podzadania (opcjonalnie)</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Nazwa podzadania"
                      value={newTaskSub}
                      onChange={(e) => setNewTaskSub(e.target.value)}
                      className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                    />
                    <input
                      type="number"
                      placeholder="H"
                      value={newTaskSubHours || ""}
                      onChange={(e) => setNewTaskSubHours(Number(e.target.value))}
                      className="w-20 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                    />
                    <button
                      onClick={addSubcategory}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newTaskSubs.map((sub, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg border border-white/5">
                        <span className="text-sm text-gray-300">{sub.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-gray-500">{sub.hours}h</span>
                          <button onClick={() => removeSubcategory(sub.name)} className="text-gray-500 hover:text-red-400">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="text-xs text-gray-500">
                      Szacowany czas: <span className="text-accent font-mono font-bold">{newTaskEstimate}h</span>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowNewTaskDeadlinePicker(!showNewTaskDeadlinePicker)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                          newTaskDeadline ? "bg-accent/10 border-accent text-accent" : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        {newTaskDeadline || "Termin"}
                      </button>
                      <AnimatePresence>
                        {showNewTaskDeadlinePicker && (
                          <DatePicker
                            value={newTaskDeadline}
                            onChange={setNewTaskDeadline}
                            onClose={() => setShowNewTaskDeadlinePicker(false)}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <button
                    onClick={handleAddTask}
                    disabled={!newTaskTitle.trim()}
                    className="px-4 py-2 bg-accent text-black text-sm font-bold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Dodaj zadanie
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {lead.productTasks && lead.productTasks.length > 0 ? (
                  lead.productTasks.map((task) => (
                    <div key={task.id} className="bg-white/5 border border-white/10 rounded-xl p-4 group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleUpdateTask(task.id, { completed: !task.completed })}
                            className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                              task.completed
                                ? "bg-green-500 border-green-500 text-black"
                                : "border-white/20 hover:border-accent"
                            }`}
                          >
                            {task.completed && <Check className="w-3.5 h-3.5" />}
                          </button>
                          <div>
                            <h4 className={`font-medium text-white ${task.completed ? "line-through text-gray-500" : ""}`}>
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-400 border border-white/5">
                                {task.category}
                              </span>
                              {task.deadline && (
                                <span className={`text-[10px] flex items-center gap-1 ${
                                  new Date(task.deadline) < new Date() && !task.completed ? "text-red-400" : "text-gray-500"
                                }`}>
                                  <Calendar className="w-3 h-3" />
                                  {task.deadline}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {task.subcategories && task.subcategories.length > 0 && (
                        <div className="pl-8 space-y-1">
                          {task.subcategories.map((sub, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm text-gray-400">
                              <span>{sub.name}</span>
                              <span className="font-mono text-xs">{sub.hours}h</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p>Brak zadań dla tego leada</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Building2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  )
}

function Mail(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function Phone(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
