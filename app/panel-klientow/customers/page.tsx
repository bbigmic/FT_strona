"use client";

import { Search, Filter, Mail, Calendar, User, Clock, CheckCircle, AlertTriangle, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useCRM } from "../../context/CRMContext";
import { useRouter } from "next/navigation";

export default function CustomersPage() {
  const { clients, updateInvoice } = useCRM();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  
  const [viewMode, setViewMode] = useState<'list' | 'schedule'>('list');

  const filteredClients = clients.filter(client => {
    // Only show "CUSTOMER" type clients (completed projects)
    if (client.type !== "CUSTOMER") return false;

    if (statusFilter !== "ALL" && client.status !== statusFilter) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        client.company.toLowerCase().includes(query) ||
        client.contact.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AKTYWNY": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "ZAKOŃCZONY": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "ODRZUCONY": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "SENT": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "OVERDUE": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getAggregatedInvoices = () => {
    const allInvoices = clients.flatMap(client => 
      (client.invoices || []).map(inv => ({
        ...inv,
        clientId: client.id,
        clientName: client.company,
        clientContact: client.contact
      }))
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = allInvoices.filter(inv => {
      const due = new Date(inv.dueDate);
      return due < today && inv.status !== "PAID";
    });

    const upcoming7Days = allInvoices.filter(inv => {
      const due = new Date(inv.dueDate);
      const next7Days = new Date(today);
      next7Days.setDate(today.getDate() + 7);
      return due >= today && due <= next7Days && inv.status !== "PAID";
    });

    const thisMonth = allInvoices.filter(inv => {
      const due = new Date(inv.dueDate);
      const next7Days = new Date(today);
      next7Days.setDate(today.getDate() + 7);
      return due > next7Days && due.getMonth() === today.getMonth() && due.getFullYear() === today.getFullYear() && inv.status !== "PAID";
    });

    const future = allInvoices.filter(inv => {
      const due = new Date(inv.dueDate);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return due > endOfMonth && inv.status !== "PAID";
    });

    return { overdue, upcoming7Days, thisMonth, future };
  };

  const invoiceGroups = getAggregatedInvoices();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Klienci i Rozliczenia</h1>
          <p className="text-gray-400">Zarządzaj klientami i przygotowuj faktury za usługi.</p>
        </div>
        
        <div className="flex bg-[#111] p-1 rounded-xl border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            Lista klientów
          </button>
          <button
            onClick={() => setViewMode('schedule')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'schedule' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            Harmonogram
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <>
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj klientów, firm, emaili..." 
            className="w-full bg-[#111] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 bg-[#111] border rounded-xl text-white transition-colors flex items-center gap-2 ${showFilters || statusFilter !== "ALL" ? 'border-accent bg-accent/5' : 'border-white/10 hover:bg-white/5'}`}
          >
            <Filter className="w-5 h-5" />
            <span>Filtry {statusFilter !== "ALL" && "(1)"}</span>
          </button>

          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-20 p-4">
              <div className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Status</div>
              <div className="space-y-1">
                {["ALL", "AKTYWNY", "ZAKOŃCZONY", "ODRZUCONY"].map(status => (
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
          )}
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Firma</th>
                <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Kontakt</th>
                <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Ostatnia faktura</th>
                <th className="px-6 py-4 text-right text-xs font-mono text-gray-400 uppercase tracking-wider">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => {
                  const lastInvoice = client.invoices && client.invoices.length > 0 
                    ? client.invoices[client.invoices.length - 1] 
                    : null;

                  return (
                    <tr 
                      key={client.id} 
                      onClick={() => router.push(`/panel-klientow/customers/${client.id}`)}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{client.company}</div>
                        <div className="text-xs text-gray-500 mt-1">{client.source}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <User className="w-3 h-3 text-gray-500" />
                            {client.contact}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Mail className="w-3 h-3" />
                            {client.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {lastInvoice ? (
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-mono text-white">
                              {lastInvoice.amount} {lastInvoice.currency}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider ${getInvoiceStatusColor(lastInvoice.status)}`}>
                                    {lastInvoice.status === "DRAFT" ? "Szkic" : lastInvoice.status}
                                </span>
                                <span className="text-xs text-gray-500">{lastInvoice.dueDate}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500 italic">Brak faktur</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Brak klientów spełniających kryteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      ) : (
        <div className="space-y-8">
          {[
            { title: "Zaległe płatności", icon: AlertTriangle, color: "text-red-500", data: invoiceGroups.overdue, bg: "bg-red-500/10", border: "border-red-500/20" },
            { title: "W tym tygodniu", icon: Clock, color: "text-yellow-500", data: invoiceGroups.upcoming7Days, bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
            { title: "W tym miesiącu", icon: Calendar, color: "text-blue-500", data: invoiceGroups.thisMonth, bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { title: "Przyszłe płatności", icon: CheckCircle, color: "text-gray-500", data: invoiceGroups.future, bg: "bg-gray-500/10", border: "border-gray-500/20" }
          ].map((group, idx) => (
            group.data.length > 0 && (
              <div key={idx} className="space-y-4">
                <h3 className={`text-lg font-bold text-white flex items-center gap-2`}>
                  <group.icon className={`w-5 h-5 ${group.color}`} />
                  {group.title}
                  <span className="text-sm text-gray-500 font-normal ml-2">({group.data.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.data.map((inv: any) => (
                    <div key={inv.id || inv.number} className={`p-4 rounded-xl border ${group.bg} ${group.border} hover:bg-opacity-20 transition-all cursor-pointer group relative overflow-hidden`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-xs text-gray-400 font-mono mb-1">{inv.number}</div>
                          <div className="font-bold text-white">{inv.clientName}</div>
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wider ${getInvoiceStatusColor(inv.status)}`}>
                          {inv.status === "DRAFT" ? "Szkic" : inv.status}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Kwota:</span>
                          <span className="font-mono font-bold text-white">{inv.amount} {inv.currency}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Termin:</span>
                          <span className={`${group.color} font-medium`}>{inv.dueDate}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                         <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                updateInvoice(inv.clientId, inv.id, { status: "PAID" });
                            }}
                            className="text-xs font-bold px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-1"
                         >
                            <Check className="w-3 h-3" />
                            Opłacona
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
          
          {Object.values(invoiceGroups).every(g => g.length === 0) && (
             <div className="bg-[#111] border border-white/5 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Wszystko uregulowane!</h3>
                <p className="text-gray-400">Brak nadchodzących płatności lub zaległości.</p>
             </div>
          )}
        </div>
      )}

      {/* Invoice Modal */}
      <AnimatePresence>
      </AnimatePresence>
    </div>
  );
}
