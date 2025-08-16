import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";

export const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthContext();
  const { loading, error, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await signIn(email, password);
    if (user) {
      login(user);
      navigate("/index");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 grid place-items-center px-4 py-10">
        <div
          className="
            w-full max-w-md rounded-2xl border border-border
            bg-card text-card-foreground shadow-xl
            p-6 sm:p-8
          "
        >
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>

              <div className="">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 pl-10 sm:pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>

              <div className="">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pl-10 sm:pl-11"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p
                className="text-sm text-destructive"
                role="alert"
                aria-live="polite"
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="
                h-11 w-full inline-flex items-center justify-center gap-2
                bg-primary text-primary-foreground
                hover:opacity-95
              "
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <p className="text-center mt-4 text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};
