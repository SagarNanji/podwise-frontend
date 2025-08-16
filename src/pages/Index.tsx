import React, { useState } from "react";
import { AudioUpload } from "@/components/AudioUpload";
import { ChatInterface } from "@/components/ChatInterface";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleSessionCreated = (id: string) => {
    setSessionId(id);
  };

  const handleBack = () => {
    setSessionId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--page-bg)] text-[var(--text)]">
      {/* Top navigation */}
      <Header />

      {/* Main content */}
      <main className="container mx-auto flex-1 px-4 py-6">
        {sessionId ? (
          <ChatInterface sessionId={sessionId} onBack={handleBack} />
        ) : (
          <AudioUpload onSessionCreated={handleSessionCreated} />
        )}
      </main>

      {/* Global footer */}
      <Footer />
    </div>
  );
};

export default Index;
