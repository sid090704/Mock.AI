"use client";
import React, { useEffect } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/gemini";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { userAnswerSchema } from "@/utils/schema";

function RecordAnswerSection({
    mockInterviewQuestions,
    activeQuestionIndex,
    interviewData,
}) {
    const [userAnswer, setUserAnswer] = React.useState("");
    const { user } = useUser();
    const [loading, setLoading] = React.useState(false);

    const {
        error,
        setResults,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });

    useEffect(() => {
        if (!isRecording && results.length > 0) {
            const finalAnswer = results.map((result) => result.transcript).join(" ");
            setUserAnswer(finalAnswer);
        }
    }, [isRecording, results]);

    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
            UpdateUserAnswer();
        } else if (!isRecording && userAnswer.length < 10 && userAnswer.length > 0) {
            setLoading(false);
            toast("Error while saving your response, please record again");
            resetRecordingState();
        }
    }, [isRecording, userAnswer]);

    const StartStopRecording = () => {
        if (isRecording) {
            console.log("Stopping Recording...");
            stopSpeechToText();
        } else {
            console.log("Starting Recording...");
            setUserAnswer("");
            setResults([]);
            startSpeechToText();
        }
    };

    const resetRecordingState = () => {
        console.log("Resetting state...");
        setUserAnswer("");
        setResults([]);
    };

    const UpdateUserAnswer = async () => {
        console.log("Final Answer:", userAnswer);
        setLoading(true);
        if (!userAnswer.trim()) {
            toast("No answer recorded. Please try again.");
            setLoading(false);
            return;
        }

        const feedbackPrompt = `You are an experienced, professional, and empathetic senior interviewer with a deep understanding of industry best practices and effective communication. Your task is to analyze a candidate's answer to a given interview question and provide constructive, realistic feedback directly to the candidate. 
        Input Data: Question: ${mockInterviewQuestions[activeQuestionIndex]?.question} Candidate's Answer: ${userAnswer} Instructions for Feedback Generation: Analyze and Evaluate: Thoroughly assess the candidate's answer based on the following criteria: Clarity and Structure: Was the answer easy to follow? Did it have a clear beginning, middle, and end (for example, using the STAR method implicitly or explicitly)? 
        Relevance and Completeness: Did the answer fully address the question? Was it too brief or overly verbose? Depth and Technical Acumen (if applicable): Did the candidate demonstrate deep knowledge or critical thinking? Confidence and Professionalism: Was the language appropriate and confident?
         Tone and Persona: The feedback must be delivered as if you are a human mentor or interviewer giving personalized advice. Use a warm, professional, and encouraging tone. Do not use phrases like “As an AI...” Content Focus: If the answer was strong (rating 7 or higher): Clearly state what was excellent (for example, “Your use of the STAR method was perfect,” or “The technical detail you provided was impressive”). 
         Offer one or two minor suggestions for improvement or polish. If the answer needs improvement (rating 6 or below): Clearly and gently explain why it fell short (for example, lack of structure, missing key technical points, or rambling). Then provide specific, actionable ways to improve the answer, focusing on what they should add, remove, or how they should re-structure it.
          Format: Your final output must be a single JSON object with two keys: rating: An overall score out of 10 (integer) feedback: The complete, professionally written feedback addressed to the candidate 
          Example JSON Output Structure: { "rating": 8, "feedback": "Hello Candidate, I appreciated..." }`;

        try {
            const result = await chatSession.sendMessage(feedbackPrompt);
            const text = result.response.text();
            const mockJsonResp = text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .replace(/[\u0000-\u001F]+/g, "")
                .trim();

            const jsonFeedbackResp = JSON.parse(mockJsonResp);
            console.log("Feedback Generated:", jsonFeedbackResp);

            const resp = await db.insert(userAnswerSchema).values({
                mockIdRef: interviewData?.mockId,
                question: mockInterviewQuestions[activeQuestionIndex]?.question,
                correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer,
                userAns: userAnswer,
                feedback: jsonFeedbackResp?.feedback,
                rating: jsonFeedbackResp?.rating,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format("DD-MM-yyyy"),
            });

            if (resp) {
                toast("✅ Answer recorded successfully!");
                resetRecordingState();
            }
        } catch (error) {
            console.error("Error saving answer:", error);
            toast("Error while saving your response, please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="mt-20 relative flex flex-col items-center justify-center p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-cyan-400/20 shadow-[0_0_30px_rgba(56,189,248,0.15)] hover:shadow-[0_0_40px_rgba(56,189,248,0.25)] transition-all duration-500">
            {/* Animated Gradient Overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent opacity-0 hover:opacity-40 blur-2xl transition-opacity duration-700
            w-full max-w-xl flex flex-col justify-center items-center"></div>

            {/* Webcam Section */}
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-cyan-400/30 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
                <Webcam
                    mirrored={true}
                    style={{
                        height: 350,
                        width: "100%",
                        borderRadius: 15,
                        backgroundColor: "rgba(15,23,42,0.4)",
                        objectFit: "cover",
                    }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                {/* Decorative image overlay */}
                <Image
                    src="/images/webcam.png"
                    alt="webcam frame"
                    width={200}
                    height={200}
                    className="absolute flex justify-center opacity-20"
                />
            </div>

            {/* Mic Button */}
            <Button
                disabled={loading}
                onClick={StartStopRecording}
                className={`mt-8 px-8 py-4 rounded-full text-lg font-bold flex items-center gap-3 transition-all duration-500 z-10 ${isRecording
                    ? "bg-gradient-to-r from-red-500 to-pink-600 shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse"
                    : "bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-purple-500 shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:shadow-[0_0_40px_rgba(56,189,248,0.6)]"
                    } text-black`}
            >
                {loading ? (
                    <Loader2 className="animate-spin" size={22} />
                ) : isRecording ? (
                    <>
                        <Mic className="w-5 h-5" /> Stop Recording
                    </>
                ) : (
                    <>
                        <Mic className="w-5 h-5" /> Record Answer
                    </>
                )}
            </Button>

            {/* Status Message */}
            <p className="mt-4 text-sm text-gray-300 italic">
                {loading
                    ? "⏳ Saving your answer..."
                    : isRecording
                        ? "🎙️ Recording your response..."
                        : "Click 'Record Answer' when you’re ready to begin."}
            </p>
        </div>
    );
}

export default RecordAnswerSection;
