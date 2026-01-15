"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Terminal, Copy, Trash2, Maximize2, Minimize2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function About() {
  const features = [
    "Dedykowane podejście do każdego projektu",
    "Najnowsze technologie (Next.js, AI, Cloud)",
    "Wsparcie techniczne i utrzymanie",
    "Skalowalne rozwiązania dla rosnących firm"
  ];

  // Terminal Logic
  const [logs, setLogs] = useState<string[]>([]);
  const [currentModule, setCurrentModule] = useState<{ name: string; progress: number } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentLine, setCurrentLine] = useState<string>("");
  const initializedRef = useRef(false);
  const currentModuleRef = useRef<{ name: string; progress: number } | null>(null);

  useEffect(() => {
    currentModuleRef.current = currentModule;
  }, [currentModule]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const modules = [
      "AI_AGENTS",
      "SAAS_ARCHITECTURE",
      "AUTOMATION_PROTOCOLS"
    ];

    const typeText = async (text: string) => {
      setCurrentLine("");
      for (let i = 0; i < text.length; i++) {
        await new Promise(r => setTimeout(r, 20 + Math.random() * 30));
        setCurrentLine(text.slice(0, i + 1));
      }
      setLogs(prev => {
        if (prev[prev.length - 1] === text) return prev;
        return [...prev, text];
      });
      setCurrentLine("");
    };

    const runSequence = async () => {
      // Step 1: Init
      await typeText("> initiating_core_systems...");
      await new Promise(r => setTimeout(r, 500));

      // Step 2: Modules
      for (const moduleName of modules) {
        await typeText(`> loading_module: ${moduleName}`);
        
        setCurrentModule({ name: moduleName, progress: 0 });
        
        // Simulate loading
        for (let i = 0; i <= 100; i += 2) {
          setCurrentModule({ name: moduleName, progress: i });
          await new Promise(r => setTimeout(r, 15)); 
        }

        // Commit log
        setCurrentModule(null);
        setLogs(prev => {
          const newLogs = [...prev];
          const idx = newLogs.length - 1;
          if (idx >= 0 && !/\[OK\]\s*$/.test(newLogs[idx])) {
            newLogs[idx] = `${newLogs[idx]} [OK]`;
          }
          return newLogs;
        });
        await new Promise(r => setTimeout(r, 200));
      }

      // Step 3: Final Status
      await typeText("> system_status: ONLINE");
      await new Promise(r => setTimeout(r, 500));
      setIsComplete(true);
      
      await new Promise(r => setTimeout(r, 1000));
      setShowCommands(true);
    };

    runSequence();
  }, []);

  return (
    <section id="about" className="py-12 sm:py-16 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-16 lg:gap-20">
          <motion.div 
            layout
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`lg:w-1/2 w-full transition-all duration-500 ease-in-out ${isFullscreen ? "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" : "relative"}`}
          >
          <motion.div 
            layout
            className={`relative group w-full ${isFullscreen ? "max-w-5xl h-[80vh]" : ""}`}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-blue-600 rounded-xl sm:rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
            <motion.div 
              layout
              className="rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl relative h-full flex flex-col"
            >
              <div className="bg-[#1c1c1e] px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 border-b border-white/5 relative z-10 shrink-0">
                <div className="flex gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors shadow-lg shadow-red-500/20" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 transition-colors shadow-lg shadow-yellow-500/20" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 transition-colors shadow-lg shadow-green-500/20" />
                </div>
                <div className="flex-1 text-center text-[10px] sm:text-xs text-gray-500 font-mono flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent animate-pulse"></span>
                  <span className="hidden sm:inline">user@feliztrade:~</span>
                  <span className="sm:hidden">user@ft:~</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => {
                      const text = logs.join("\n");
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(text).then(() => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1000);
                        });
                      }
                    }}
                    className="p-1.5 sm:p-2 rounded-lg border border-white/10 text-gray-400 hover:text-accent hover:border-accent/40 transition-colors"
                    aria-label="Copy logs"
                  >
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setLogs([]);
                      setCurrentModule(null);
                      setIsComplete(false);
                      setShowCommands(false);
                    }}
                    className="p-1.5 sm:p-2 rounded-lg border border-white/10 text-gray-400 hover:text-accent hover:border-accent/40 transition-colors"
                    aria-label="Clear terminal"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => setIsFullscreen(v => !v)}
                    className="p-1.5 sm:p-2 rounded-lg border border-white/10 text-gray-400 hover:text-accent hover:border-accent/40 transition-colors"
                    aria-label="Toggle size"
                  >
                    {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                  {copied && <span className="text-[9px] sm:text-[10px] font-mono text-accent hidden sm:inline">COPIED</span>}
                </div>
              </div>
              <div className={`p-4 sm:p-6 text-left font-mono text-xs sm:text-sm md:text-base ${isFullscreen ? "flex-1 overflow-auto" : "h-64 sm:h-80 md:h-96 overflow-hidden"} flex flex-col`}>
                <div className="text-gray-300 leading-relaxed space-y-1">
                  {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                  {currentLine && <div>{currentLine}</div>}
                  
                  {currentModule && (
                    <div className="flex items-center gap-2 text-accent">
                      <div className="flex-1 h-2 bg-gray-800 rounded-full max-w-[200px] overflow-hidden">
                        <div 
                          className="h-full bg-accent transition-all duration-75 ease-out" 
                          style={{ width: `${currentModule.progress}%` }}
                        />
                      </div>
                      <span className="w-12 text-right">{currentModule.progress}%</span>
                    </div>
                  )}

                  {isComplete && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-emerald-500 font-bold mt-2"
                    >
                      {"> ready_to_deploy."}
                      {!showCommands && <span className="terminal-cursor text-accent ml-1"></span>}
                    </motion.div>
                  )}

                  {showCommands && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="mt-4 space-y-2"
                    >
                      <div className="text-gray-500 text-xs mb-2">AVAILABLE_COMMANDS:</div>
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                          className="text-left group flex items-center gap-2 hover:bg-white/5 p-2 -mx-2 rounded transition-colors"
                        >
                          <span className="text-accent">{">"}</span>
                          <span className="text-gray-300 group-hover:text-white transition-colors">run ./explore_services.exe</span>
                        </button>
                        <button 
                          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                          className="text-left group flex items-center gap-2 hover:bg-white/5 p-2 -mx-2 rounded transition-colors"
                        >
                          <span className="text-accent">{">"}</span>
                          <span className="text-gray-300 group-hover:text-white transition-colors">run ./init_contact_protocol.sh</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 w-full"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 text-white tracking-tight">
              Why <span className="text-gray-500">Choose Us<span className="text-accent animate-pulse">?</span></span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 mb-8 sm:mb-10 leading-relaxed">
              Jesteśmy zespołem inżynierów, którzy wierzą, że kod jest nowym językiem biznesu. Nie tylko budujemy oprogramowanie – projektujemy cyfrową infrastrukturę przyszłości.
            </p>

            <div className="space-y-4 sm:space-y-6">
              {features.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 sm:space-x-4 group">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors shrink-0">
                     <CheckCircle2 className="text-accent w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-300 font-medium group-hover:text-white transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
