import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name (min 2 characters).")
    .max(80, "Name is too long."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Za-z]/, "Password must include at least one letter.")
    .regex(/\d/, "Password must include at least one number."),
});

type FormData = z.infer<typeof schema>;

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, loading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur", // validate on blur; change to "onChange" if you want instant feedback
  });

  const onSubmit = async (values: FormData) => {
    const res = await signUp(
      values.name.trim(),
      values.email.trim(),
      values.password
    );
    if (res) {
      // useAuthContext().login() should happen wherever you currently do it (if needed)
      navigate("/index");
    } else if (error) {
      // Surface server error in the form area
      setError("root", { type: "server", message: error });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 grid place-items-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card text-card-foreground shadow-xl p-6 sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create account
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign up to start using your account
            </p>
          </div>

          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                aria-invalid={!!errors.name || undefined}
                aria-errormessage={errors.name ? "name-error" : undefined}
                className={`h-11 ${
                  errors.name
                    ? "ring-1 ring-destructive border-destructive"
                    : ""
                }`}
                {...register("name")}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email || undefined}
                aria-errormessage={errors.email ? "email-error" : undefined}
                className={`h-11 ${
                  errors.email
                    ? "ring-1 ring-destructive border-destructive"
                    : ""
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                aria-invalid={!!errors.password || undefined}
                aria-errormessage={
                  errors.password ? "password-error" : undefined
                }
                className={`h-11 ${
                  errors.password
                    ? "ring-1 ring-destructive border-destructive"
                    : ""
                }`}
                {...register("password")}
              />
              <p className="text-xs text-muted-foreground">
                Must be 8+ characters and include at least one letter and one
                number.
              </p>
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Server / root error */}
            {(errors.root?.message || error) && (
              <p
                className="text-sm text-destructive"
                role="alert"
                aria-live="polite"
              >
                {errors.root?.message || error}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || isSubmitting}
              className="h-11 w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-95"
            >
              {loading || isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Signing up…
                </>
              ) : (
                <>Sign Up</>
              )}
            </Button>
          </form>

          <p className="text-center mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};
