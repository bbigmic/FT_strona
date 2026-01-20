"use client";

import { Terminal, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-black border-t border-white/10 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16 md:mb-20">
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 pr-0 sm:pr-8">
            <Link href="/" className="flex items-center space-x-2 text-white mb-4 sm:mb-6 group">
              <div className="relative w-5 h-5 sm:w-6 sm:h-6 group-hover:opacity-90 transition-opacity">
                <Image 
                  src="/logo-wsp-edu-feliz-saturation.png" 
                  alt="Feliz Logo" 
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 20px, 24px"
                />
              </div>
              <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-accent group-hover:text-white transition-colors" />
              <span className="font-mono text-base sm:text-lg font-bold">FELIZ<span className="text-accent">_TRADE</span></span>
            </Link>
            <p className="text-gray-500 max-w-sm mb-6 sm:mb-8 text-xs sm:text-sm leading-relaxed">
              {t.footer.tagline} 
              <br />
              {t.footer.tagline_secondary}
            </p>
            <div className="flex space-x-4 sm:space-x-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter className="w-4 h-4 sm:w-5 sm:h-5" /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin className="w-4 h-4 sm:w-5 sm:h-5" /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github className="w-4 h-4 sm:w-5 sm:h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-6 font-mono text-xs sm:text-sm uppercase tracking-widest">{t.footer.system_title}</h4>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-gray-500">
              <li><Link href="#" className="hover:text-accent transition-colors">{t.footer.system_links.ai_agents}</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">{t.footer.system_links.automation}</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">{t.footer.system_links.saas_architecture}</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">{t.footer.system_links.web_development}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-6 font-mono text-xs sm:text-sm uppercase tracking-widest">{t.footer.company_title}</h4>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-gray-500">
              <li><Link href="#" className="hover:text-white transition-colors">{t.footer.company_links.about_us}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{t.footer.company_links.careers}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{t.footer.company_links.blog}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{t.footer.company_links.contact}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs text-gray-600 font-mono gap-3 sm:gap-0">
          <p>&copy; {new Date().getFullYear()} {t.footer.copyright}</p>
          <div className="flex space-x-4 sm:space-x-6">
            <Link href="#" className="hover:text-white transition-colors">{t.footer.privacy_policy}</Link>
            <Link href="#" className="hover:text-white transition-colors">{t.footer.terms_of_service}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
