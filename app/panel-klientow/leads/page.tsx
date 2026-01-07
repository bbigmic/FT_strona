"use client";

import { Search, Filter, MoreHorizontal, Mail, Phone, Calendar, User, Clock, MessageSquare, Bot, FileText, X, AlertCircle, Building2, CheckCircle, Trash, AlertTriangle, UserPlus, Users, Edit2, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCRM } from "../../context/CRMContext";

const AVAILABLE_HOURS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00"
];

export default function LeadsPage() {
  const { leads, employees, assignEmployee, moveLeadToClients: contextMoveLead, deleteLead, updateLead } = useCRM();
  const CURRENT_USER = "Jan Kowalski";
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("KONTAKT");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [activeEmployeeDropdown, setActiveEmployeeDropdown] = useState<number | null>(null);
  const [editingReservation, setEditingReservation] = useState<{ id: number, date: string, time: string } | null>(null);
  
  // New state for notifications and modals
  const [notification, setNotification] = useState<{ show: boolean; title: string; message: string; type: 'success' | 'error' } | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<number | null>(null);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateSort, setDateSort] = useState<"ASC" | "DESC">("DESC");
  const [showFilters, setShowFilters] = useState(false);



  const handleStartEdit = (lead: any) => {
    const match = lead.details.match(/Rezerwacja: (\d{4}-\d{2}-\d{2}), (\d{2}:\d{2})/);
    if (match) {
      setEditingReservation({
        id: lead.id,
        date: match[1],
        time: match[2]
      });
    } else {
      setEditingReservation({
        id: lead.id,
        date: "",
        time: ""
      });
    }
  };

  const handleSaveEdit = () => {
    if (editingReservation) {
      const newDetails = `Rezerwacja: ${editingReservation.date}, ${editingReservation.time}`;
      updateLead(editingReservation.id, { 
        details: newDetails,
        date: editingReservation.date,
        time: editingReservation.time
      });
      setEditingReservation(null);
      showNotification("Zaktualizowano", "Data rezerwacji została zmieniona.");
    }
  };

  const handleCancelEdit = () => {
    setEditingReservation(null);
  };

  const filteredLeads = leads
    .filter(lead => activeTab === "ALL" || lead.source === activeTab)
    .filter(lead => statusFilter === "ALL" || lead.status === statusFilter)
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateSort === "ASC" 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    });

  const activeFiltersCount = (statusFilter !== "ALL" ? 1 : 0);

  const clearFilters = () => {
    setStatusFilter("ALL");
    setDateSort("DESC");
    setShowFilters(false);
  };

  const tabs = [
    { id: "KONTAKT", label: "Formularz Kontaktowy" },
    { id: "USŁUGI", label: "Zapytanie o Usługi" },
    { id: "DEMO", label: "Rezerwacja Demo" },
  ];

  const showNotification = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, title, message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const moveToClients = (leadId: number) => {
    contextMoveLead(leadId, CURRENT_USER);
    showNotification("Sukces", "Lead został przeniesiony do klientów.");
    setActiveDropdown(null);
  };

  const handleDelete = () => {
    if (leadToDelete) {
      deleteLead(leadToDelete);
      showNotification("Usunięto", "Lead został trwale usunięty.", "success");
      setLeadToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NOWY": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "POŁĄCZENIE ZAKOŃCZONE": return "bg-green-500/10 text-green-400 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "KONTAKT": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "USŁUGI": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "DEMO": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
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
    if (!name) return "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white";
    const idx = employees.indexOf(name);
    if (idx === -1) return "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white";
    return employeePalette[idx % employeePalette.length];
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Leady</h1>
          <p className="text-gray-400">Zarządzaj potencjalnymi klientami i śledź proces sprzedaży.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative ${
                activeTab === tab.id
                  ? "text-accent bg-accent/5 border-b-2 border-accent"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Szukaj firm, osób, emaili..." 
              className="w-full bg-[#111] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 bg-[#111] border rounded-xl text-white transition-colors flex items-center gap-2 ${showFilters || activeFiltersCount > 0 ? 'border-accent bg-accent/5' : 'border-white/10 hover:bg-white/5'}`}
            >
              <Filter className="w-5 h-5" />
              <span>Filtry {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-20 p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-sm">Filtrowanie</h3>
                  {activeFiltersCount > 0 && (
                    <button 
                      onClick={clearFilters}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Wyczyść
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Status</div>
                    <div className="space-y-1">
                      {["ALL", "NOWY", "POŁĄCZENIE ZAKOŃCZONE"].map(status => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                            statusFilter === status ? "bg-accent/10 text-accent" : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <span>{status === "ALL" ? "Wszystkie" : status}</span>
                          {statusFilter === status && <CheckCircle className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Sortowanie daty</div>
                    <div className="space-y-1">
                      <button
                        onClick={() => setDateSort("DESC")}
                        className={`text-left w-full px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                          dateSort === "DESC" ? "bg-accent/10 text-accent" : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span>Od najnowszych</span>
                        {dateSort === "DESC" && <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setDateSort("ASC")}
                        className={`text-left w-full px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                          dateSort === "ASC" ? "bg-accent/10 text-accent" : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span>Od najstarszych</span>
                        {dateSort === "ASC" && <CheckCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Firma / Kontakt</th>
                {activeTab !== "KONTAKT" && activeTab !== "DEMO" && <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Szczegóły</th>}
                {activeTab === "USŁUGI" && <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Produkt</th>}
                {activeTab === "DEMO" && <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Produkt</th>}
                {activeTab === "DEMO" && <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Prezenter</th>}
                {activeTab === "DEMO" && <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Dzień i godzina prezentacji</th>}
                <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Źródło</th>
                <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Status</th>
                {activeTab !== "DEMO" && <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Szczegóły rozmowy</th>}
                <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Czas</th>
                <th className="px-6 py-4 text-right text-xs font-mono text-gray-400 uppercase tracking-wider">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold text-white">{lead.name}</div>
                        <div className="text-sm text-gray-500 flex flex-col gap-1 mt-1">
                          <span className="flex items-center gap-2">
                            <User className="w-3 h-3" /> {lead.contact}
                          </span>
                          <span className="flex items-center gap-2 hover:text-accent cursor-pointer transition-colors">
                            <Mail className="w-3 h-3" /> {lead.email}
                          </span>
                          <span className="flex items-center gap-2">
                            <Phone className="w-3 h-3" /> {lead.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  {activeTab !== "KONTAKT" && activeTab !== "DEMO" && (
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-400 min-w-[300px] whitespace-pre-wrap break-words" title={lead.details}>
                      {lead.details}
                    </p>
                  </td>
                  )}
                  {activeTab === "USŁUGI" && (
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">
                      {lead.product || "-"}
                    </span>
                  </td>
                  )}
                  {activeTab === "DEMO" && (
                  <>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">
                      {lead.product || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveEmployeeDropdown(activeEmployeeDropdown === lead.id ? null : lead.id);
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${employeeBadgeClass(lead.assignedEmployee)}`}
                    >
                      {lead.assignedEmployee ? (
                        <>
                          <User className="w-3.5 h-3.5" />
                          <span>{lead.assignedEmployee}</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Przypisz</span>
                        </>
                      )}
                    </button>

                    {activeEmployeeDropdown === lead.id && (
                      <div className="absolute left-0 top-full mt-2 z-50 w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                        <div className="px-3 py-2 text-xs font-mono text-gray-500 uppercase tracking-wider border-b border-white/5">
                          Wybierz pracownika
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {employees.map((employee) => (
                            <button
                              key={employee}
                              onClick={(e) => {
                                e.stopPropagation();
                                assignEmployee(lead.id, employee);
                                setActiveEmployeeDropdown(null);
                                showNotification("Przypisano", `Przypisano pracownika: ${employee}`);
                              }}
                              className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors text-left ${
                                lead.assignedEmployee === employee 
                                  ? 'bg-accent/10 text-accent' 
                                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full ${lead.assignedEmployee === employee ? 'bg-accent' : 'bg-transparent'}`} />
                              <span>{employee}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 relative">
                    {editingReservation?.id === lead.id ? (
                      <div className="absolute top-2 left-0 z-50 p-4 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl min-w-[320px] backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Edytuj termin</span>
                          <button onClick={handleCancelEdit} className="text-gray-500 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="mb-4">
                          <label className="text-xs text-gray-500 mb-1.5 block">Data</label>
                          <input
                            type="date"
                            value={editingReservation.date}
                            onChange={(e) => setEditingReservation({ ...editingReservation, date: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors [color-scheme:dark]"
                          />
                        </div>

                        <div className="mb-6">
                          <label className="text-xs text-gray-500 mb-1.5 block">Godzina</label>
                          <div className="grid grid-cols-4 gap-2">
                            {AVAILABLE_HOURS.map((hour) => (
                              <button
                                key={hour}
                                onClick={() => setEditingReservation({ ...editingReservation, time: hour })}
                                className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all border ${
                                  editingReservation.time === hour
                                    ? "bg-accent text-black border-accent shadow-[0_0_10px_rgba(0,255,65,0.2)]"
                                    : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                {hour}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={handleSaveEdit}
                          className="w-full py-2 bg-accent hover:bg-accent/90 text-black font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Zapisz zmiany
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-300 group/date">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span>{lead.details.replace("Rezerwacja: ", "")}</span>
                        <button 
                          onClick={() => handleStartEdit(lead)}
                          className="opacity-0 group-hover/date:opacity-100 p-1 hover:bg-white/10 rounded transition-all text-gray-400 hover:text-white"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>
                  </>
                  )}
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-mono border ${getSourceColor(lead.source)}`}>
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  {activeTab !== "DEMO" && (
                  <td className="px-6 py-4">
                     {lead.transcription ? (
                       <button 
                         onClick={() => setSelectedLead(lead)}
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
                   </td>
                   )}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      {lead.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      {lead.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === lead.id ? null : lead.id);
                      }}
                      className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${activeDropdown === lead.id ? 'text-white bg-white/10' : 'text-gray-400'}`}
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    
                    {activeDropdown === lead.id && (
                      <div className="absolute right-8 top-8 z-50 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                        {lead.source !== "DEMO" ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveToClients(lead.id);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                          >
                            <Building2 className="w-4 h-4" />
                            <span>Przenieś do Klientów</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/panel-klientow/calls/${lead.id}`);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                          >
                            <Phone className="w-4 h-4" />
                            <span>Przejdź do Rozmowy</span>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLeadToDelete(lead.id);
                            setActiveDropdown(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left border-t border-white/5"
                        >
                          <Trash className="w-4 h-4" />
                          <span>Usuń Leada</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedLead && (
          <motion.div
            key="selected-lead-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
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
                    <Bot className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Analiza AI</h3>
                    <p className="text-sm text-gray-400">Transkrypcja i podsumowanie rozmowy</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase tracking-widest">
                    <FileText className="w-4 h-4" />
                    <span>Podsumowanie</span>
                  </div>
                  <div className="bg-accent/5 border border-accent/10 rounded-xl p-4 text-gray-300 leading-relaxed">
                    {selectedLead.aiSummary || "Brak podsumowania dla tej rozmowy."}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-500 font-mono text-xs uppercase tracking-widest border-t border-white/10 pt-6">
                    <MessageSquare className="w-4 h-4" />
                    <span>Transkrypcja rozmowy</span>
                  </div>
                  <div className="space-y-4">
                    {selectedLead.transcription ? (
                      selectedLead.transcription.map((msg: any, idx: number) => (
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
          </motion.div>
        )}
      </AnimatePresence>



      <AnimatePresence>
        {leadToDelete && (
          <motion.div
            key="delete-modal-overlay"
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
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Usunąć leada?</h3>
                <p className="text-gray-400 mb-6">
                  Czy na pewno chcesz usunąć tego leada? Tej operacji nie można cofnąć.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setLeadToDelete(null)}
                    className="px-6 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 right-8 z-50 bg-[#111] border shadow-2xl rounded-xl p-4 flex items-center gap-3 ${
              notification.type === 'success' ? 'border-green-500/20' : 'border-red-500/20'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              notification.type === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{notification.title}</h4>
              <p className="text-gray-400 text-xs">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
