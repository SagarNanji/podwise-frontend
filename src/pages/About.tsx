import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail, Phone, MapPin, Send, CheckCircle2, AlertTriangle,
  Search, Clock, MessageSquare, ListChecks, ShieldCheck, Sparkles
} from "lucide-react";
import { endpoint } from "@/config";

export default function About() {
  // form state
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [category, setCategory] = React.useState<"support" | "billing" | "feedback" | "other">("support");
  const [message, setMessage] = React.useState("");
  const [agree, setAgree] = React.useState(false);

  // ux state
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const validate = () => {
    if (!name.trim()) return "Please enter your name.";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
    if (!message.trim()) return "Please write a brief message.";
    if (!agree) return "Please accept the privacy notice.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }

    setSubmitting(true);
    try {
      const res = await fetch(`${endpoint}/api/contact`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, category, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to send message.");
      }

      setSuccess("Thanks! Your message has been sent. We’ll get back to you soon.");
      setName(""); setEmail(""); setSubject(""); setCategory("support"); setMessage(""); setAgree(false);
    } catch (err: unknown) {
      setError((err as Error).message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="container mx-auto p-4 space-y-6 flex-1">
        {/* Hero / Intro */}
        <Card className="shadow-sm overflow-hidden">
          <div className="bg-[--header-gradient]">
            <div className="header-glass rounded-b-2xl px-5 py-8">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-[--header-text] mt-1" />
                <div>
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[--header-text] leading-tight">
                    Turn audio into answers — instantly.
                  </h1>
                  <p className="mt-2 text-sm md:text-base text-[--header-text]/90">
                    Podwise makes every recording searchable and conversational. Upload once. Ask anything.
                  </p>
                  <div className="mt-4">
                    <a href="#contact-form">
                      <Button className="auth-btn">Talk to us</Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CardHeader>
            <CardTitle className="page-title">About Podwise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 page-text">
            <p>
              Podwise helps you turn audio into searchable conversations. Upload a meeting, lecture,
              or interview and get an accurate transcript, smart summaries, and a chat interface to
              pull the exact answers you need—complete with timestamps.
            </p>
            <p>
              Built with Vite + React + TypeScript on the front end and Node/Express + MongoDB on
              the back end, Podwise is designed for speed, clarity, and a clean UX.
            </p>
          </CardContent>
        </Card>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card className="shadow-sm">
            <CardContent className="pt-5 flex items-start gap-3">
              <Search className="h-5 w-5 text-[--header-text]" />
              <div className="page-text">
                <h3 className="font-semibold mb-1">Searchable transcripts</h3>
                <p className="text-sm text-muted-foreground">Find quotes, names, and decisions in seconds.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="pt-5 flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-[--header-text]" />
              <div className="page-text">
                <h3 className="font-semibold mb-1">Chat with recordings</h3>
                <p className="text-sm text-muted-foreground">Ask natural questions and jump to the exact moment.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="pt-5 flex items-start gap-3">
              <ListChecks className="h-5 w-5 text-[--header-text]" />
              <div className="page-text">
                <h3 className="font-semibold mb-1">Smart summaries</h3>
                <p className="text-sm text-muted-foreground">Auto-generate briefs, highlights, and action items.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="pt-5 flex items-start gap-3">
              <Clock className="h-5 w-5 text-[--header-text]" />
              <div className="page-text">
                <h3 className="font-semibold mb-1">Save hours</h3>
                <p className="text-sm text-muted-foreground">Skip re-listening; get answers in minutes, not hours.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2-column layout on desktop: Contact + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Details */}
          <Card className="shadow-sm lg:col-span-1">
            <CardHeader>
              <CardTitle className="page-title">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 page-text">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <a className="underline" href="mailto:support@podwise.example">support@podwise.example</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4" />
                <a className="underline" href="tel:+1234567890">+1 (234) 567-890</a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4" />
                <span>123 Maker Way, Kitchener, ON</span>
              </div>

              <div className="mt-4 rounded-lg border border-[var(--border)] p-3 text-sm text-muted-foreground">
                <p><strong>Hours:</strong> Mon–Fri, 9am–6pm ET</p>
                <p><strong>Typical response:</strong> within 1–2 business days</p>
                <div className="mt-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs">Your uploads remain private to your account.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Form */}
          <Card className="shadow-sm lg:col-span-2" id="contact-form">
            <CardHeader>
              <CardTitle className="page-title">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              {/* feedback banners */}
              {success && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-600/30 bg-green-600/10 px-3 py-2 text-green-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <p className="text-sm">{success}</p>
                </div>
              )}
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-600/30 bg-red-600/10 px-3 py-2 text-red-300">
                  <AlertTriangle className="h-4 w-4" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    className="auth-input"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    className="auth-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    className="auth-input"
                    placeholder="Short summary"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="auth-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as "support" | "billing" | "feedback" | "other")}
                  >
                    <option value="support">Support</option>
                    <option value="billing">Billing</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    className="auth-input min-h-[140px]"
                    placeholder="How can we help?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                {/* Consent */}
                <div className="md:col-span-2 flex items-start gap-2 text-sm text-muted-foreground">
                  <input
                    id="agree"
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-1 form-checkbox-dark"
                    required
                  />
                  <label htmlFor="agree">
                    I agree that Podwise may contact me about my request and handle my data according to the privacy policy.
                  </label>
                </div>

                {/* Submit */}
                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    className="auth-btn inline-flex items-center gap-2"
                    disabled={submitting}
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>

              <p className="mt-4 text-xs text-muted-foreground">
                Need immediate help? Email <a className="underline" href="mailto:support@podwise.example">support@podwise.example</a>.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Simple FAQ */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="page-title">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="page-text">
            <div className="space-y-3">
              <details className="rounded-lg border border-[var(--border)] p-3">
                <summary className="cursor-pointer font-semibold">What types of audio can I upload?</summary>
                <p className="mt-2 text-sm text-muted-foreground">
                  MP3, WAV, and M4A work great. Long recordings are split automatically and processed in sequence.
                </p>
              </details>
              <details className="rounded-lg border border-[var(--border)] p-3">
                <summary className="cursor-pointer font-semibold">How does the chat over audio work?</summary>
                <p className="mt-2 text-sm text-muted-foreground">
                  Once transcribed, you can ask natural questions—Podwise cites timestamps so you can jump back to the moment.
                </p>
              </details>
              <details className="rounded-lg border border-[var(--border)] p-3">
                <summary className="cursor-pointer font-semibold">Is my data private?</summary>
                <p className="mt-2 text-sm text-muted-foreground">
                  Yes. Your uploads and chats remain private to your account. You control your data and can delete sessions anytime.
                </p>
              </details>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
