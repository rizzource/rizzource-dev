import { Zap, Mail } from "lucide-react";
import { useTheme } from "next-themes";
import logoLight from "@/assets/rizzource-logo-light.png";
import logoDark from "@/assets/rizzource-logo-dark.png";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-charcoal text-warm-cream py-24 px-6 rounded-t-[4rem]">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-20 mb-20">

          {/* Brand Section */}
          <div className="col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-electric-teal flex items-center justify-center rounded-2xl">
                <Zap className="w-8 h-8 text-charcoal" />
              </div>
              <span className="text-4xl font-black uppercase italic tracking-tighter">RIZZource</span>
            </div>
            <p className="text-xl text-warm-cream/60 font-medium max-w-sm leading-relaxed">
              Student-driven resource to support your journey through Law School and Beyond.
              No fluff, just results.
            </p>
          </div>

          {/* Resources Section */}
          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-xs text-electric-teal">Resources</h4>
            <ul className="space-y-4 font-bold uppercase tracking-widest text-[10px] text-warm-cream/40">
              <li className="hover:text-warm-cream cursor-pointer transition-colors">Job Search</li>
              <li className="hover:text-warm-cream cursor-pointer transition-colors">Resume AI</li>
              <li className="hover:text-warm-cream cursor-pointer transition-colors">Cover Letters</li>
              <li className="hover:text-warm-cream cursor-pointer transition-colors">Career Guide</li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-xs text-ai-violet">Connect</h4>
            <ul className="space-y-4 font-bold uppercase tracking-widest text-[10px] text-warm-cream/40">
              <li className="hover:text-warm-cream cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  <span>Support</span>
                </div>
              </li>
              <li className="hover:text-warm-cream cursor-pointer transition-colors">Twitter (X)</li>
              <li className="hover:text-warm-cream cursor-pointer transition-colors">LinkedIn</li>
              <li className="hover:text-warm-cream cursor-pointer transition-colors">Discord</li>
            </ul>
            <div className="pt-4">
              <a
                href="mailto:support@rizzource.com"
                className="text-sm text-warm-cream/60 hover:text-electric-teal transition-colors font-medium"
              >
                support@rizzource.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            © 2025 RIZZOURCE / POWERED BY STUDENTS / STAY LIT
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/20">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white cursor-pointer transition-colors">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;