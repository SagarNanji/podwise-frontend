import React, { useState, useCallback, useRef } from 'react';
import { Upload, Music, FileAudio, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { endpoint } from "@/config.ts";

interface AudioUploadProps {
  onSessionCreated: (sessionId: string) => void;
}

export const AudioUpload: React.FC<AudioUploadProps> = ({ onSessionCreated }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      // Important: ensure the file input is not empty
      formData.append('file', file);

      const res = await fetch(`${endpoint}/api/session`, {
        method: 'POST',
        credentials: 'include', 
        body: formData,
      });

      if (!res.ok) {
        // try to parse server message
        let msg = '';
        try { msg = await res.text(); } catch (e) { console.error(e) }
        if (res.status === 401) {
          throw new Error('You must be signed in before uploading.');
        }
        throw new Error(msg || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      setUploadProgress(100);

      setTimeout(() => {
        if (data.sessionId) {
          onSessionCreated(data.sessionId);
        } else {
          throw new Error("Session ID not returned from server.");
        }
      }, 300);
    } catch (error: unknown) {
      console.error('Upload error:', error);
      alert(
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : 'File upload failed. Please try again.'
      );
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
      clearInterval(interval);
    }
  }, [onSessionCreated, endpoint]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => file.type.startsWith('audio/'));
    if (audioFile) uploadFile(audioFile);
  }, [uploadFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      uploadFile(file);
    }
  }, [uploadFile]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-primary">
              <Music className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome to Podwise
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload your audio file to start an intelligent conversation
          </p>
        </div>

        <Card
          className={cn(
            "relative border-2 border-dashed transition-all duration-300",
            isDragOver
              ? "border-audio-primary bg-audio-primary/5 scale-105"
              : "border-border hover:border-audio-primary/50",
            isUploading && "border-audio-primary bg-audio-primary/5"
          )}
        >
          <div
            className="p-12 text-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Loader2 className="w-12 h-12 text-audio-primary animate-spin" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">Uploading your audio...</p>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <FileAudio
                    className={cn(
                      "w-16 h-16 transition-colors duration-300",
                      isDragOver ? "text-audio-primary" : "text-muted-foreground"
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Drop your audio file here</h3>
                  <p className="text-muted-foreground">
                    Supports MP3, WAV, M4A, and other audio formats
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".mp3,.wav,.m4a,audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {/* Button triggers file input click */}
                  <Button
                    variant="audio"
                    size="lg"
                    className="cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-5 h-5" />
                    Choose Audio File
                  </Button>

                  <span className="text-sm text-muted-foreground">or drag and drop</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Your audio will be processed securely and used only for this conversation
          </p>
        </div>
      </div>
    </div>
  );
};
