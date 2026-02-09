import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";

interface VoiceDictationProps {
  onTranscript: (text: string) => void;
  language?: string;
}

// Definisci i tipi per Speech Recognition API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export const VoiceDictation = ({ onTranscript, language = "it-IT" }: VoiceDictationProps) => {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [isSupported] = useState(() => "webkitSpeechRecognition" in window || "SpeechRecognition" in window);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onTranscriptRef = useRef(onTranscript);

  // Mantieni la ref aggiornata senza ricreare il recognition
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const initRecognition = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      // Mostra il testo parziale in tempo reale
      setInterimText(interimTranscript);

      // Quando il risultato è definitivo, invialo e pulisci l'interim
      if (finalTranscript) {
        setInterimText("");
        onTranscriptRef.current(finalTranscript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;
  }, [language, isSupported]);

  useEffect(() => {
    initRecognition();

    return () => {
      recognitionRef.current?.stop();
    };
  }, [initRecognition]);

  const toggleDictation = () => {
    if (!isSupported) {
      alert("Il tuo browser non supporta la dettatura vocale. Usa Chrome, Edge o Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="voice-dictation-wrapper">
      <button
        type="button"
        onClick={toggleDictation}
        className={`btn btn-ghost voice-dictation-btn ${isListening ? "recording" : ""}`}
        title={isListening ? "Ferma dettatura" : "Inizia dettatura"}
      >
        {isListening ? <MicOff size={20} className="mic-icon-active" /> : <Mic size={20} />}
      </button>

      {/* Preview in tempo reale del testo dettato */}
      {isListening && (
        <div className="voice-interim-banner">
          <span className="interim-recording-dot" />
          {interimText ? <span className="interim-text">{interimText}</span> : <span className="interim-text interim-waiting">In ascolto...</span>}
        </div>
      )}
    </div>
  );
};
