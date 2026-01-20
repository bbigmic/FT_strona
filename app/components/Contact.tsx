"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, ArrowRight, CheckCircle, X, Building } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const [formState, setFormState] = useState({ name: "", email: "", phone: "", company: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formState.company || formState.name,
          contact: formState.name,
          email: formState.email,
          phone: formState.phone,
          company: formState.company || formState.name,
          source: t.contact.form.source,
          details: t.contact.form.details,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      setFormState({ name: "", email: "", phone: "", company: "" });
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      alert(t.contact.error);
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-16 bg-black relative border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 text-white tracking-tight">
              {t.contact.title} <br/> <span className="text-gray-500">{t.contact.title_connection}<span className="text-accent animate-pulse">.</span></span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 mb-8 sm:mb-10 lg:mb-12">
              {t.contact.description}
            </p>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-start space-x-4 sm:space-x-6 group">
                <div className="p-3 sm:p-4 bg-[#111] rounded-xl sm:rounded-2xl border border-white/10 group-hover:border-accent/50 transition-colors shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">{t.contact.email_protocol}</h3>
                  <p className="text-sm sm:text-base text-gray-400 font-mono break-all">contact@feliztradeltd.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 sm:space-x-6 group">
                <div className="p-3 sm:p-4 bg-[#111] rounded-xl sm:rounded-2xl border border-white/10 group-hover:border-accent/50 transition-colors shrink-0">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">{t.contact.voice_channel}</h3>
                  <p className="text-sm sm:text-base text-gray-400 font-mono">+48 502 600 739</p>
                  <p className="text-sm sm:text-base text-gray-400 font-mono">+48 575 057 624</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 sm:space-x-6 group">
                <div className="p-3 sm:p-4 bg-[#111] rounded-xl sm:rounded-2xl border border-white/10 group-hover:border-accent/50 transition-colors shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">{t.contact.base_location}</h3>
                  <p className="text-sm sm:text-base text-gray-400">{t.contact.location}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 sm:space-x-6 group">
                <div className="p-3 sm:p-4 bg-[#111] rounded-xl sm:rounded-2xl border border-white/10 group-hover:border-accent/50 transition-colors shrink-0">
                  <Building className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">{t.contact.company_registry}</h3>
                  <p className="text-sm sm:text-base text-gray-400 font-mono">{t.contact.company_name}</p>
                  <p className="text-sm sm:text-base text-gray-400 font-mono">{t.contact.company_number_label} {t.contact.company_number}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form Container */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#111] p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-5 pointer-events-none">
                <Send className="w-16 h-16 sm:w-24 sm:h-24" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 relative z-10">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-500 uppercase tracking-widest ml-1">{t.contact.form.identity_label}</label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-700"
                    placeholder={t.contact.form.identity_placeholder}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-500 uppercase tracking-widest ml-1">{t.contact.form.communication_label}</label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-700"
                    placeholder={t.contact.form.communication_placeholder}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-500 uppercase tracking-widest ml-1">{t.contact.form.voice_label}</label>
                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-700"
                    placeholder={t.contact.form.voice_placeholder}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-500 uppercase tracking-widest ml-1">{t.contact.form.organization_label}</label>
                  <input
                    type="text"
                    autoComplete="organization"
                    value={formState.company}
                    onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-700"
                    placeholder={t.contact.form.organization_placeholder}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black font-bold py-4 sm:py-5 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <span className="font-mono text-xs sm:text-sm">{t.contact.form.submit_loading}</span>
                  ) : (
                    <>
                      <span>{t.contact.form.submit_button}</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
              
              {/* Success Modal Overlay */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 z-20 bg-[#111]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12 }}
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 rounded-full flex items-center justify-center mb-4 sm:mb-6"
                    >
                      <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
                    </motion.div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">{t.contact.success.title}</h3>
                    <div className="w-10 sm:w-12 h-1 bg-accent rounded-full mb-4 sm:mb-6"></div>
                    
                    <p className="text-gray-300 mb-2 text-base sm:text-lg">{t.contact.success.message}</p>
                    <p className="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8 max-w-xs mx-auto">
                      {t.contact.success.description}
                    </p>
                    
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white transition-all font-mono text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {t.contact.success.close}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
