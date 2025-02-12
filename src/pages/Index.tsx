
import { useState } from "react";
import { AudioRecorder } from "@/components/AudioRecorder";
import { cn } from "@/lib/utils";

const Index = () => {
  const [transcription, setTranscription] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Create form data with the audio blob
      const formData = new FormData();
      formData.append('audio', audioBlob);

      // For testing purposes, we'll set some actual transcribed text
      // Replace this with your actual API call when ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockTranscription = "This is a test transcription. Your audio was recorded successfully. When you integrate with a real API, the actual transcribed text will appear here.";
      setTranscription(mockTranscription);
    } catch (error) {
      console.error('Error processing audio:', error);
      setTranscription("Error processing audio. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">
        {/* Text Display Area */}
        <div className={cn(
          "w-full min-h-[200px] p-6 rounded-2xl transition-all duration-300",
          "glass-panel"
        )}>
          <p className="text-gray-700 text-lg leading-relaxed">
            {isProcessing ? (
              <span className="animate-pulse">Processing audio...</span>
            ) : (
              transcription || "Click the microphone button below to start recording..."
            )}
          </p>
        </div>

        {/* Audio Recorder */}
        <AudioRecorder 
          onRecordingComplete={handleRecordingComplete}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};

export default Index;
