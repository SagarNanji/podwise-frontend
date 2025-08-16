import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare } from "lucide-react";

import { Message } from "@/types/message";
import { endpoint } from "@/config";


type SessionItem = {
  _id: string;
  transcript: string | null;
  chatId: string;
  messageCount: number;
  lastMessagePreview: string;
  lastMessageAt: string | null;
};

export default function ChatHistory() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<SessionItem[]>([]);
  const [selected, setSelected] = React.useState<SessionItem | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const navigate = useNavigate();

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${endpoint}/api/history/sessions`, { credentials: "include" });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.message || `Failed: ${r.status}`);
      setItems(data.sessions || []);
    } catch (e: unknown) {
      setError((e as Error).message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const openSession = async (s: SessionItem) => {
    setSelected(s);
    setMessages([]);
    try {
      const r = await fetch(`${endpoint}/api/history/chats/${s._id}`, { credentials: "include" });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.message || `Failed: ${r.status}`);
      const msgs = (data.chat?.messages || []).map((m: Message) => ({
        sender: m.sender,
        content: m.content,
        timestamp: m.timestamp,
      }));
      setMessages(msgs);
    } catch (e: unknown) {
      setError((e as Error).message || "Failed to load chat");
    }
  };

  React.useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto p-4 space-y-6 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold">Chat History</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Your Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading…
              </div>
            )}
            {error && <div className="text-sm text-red-600">{error}</div>}
            {!loading && !items.length && (
              <div className="text-sm text-muted-foreground">No sessions yet.</div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => (
                <div
                  key={s._id}
                  className="border rounded-2xl p-3 hover:bg-muted/30 transition cursor-pointer"
                  onClick={() => openSession(s)}
                >
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Session #{s._id.slice(-6)}
                    </div>
                    {s.transcript && (
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        Transcript: {s.transcript.slice(0, 140)}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {s.messageCount} messages
                      {s.lastMessageAt
                        ? ` • Last: ${new Date(s.lastMessageAt).toLocaleString()}`
                        : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selected && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>
                Session #{selected._id.slice(-6)} — {selected.messageCount} messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {messages.length === 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading messages…
                </div>
              )}

              <div className="space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border ${
                      m.sender === "user" ? "bg-blue-950/20" : "bg-muted/50"
                    }`}
                  >
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      {m.sender}
                    </div>
                    <div className="whitespace-pre-wrap">{m.content}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      {new Date(m.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex gap-2">
                <Button variant="outline" onClick={() => openSession(selected)}>
                  Refresh Preview
                </Button>

                {/* Open in Full Screen */}
                <Button onClick={() => navigate(`/chat/${selected._id}`)}>
                  Open Conversation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
