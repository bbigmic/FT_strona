"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowUpRight, Cpu, Database, Shield, ChevronLeft, ChevronRight, X, Calendar, Clock, User, Mail, Send, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const productAssets = [
  {
    price: "$499 / mo",
    icon: <Cpu className="w-10 h-10 text-accent" />,
    gradient: "from-accent/20 to-blue-500/20"
  },
  {
    price: "$299 / mo",
    icon: <Database className="w-10 h-10 text-purple-500" />,
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    price: "Custom",
    icon: <Shield className="w-10 h-10 text-blue-500" />,
    gradient: "from-blue-500/20 to-cyan-500/20"
  }
];

export default function Products() {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1); // 1: Calendar, 2: Form, 3: Success
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const [bookingForm, setBookingForm] = useState({ name: "", company: "", email: "", phone: "" });
  const [bookingErrors, setBookingErrors] = useState<{ [key: string]: string }>({});
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  const products = t.products.items.map((item, index) => ({
    ...item,
    ...productAssets[index]
  }));

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <section id="products" className="py-16 bg-black relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-accent" />
            <span className="text-accent font-mono text-sm tracking-widest uppercase">{t.products.available_solutions}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
            {t.products.our} <span className="text-gray-500">{t.products.products}<span className="text-accent animate-pulse">.</span></span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl">
            {t.products.subtitle}
          </p>
        </motion.div>

        <div className="flex items-center justify-center gap-4 md:gap-12">
          {/* Previous Button */}
          <button
            onClick={prevProduct}
            className="p-4 rounded-full bg-[#111] border border-white/10 text-white hover:bg-white/10 hover:border-accent/50 hover:text-accent transition-all active:scale-95 group hidden md:flex"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* Product Carousel */}
          <div className="relative w-full max-w-2xl h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <div className="group h-full relative bg-[#111] rounded-3xl p-1 overflow-hidden border border-white/5 hover:border-white/10 transition-colors">
                  <div className={`absolute inset-0 bg-gradient-to-b ${products[currentIndex].gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />
                  
                  <div className="bg-black/50 rounded-[22px] h-full p-8 md:p-12 flex flex-col relative z-10 backdrop-blur-sm">
                    <div className="mb-8 p-4 bg-white/5 w-fit rounded-2xl border border-white/5 group-hover:scale-110 transition-transform duration-500">
                      {products[currentIndex].icon}
                    </div>

                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-3xl font-bold text-white font-mono">{products[currentIndex].title}</h3>
                        <p className="text-accent font-mono text-lg">{products[currentIndex].price}</p>
                    </div>
                    
                    <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                      {products[currentIndex].description}
                    </p>

                    <div className="mt-auto space-y-4 mb-8 border-t border-white/5 pt-6">
                      {products[currentIndex].features.map((feature, i) => (
                        <div key={i} className="flex items-center text-gray-500 font-mono">
                          <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-3 group-hover:bg-accent transition-colors" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => setShowBookingModal(true)}
                      className="w-full py-4 bg-black border border-accent/20 text-accent font-mono text-sm tracking-wider uppercase rounded-xl hover:bg-accent/10 hover:border-accent/50 transition-all flex items-center justify-center group/btn shadow-[0_0_20px_-10px_rgba(34,197,94,0.3)]"
                    >
                      <span className="mr-2">{">"}</span>
                      <span>{t.products.book_demo}</span>
                      <span className="ml-1 animate-pulse">_</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
             {/* Mobile Navigation Controls (below card) */}
             <div className="flex md:hidden justify-between mt-4">
                <button
                    onClick={prevProduct}
                    className="p-3 rounded-full bg-[#111] border border-white/10 text-white hover:text-accent transition-colors active:scale-95"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                 <span className="text-gray-500 font-mono text-sm flex items-center">
                    {currentIndex + 1} / {products.length}
                 </span>
                <button
                    onClick={nextProduct}
                    className="p-3 rounded-full bg-[#111] border border-white/10 text-white hover:text-accent transition-colors active:scale-95"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
             </div>
          </div>

          {/* Next Button */}
          <button
            onClick={nextProduct}
            className="p-4 rounded-full bg-[#111] border border-white/10 text-white hover:bg-white/10 hover:border-accent/50 hover:text-accent transition-all active:scale-95 group hidden md:flex"
            aria-label="Next product"
          >
            <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center mt-12 gap-3">
            {products.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                        index === currentIndex ? "w-8 bg-accent" : "w-2 bg-gray-700 hover:bg-gray-500"
                    }`}
                    aria-label={`Go to product ${index + 1}`}
                />
            ))}
        </div>
      </div>

      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 font-mono text-sm text-gray-400">{t.booking.system_title}</span>
                </div>
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8">
                {bookingStep === 1 && (
                  <div className="space-y-6">
                    <div>
                        <h3 className="text-xl text-white font-mono mb-2 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-accent" />
                            {t.booking.step_1_title}
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
                            {Array.from({ length: 8 }).map((_, i) => {
                                const date = new Date();
                                date.setDate(date.getDate() + i + 1);
                                const locale = language === 'PL' ? 'pl-PL' : 'en-US';
                                const dateStr = date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
                                const dayName = date.toLocaleDateString(locale, { weekday: 'short' });
                                const isSelected = selectedDate === dateStr;
                                
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedDate(dateStr)}
                                        className={`p-3 rounded-lg border font-mono text-sm transition-all ${
                                            isSelected 
                                            ? "bg-accent text-black border-accent" 
                                            : "bg-black border-white/10 text-gray-400 hover:border-accent/50 hover:text-white"
                                        }`}
                                    >
                                        <div className="opacity-60 text-xs mb-1">{dayName}</div>
                                        <div className="font-bold">{dateStr}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {selectedDate && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h3 className="text-xl text-white font-mono mb-2 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-accent" />
                                {t.booking.step_1_time}
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
                                {["09:00", "10:00", "11:30", "13:00", "14:30", "16:00"].map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`p-2 rounded-lg border font-mono text-sm transition-all ${
                                            selectedTime === time
                                            ? "bg-accent text-black border-accent"
                                            : "bg-black border-white/10 text-gray-400 hover:border-accent/50 hover:text-white"
                                        }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            disabled={!selectedDate || !selectedTime}
                            onClick={() => setBookingStep(2)}
                            className="px-6 py-3 bg-white text-black font-mono font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            {t.booking.next} <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                )}

                {bookingStep === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl text-white font-mono mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-accent" />
                            {t.booking.step_2_title}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-500">{t.booking.name_label}</label>
                                <div className={`bg-black border rounded-lg p-3 transition-colors ${bookingErrors.name ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}>
                                    <input 
                                        type="text" 
                                        value={bookingForm.name}
                                        onChange={(e) => {
                                            setBookingForm({ ...bookingForm, name: e.target.value });
                                            if (bookingErrors.name) setBookingErrors({ ...bookingErrors, name: "" });
                                        }}
                                        className="w-full bg-transparent text-white focus:outline-none font-mono placeholder:text-gray-700" 
                                        placeholder="John Doe" 
                                    />
                                </div>
                                {bookingErrors.name && (
                                    <div className="flex items-center gap-2 text-[10px] text-red-500 font-mono tracking-wider">
                                        <AlertCircle className="w-3 h-3" />
                                        <span>{">"} {bookingErrors.name}</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-500">{t.booking.company_label}</label>
                                <div className={`bg-black border rounded-lg p-3 transition-colors ${bookingErrors.company ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}>
                                    <input 
                                        type="text" 
                                        value={bookingForm.company}
                                        onChange={(e) => {
                                            setBookingForm({ ...bookingForm, company: e.target.value });
                                            if (bookingErrors.company) setBookingErrors({ ...bookingErrors, company: "" });
                                        }}
                                        className="w-full bg-transparent text-white focus:outline-none font-mono placeholder:text-gray-700" 
                                        placeholder="Corp Inc." 
                                    />
                                </div>
                                {bookingErrors.company && (
                                    <div className="flex items-center gap-2 text-[10px] text-red-500 font-mono tracking-wider">
                                        <AlertCircle className="w-3 h-3" />
                                        <span>{">"} {bookingErrors.company}</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-500">{t.booking.email_label}</label>
                                <div className={`bg-black border rounded-lg p-3 transition-colors ${bookingErrors.email ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}>
                                    <input 
                                        type="email" 
                                        value={bookingForm.email}
                                        onChange={(e) => {
                                            setBookingForm({ ...bookingForm, email: e.target.value });
                                            if (bookingErrors.email) setBookingErrors({ ...bookingErrors, email: "" });
                                        }}
                                        className="w-full bg-transparent text-white focus:outline-none font-mono placeholder:text-gray-700" 
                                        placeholder="john@example.com" 
                                    />
                                </div>
                                {bookingErrors.email && (
                                    <div className="flex items-center gap-2 text-[10px] text-red-500 font-mono tracking-wider">
                                        <AlertCircle className="w-3 h-3" />
                                        <span>{">"} {bookingErrors.email}</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-500">{t.booking.phone_label}</label>
                                <div className={`bg-black border rounded-lg p-3 transition-colors ${bookingErrors.phone ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}>
                                    <input 
                                        type="tel" 
                                        value={bookingForm.phone}
                                        onChange={(e) => {
                                            setBookingForm({ ...bookingForm, phone: e.target.value });
                                            if (bookingErrors.phone) setBookingErrors({ ...bookingErrors, phone: "" });
                                        }}
                                        className="w-full bg-transparent text-white focus:outline-none font-mono placeholder:text-gray-700" 
                                        placeholder="+48 000 000 000" 
                                    />
                                </div>
                                {bookingErrors.phone && (
                                    <div className="flex items-center gap-2 text-[10px] text-red-500 font-mono tracking-wider">
                                        <AlertCircle className="w-3 h-3" />
                                        <span>{">"} {bookingErrors.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between pt-8">
                            <button
                                onClick={() => setBookingStep(1)}
                                className="px-6 py-3 border border-white/10 text-white font-mono rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" /> {t.booking.back}
                            </button>
                            <button
                                onClick={async () => {
                                    if (isSubmittingBooking) return;
                                    
                                    const newErrors: { [key: string]: string } = {};
                                    if (!bookingForm.name.trim()) newErrors.name = "MISSING_IDENTITY";
                                    if (!bookingForm.company.trim()) newErrors.company = "MISSING_ENTITY";
                                    if (!bookingForm.email.trim()) {
                                        newErrors.email = "MISSING_COMM_ID";
                                    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingForm.email)) {
                                        newErrors.email = "INVALID_PROTOCOL";
                                    }
                                    if (!bookingForm.phone.trim()) newErrors.phone = "MISSING_VOICE_LINK";
                                    
                                    setBookingErrors(newErrors);
                                    
                                    if (Object.keys(newErrors).length > 0) return;
                                    
                                    setIsSubmittingBooking(true);
                                    
                                    try {
                                        // Konwersja daty z formatu "7 sty" na format "YYYY-MM-DD"
                                        const parseDate = (dateStr: string): string => {
                                            if (!dateStr) return new Date().toISOString().split('T')[0];
                                            // Jeśli data jest już w formacie YYYY-MM-DD, zwróć ją
                                            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
                                            
                                            // W przeciwnym razie spróbuj sparsować
                                            const today = new Date();
                                            const parts = dateStr.split(' ');
                                            if (parts.length === 2) {
                                                const day = parseInt(parts[0]);
                                                const monthNames = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
                                                const month = monthNames.indexOf(parts[1].toLowerCase());
                                                if (month !== -1 && day) {
                                                    const year = today.getFullYear();
                                                    const date = new Date(year, month, day);
                                                    // Jeśli data jest w przeszłości, użyj następnego roku
                                                    if (date < today) {
                                                        date.setFullYear(year + 1);
                                                    }
                                                    return date.toISOString().split('T')[0];
                                                }
                                            }
                                            return new Date().toISOString().split('T')[0];
                                        };

                                        const response = await fetch('/api/leads', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                name: bookingForm.company,
                                                contact: bookingForm.name,
                                                email: bookingForm.email,
                                                phone: bookingForm.phone,
                                                company: bookingForm.company,
                                                source: 'DEMO',
                                                value: 'Do wyceny',
                                                details: `Rezerwacja: ${parseDate(selectedDate || '')}, ${selectedTime || ''}`,
                                                callDetails: 'Oczekuje na kontakt',
                                                product: products[currentIndex]?.title || 'Demo',
                                            }),
                                        });

                                        if (!response.ok) {
                                            throw new Error('Failed to submit booking');
                                        }

                                        setIsSubmittingBooking(false);
                                        setBookingStep(3);
                                    } catch (error) {
                                        console.error('Error submitting booking:', error);
                                        setIsSubmittingBooking(false);
                                        alert('Wystąpił błąd podczas rezerwacji. Spróbuj ponownie.');
                                    }
                                }}
                                disabled={isSubmittingBooking}
                                className="px-6 py-3 bg-accent text-black font-mono font-bold rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmittingBooking ? "SENDING..." : t.booking.submit} <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {bookingStep === 3 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Send className="w-10 h-10 text-accent" />
                        </div>
                        <h3 className="text-2xl text-white font-mono mb-2">{t.booking.success_title}</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            {t.booking.success_msg}
                        </p>
                        <div className="bg-white/5 p-4 rounded-lg inline-block mb-8 border border-white/10">
                            <p className="text-xs text-gray-500 font-mono mb-1">{t.booking.meeting_date}</p>
                            <p className="text-accent font-mono text-lg">{selectedDate} | {selectedTime}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    setShowBookingModal(false);
                                    setBookingStep(1);
                                    setSelectedDate(null);
                                    setSelectedTime(null);
                                    setBookingForm({ name: "", company: "", email: "", phone: "" });
                                    setBookingErrors({});
                                    setIsSubmittingBooking(false);
                                }}
                                className="px-8 py-3 bg-white text-black font-mono font-bold rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {t.booking.close}
                            </button>
                        </div>
                    </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
