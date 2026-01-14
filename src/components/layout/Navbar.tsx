import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "VISA PREP", href: "/visa" },
    { name: "IELTS", href: "/chat/ielts" },
    { name: "PRICING", href: "/pricing" },
  ];

  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-black/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tight text-white">
              prep<span className="text-emerald-400">AI</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-[13px] font-medium tracking-[0.1em] text-white/70 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-[13px] font-medium tracking-wide text-white/70 hover:text-white transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={logout}
                  className="px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-semibold tracking-wide hover:bg-white/90 transition-colors"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-[13px] font-medium tracking-wide text-white/70 hover:text-white transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-6 py-2.5 rounded-full bg-emerald-500 text-white text-[13px] font-semibold tracking-wide hover:bg-emerald-400 transition-colors"
                >
                  GET STARTED
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-lg font-medium text-white/70 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-white/10 space-y-4">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => { navigate("/dashboard"); setMobileMenuOpen(false); }}
                      className="block w-full text-left text-lg text-white/70"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="w-full py-3 rounded-full bg-white text-black font-semibold"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                      className="block w-full text-left text-lg text-white/70"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => { navigate("/register"); setMobileMenuOpen(false); }}
                      className="w-full py-3 rounded-full bg-emerald-500 text-white font-semibold"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
