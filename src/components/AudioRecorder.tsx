
import { useState, useRef } from "react";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isProcessing: boolean;
}

export const AudioRecorder = ({ onRecordingComplete, isProcessing }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        chunksRef.current = [];
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleClick = () => {
    if (isProcessing) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing}
      className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
        "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isRecording ? "bg-red-500 recording-pulse" : "bg-primary",
        "glass-panel"
      )}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
    >
      <Mic className={cn(
        "w-6 h-6 transition-colors duration-200",
        isRecording ? "text-white" : "text-white"
      )} />
    </button>
  );
};
