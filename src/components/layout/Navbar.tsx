import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks: Array<{
    name: string;
    href: string;
    hasDropdown?: boolean;
    items?: Array<{ name: string; href: string }>;
  }> = [
    {
      name: "Features",
      href: "#",
      hasDropdown: true,
      items: [
        { name: "IELTS Prep", href: "/chat/ielts" },
        { name: "Visa Interview", href: "/visa" },
        { name: "Job Interview", href: "/chat/job" }
      ]
    },
    { name: "Underlord", href: "/dashboard" },
    {
      name: "For work",
      href: "#",
      hasDropdown: true,
      items: [
        { name: "Teams", href: "#" },
        { name: "Enterprise", href: "#" }
      ]
    },
    { name: "Pricing", href: "/pricing" },
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
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white rounded" />
              </div>
            </div>
            <span className="text-xl font-normal text-white">
              descript
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => link.hasDropdown && setOpenDropdown(link.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {link.hasDropdown ? (
                  <>
                    <button className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors">
                      {link.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {openDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl py-2 min-w-[180px]"
                      >
                        {link.items?.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => navigate("/pricing")}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Contact sales
            </button>

            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('resources')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors">
                Resources
                <ChevronDown className="w-4 h-4" />
              </button>
              {openDropdown === 'resources' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl py-2 min-w-[180px]"
                >
                  <Link to="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Help Center
                  </Link>
                  <Link to="/activity" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Activity
                  </Link>
                </motion.div>
              )}
            </div>

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={logout}
                  className="px-6 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-900 transition-colors border border-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-6 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-900 transition-colors border border-white/10"
                >
                  Sign up
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
                <div key={link.name}>
                  {link.hasDropdown ? (
                    <div className="space-y-3">
                      <div className="text-lg font-medium text-white/90">
                        {link.name}
                      </div>
                      <div className="pl-4 space-y-2">
                        {link.items?.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="block text-sm text-white/70 hover:text-white transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={link.href}
                      className="block text-lg font-medium text-white/70 hover:text-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}

              <div className="pt-6 border-t border-white/10 space-y-4">
                <button
                  onClick={() => { navigate("/pricing"); setMobileMenuOpen(false); }}
                  className="block w-full text-left text-sm text-white/70"
                >
                  Contact sales
                </button>

                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => { navigate("/dashboard"); setMobileMenuOpen(false); }}
                      className="block w-full text-left text-sm text-white/70"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="w-full py-3 rounded-lg bg-black text-white font-medium border border-white/10"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                      className="block w-full text-left text-sm text-white/70"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => { navigate("/register"); setMobileMenuOpen(false); }}
                      className="w-full py-3 rounded-lg bg-black text-white font-medium border border-white/10"
                    >
                      Sign up
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
