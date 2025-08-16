import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { Menu } from "lucide-react";
import "@/styles/auth.css"; // keeps your header gradients/extra tokens

const Header: React.FC = () => {
  const { user, logout } = useAuthContext();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = React.useState(false);

  const isActive = (to: string) =>
    pathname === to
      ? "bg-primary text-primary-foreground"
      : "text-[--header-text] hover:bg-[--pill-hover-bg]";

  const handleSignOut = async () => {
    try {
      await signOut();
      logout();
      navigate("/signin");
    } catch {
      // swallow; you likely have toasts elsewhere
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[--header-gradient] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="header-glass rounded-2xl px-3 sm:px-4 py-2.5 flex items-center justify-between">
          {/* Brand */}
          <Link
            to="/index"
            className="inline-flex items-center gap-2 font-semibold text-lg text-[--header-text] drop-shadow-sm hover:scale-[1.02] transition-transform"
          >
            <span
              className="w-2.5 h-2.5 rounded-full ring-4"
              style={{ background: "var(--brand-dot)" }}
            />
            Podwise
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-3">
            <Link
              to="/about"
              className={`px-3 py-1.5 rounded-full text-base font-medium transition-colors ${isActive("/about")}`}
            >
              About
            </Link>

            {user && (
              <>
                <Link
                  to="/history"
                  className={`px-3 py-1.5 rounded-full text-base font-medium transition-colors ${isActive("/history")}`}
                >
                  History
                </Link>
                <Link
                  to="/profile"
                  className={`px-3 py-1.5 rounded-full text-base font-medium transition-colors ${isActive("/profile")}`}
                >
                  Profile
                </Link>
              </>
            )}

            {!user ? (
              <>
                <Link
                  to="/signin"
                  className={`px-3 py-1.5 rounded-full text-base font-medium transition-colors ${isActive("/signin")}`}
                >
                  Sign In
                </Link>
              </>
            ) : (
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-full text-base font-medium transition-colors bg-destructive text-destructive-foreground hover:opacity-90"
              >
                Sign Out
              </button>
            )}
          </nav>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[--pill-hover-bg] text-[--header-text] transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-3 bg-[--header-gradient]">
          <nav className="mt-2 space-y-1.5">
            <Link
              to="/about"
              className="block px-3 py-2 rounded-xl text-base text-[--header-text] hover:bg-[--pill-hover-bg]"
              onClick={() => setOpen(false)}
            >
              About
            </Link>

            {user && (
              <>
                <Link
                  to="/history"
                  className="block px-3 py-2 rounded-xl text-base text-[--header-text] hover:bg-[--pill-hover-bg]"
                  onClick={() => setOpen(false)}
                >
                  History
                </Link>
                <Link
                  to="/chat"
                  className="block px-3 py-2 rounded-xl text-base text-[--header-text] hover:bg-[--pill-hover-bg]"
                  onClick={() => setOpen(false)}
                >
                  Chat
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-xl text-base text-[--header-text] hover:bg-[--pill-hover-bg]"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleSignOut();
                  }}
                  className="w-full text-left block px-3 py-2 rounded-xl text-base text-[--header-text] hover:bg-[--pill-hover-bg]"
                >
                  Sign Out
                </button>
              </>
            )}

            {!user && (
              <>
                <Link
                  to="/signin"
                  className="block px-3 py-2 rounded-xl text-base text-[--header-text] hover:bg-[--pill-hover-bg]"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-xl text-base text-[--header-text] hover:bg-[--pill-hover-bg]"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
