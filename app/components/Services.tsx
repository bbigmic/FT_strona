"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, Workflow, Layers, Globe, Code, Terminal, X, CheckCircle2, ArrowRight, Send, User, Mail, Building2, CheckCircle, AlertCircle, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useCRM } from "../context/CRMContext";

const serviceAssets = [
  {
    icon: <Bot className="w-8 h-8" />,
    colSpan: "col-span-1 md:col-span-2"
  },
  {
    icon: <Workflow className="w-8 h-8" />,
    colSpan: "col-span-1"
  },
  {
    icon: <Layers className="w-8 h-8" />,
    colSpan: "col-span-1"
  },
  {
    icon: <Globe className="w-8 h-8" />,
    colSpan: "col-span-1 md:col-span-2"
  }
];

export default function Services() {
  const { t } = useLanguage();
  const { addLead } = useCRM();
  const services = t.services.items.map((item, index) => ({
    ...item,
    ...serviceAssets[index]
  }));

  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<{id: number, time: string, prefix: string, color: string, message: string}[]>([]);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "", company: "", message: "", product: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [isInquirySuccess, setIsInquirySuccess] = useState(false);

  useEffect(() => {
    const generateLog = () => {
      const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const options = [
        { prefix: "INFO", color: "text-blue-400", message: "Initializing neural handshake..." },
        { prefix: "SUCCESS", color: "text-emerald-400", message: "Module connected successfully" },
        { prefix: "WARN", color: "text-yellow-400", message: "High latency detected in node_24" },
        { prefix: "SYSTEM", color: "text-purple-400", message: "Optimizing database shards..." },
        { prefix: "DEBUG", color: "text-gray-500", message: `Processing batch #${Math.floor(Math.random() * 9999)}` },
        { prefix: "NETWORK", color: "text-cyan-400", message: "Packet verified (24ms)" },
        { prefix: "SECURITY", color: "text-red-400", message: "Encrypting payload..." },
        { prefix: "UPDATE", color: "text-orange-400", message: "Patch applied: v2.4.1" }
      ];
      const randomOption = options[Math.floor(Math.random() * options.length)];
      return { id: Date.now() + Math.random(), time, ...randomOption };
    };

    setTerminalLogs(Array.from({ length: 12 }).map(generateLog));
      
      const interval = setInterval(() => {
        setTerminalLogs(prev => {
          const newLogs = [...prev, generateLog()];
          if (newLogs.length > 12) return newLogs.slice(1);
          return newLogs;
        });
      }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="services" className="py-16 bg-black relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center md:text-left"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
            {t.services.title}<span className="text-accent animate-pulse">.</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl">
            {t.services.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedService(service)}
              className={`${service.colSpan} group relative overflow-hidden bg-[#111] rounded-3xl p-8 border border-white/5 hover:bg-[#161616] transition-all duration-500 cursor-pointer hover:border-accent/30`}
            >
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-100 transition-opacity">
                <Code className="w-5 h-5 text-gray-600 group-hover:text-accent" />
              </div>

              <div className="mb-8 p-4 bg-white/5 w-fit rounded-2xl text-white group-hover:text-accent transition-colors">
                {service.icon}
              </div>
              
              <h3 className="text-xl font-mono font-bold mb-4 text-white group-hover:text-accent transition-colors">
                {">"} {service.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed text-lg">
                {service.description}
              </p>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-50 transition-opacity" />
            </motion.div>
          ))}
          
          {/* Feature Card: Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-3 bg-[#111] rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12"
          >
             <div className="flex-1 z-10">
                <div className="flex items-center space-x-3 mb-6">
                   <Terminal className="w-6 h-6 text-accent" />
                   <span className="text-sm font-mono text-accent">{t.services.integration.badge}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">{t.services.integration.title}</h3>
                <p className="text-gray-400 text-lg mb-8">
                  {t.services.integration.description}
                </p>
                <button 
                  onClick={() => setShowDocsModal(true)}
                  className="group flex items-center gap-3 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/50 rounded-xl transition-all duration-300"
                >
                  <div className="p-2 bg-black rounded-lg border border-white/10 group-hover:border-accent/30 transition-colors">
                    <Code className="w-4 h-4 text-gray-400 group-hover:text-accent" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-500 font-mono mb-0.5">{t.services.integration.resources}</div>
                    <div className="text-sm text-white font-medium group-hover:text-accent transition-colors">{t.services.integration.docs}</div>
                  </div>
                </button>
             </div>
             
             {/* Abstract Visualization - Live Terminal */}
             <div className="flex-1 w-full h-56 md:h-72 bg-[#050505] rounded-xl border border-white/10 p-6 font-mono text-xs overflow-hidden relative shadow-2xl">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 pointer-events-none" />
                
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none z-10" />
                
                <div className="relative z-20 flex flex-col justify-between h-full">
                  <AnimatePresence initial={false} mode="popLayout">
                    {terminalLogs.map((log) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 mb-1 font-medium"
                      >
                        <span className="text-gray-600 shrink-0">[{log.time}]</span>
                        <span className={`${log.color} w-16 shrink-0`}>{log.prefix}</span>
                        <span className="text-gray-400 truncate">{log.message}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
             </div>
          </motion.div>
        </div>
      </div>

      {/* Documentation Modal */}
      <AnimatePresence>
        {showDocsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDocsModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#161616]">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-bold text-white font-mono">{t.services.docs_modal.title}</h3>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto font-mono text-sm md:text-base">
                <div className="space-y-8">
                  {/* Section 1: Introduction */}
                  <div>
                    <h4 className="text-accent font-bold mb-4 uppercase tracking-wider text-xs">{t.services.docs_modal.intro_title}</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {t.services.docs_modal.intro_text}
                    </p>
                    <div className="bg-black/50 p-4 rounded-lg border border-white/5">
                       <code className="text-green-400">
                         $ initialize_core --verbose<br/>
                         {">"} Loading neural modules... [OK]<br/>
                         {">"} Establishing secure handshake... [OK]<br/>
                         {">"} System ready for deployment.
                       </code>
                     </div>
                  </div>

                  {/* Section 2: API Specification */}
                  <div>
                    <h4 className="text-accent font-bold mb-4 uppercase tracking-wider text-xs">{t.services.docs_modal.api_title}</h4>
                    <div className="bg-[#0a0a0a] p-4 rounded-lg border border-white/10 overflow-x-auto">
                      <pre className="text-gray-300">
{`{
  "endpoint": "/api/v1/stream",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
  },
  "body": {
    "module": "ai_agent_01",
    "action": "analyze_sentiment",
    "payload": {
      "data_source": "user_feedback_stream",
      "threshold": 0.85
    }
  }
}`}
                      </pre>
                    </div>
                  </div>

                  {/* Section 3: Integration */}
                  <div>
                    <h4 className="text-accent font-bold mb-4 uppercase tracking-wider text-xs">{t.services.docs_modal.integration_title}</h4>
                    <ul className="space-y-2 text-gray-300 list-disc list-inside">
                      <li>Install the SDK via npm or yarn</li>
                      <li>Configure environment variables in .env</li>
                      <li>Initialize the client with your API key</li>
                      <li>Subscribe to real-time events via WebSockets</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 bg-[#161616] flex justify-end">
                <button 
                  onClick={() => setShowDocsModal(false)}
                  className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t.services.docs_modal.close}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Details Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative"
            >
               {/* Decorative Background */}
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
               
               <div className="relative p-8 md:p-10">

                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-accent">
                      {selectedService.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedService.details.title}</h3>
                      <p className="text-sm font-mono text-accent">{selectedService.title}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    {selectedService.details.content}
                  </p>

                  <div className="space-y-4">
                    <h4 className="text-sm font-mono text-gray-500 uppercase tracking-widest">{t.services.service_modal.features_title}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedService.details.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                          <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => {
                        setInquiryForm(prev => ({ ...prev, product: selectedService.title }));
                        setSelectedService(null);
                        setShowInquiryModal(true);
                      }}
                      className="order-2 md:order-1 group w-full py-4 rounded-xl bg-accent/5 border border-accent/20 text-accent font-bold hover:bg-accent hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span className="tracking-wider">{t.services.service_modal.interested}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => setSelectedService(null)}
                      className="order-1 md:order-2 w-full py-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 font-bold hover:bg-red-500 hover:text-black transition-all duration-300 tracking-wider"
                    >
                      {t.services.service_modal.close}
                    </button>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showInquiryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowInquiryModal(false);
              setIsInquirySuccess(false);
              setIsSubmittingInquiry(false);
              setInquiryForm({ name: "", email: "", phone: "", company: "", message: "", product: "" });
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#161616]">
                <div className="flex items-center gap-3">
                  <Send className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-bold text-white font-mono">{t.services.inquiry_form.title}</h3>
                </div>
                <button
                  onClick={() => {
                    setShowInquiryModal(false);
                    setIsInquirySuccess(false);
                    setIsSubmittingInquiry(false);
                    setInquiryForm({ name: "", email: "", phone: "", company: "", message: "", product: "" });
                  }}
                  className="px-3 py-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                {!isInquirySuccess ? (
                  <form
                    noValidate
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (isSubmittingInquiry) return;
                      
                      const newErrors: { [key: string]: string } = {};
                      if (!inquiryForm.name.trim()) newErrors.name = "MISSING_IDENTITY";
                      if (!inquiryForm.email.trim()) {
                         newErrors.email = "MISSING_COMM_ID";
                       } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiryForm.email)) {
                         newErrors.email = "INVALID_PROTOCOL";
                       }
                       if (!inquiryForm.phone.trim()) newErrors.phone = "MISSING_VOICE_LINK";
                       if (!inquiryForm.company.trim()) newErrors.company = "MISSING_ENTITY";
                       if (!inquiryForm.message.trim()) newErrors.message = "EMPTY_PAYLOAD";
                      
                      setErrors(newErrors);
                      
                      if (Object.keys(newErrors).length > 0) return;

                      setIsSubmittingInquiry(true);
                      
                      try {
                        const response = await fetch('/api/leads', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            name: inquiryForm.company,
                            contact: inquiryForm.name,
                            email: inquiryForm.email,
                            phone: inquiryForm.phone,
                            company: inquiryForm.company,
                            source: 'USŁUGI',
                            value: 'Do wyceny',
                            details: `Wiadomość: ${inquiryForm.message}`,
                            callDetails: 'Oczekuje na kontakt',
                            product: inquiryForm.product,
                          }),
                        });

                        if (!response.ok) {
                          throw new Error('Failed to submit inquiry');
                        }

                        // Opcjonalnie: dodaj do lokalnego contextu (jeśli potrzebne)
                        addLead({
                          name: inquiryForm.company,
                          contact: inquiryForm.name,
                          email: inquiryForm.email,
                          phone: inquiryForm.phone,
                          company: inquiryForm.company,
                          source: "USŁUGI",
                          value: "Do wyceny",
                          details: `Wiadomość: ${inquiryForm.message}`,
                          callDetails: "Oczekuje na kontakt",
                          product: inquiryForm.product
                        });
                        
                        setIsSubmittingInquiry(false);
                        setIsInquirySuccess(true);
                      } catch (error) {
                        console.error('Error submitting inquiry:', error);
                        setIsSubmittingInquiry(false);
                        alert('Wystąpił błąd podczas wysyłania zapytania. Spróbuj ponownie.');
                      }
                    }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">{t.services.inquiry_form.name_label}</label>
                        <div className={`flex items-center gap-2 bg-black border rounded-lg p-3 transition-colors ${errors.name ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}>
                          <User className={`w-4 h-4 ${errors.name ? 'text-red-500' : 'text-gray-500'}`} />
                          <input
                            type="text"
                            value={inquiryForm.name}
                            onChange={(e) => {
                              setInquiryForm({ ...inquiryForm, name: e.target.value });
                              if (errors.name) setErrors({ ...errors, name: "" });
                            }}
                            className="w-full bg-transparent text-white outline-none font-mono placeholder:text-gray-700"
                            placeholder="Jan Kowalski"
                          />
                        </div>
                        {errors.name && (
                          <div className="flex items-center gap-2 text-[10px] text-red-500 font-mono tracking-wider">
                            <AlertCircle className="w-3 h-3" />
                            <span>{">"} {errors.name}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">{t.services.inquiry_form.email_label}</label>
                        <div className={`flex items-center gap-2 bg-black border rounded-lg p-3 transition-colors ${errors.email ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}>
                          <Mail className={`w-4 h-4 ${errors.email ? 'text-red-500' : 'text-gray-500'}`} />
                          <input
                            type="email"
                            value={inquiryForm.email}
                            onChange={(e) => {
                              setInquiryForm({ ...inquiryForm, email: e.target.value });
                              if (errors.email) setErrors({ ...errors, email: "" });
                            }}
                            className="w-full bg-transparent text-white outline-none font-mono placeholder:text-gray-700"
                            placeholder="jan@example.com"
                          />
                        </div>
                        {errors.email && (
                          <div className="flex items-center gap-2 text-[10px] text-red-500 font-mono tracking-wider">
                            <AlertCircle className="w-3 h-3" />
                            <span>{">"} {errors.email}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">{t.services.inquiry_form.phone_label}</label>
                        <div className={`flex items-center gap-2 bg-black border rounded-lg p-3 transition-colors ${errors.phone ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}>
                          <Phone className={`w-4 h-4 ${errors.phone ? 'text-red-500' : 'text-gray-500'}`} />
                          <input
                            type="tel"
                            value={inquiryForm.phone}
                            onChange={(e) => {
                              setInquiryForm({ ...inquiryForm, phone: e.target.value });
                              if (errors.phone) setErrors({ ...errors, phone: "" });
                            }}
                            className="w-full bg-transparent text-white outline-none font-mono placeholder:text-gray-700"
                            placeholder="+48 000 000 000"
                          />
                        </div>
                        {errors.phone && (
                          <div className="flex items-center gap-2 text-[10px] text-red-500 font-mono tracking-wider">
                            <AlertCircle className="w-3 h-3" />
                            <span>{">"} {errors.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">{t.services.inquiry_form.company_label}</label>
                        <div className={`flex items-center gap-2 bg-black border rounded-lg p-3 transition-colors ${errors.company ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}>
                          <Building2 className={`w-4 h-4 ${errors.company ? 'text-red-500' : 'text-gray-500'}`} />
                          <input
                            type="text"
                            value={inquiryForm.company}
                            onChange={(e) => {
                              setInquiryForm({ ...inquiryForm, company: e.target.value });
                              if (errors.company) setErrors({ ...errors, company: "" });
                            }}
                            className="w-full bg-transparent text-white outline-none font-mono placeholder:text-gray-700"
                            placeholder="Feliz Trade Ltd"
                          />
                        </div>
                        {errors.company && (
                          <div className="flex items-center gap-2 text-[10px] text-red-500 font-mono tracking-wider">
                            <AlertCircle className="w-3 h-3" />
                            <span>{">"} {errors.company}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">{t.services.inquiry_form.message_label}</label>
                        <div className={`bg-black border rounded-lg p-3 transition-colors ${errors.message ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}>
                          <textarea
                            rows={4}
                            value={inquiryForm.message}
                            onChange={(e) => {
                              setInquiryForm({ ...inquiryForm, message: e.target.value });
                              if (errors.message) setErrors({ ...errors, message: "" });
                            }}
                            className="w-full bg-transparent text-white focus:outline-none font-mono resize-none placeholder:text-gray-700"
                            placeholder="Opisz zakres projektu..."
                          />
                        </div>
                        {errors.message && (
                          <div className="flex items-center gap-2 text-[10px] text-red-500 font-mono tracking-wider">
                            <AlertCircle className="w-3 h-3" />
                            <span>{">"} {errors.message}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingInquiry}
                      className="w-full bg-accent text-black font-mono font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-accent/20 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                    >
                      {isSubmittingInquiry ? (
                        <span className="font-mono tracking-widest">SENDING...</span>
                      ) : (
                        <>
                          <span className="tracking-wider">{t.services.inquiry_form.submit}</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-accent" />
                    </div>
                    <h4 className="text-2xl font-bold mb-2">{t.services.inquiry_form.success_title}</h4>
                    <p className="text-gray-400 mb-8">{t.services.inquiry_form.success_msg}</p>
                    <button
                      onClick={() => {
                        setShowInquiryModal(false);
                        setIsInquirySuccess(false);
                        setInquiryForm({ name: "", email: "", phone: "", company: "", message: "", product: "" });
                      }}
                      className="px-8 py-3 bg-white text-black font-mono font-bold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {t.services.inquiry_form.close}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
