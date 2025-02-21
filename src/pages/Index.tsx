
import { useState } from "react";
import { AudioRecorder } from "@/components/AudioRecorder";
import { cn } from "@/lib/utils";

const Index = () => {
  const [transcription, setTranscription] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiResponse, setApiResponse] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const processTranscription = async (text: string) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      console.log("data type: ", typeof data)
      // console.log('API Response:', data); // Debug log
      if (typeof data === 'string') {
        setApiResponse(data);
      } else if (data.response) {
        setApiResponse(data.response);
      } else {
        throw new Error('Unexpected response format from server');
      }
    } catch (err) {
      setError('Error communicating with the server. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordingComplete = (text: string) => {
    setTranscription(text);
    processTranscription(text);
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
            ) : isLoading ? (
              <span className="animate-pulse">Getting response...</span>
            ) : error ? (
              <span className="text-red-500">{error}</span>
            ) : apiResponse ? (
              apiResponse
            ) : (
              "Click the microphone button below to start recording..."
            )}
          </p>
        </div>

        <AudioRecorder 
          onRecordingComplete={handleRecordingComplete}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};

export default Index;
