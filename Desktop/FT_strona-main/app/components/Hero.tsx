"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    let width = 0;
    let height = 0;
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      width = w;
      height = h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const cores: { x: number; y: number; s: number; activity: number; id: number }[] = [];
    const buses: { x1: number; y1: number; x2: number; y2: number; u: number; v: number }[] = [];
    const adj: number[][] = [];
    
    // Packet types
    type Packet = {
      path: number[];
      curr: number; // current core index in path
      next: number; // next core index in path
      t: number; // progress between curr and next (0..1)
      speed: number;
      type: "AI" | "SAAS" | "AUTO" | "IDLE" | "RED_SIGNAL";
      color: string;
      size: number;
      trail: { x: number; y: number; age: number }[];
    };
    const packets: Packet[] = [];

    const rebuildTopology = () => {
      cores.length = 0;
      buses.length = 0;
      adj.length = 0;
      
      const spacing = 110; // More density
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const offsetX = (width - (cols - 1) * spacing) / 2;
      const offsetY = (height - (rows - 1) * spacing) / 2;
      
      let idCounter = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = offsetX + c * spacing;
          const y = offsetY + r * spacing;
          // Extend slightly beyond viewport for "infinite" feel
          if (x > -spacing && x < width + spacing && y > -spacing && y < height + spacing) {
             cores.push({ x, y, s: 16, activity: 0, id: idCounter++ }); 
             adj.push([]);
          }
        }
      }
      for (let i = 0; i < cores.length; i++) {
        const a = cores[i];
        for (let j = i + 1; j < cores.length; j++) {
          const b = cores[j];
          const dx = Math.abs(a.x - b.x);
          const dy = Math.abs(a.y - b.y);
          // Manhattan connections
          if ((dx < spacing + 5 && dy < 5) || (dy < spacing + 5 && dx < 5)) {
            buses.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, u: i, v: j });
            adj[i].push(j);
            adj[j].push(i);
          }
        }
      }
    };
    rebuildTopology();
    let last = performance.now();
    let raf = 0;

    const findPath = (start: number, end: number): number[] => {
      const q = [start];
      const cameFrom = new Map<number, number>();
      const visited = new Set([start]);
      while (q.length > 0) {
        const curr = q.shift()!;
        if (curr === end) break;
        for (const neighbor of adj[curr]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            cameFrom.set(neighbor, curr);
            q.push(neighbor);
          }
        }
      }
      if (!cameFrom.has(end)) return [];
      const path = [end];
      let curr = end;
      while (curr !== start) {
        curr = cameFrom.get(curr)!;
        path.unshift(curr);
      }
      return path;
    };

    const spawnPacket = (forceType?: "AI" | "SAAS" | "AUTO" | "RED_SIGNAL", startNodeIndex?: number) => {
      if (cores.length < 2) return;
      let type: "AI" | "SAAS" | "AUTO" | "IDLE" | "RED_SIGNAL" = "IDLE";
      
      if (forceType) type = forceType;

      // Start/End logic
      const start = startNodeIndex !== undefined ? startNodeIndex : Math.floor(Math.random() * cores.length);
      
      // Try to find a valid path (retry a few times if random end is unreachable)
      let path: number[] = [];
      for (let i = 0; i < 5; i++) {
        let end = Math.floor(Math.random() * cores.length);
        while (end === start) end = Math.floor(Math.random() * cores.length);
        
        const candidate = findPath(start, end);
        if (candidate.length >= 2) {
          path = candidate;
          break;
        }
      }
      
      if (path.length < 2) return;

      let speed = 0.02 + Math.random() * 0.02;
      let color = "rgba(0,255,65,0.9)";
      let size = 3;

      if (type === "AI") {
        speed = 0.04 + Math.random() * 0.03;
        color = Math.random() < 0.5 ? "#00ff41" : "#00f0ff"; // Toxic Green / Cyan
        size = 2;
      } else if (type === "SAAS") {
        speed = 0.015 + Math.random() * 0.01;
        color = Math.random() < 0.5 ? "#3b82f6" : "#8b5cf6"; // Blue / Purple
        size = 4;
      } else if (type === "AUTO") {
        speed = 0.03 + Math.random() * 0.01;
        color = Math.random() < 0.5 ? "#f59e0b" : "#ef4444"; // Amber / Red
        size = 2.5;
      } else if (type === "RED_SIGNAL") {
        speed = 0.06; // Very fast
        color = "#ff0000"; // Pure Red
        size = 5; // Large sphere
      }

      packets.push({
        path,
        curr: 0,
        next: 1,
        t: 0,
        speed,
        type,
        color,
        size,
        trail: []
      });
      
      cores[path[0]].activity = 1;
    };

    const drawBackground = (now: number) => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);
      const s = 56;
      ctx.lineWidth = 1;
      for (let y = (now * 0.02) % s; y < height + s; y += s) {
        ctx.strokeStyle = "rgba(255,255,255,0.03)";
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let x = 0; x < width + s; x += s) {
        ctx.strokeStyle = "rgba(0,255,65,0.05)";
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      const cell = 38;
      for (let y = cell; y < height; y += cell) {
        for (let x = cell; x < width; x += cell) {
          const a = 0.015 + 0.02 * Math.sin((x * 0.01 + y * 0.012) + now * 0.001);
          ctx.strokeStyle = `rgba(0,255,65,${a})`;
          ctx.beginPath();
          ctx.roundRect(x - 10, y - 10, 20, 20, 5);
          ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "rgba(0,255,65,0.06)";
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(width * 0.18, height * 0.2);
      ctx.lineTo(width * 0.82, height * 0.22);
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = () => {
      const now = performance.now();
      const dt = Math.min(32, now - last);
      last = now;
      ctx.clearRect(0, 0, width, height);
      drawBackground(now);
      for (let i = 0; i < buses.length; i++) {
        const b = buses[i];
        ctx.strokeStyle = "rgba(0,255,65,0.12)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(b.x1, b.y1);
        ctx.lineTo(b.x2, b.y2);
        ctx.stroke();
      }
      // Reduced spawn rate and max packets by ~50%
      if (packets.length < 14 && Math.random() < 0.04) {
        spawnPacket();
      }
      
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        const u = cores[p.path[p.curr]];
        const v = cores[p.path[p.next]];
        
        // Sprawdź czy węzły istnieją (mogą być nieprawidłowe po przebudowie topologii)
        if (!u || !v || p.curr >= p.path.length || p.next >= p.path.length) {
          packets.splice(i, 1);
          continue;
        }
        
        const dx = v.x - u.x;
        const dy = v.y - u.y;
        const x = u.x + dx * p.t;
        const y = u.y + dy * p.t;
        
        // Trail
        p.trail.push({ x, y, age: 0 });
        if (p.trail.length > (p.type === "SAAS" ? 16 : 10)) p.trail.shift();
        
        // Draw trail
        if (p.type === "AI") {
           // Smooth line trail for AI
           ctx.beginPath();
           ctx.strokeStyle = p.color;
           ctx.lineWidth = p.size;
           if (p.trail.length > 0) {
              ctx.moveTo(p.trail[0].x, p.trail[0].y);
              for (let k = 1; k < p.trail.length; k++) {
                 ctx.lineTo(p.trail[k].x, p.trail[k].y);
              }
           }
           ctx.lineTo(x, y);
           ctx.stroke();
        } else {
           // Dot trail for others
           for (let k = 0; k < p.trail.length; k++) {
             const pt = p.trail[k];
             pt.age += dt;
             const alpha = Math.max(0, 1 - (p.trail.length - k) / p.trail.length);
             ctx.fillStyle = p.color;
             ctx.globalAlpha = alpha * 0.5;
             ctx.beginPath();
             if (p.type === "SAAS") {
                ctx.rect(pt.x - p.size * 0.6, pt.y - p.size * 0.6, p.size * 1.2, p.size * 1.2);
             } else {
                ctx.arc(pt.x, pt.y, p.size * 0.8, 0, Math.PI * 2);
             }
             ctx.fill();
           }
        }
        ctx.globalAlpha = 1;

        // Draw head
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        if (p.type === "SAAS") {
           // Square Block
           ctx.rect(x - p.size, y - p.size, p.size * 2, p.size * 2);
           ctx.fill();
           // Inner detail
           ctx.fillStyle = "#ffffff";
           ctx.fillRect(x - 1, y - 1, 2, 2);
        } else if (p.type === "AI") {
           // Triangle / Arrow
           const angle = Math.atan2(dy, dx);
           ctx.save();
           ctx.translate(x, y);
           ctx.rotate(angle);
           ctx.moveTo(p.size * 2, 0);
           ctx.lineTo(-p.size, -p.size);
           ctx.lineTo(-p.size, p.size);
           ctx.closePath();
           ctx.fill();
           ctx.restore();
        } else if (p.type === "AUTO") {
           // Hexagon-ish or Gear
           ctx.arc(x, y, p.size, 0, Math.PI * 2);
           ctx.fill();
           ctx.strokeStyle = "#ffffff";
           ctx.lineWidth = 1;
           ctx.stroke();
        } else {
           ctx.arc(x, y, p.size, 0, Math.PI * 2);
           ctx.fill();
        }
        ctx.shadowBlur = 0;
        
        // Move
        p.t += p.speed * (dt / 16);
        if (p.t >= 1) {
          const nextCore = cores[p.path[p.next]];
          if (nextCore) {
            nextCore.activity = Math.min(1, nextCore.activity + 0.8);
          }
          p.curr++;
          p.next++;
          p.t = 0;
          if (p.next >= p.path.length) {
            packets.splice(i, 1);
          }
        }
      }
      for (let i = 0; i < cores.length; i++) {
        const c = cores[i];
        c.activity *= 0.96;
        
        const activity = c.activity;
        const isActive = activity > 0.01;
        
        // Base colors
        const darkBase = "#050505";
        const accent = `rgba(0, 255, 65, ${0.2 + activity * 0.8})`;
        const pinColor = `rgba(0, 255, 65, ${0.1 + activity * 0.4})`;
        
        // 1. Draw Pins (Gold/Greenish pads)
        ctx.fillStyle = pinColor;
        const pinCount = 6;
        const gap = (c.s * 2) / (pinCount - 1);
        
        // Top/Bottom pins
        for (let k = 0; k < pinCount; k++) {
            const px = c.x - c.s + k * gap;
            ctx.fillRect(px - 1, c.y - c.s - 4, 2, 4); // Top
            ctx.fillRect(px - 1, c.y + c.s, 2, 4);     // Bottom
        }
        // Left/Right pins
        for (let k = 0; k < pinCount; k++) {
            const py = c.y - c.s + k * gap;
            ctx.fillRect(c.x - c.s - 4, py - 1, 4, 2); // Left
            ctx.fillRect(c.x + c.s, py - 1, 4, 2);     // Right
        }

        // 2. Main Body (Substrate)
        ctx.fillStyle = darkBase;
        ctx.strokeStyle = `rgba(0, 255, 65, ${0.15 + activity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(c.x - c.s, c.y - c.s, c.s * 2, c.s * 2);
        ctx.fill();
        ctx.stroke();
        
        // 3. Inner Die (The "Core")
        const dieSize = c.s * 0.6;
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(c.x - dieSize/2, c.y - dieSize/2, dieSize, dieSize);
        
        // Die Border/Glow
        ctx.strokeStyle = accent;
        ctx.lineWidth = isActive ? 1.5 : 0.5;
        ctx.strokeRect(c.x - dieSize/2, c.y - dieSize/2, dieSize, dieSize);
        
        // 4. Details (Label/Status)
        // Tiny text lines
        ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + activity * 0.2})`;
        ctx.fillRect(c.x - dieSize/2 + 2, c.y - dieSize/2 + 3, dieSize - 4, 1);
        ctx.fillRect(c.x - dieSize/2 + 2, c.y - dieSize/2 + 6, dieSize - 8, 1);
        
        // Corner accents
        ctx.fillStyle = accent;
        const cs = 2;
        ctx.fillRect(c.x - c.s, c.y - c.s, cs, cs);
        ctx.fillRect(c.x + c.s - cs, c.y - c.s, cs, cs);
        ctx.fillRect(c.x + c.s - cs, c.y + c.s - cs, cs, cs);
        ctx.fillRect(c.x - c.s, c.y + c.s - cs, cs, cs);

        // Status LED
        if (isActive) {
           ctx.fillStyle = "#00ff41";
           ctx.shadowColor = "#00ff41";
           ctx.shadowBlur = 4;
           ctx.beginPath();
           ctx.arc(c.x + c.s - 5, c.y - c.s + 5, 1.5, 0, Math.PI * 2);
           ctx.fill();
           ctx.shadowBlur = 0;
        }
      }
      // Mouse interaction
      if (mouseRef.current) {
        const m = mouseRef.current;
        let bestDist = 1e9;
        let bestCore = -1;
        
        for (let i = 0; i < cores.length; i++) {
           const c = cores[i];
           const d = (c.x - m.x) * (c.x - m.x) + (c.y - m.y) * (c.y - m.y);
           if (d < bestDist) {
              bestDist = d;
              bestCore = i;
           }
        }

        const isHovering = bestDist < 900 && bestCore !== -1;
        if (canvasRef.current) {
           canvasRef.current.style.cursor = isHovering ? "pointer" : "default";
        }

        if (bestDist < 12000 && bestCore !== -1) {
           const c = cores[bestCore];
           // Scan effect
           const time = performance.now() * 0.005;
           const radius = c.s + 12 + Math.sin(time) * 4;
           
           if (isHovering) {
              ctx.strokeStyle = "#00f0ff";
              ctx.shadowColor = "#00f0ff";
              ctx.shadowBlur = 12;
              ctx.setLineDash([]);
           } else {
              ctx.strokeStyle = "rgba(6,182,212,0.6)";
              ctx.shadowBlur = 0;
              ctx.setLineDash([4, 4]);
           }

           ctx.lineWidth = 2;
           ctx.beginPath();
           ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
           ctx.stroke();
           ctx.setLineDash([]);
           ctx.shadowBlur = 0;
           
           if (Math.random() < 0.12) {
              let type: "AI" | "SAAS" | "AUTO" = "AI";
              // Random if idle
              const r = Math.random();
              if (r < 0.33) type = "AI";
              else if (r < 0.66) type = "SAAS";
              else type = "AUTO";
              spawnPacket(type);
           }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onResize = () => {
      resize();
      rebuildTopology();
    };
    const getCoreAt = (x: number, y: number) => {
      let bestDist = 1e9;
      let bestCore = -1;
      
      for (let i = 0; i < cores.length; i++) {
         const c = cores[i];
         const d = (c.x - x) * (c.x - x) + (c.y - y) * (c.y - y);
         if (d < bestDist) {
            bestDist = d;
            bestCore = i;
         }
      }
      return { dist: bestDist, index: bestCore };
    };

    const onMouse = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      // Convert viewport coordinates to canvas coordinates
      mouseRef.current = { 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      };
    };

    const isInteractiveElement = (target: EventTarget | null) => {
      if (!target) return false;
      const el = target as HTMLElement;
      // Check if clicking on text, links, buttons
      if (el.tagName === "A" || el.tagName === "BUTTON" || el.closest("a") || el.closest("button")) return true;
      // Check if clicking on text content
      if (["H1", "H2", "P", "SPAN"].includes(el.tagName)) return true;
      return false;
    };

    const onMouseDown = (e: MouseEvent) => {
       if (isInteractiveElement(e.target)) return;

       const canvas = canvasRef.current;
       if (!canvas) return;
       
       const rect = canvas.getBoundingClientRect();
       // Check if click is within the canvas bounds
       if (e.clientX < rect.left || e.clientX > rect.right || 
           e.clientY < rect.top || e.clientY > rect.bottom) {
         return;
       }
       
       // Convert viewport coordinates to canvas coordinates
       const canvasX = e.clientX - rect.left;
       const canvasY = e.clientY - rect.top;
       
       const { dist, index } = getCoreAt(canvasX, canvasY);
       
       // If hitting a processor
       if (dist < 1500 && index !== -1) {
          e.preventDefault(); // Prevents text selection
          
          // Trigger signal immediately on press
          spawnPacket("RED_SIGNAL", index);
          cores[index].activity = 2.0;
       }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex flex-col justify-center items-center pt-20 sm:pt-24 md:pt-28 overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center flex-1 flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-4xl mx-auto bg-black/40 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/10 shadow-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 sm:mb-8"
          >
            <span className="inline-block px-3 sm:px-4 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] sm:text-xs text-gray-300 font-medium tracking-wide backdrop-blur-md">
              {t.hero.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white mb-4 sm:mb-6 leading-tight select-none drop-shadow-2xl"
          >
            <span className="relative z-10">{t.hero.headline_primary}</span> <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00ff41] via-[#00f0ff] to-[#00ff41] bg-[length:200%_auto] animate-gradient">
              {t.hero.headline_secondary}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-light px-2"
          >
            {t.hero.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link
              href="#contact"
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#00f0ff] text-black rounded-xl text-sm sm:text-base md:text-lg font-mono font-bold uppercase tracking-widest hover:bg-[#00f0ff]/90 transition-all flex items-center justify-center border border-[#00f0ff]/20 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              {t.hero.cta_start}
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#services"
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-[#00f0ff] rounded-xl text-sm sm:text-base md:text-lg font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center border border-[#00f0ff]/30 bg-black/40 hover:bg-[#00f0ff]/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
            >
              {t.hero.cta_explore} <ChevronRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        </motion.div>


      </div>
    </section>
  );
}
