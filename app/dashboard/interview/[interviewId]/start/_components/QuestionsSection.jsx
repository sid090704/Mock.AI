"use client";
import React from "react";
import { Lightbulb, Speech, Loader2 } from "lucide-react";

function QuestionsSection({ mockInterviewQuestions, activeQuestionIndex }) {
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const textToSpeech = async (text) => {
    if (!text || isSpeaking) return;

    try {
      setIsSpeaking(true);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Failed to fetch TTS audio");

      const audioBuffer = await res.arrayBuffer();
      const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);

      audio.onplay = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      audio.play().catch((err) => {
        console.error("Playback error:", err);
        setIsSpeaking(false);
      });
    } catch (error) {
      console.error("TTS playback failed:", error);
      setIsSpeaking(false);
    }
  };

  return (
    mockInterviewQuestions && (
      <div className="relative z-10 mt-20 p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-cyan-400/20 shadow-[0_0_25px_rgba(56,189,248,0.15)] hover:shadow-[0_0_35px_rgba(56,189,248,0.25)] transition-all duration-500">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
          Question Panel
        </h2>

        {/* Question Navigation */}
        <div className="flex flex-wrap gap-3 mb-6">
          {mockInterviewQuestions.map((_, index) => (
            <button
              key={index}
              className={`px-4 py-2 text-xs md:text-sm rounded-full font-semibold transition-all duration-300 ${
                activeQuestionIndex === index
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_0_10px_rgba(56,189,248,0.5)] scale-105"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Q{index + 1}
            </button>
          ))}
        </div>

        {/* Current Question */}
        <div className="relative">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-5 leading-relaxed">
            {mockInterviewQuestions[activeQuestionIndex]?.question}
          </h2>

          {/* TTS Icon */}
          <div className="absolute top-0 right-0">
            {isSpeaking ? (
              <Loader2 className="animate-spin text-cyan-400" size={26} />
            ) : (
              <Speech
                className="text-cyan-400 hover:text-cyan-200 cursor-pointer transition-all hover:scale-110"
                size={26}
                onClick={() =>
                  textToSpeech(
                    mockInterviewQuestions[activeQuestionIndex]?.question
                  )
                }
              />
            )}
          </div>
        </div>

        {/* Note Section */}
        <div className="mt-10 p-5 border border-cyan-400/30 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-xl text-gray-200">
          <h2 className="flex items-center gap-2 text-cyan-300 mb-2">
            <Lightbulb className="h-5 w-5" />
            <strong>Tip:</strong>
          </h2>
          <p className="text-sm font-medium">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE &&
              "Think out loud and structure your answer clearly using real-life examples."}
          </p>
        </div>
      </div>
    )
  );
}

export default QuestionsSection;
