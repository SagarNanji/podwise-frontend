import React from "react";
import { Mail, Phone, MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-6 py-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tight">Podwise</h2>
              <p className="text-sm leading-relaxed text-slate-400">
                Turn audio into searchable conversations. Upload, transcribe, and find insights — fast.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/history"
                    className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                    History
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signin"
                    className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Contact
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-slate-300">
                  <Mail className="h-4 w-4" />
                  support@podwise.com
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Phone className="h-4 w-4" />
                  +1 (234) 567-890
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <MapPin className="h-4 w-4" />
                  Kitchener, Ontario
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Stay Updated
              </h3>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Podwise. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
