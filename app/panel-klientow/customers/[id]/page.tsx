"use client";

import { useParams, useRouter } from "next/navigation";
import { useCRM } from "../../../context/CRMContext";
import { ArrowLeft, User, Calendar, FileText, Save, X, Plus, Trash2, Check, ChevronLeft, ChevronRight, Tag, Pencil, Eye, FileDown, Clock } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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

function InvoiceTemplateView({ invoice, client }: { invoice: any, client: any }) {
  const calculateTotals = () => {
    return invoice.items.reduce((acc: any, item: any) => {
      const net = item.quantity * item.unitPrice;
      const vat = net * (item.vatRate / 100);
      return {
        net: acc.net + net,
        vat: acc.vat + vat,
        gross: acc.gross + net + vat
      };
    }, { net: 0, vat: 0, gross: 0 });
  };

  const totals = calculateTotals();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    // Check if YYYY-MM-DD
    if (typeof dateStr === 'string' && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return new Date(dateStr).toLocaleDateString('pl-PL');
    }
    return dateStr;
  };

  return (
    <div className="max-w-[210mm] mx-auto bg-white shadow-xl min-h-[297mm] p-[15mm] relative flex flex-col text-black font-sans">
      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">FAKTURA VAT</h2>
          <p className="text-gray-500 font-mono">NR: {invoice.number}</p>
        </div>
        <div className="text-right">
          <div className="font-bold text-xl text-gray-900">Feliz Trade</div>
          <div className="text-gray-500 text-sm mt-1">
            ul. Przykładowa 123<br />
            00-000 Warszawa<br />
            NIP: 123-456-78-90
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div className="flex justify-between items-start mb-12 bg-gray-50 p-6 rounded-lg">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Nabywca</h3>
          <div className="font-bold text-lg text-gray-900">{client.company}</div>
          <div className="text-gray-600 mt-1">{client.name}</div>
          <div className="text-gray-600 text-sm mt-2">
            {client.email}<br />
            {client.phone}
          </div>
        </div>
        <div className="text-right">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Szczegóły</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-end gap-4">
              <span className="text-gray-500">Data wystawienia:</span>
              <span className="font-mono font-medium">{formatDate(invoice.date)}</span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-gray-500">Termin płatności:</span>
              <span className="font-mono font-medium">{formatDate(invoice.dueDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="flex-1">
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-900 text-left">
              <th className="py-3 font-bold text-gray-900 uppercase text-xs tracking-wider w-12">Lp.</th>
              <th className="py-3 font-bold text-gray-900 uppercase text-xs tracking-wider">Nazwa usługi / towaru</th>
              <th className="py-3 font-bold text-gray-900 uppercase text-xs tracking-wider text-right w-20">Ilość</th>
              <th className="py-3 font-bold text-gray-900 uppercase text-xs tracking-wider text-right w-32">Cena netto</th>
              <th className="py-3 font-bold text-gray-900 uppercase text-xs tracking-wider text-right w-20">VAT</th>
              <th className="py-3 font-bold text-gray-900 uppercase text-xs tracking-wider text-right w-32">Wartość</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {invoice.items.map((item: any, index: number) => {
              const net = item.quantity * item.unitPrice;
              return (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-4 text-gray-500">{index + 1}</td>
                  <td className="py-4 font-medium text-gray-900">{item.description || "—"}</td>
                  <td className="py-4 text-right text-gray-600">{item.quantity}</td>
                  <td className="py-4 text-right font-mono text-gray-900">{item.unitPrice.toFixed(2)} zł</td>
                  <td className="py-4 text-right text-gray-600">{item.vatRate}%</td>
                  <td className="py-4 text-right font-mono font-bold text-gray-900">{net.toFixed(2)} zł</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Suma netto:</span>
              <span className="font-mono">{totals.net.toFixed(2)} zł</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Kwota VAT:</span>
              <span className="font-mono">{totals.vat.toFixed(2)} zł</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t-2 border-gray-900">
              <span>Do zapłaty:</span>
              <span className="font-mono">{totals.gross.toFixed(2)} zł</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
        <p>Dokument wygenerowany elektronicznie, nie wymaga podpisu.</p>
      </div>
    </div>
  );
}

function InvoicePreviewModal({ invoice, client, onClose }: { invoice: any, client: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl h-[90vh] bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#111]">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Podgląd faktury {invoice.number}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="Drukuj"
            >
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
          <InvoiceTemplateView invoice={invoice} client={client} />
        </div>
      </motion.div>
    </div>
  );
}

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
  const [showNewTaskDeadlinePicker, setShowNewTaskDeadlinePicker] = useState(false);
  
  // Active Services State
  const [activeServicesDraft, setActiveServicesDraft] = useState<string[]>([]);
  const [newServiceInput, setNewServiceInput] = useState("");
  const [isSavingServices, setIsSavingServices] = useState(false);
  
  // Invoice State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    dueDate: new Date().toISOString().split('T')[0],
    items: [{ description: "", quantity: "1", unitPrice: "", vatRate: "23" }]
  });
  const [templateName, setTemplateName] = useState("");
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [printInvoice, setPrintInvoice] = useState<any>(null);

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
    }
  }, [client]);

  const handleSaveClientData = () => {
    if (!client) return;
    updateClient(client.id, editClientData);
    setIsEditingClient(false);
  };

  const handleSaveTemplate = () => {
    if (!client || !templateName.trim()) return;
    const newTemplate = {
      id: Date.now().toString(),
      name: templateName.trim(),
      items: invoiceData.items
    };
    updateClient(client.id, {
      invoiceTemplates: [...(client.invoiceTemplates || []), newTemplate]
    });
    setTemplateName("");
    setShowSaveTemplate(false);
  };

  const handleLoadTemplate = (templateId: string) => {
    if (!client) return;
    const template = client.invoiceTemplates?.find(t => t.id === templateId);
    if (template) {
      setInvoiceData(prev => ({
        ...prev,
        items: template.items
      }));
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (!client) return;
    const updatedTemplates = client.invoiceTemplates?.filter(t => t.id !== templateId) || [];
    updateClient(client.id, {
      invoiceTemplates: updatedTemplates
    });
  };

  const handleCreateInvoice = () => {
    if (!client) return;
    
    const items = invoiceData.items.map(item => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return {
        description: item.description,
        quantity,
        unitPrice,
        vatRate: parseFloat(item.vatRate) || 23,
        total: quantity * unitPrice
      };
    });

    const totalAmount = items.reduce((acc, item) => acc + item.total, 0);

    const newInvoice = {
      id: Date.now().toString(),
      number: `FV/${new Date().getFullYear()}/${(client.invoices?.length || 0) + 1}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: invoiceData.dueDate,
      amount: totalAmount,
      currency: "PLN",
      status: "DRAFT" as const,
      items: items
    };
    
    updateClient(client.id, {
      invoices: [...(client.invoices || []), newInvoice]
    });
    
    setShowInvoiceModal(false);
    setInvoiceData({
      dueDate: new Date().toISOString().split('T')[0],
      items: [{ description: "", quantity: "1", unitPrice: "", vatRate: "23" }]
    });
  };

  const addInvoiceItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: "1", unitPrice: "", vatRate: "23" }]
    }));
  };

  const removeInvoiceItem = (index: number) => {
    if (invoiceData.items.length <= 1) return;
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateInvoiceItem = (index: number, field: string, value: string) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const calculateInvoiceTotals = () => {
    return invoiceData.items.reduce((acc, item) => {
      const cleanNumber = (val: string | number) => {
        if (typeof val === 'number') return val;
        const cleaned = val.replace(/,/g, '.');
        return parseFloat(cleaned) || 0;
      };

      const quantity = cleanNumber(item.quantity);
      const unitPrice = cleanNumber(item.unitPrice);
      const vatRate = cleanNumber(item.vatRate);
      
      const net = quantity * unitPrice;
      const vat = net * (vatRate / 100);
      
      return {
        net: acc.net + net,
        vat: acc.vat + vat,
        gross: acc.gross + net + vat
      };
    }, { net: 0, vat: 0, gross: 0 });
  };

  useEffect(() => {
    if (client) {
      setClientNote(client.clientNote || "");
      setProjectChanges(client.projectChanges || "");
      setActiveServicesDraft(client.activeServices || []);
    }
  }, [client]);

  const handleAddService = () => {
    if (!newServiceInput.trim() || !client) return;
    const updatedServices = [...activeServicesDraft, newServiceInput.trim()];
    setActiveServicesDraft(updatedServices);
    setNewServiceInput("");
    
    // Auto-save
    setIsSavingServices(true);
    updateClient(client.id, { activeServices: updatedServices });
    setTimeout(() => setIsSavingServices(false), 500);
  };

  const handleRemoveService = (serviceToRemove: string) => {
    if (!client) return;
    const updatedServices = activeServicesDraft.filter(s => s !== serviceToRemove);
    setActiveServicesDraft(updatedServices);
    
    // Auto-save
    setIsSavingServices(true);
    updateClient(client.id, { activeServices: updatedServices });
    setTimeout(() => setIsSavingServices(false), 500);
  };

  const handleDownloadPDF = async (invoice: any) => {
    setPrintInvoice(invoice);
    // Wait for render
    setTimeout(async () => {
      const element = document.getElementById('invoice-pdf-container');
      if (!element) return;
      
      try {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`Faktura_${invoice.number.replace(/\//g, '_')}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setPrintInvoice(null);
      }
    }, 500);
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
    <>
      {/* Hidden PDF generation view */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div id="invoice-pdf-container">
          {printInvoice && (
            <InvoiceTemplateView invoice={printInvoice} client={client} />
          )}
        </div>
      </div>

      {/* Main Content - Hidden when printing */}
      <div className="space-y-8 animate-in fade-in duration-500 print:hidden">
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
        
        <AnimatePresence>
        {selectedInvoice && client && (
          <InvoicePreviewModal
            invoice={selectedInvoice}
            client={client}
            onClose={() => setSelectedInvoice(null)}
          />
        )}
        </AnimatePresence>

        <AnimatePresence>
        {showInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInvoiceModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl h-[85vh] bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  Kreator faktury
                </h3>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 flex overflow-hidden">
                {/* Left Column: Form */}
                <div className="w-full lg:w-1/3 p-6 space-y-6 overflow-y-auto border-r border-white/10">
                  
                  <div className="mb-6">
                    <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Szablony</label>
                    <div className="flex flex-wrap gap-2">
                      {client.invoiceTemplates?.map(t => (
                        <div key={t.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:border-accent/50 transition-colors group">
                          <button onClick={() => handleLoadTemplate(t.id)} className="hover:text-white">{t.name}</button>
                          <button onClick={() => handleDeleteTemplate(t.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {(!client.invoiceTemplates || client.invoiceTemplates.length === 0) && (
                        <span className="text-xs text-gray-600 italic">Brak zapisanych szablonów</span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Pozycje faktury</h4>
                  
                  {invoiceData.items.map((item, index) => (
                    <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4 relative group">
                      {invoiceData.items.length > 1 && (
                        <button
                          onClick={() => removeInvoiceItem(index)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Opis</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors"
                          placeholder="Nazwa usługi/produktu"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Cena netto</label>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateInvoiceItem(index, 'unitPrice', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Ilość</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateInvoiceItem(index, 'quantity', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors"
                            placeholder="1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Stawka VAT</label>
                        <select
                          value={item.vatRate}
                          onChange={(e) => updateInvoiceItem(index, 'vatRate', e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors"
                        >
                          <option value="23">23%</option>
                          <option value="8">8%</option>
                          <option value="5">5%</option>
                          <option value="0">0%</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addInvoiceItem}
                    className="w-full py-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Dodaj pozycję
                  </button>

                  <div className="pt-4 border-t border-white/10">
                    <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Termin płatności</label>
                    <input
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors [color-scheme:dark]"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-3">
                    {!showSaveTemplate ? (
                      <button
                        onClick={() => setShowSaveTemplate(true)}
                        className="text-xs text-accent hover:text-accent/80 flex items-center gap-1"
                      >
                        <Save className="w-3 h-3" />
                        Zapisz jako szablon
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                          placeholder="Nazwa szablonu"
                          className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-accent"
                        />
                        <button
                          onClick={handleSaveTemplate}
                          disabled={!templateName.trim()}
                          className="p-1.5 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 disabled:opacity-50"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setShowSaveTemplate(false)}
                          className="p-1.5 text-gray-500 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Preview */}
                <div className="w-full lg:w-2/3 bg-gray-100 overflow-y-auto p-8 text-black font-sans relative">
                   <div className="absolute top-4 right-4 bg-gray-200 px-3 py-1 rounded-full text-xs font-bold text-gray-600 uppercase z-10">
                     Podgląd na żywo
                   </div>
                   
                   <InvoiceTemplateView 
                     invoice={{
                       number: `FV/${new Date().getFullYear()}/${(client.invoices?.length || 0) + 1}`,
                       date: new Date().toLocaleDateString('pl-PL'),
                       dueDate: new Date(invoiceData.dueDate).toLocaleDateString('pl-PL'),
                       items: invoiceData.items.map(item => ({
                         description: item.description,
                         quantity: parseFloat(item.quantity.replace(/,/g, '.')) || 0,
                         unitPrice: parseFloat(item.unitPrice.replace(/,/g, '.')) || 0,
                         vatRate: parseFloat(item.vatRate.replace(/,/g, '.')) || 23
                       }))
                     }}
                     client={client}
                   />
                </div>
              </div>
              
              <div className="p-6 border-t border-white/10 flex items-center justify-end gap-3 bg-[#111] shrink-0">
                <button
                  onClick={() => {
                    const draft = {
                       number: `FV/${new Date().getFullYear()}/${(client.invoices?.length || 0) + 1}`,
                       date: new Date().toLocaleDateString('pl-PL'),
                       dueDate: new Date(invoiceData.dueDate).toLocaleDateString('pl-PL'),
                       items: invoiceData.items.map(item => ({
                         description: item.description,
                         quantity: parseFloat(item.quantity.replace(/,/g, '.')) || 0,
                         unitPrice: parseFloat(item.unitPrice.replace(/,/g, '.')) || 0,
                         vatRate: parseFloat(item.vatRate.replace(/,/g, '.')) || 23
                       }))
                     };
                     setSelectedInvoice(draft);
                  }}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Podgląd
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleCreateInvoice}
                  className="px-6 py-3 rounded-xl bg-accent hover:bg-accent/90 text-white font-medium shadow-lg shadow-accent/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Wystaw fakturę ({calculateInvoiceTotals().gross.toFixed(2)} PLN)
                </button>
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>

        <div className="flex gap-2">
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-xl transition-all shadow-lg shadow-accent/20"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">Nowa faktura</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Invoices List */}
          <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-xl space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Wystawione faktury
              </h2>
              <div className="text-sm text-gray-400">
                Łącznie: <span className="text-white font-bold">{client.invoices?.length || 0}</span>
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {client.invoices && client.invoices.length > 0 ? (
                client.invoices.map((invoice) => (
                  <div key={invoice.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-lg font-bold text-white">{invoice.number}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            invoice.status === 'PAID' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            invoice.status === 'SENT' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            invoice.status === 'OVERDUE' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}>
                            {invoice.status === 'DRAFT' ? 'Szkic' : 
                             invoice.status === 'SENT' ? 'Wysłana' :
                             invoice.status === 'PAID' ? 'Opłacona' : 'Po terminie'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {invoice.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            Termin: {invoice.dueDate}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-white tracking-tight">
                          {invoice.amount.toFixed(2)} <span className="text-sm font-normal text-gray-500">{invoice.currency}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadPDF(invoice);
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                            title="Pobierz PDF"
                          >
                            <FileDown className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => setSelectedInvoice(invoice)}
                            className="text-xs text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
                          >
                            Szczegóły &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-white/10 rounded-xl">
                  <div className="p-3 rounded-full bg-white/5 text-gray-500 mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-white font-medium mb-1">Brak faktur</h3>
                  <p className="text-sm text-gray-500">Nie wystawiono jeszcze żadnych faktur dla tego klienta.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Client Details Card */}
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
          
          {/* Active Services */}
          <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-accent" />
                Usługi
              </h2>
              {isSavingServices && (
                <span className="text-xs text-green-400 animate-pulse">Zapisano</span>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newServiceInput}
                  onChange={(e) => setNewServiceInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddService()}
                  placeholder="Dodaj usługę..."
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  onClick={handleAddService}
                  disabled={!newServiceInput.trim()}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeServicesDraft.map((service, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 text-accent border border-accent/20 text-sm font-medium group"
                  >
                    {service}
                    <button
                      onClick={() => handleRemoveService(service)}
                      className="text-accent/50 hover:text-accent transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                {activeServicesDraft.length === 0 && (
                  <div className="text-sm text-gray-500 italic w-full text-center py-4">
                    Brak aktywnych usług
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
