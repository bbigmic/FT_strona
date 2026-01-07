import { Terminal, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2 pr-8">
            <Link href="/" className="flex items-center space-x-2 text-white mb-6 group">
              <Terminal className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
              <span className="font-mono text-lg font-bold">FELIZ<span className="text-accent">_TRADE</span></span>
            </Link>
            <p className="text-gray-500 max-w-sm mb-8 text-sm leading-relaxed">
              Tworzymy przyszłość poprzez inteligentną automatyzację. 
              Code is law. Efficiency is mandatory.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-mono text-sm uppercase tracking-widest">System</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-accent transition-colors">AI Agents</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Automation</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">SaaS Architecture</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Web Development</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-mono text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-mono">
          <p>&copy; {new Date().getFullYear()} Feliz Trade Ltd. All systems operational.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Privacy_Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms_of_Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
