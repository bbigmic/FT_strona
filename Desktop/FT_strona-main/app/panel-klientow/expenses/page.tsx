"use client";

import { useState } from "react";
import { useCRM, Expense, ExpenseCategory } from "../../context/CRMContext";
import { Plus, Search, Filter, DollarSign, Calendar, Tag, User, Trash2, X, CheckCircle, PieChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES: ExpenseCategory[] = ["Subskrypcje", "Wyjazd", "Delegacja", "Utrzymanie programu", "Tokeny AI", "Inne"];

export default function ExpensesPage() {
  const { expenses, addExpense, deleteExpense } = useCRM();
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "ALL">("ALL");
  const [dateRange, setDateRange] = useState<"ALL" | "WEEK" | "MONTH" | "YEAR">("ALL");
  const [userFilter, setUserFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Extract unique users
  const uniqueUsers = Array.from(new Set(expenses.map(e => e.user)));

  const [newExpense, setNewExpense] = useState<{
    title: string;
    amount: string;
    currency: string;
    category: ExpenseCategory;
    date: string;
    user: string;
  }>({
    title: "",
    amount: "",
    currency: "PLN",
    category: "Inne",
    date: new Date().toISOString().split('T')[0],
    user: "Admin User" // Default user for now
  });

  const filteredExpenses = expenses.filter(expense => {
    // Category Filter
    if (categoryFilter !== "ALL" && expense.category !== categoryFilter) return false;
    
    // User Filter
    if (userFilter !== "ALL" && expense.user !== userFilter) return false;

    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!expense.title.toLowerCase().includes(query) && 
          !expense.user.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Date Filter
    if (dateRange !== "ALL") {
      const expenseDate = new Date(expense.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const diffTime = Math.abs(today.getTime() - expenseDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      switch (dateRange) {
        case "WEEK":
          // Check if within current week (starting Monday) or just last 7 days? 
          // Let's do last 7 days for simplicity or strictly this week
          const oneWeekAgo = new Date(today);
          oneWeekAgo.setDate(today.getDate() - 7);
          if (expenseDate < oneWeekAgo || expenseDate > today) return false;
          break;
        case "MONTH":
          if (expenseDate.getMonth() !== today.getMonth() || 
              expenseDate.getFullYear() !== today.getFullYear()) return false;
          break;
        case "YEAR":
          if (expenseDate.getFullYear() !== today.getFullYear()) return false;
          break;
      }
    }
    
    return true;
  });

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAdd = () => {
    if (!newExpense.title || !newExpense.amount) return;

    addExpense({
      title: newExpense.title,
      amount: parseFloat(newExpense.amount),
      currency: newExpense.currency,
      category: newExpense.category,
      date: newExpense.date,
      user: newExpense.user
    });

    setShowAddModal(false);
    setNewExpense({
      title: "",
      amount: "",
      currency: "PLN",
      category: "Inne",
      date: new Date().toISOString().split('T')[0],
      user: "Admin User"
    });
  };

  const getCategoryColor = (category: ExpenseCategory) => {
    switch (category) {
      case "Subskrypcje": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "Wyjazd": return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "Delegacja": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "Utrzymanie programu": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "Tokeny AI": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Wydatki Firmowe</h1>
          <p className="text-gray-400">Monitoruj i kategoryzuj wydatki w firmie.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
        >
          <Plus className="w-5 h-5" />
          <span>Dodaj wydatek</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Suma wydatków (widoczne)</p>
              <p className="text-2xl font-bold text-white">{totalExpenses.toFixed(2)} PLN</p>
            </div>
          </div>
        </div>
        <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <PieChart className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Ilość transakcji</p>
              <p className="text-2xl font-bold text-white">{filteredExpenses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Top Row: Search and Date Range */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj wydatków..."
              className="w-full bg-[#111] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          
          <div className="flex bg-[#111] p-1 rounded-xl border border-white/10 self-start md:self-auto gap-2">
            {/* User Filter Dropdown */}
            <div className="relative group">
               <button className="h-full px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{userFilter === "ALL" ? "Wszyscy" : userFilter}</span>
               </button>
               <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-20 p-2 hidden group-hover:block">
                  <button
                    onClick={() => setUserFilter("ALL")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      userFilter === "ALL" ? "bg-accent/10 text-accent" : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>Wszyscy</span>
                    {userFilter === "ALL" && <CheckCircle className="w-3 h-3" />}
                  </button>
                  {uniqueUsers.map(user => (
                    <button
                      key={user}
                      onClick={() => setUserFilter(user)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                        userFilter === user ? "bg-accent/10 text-accent" : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{user}</span>
                      {userFilter === user && <CheckCircle className="w-3 h-3" />}
                    </button>
                  ))}
               </div>
            </div>
            
            <div className="w-px bg-white/10 my-1 mx-1"></div>

            {[
              { label: "Wszystkie", value: "ALL" },
              { label: "Tydzień", value: "WEEK" },
              { label: "Miesiąc", value: "MONTH" },
              { label: "Rok", value: "YEAR" },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setDateRange(range.value as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  dateRange === range.value
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Row: Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button
            onClick={() => setCategoryFilter("ALL")}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              categoryFilter === "ALL" ? "bg-white text-black" : "bg-[#111] text-gray-400 hover:text-white border border-white/10"
            }`}
          >
            Wszystkie
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                categoryFilter === cat ? "bg-accent/20 text-accent border border-accent/50" : "bg-[#111] text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Opis</th>
                <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Kategoria</th>
                <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">Użytkownik</th>
                <th className="px-6 py-4 text-right text-xs font-mono text-gray-400 uppercase tracking-wider">Kwota</th>
                <th className="px-6 py-4 text-right text-xs font-mono text-gray-400 uppercase tracking-wider">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{expense.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {expense.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <User className="w-4 h-4" />
                        {expense.user}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono font-bold text-white">{expense.amount.toFixed(2)} {expense.currency}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Usuń wydatek"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Brak wydatków spełniających kryteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-accent" />
                  Dodaj nowy wydatek
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Tytuł / Opis</label>
                  <input
                    type="text"
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                    placeholder="np. Opłata za serwer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Kwota</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                        placeholder="0.00"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">PLN</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Data</label>
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Kategoria</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setNewExpense({ ...newExpense, category: cat })}
                        className={`px-3 py-2 rounded-lg text-sm border transition-all text-left ${
                          newExpense.category === cat
                            ? "bg-accent/10 border-accent text-accent"
                            : "bg-black/50 border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={!newExpense.title || !newExpense.amount}
                  className="w-full py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  Dodaj wydatek
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}