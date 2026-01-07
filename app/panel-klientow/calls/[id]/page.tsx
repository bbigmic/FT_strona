"use client";

import { useParams, useRouter } from "next/navigation";
import { useCRM } from "../../../context/CRMContext";
import { ArrowLeft, Mail, Phone, Building2, User, Calendar, Clock, FileText, MessageSquare, Bot, Save, PenTool, Pencil, CheckCircle, Check, UserPlus, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function CallDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { leads, updateLead, moveLeadToClients, deleteLead } = useCRM();
  
  const leadId = Number(params.id);
  const lead = leads.find((l) => l.id === leadId);

  const [clientNote, setClientNote] = useState("");
  const [projectChanges, setProjectChanges] = useState("");
  const [value, setValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (lead) {
      setClientNote(lead.clientNote || "");
      setProjectChanges(lead.projectChanges || "");
      setValue(lead.value || "");
    }
  }, [lead]);

  const handleSave = () => {
    if (!lead) return;
    setIsSaving(true);
    updateLead(lead.id, {
      clientNote,
      projectChanges,
      value
    });
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleMarkAsCompleted = () => {
    if (!lead) return;
    updateLead(lead.id, {
      status: "ROZMOWA ODBYTA"
    });
  };

  const handleAddToClients = () => {
    if (!lead) return;
    const CURRENT_USER = "Jan Kowalski";
    moveLeadToClients(lead.id, CURRENT_USER);
    router.push('/panel-klientow/clients');
  };

  const handleNotInterested = () => {
    if (!lead) return;
    deleteLead(lead.id);
    router.push('/panel-klientow/calls');
  };

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Nie znaleziono rozmowy</h2>
        <p className="text-gray-400 mb-8">Rozmowa o podanym ID nie istnieje lub została usunięta.</p>
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
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto p-8">
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
            <div className="flex items-center gap-3 mb-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                lead.source === "DEMO" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                lead.source === "KONTAKT" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                "bg-green-500/10 text-green-400 border-green-500/20"
              }`}>
                {lead.source}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                lead.status === "NOWY" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                lead.status === "POŁĄCZENIE ZAKOŃCZONE" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                "bg-gray-500/10 text-gray-400 border-gray-500/20"
              }`}>
                {lead.status}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{lead.company}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {lead.status !== "ROZMOWA ODBYTA" ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleMarkAsCompleted}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-all text-sm font-bold"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Klient Zainteresowany</span>
              </button>
              <button 
                onClick={handleNotInterested}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all text-sm font-bold"
              >
                <Trash2 className="w-4 h-4" />
                <span>Klient nie jest zainteresowany</span>
              </button>
            </div>
          ) : (
            <motion.button 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToClients}
              className="flex items-center gap-2 px-6 py-2.5 bg-accent text-black rounded-xl hover:bg-accent/90 transition-all text-sm font-bold shadow-[0_0_20px_rgba(0,255,159,0.3)]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Dodaj do klientów</span>
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Meeting Info & Contact */}
        <div className="space-y-6">
          {/* Meeting Card */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/10 transition-colors"></div>
            
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
              <Calendar className="w-5 h-5 text-accent" />
              Szczegóły spotkania
            </h3>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center font-bold transition-all ${
                    lead.status === "ROZMOWA ODBYTA" 
                        ? "bg-green-500/10 border-green-500/20 text-green-400" 
                        : "bg-white/5 border-white/5 text-white"
                }`}>
                    {lead.status === "ROZMOWA ODBYTA" ? (
                        <Check className="w-6 h-6" />
                    ) : (
                        <>
                            <span className="text-xs text-gray-500 uppercase">
                                {new Date(lead.date).toLocaleDateString('pl-PL', { month: 'short' })}
                            </span>
                            <span className="text-xl">
                                {new Date(lead.date).getDate()}
                            </span>
                        </>
                    )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Data i godzina</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    {lead.date}, {lead.time}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Prowadzący</p>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                        {lead.assignedEmployee ? lead.assignedEmployee.charAt(0) : "?"}
                    </div>
                    <span className="text-white font-medium">
                        {lead.assignedEmployee || "Brak przypisania"}
                    </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-accent" />
              Dane kontaktowe
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Osoba kontaktowa</p>
                  <p className="text-white font-medium">{lead.contact}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Email</p>
                  <a href={`mailto:${lead.email}`} className="text-white font-medium hover:text-accent transition-colors">
                    {lead.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Telefon</p>
                  <a href={`tel:${lead.phone}`} className="text-white font-medium hover:text-accent transition-colors">
                    {lead.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center & Right Column: Details & Transcription */}
        <div className="lg:col-span-2 space-y-6">
            {/* Notes / Details */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    Szczegóły zgłoszenia
                </h3>
                <div className="space-y-4">
                    {lead.product && (
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Zainteresowany produkt</p>
                            <p className="text-accent font-medium text-lg">
                                {lead.product}
                            </p>
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <p className="text-xs text-gray-500 uppercase font-bold">Wartość potencjalna</p>
                            <Pencil className="w-3 h-3 text-gray-500" />
                        </div>
                        <input 
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-accent font-mono font-bold text-lg focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                            placeholder="Wpisz wartość (np. 15 000 PLN)"
                        />
                    </div>
                </div>
            </div>

            {/* Editable Notes Section */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <PenTool className="w-5 h-5 text-accent" />
                        Notatki i ustalenia
                    </h3>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            isSaving 
                                ? "bg-green-500/20 text-green-400 border border-green-500/20" 
                                : "bg-accent text-[#111] hover:bg-accent/90"
                        }`}
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Zapisano!" : "Zapisz zmiany"}
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs text-gray-500 uppercase font-bold mb-2">
                            Notatka o kliencie
                        </label>
                        <textarea
                            value={clientNote}
                            onChange={(e) => setClientNote(e.target.value)}
                            placeholder="Wpisz ważne informacje o kliencie..."
                            className="w-full min-h-[200px] bg-white/5 border border-white/10 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all resize-y placeholder:text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 uppercase font-bold mb-2">
                            Zmiany w projekcie / Zainteresowanie
                        </label>
                        <textarea
                            value={projectChanges}
                            onChange={(e) => setProjectChanges(e.target.value)}
                            placeholder="Opisz jakimi zmianami w projekcie klient jest zainteresowany..."
                            className="w-full min-h-[200px] bg-white/5 border border-white/10 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all resize-y placeholder:text-gray-600"
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
