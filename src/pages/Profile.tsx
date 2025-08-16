import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, ShieldCheck, KeyRound, User2 } from "lucide-react";

import type { User } from "@/types/user";
import { endpoint } from "@/config";


export default function Profile() {
  // profile fields
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState(""); // read-only
  const [company, setCompany] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [bio, setBio] = React.useState("");

  // password fields
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");

  // UX
  const [loading, setLoading] = React.useState(true);
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [savingPass, setSavingPass] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  // load current profile
  React.useEffect(() => {
    const ac = new AbortController();
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const r = await fetch(`${endpoint}/api/profile`, {
          credentials: "include",
          signal: ac.signal,
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data?.message || "Failed to load profile");

        const u: Partial<User> = data.user || {};
        setName(u.name || "");         // <-- fix here
        setEmail(u.email || "");
        setCompany(u.company || "");
        setTitle(u.title || "");
        setBio(u.bio || "");
      } catch (e: unknown) {
        if ((e as any)?.name !== "AbortError") {
          setErr((e as Error).message || "Error loading profile");
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setMsg(null);
    setErr(null);
    try {
      const r = await fetch(`${endpoint}/api/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, title, bio }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.message || "Failed to save profile");
      setMsg("Profile updated successfully.");
    } catch (e: unknown) {
      setErr((e as Error).message || "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPass(true);
    setMsg(null);
    setErr(null);
    try {
      if (newPassword.length < 8) throw new Error("New password must be at least 8 characters");
      if (newPassword !== confirm) throw new Error("New password and confirmation do not match");

      const r = await fetch(`${endpoint}/api/profile/password`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.message || "Failed to change password");
      setMsg("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (e: unknown) {
      setErr((e as Error).message || "Failed to change password");
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto p-4 space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <User2 className="h-6 w-6" /> Profile
          </h1>
        </div>

        {msg && (
          <div className="rounded-lg border border-green-600/30 bg-green-600/10 px-3 py-2 text-green-300 text-sm" role="status" aria-live="polite">
            {msg}
          </div>
        )}
        {err && (
          <div className="rounded-lg border border-red-600/30 bg-red-600/10 px-3 py-2 text-red-300 text-sm" role="alert">
            {err}
          </div>
        )}

        {/* Profile info */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="page-title">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (
              <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    className="auth-input"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email (read-only)</Label>
                  <Input id="email" className="auth-input" value={email} readOnly />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    className="auth-input"
                    placeholder="Your company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    className="auth-input"
                    placeholder="Your title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    className="auth-input min-h-[120px]"
                    placeholder="Tell us a bit about yourself…"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <Button type="submit" className="auth-btn inline-flex items-center gap-2" disabled={savingProfile}>
                    <Save className="h-4 w-4" />
                    {savingProfile ? "Saving…" : "Save Changes"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Password change */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="page-title">Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={changePassword} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="current">Current Password</Label>
                <Input
                  id="current"
                  type="password"
                  className="auth-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="new">New Password</Label>
                <Input
                  id="new"
                  type="password"
                  className="auth-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  className="auth-input"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter new password"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                <span>We never store plain-text passwords.</span>
              </div>

              <div className="md:col-span-2">
                <Button type="submit" className="auth-btn inline-flex items-center gap-2" disabled={savingPass}>
                  <KeyRound className="h-4 w-4" />
                  {savingPass ? "Updating…" : "Update Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
