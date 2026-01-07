"use client";

import { Search, Filter, Plus, MoreHorizontal, Mail, Phone, Building2, User, Calendar, DollarSign, Users, Bot, X, FileText, MessageSquare, AlertCircle, Check, UserPlus, Ban } from "lucide-react";
import { useCRM } from "../../context/CRMContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CURRENT_USER = "Jan Kowalski"; // Symulacja zalogowanego użytkownika

export default function ClientsPage() {
  const { clients, employees, addClient, updateClient } = useCRM();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    priorities: [] as string[],
    sources: [] as string[],
    statuses: [] as string[]
  });
  const [rejectionReason, setRejectionReason] = useState("");
  const [clientToReject, setClientToReject] = useState<number | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newClientData, setNewClientData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    company: "",
    source: "KONTAKT",
    value: "",
    details: "",
    priority: "MEDIUM" as "HIGH" | "MEDIUM" | "LOW"
  });

  const handleAddClient = () => {
    if (!newClientData.company) return;
    addClient({
      ...newClientData,
      priority: newClientData.priority,
      aiSummary: "",
      callDetails: "",
      transcription: [],
      product: "",
      assignedEmployee: CURRENT_USER,
      projectChanges: "",
      productTasks: [],
      finalDeadline: "",
      type: "POTENTIAL",
      activeServices: []
    });
    setShowAddModal(false);
    setNewClientData({
      name: "",
      contact: "",
      email: "",
      phone: "",
      company: "",
      source: "KONTAKT",
      value: "",
      details: "",
      priority: "MEDIUM"
    });
  };

  const router = useRouter();
  const [viewMode, setViewMode] = useState<'all' | 'mine'>('all');
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const handleConfirmRejection = () => {
    if (clientToReject !== null) {
      updateClient(clientToReject, {
        status: "ODRZUCONY",
        rejectionReason: rejectionReason
      });
      setShowRejectModal(false);
      setRejectionReason("");
      setClientToReject(null);
    }
  };

  const filteredClients = clients.filter(client => {
    // Only show "POTENTIAL" type clients (leads in negotiation)
    if (client.type !== "POTENTIAL") return false;

    // Filtrowanie po widoku
    if (viewMode === 'mine' && client.assignedEmployee !== CURRENT_USER) {
      return false;
    }
    
    // Filtrowanie po priorytecie
    if (activeFilters.priorities.length > 0 && !activeFilters.priorities.includes(client.priority || "MEDIUM")) {
      return false;
    }

    // Filtrowanie po źródle
    if (activeFilters.sources.length > 0 && !activeFilters.sources.includes(client.source)) {
      return false;
    }

    // Filtrowanie po statusie
    if (activeFilters.statuses.length > 0 && !activeFilters.statuses.includes(client.status)) {
      return false;
    }

    // Filtrowanie po wyszukiwaniu
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
         client.name?.toLowerCase().includes(query) ||
        client.company?.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.phone?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const getBarClass = (source: string, status?: string) => {
    if (status === "ZAKOŃCZONY") return "bg-emerald-500";
    if (status === "ODRZUCONY") return "bg-red-500";

    if (source === "KONTAKT") return "bg-yellow-400";
    if (source === "USŁUGI") return "bg-cyan-400";
    if (source === "DEMO") return "bg-fuchsia-500";
    if (source === "WŁASNY LEED") return "bg-indigo-400";
    return "bg-gray-500";
  };

  const sourceLabel = (source: string) => {
    if (source === "KONTAKT") return "Formularz kontaktowy";
    if (source === "USŁUGI") return "Zapytanie o usługę";
    if (source === "DEMO") return "Rozmowa";
    if (source === "WŁASNY LEED") return "Własny leed";
    return source;
  };

  const sourceBadgeClass = (source: string) => {
    if (source === "KONTAKT") return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    if (source === "USŁUGI") return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    if (source === "DEMO") return "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20";
    if (source === "WŁASNY LEED") return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  const employeePalette = [
    "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20",
    "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
    "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20",
    "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
    "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
    "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20",
    "bg-lime-500/10 text-lime-400 border-lime-500/20 hover:bg-lime-500/20",
  ];

  const employeeBadgeClass = (name?: string) => {
    if (!name) return "bg-white/10 text-white border-white/20";
    const idx = employees.indexOf(name);
    if (idx === -1) return "bg-white/10 text-white border-white/20";
    return employeePalette[idx % employeePalette.length];
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "HIGH": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "MEDIUM": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "LOW": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getClientCardClass = (status: string) => {
    if (status === "ZAKOŃCZONY") {
      return "group bg-emerald-900/10 border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/50 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] flex flex-col justify-between h-full cursor-pointer relative overflow-hidden";
    }
    if (status === "ODRZUCONY") {
      return "group bg-red-900/10 border border-red-500/20 rounded-2xl p-6 hover:border-red-500/50 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] flex flex-col justify-between h-full cursor-pointer relative overflow-hidden";
    }
    return "group bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-accent/50 transition-all hover:shadow-[0_0_20px_rgba(0,255,159,0.05)] flex flex-col justify-between h-full cursor-pointer relative overflow-hidden";
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Klienci</h1>
          <p className="text-gray-400">Baza stałych klientów i historia współpracy.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-accent text-black px-6 py-3 rounded-xl font-bold hover:bg-accent/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Dodaj Klienta</span>
        </button>
      </div>

      {/* View Switcher */}
      <div className="flex gap-2 bg-[#111] p-1 rounded-xl border border-white/10 w-fit">
        <button
          onClick={() => setViewMode('all')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            viewMode === 'all' 
              ? 'bg-white/10 text-white shadow-sm border border-white/5' 
              : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Users className="w-4 h-4" />
          Wszyscy klienci
        </button>
        <button
          onClick={() => setViewMode('mine')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            viewMode === 'mine' 
              ? 'bg-accent text-black shadow-[0_0_15px_rgba(0,255,159,0.3)] font-bold' 
              : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <User className="w-4 h-4" />
          Moi klienci
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj klienta..." 
            className="w-full bg-[#111] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <button 
          onClick={() => setShowFilterModal(true)}
          className={`px-4 py-3 bg-[#111] border rounded-xl text-white transition-colors flex items-center gap-2 ${
            activeFilters.priorities.length > 0 || activeFilters.sources.length > 0 || activeFilters.statuses.length > 0
              ? 'border-accent text-accent bg-accent/10'
              : 'border-white/10 hover:bg-white/5'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span>Filtry</span>
          {(activeFilters.priorities.length > 0 || activeFilters.sources.length > 0 || activeFilters.statuses.length > 0) && (
            <span className="bg-accent text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilters.priorities.length + activeFilters.sources.length + activeFilters.statuses.length}
            </span>
          )}
        </button>
      </div>

      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div 
              key={client.id} 
              onClick={() => router.push(`/panel-klientow/clients/${client.id}`)}
              className={getClientCardClass(client.status)}
            >
              <div className={`absolute top-0 left-0 h-1 w-full ${getBarClass(client.source, client.status)}`}></div>
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors">
                      {client.company}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <User className="w-4 h-4" />
                      {client.name}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wider ${getPriorityColor(client.priority)}`}>
                      {client.priority || "MEDIUM"}
                    </span>
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === client.id ? null : client.id);
                        }}
                        className="p-2 -mr-2 -mt-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      
                      {activeDropdown === client.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl z-10 overflow-hidden">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateClient(client.id, { type: "CUSTOMER" });
                              setActiveDropdown(null);
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-green-400 hover:bg-white/5 hover:text-green-300 transition-colors flex items-center gap-2 border-b border-white/5"
                          >
                            <UserPlus className="w-4 h-4" />
                            Przenieś do Klientów
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateClient(client.id, { status: "ZAKOŃCZONY" });
                              setActiveDropdown(null);
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-accent hover:bg-white/5 hover:text-accent/80 transition-colors flex items-center gap-2 border-b border-white/5"
                          >
                            <Check className="w-4 h-4" />
                            Zakończ współpracę
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setClientToReject(client.id);
                              setShowRejectModal(true);
                              setActiveDropdown(null);
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors flex items-center gap-2"
                          >
                            <Ban className="w-4 h-4" />
                            Anuluj klienta
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{client.phone}</span>
                  </div>
                </div>

                {client.status === "ODRZUCONY" && client.rejectionReason && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Ban className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Powód odrzucenia</span>
                    </div>
                    <p className="text-sm text-gray-300">{client.rejectionReason}</p>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${sourceBadgeClass(client.source)}`}>
                      {sourceLabel(client.source)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${employeeBadgeClass(client.assignedEmployee)}`}>
                      {client.assignedEmployee || "Brak opiekuna"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Od: {client.clientSince}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Wartość</span>
                  <span className="text-accent font-mono font-bold">{client.value}</span>
                </div>

                <div className="flex items-center justify-between">
                  {client.aiSummary ? (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedClient(client); }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-all group"
                    >
                      <Bot className="w-3.5 h-3.5 text-accent group-hover:scale-110 transition-transform" />
                      <span>Analiza AI</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-xs font-medium text-gray-500 cursor-not-allowed opacity-50">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Brak analizy AI</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Brak klientów</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Tutaj pojawi się lista Twoich klientów po przeniesieniu ich z leadów lub ręcznym dodaniu.
            </p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showFilterModal && (
          <motion.div
            key="filter-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Filter className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Filtrowanie</h3>
                    <p className="text-sm text-gray-400">Dostosuj widok listy</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-mono text-gray-500 uppercase mb-3">Priorytet</h4>
                  <div className="flex flex-wrap gap-2">
                    {["HIGH", "MEDIUM", "LOW"].map((priority) => (
                      <button
                        key={priority}
                        onClick={() => {
                          setActiveFilters(prev => ({
                            ...prev,
                            priorities: prev.priorities.includes(priority)
                              ? prev.priorities.filter(p => p !== priority)
                              : [...prev.priorities, priority]
                          }));
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-bold border transition-all ${
                          activeFilters.priorities.includes(priority)
                            ? 'bg-accent text-black border-accent'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-mono text-gray-500 uppercase mb-3">Źródło</h4>
                  <div className="flex flex-wrap gap-2">
                    {["KONTAKT", "USŁUGI", "DEMO", "WŁASNY LEED"].map((source) => (
                      <button
                        key={source}
                        onClick={() => {
                          setActiveFilters(prev => ({
                            ...prev,
                            sources: prev.sources.includes(source)
                              ? prev.sources.filter(s => s !== source)
                              : [...prev.sources, source]
                          }));
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-bold border transition-all ${
                          activeFilters.sources.includes(source)
                            ? 'bg-accent text-black border-accent'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {source}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-mono text-gray-500 uppercase mb-3">Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "AKTYWNY", label: "Aktywny" },
                      { value: "ODRZUCONY", label: "Anulowany" },
                      { value: "ZAKOŃCZONY", label: "Zakończony" }
                    ].map((status) => (
                      <button
                        key={status.value}
                        onClick={() => {
                          setActiveFilters(prev => ({
                            ...prev,
                            statuses: prev.statuses.includes(status.value)
                              ? prev.statuses.filter(s => s !== status.value)
                              : [...prev.statuses, status.value]
                          }));
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-bold border transition-all ${
                          activeFilters.statuses.includes(status.value)
                            ? 'bg-accent text-black border-accent'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex gap-3">
                  <button
                    onClick={() => setActiveFilters({ priorities: [], sources: [], statuses: [] })}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    Wyczyść
                  </button>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="flex-1 px-4 py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-colors"
                  >
                    Pokaż wyniki
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Analiza AI</h3>
                    <p className="text-sm text-gray-400">Podsumowanie i transkrypcja rozmowy</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase tracking-widest">
                    <FileText className="w-4 h-4" />
                    <span>Podsumowanie</span>
                  </div>
                  <div className="bg-accent/5 border border-accent/10 rounded-xl p-4 text-gray-300 leading-relaxed">
                    {selectedClient.aiSummary || "Brak podsumowania dla tej rozmowy."}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-500 font-mono text-xs uppercase tracking-widest border-t border-white/10 pt-6">
                    <MessageSquare className="w-4 h-4" />
                    <span>Transkrypcja rozmowy</span>
                  </div>
                  <div className="space-y-4">
                    {selectedClient.transcription ? (
                      selectedClient.transcription.map((msg: any, idx: number) => (
                        <div key={idx} className={`flex gap-4 ${msg.role === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            msg.role === 'ai' ? 'bg-accent/10 text-accent' : 'bg-white/10 text-white'
                          }`}>
                            {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                          </div>
                          <div className={`flex-1 p-4 rounded-2xl ${
                            msg.role === 'ai' ? 'bg-accent/5 text-gray-300 rounded-tl-none' : 'bg-white/5 text-gray-300 rounded-tr-none'
                          }`}>
                            <p className="text-sm">{msg.text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Brak transkrypcji dla tej rozmowy.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            key="add-client-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Dodaj nowego klienta</h3>
                    <p className="text-sm text-gray-400">Wprowadź dane klienta</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Nazwa Firmy *</label>
                    <input
                      type="text"
                      value={newClientData.company}
                      onChange={(e) => {
                        setNewClientData({ ...newClientData, name: e.target.value, company: e.target.value });
                      }}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                      placeholder="Wpisz nazwę firmy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Osoba Kontaktowa</label>
                    <input
                      type="text"
                      value={newClientData.contact}
                      onChange={(e) => setNewClientData({ ...newClientData, contact: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                      placeholder="Imię i nazwisko"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Email</label>
                    <input
                      type="email"
                      value={newClientData.email}
                      onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                      placeholder="adres@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Telefon</label>
                    <input
                      type="tel"
                      value={newClientData.phone}
                      onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                      placeholder="+48 000 000 000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Źródło</label>
                    <select
                      value={newClientData.source}
                      onChange={(e) => setNewClientData({ ...newClientData, source: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
                    >
                      <option value="KONTAKT">Formularz Kontaktowy</option>
                      <option value="USŁUGI">Zapytanie o Usługi</option>
                      <option value="DEMO">Rezerwacja Demo</option>
                      <option value="WŁASNY LEED">Własny leed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Wartość (PLN)</label>
                    <input
                      type="text"
                      value={newClientData.value}
                      onChange={(e) => setNewClientData({ ...newClientData, value: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                      placeholder="np. 10,000 PLN"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Szczegóły / Notatka</label>
                  <textarea
                    value={newClientData.details}
                    onChange={(e) => setNewClientData({ ...newClientData, details: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors h-32 resize-none"
                    placeholder="Wpisz dodatkowe informacje..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleAddClient}
                  className="px-6 py-2 rounded-xl text-sm font-bold bg-accent text-black hover:bg-accent/90 transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Dodaj klienta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            key="reject-client-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Ban className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Odrzuć klienta</h3>
                    <p className="text-sm text-gray-400">Podaj powód odrzucenia</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Powód odrzucenia *</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-400 transition-colors h-32 resize-none"
                    placeholder="Wpisz powód odrzucenia klienta..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={handleConfirmRejection}
                    disabled={!rejectionReason.trim()}
                    className="flex-1 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Odrzuć klienta</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
