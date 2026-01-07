"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Terminal, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("hero");
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: t.navbar.start, href: "#hero", id: "hero" },
    { name: t.navbar.services, href: "#services", id: "services" },
    { name: t.navbar.products, href: "#products", id: "products" },
    { name: t.navbar.about, href: "#about", id: "about" },
    { name: t.navbar.contact, href: "#contact", id: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll Spy Logic
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const link of navLinks) {
        const section = document.getElementById(link.id);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(link.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-4 md:top-6 left-2 right-2 md:left-6 md:right-6 z-50 rounded-2xl border border-white/10 transition-all duration-300 ${
          scrolled 
            ? "bg-black/80 backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border-white/20" 
            : "bg-black/40 backdrop-blur-md"
        }`}
      >
        <div className="px-4 md:px-6 h-14 flex justify-between items-center relative">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 text-white group relative z-10">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 group-hover:border-accent/50 transition-colors overflow-hidden">
              <Terminal className="w-4 h-4 text-gray-400 group-hover:text-accent transition-colors" />
              <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm tracking-widest font-bold leading-none">
                FELIZ<span className="text-accent">_TRADE</span>
              </span>
              <span className="text-[9px] text-gray-500 font-mono leading-none mt-1 group-hover:text-accent/80 transition-colors">
                {t.navbar.system_ver}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 bg-white/5 rounded-full p-1 border border-white/5">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`relative px-4 py-1.5 text-xs font-mono transition-colors ${
                  activeSection === link.id ? "text-accent font-bold" : "text-gray-400 hover:text-white"
                }`}
                onMouseEnter={() => setHoveredPath(link.id)}
                onMouseLeave={() => setHoveredPath(null)}
              >
                <span className="relative z-10 flex items-center gap-1">
                  {link.name}
                </span>
                {hoveredPath === link.id && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Status Indicator (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
             {/* Language Selector */}
             <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/5">
                <button
                  onClick={() => setLanguage("PL")}
                  className={`px-2 py-1 text-[10px] font-mono rounded-md transition-all ${
                    language === "PL" 
                      ? "bg-white/10 text-accent font-bold shadow-[0_0_10px_rgba(34,197,94,0.1)]" 
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  PL
                </button>
                <div className="w-[1px] h-3 bg-white/10 mx-1"></div>
                <button
                  onClick={() => setLanguage("EN")}
                  className={`px-2 py-1 text-[10px] font-mono rounded-md transition-all ${
                    language === "EN" 
                      ? "bg-white/10 text-accent font-bold shadow-[0_0_10px_rgba(34,197,94,0.1)]" 
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  EN
                </button>
             </div>

             <div className="flex items-center space-x-3 bg-black/40 rounded-lg px-3 py-1.5 border border-white/5">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">ONLINE</span>
                </div>
             </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative z-10 w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white active:scale-95 transition-transform"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-40 bg-black/60 md:hidden flex items-start justify-center pt-24"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[90%] bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Decorative grid background */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              <div className="relative z-10 flex flex-col space-y-2">
                <div className="text-xs font-mono text-gray-500 mb-4 px-4">/// NAVIGATION_MENU</div>
                {navLinks.map((link, i) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="group flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-lg font-medium text-gray-300 group-hover:text-white group-hover:translate-x-2 transition-all">
                      {link.name}
                    </span>
                    <Terminal className="w-4 h-4 text-gray-600 group-hover:text-accent opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center px-4">
                {/* Mobile Language Selector */}
                <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/5">
                    <button
                      onClick={() => setLanguage("PL")}
                      className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
                        language === "PL" 
                          ? "bg-white/10 text-accent font-bold" 
                          : "text-gray-500"
                      }`}
                    >
                      PL
                    </button>
                    <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                    <button
                      onClick={() => setLanguage("EN")}
                      className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
                        language === "EN" 
                          ? "bg-white/10 text-accent font-bold" 
                          : "text-gray-500"
                      }`}
                    >
                      EN
                    </button>
                 </div>

                <span className="text-xs text-accent font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                  {t.navbar.system_ready}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
