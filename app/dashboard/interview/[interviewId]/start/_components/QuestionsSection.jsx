import { index } from 'drizzle-orm/mysql-core'
import React from 'react'
import { Lightbulb, Speech, Loader2 } from 'lucide-react'

function QuestionsSection({ mockInterviewQuestions, activeQuestionIndex }) {

  const [isSpeaking, setIsSpeaking] = React.useState(false);


  const textToSpeech = async (text) => {
  if (!text || isSpeaking) return;

  try {
    setIsSpeaking(true); // show spinner immediately

    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error("Failed to fetch TTS audio");

    // Get the MP3 data and convert to playable URL
    const audioBuffer = await res.arrayBuffer();
    const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);

    // Stop spinner once playback *starts* (not ends)
    audio.onplay = () => setIsSpeaking(false);
    audio.onerror = () => setIsSpeaking(false);

    audio.play().catch(err => {
      console.error("Playback error:", err);
      setIsSpeaking(false);
    });

  } catch (error) {
    console.error("TTS playback failed:", error);
    setIsSpeaking(false);
  }
};





  return mockInterviewQuestions && (
    <div className='p-5 border rounded-lg mt-10 bg-gray-100'>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 '>
        {mockInterviewQuestions && mockInterviewQuestions.map((question, index) => (
          <h2 className={`p-2 bg-secondary rounded-full text-xs 
            md:text-sm text-center font-bold cursor-pointer
            ${activeQuestionIndex == index && 'bg-blue-600 text-white'} `}>Question #{index + 1}</h2>
        ))}

      </div>
      <h2 className='my-5 text-md md:text-lg font-bold'>
        {mockInterviewQuestions[activeQuestionIndex]?.question}

      </h2>
      {/* for speech icon */}
      <div className="mt-5">
        {isSpeaking ? (
          <Loader2 className="animate-spin text-red-400" size={24} />
        ) : (
          <Speech
            className="text-red-400 hover:text-red-700 cursor-pointer transition-colors"
            size={24}
            onClick={() =>
              textToSpeech(mockInterviewQuestions[activeQuestionIndex]?.question)
            }
          />
        )}
      </div>



      <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
        <h2 className='flex gap-2 items-center text-blue-600'>
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className='text-sm font-semibold '>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
      </div>


    </div>

  )
}

export default QuestionsSection
