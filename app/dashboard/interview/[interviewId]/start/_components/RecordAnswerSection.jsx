"use client"
import React, { useEffect } from 'react'
import Webcam from 'react-webcam'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text'
import { Mic } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/gemini'
import { db } from '@/utils/db'
import { useUser } from '@clerk/nextjs'
import moment from 'moment/moment'
import { userAnswerSchema } from '@/utils/schema'


function RecordAnswerSection({
    mockInterviewQuestions, activeQuestionIndex, interviewData
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
        useLegacyResults: false
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
        } else if (
            !isRecording &&
            userAnswer.length < 10 &&
            userAnswer.length > 0
        ) {
            setLoading(false);
            toast("Error while saving your response, please record again");
            resetRecordingState(); // Reset the state if the answer is invalid
        }
    }, [isRecording, userAnswer]);



    const StartStopRecording = () => {
        if (isRecording) {
            console.log("Stopping Recording...");
            stopSpeechToText();
        } else {
            console.log("Starting Recording...");
            setUserAnswer(""); // Clear previous responses
            setResults([]); // Clear old results
            startSpeechToText();
        }
    };

    const resetRecordingState = () => {
        console.log("Resetting state for next question...");
        setUserAnswer("");
        setResults([]);
    };

    const UpdateUserAnswer = async () => {
        console.log("Final Answer: ", userAnswer);
        setLoading(true);
        if (!userAnswer.trim()) {
            toast("No answer recorded. Please try again.");
            setLoading(false);
            return;
        }
        const feedbackPrompt = `You are an experienced, professional, and empathetic senior interviewer with a deep understanding of industry best practices and effective communication. Your task is to analyze a candidate's answer to a given interview question and provide constructive, realistic feedback directly to the candidate.

Input Data:

Question: ${mockInterviewQuestions[activeQuestionIndex]?.question}

Candidate's Answer: ${userAnswer}

Instructions for Feedback Generation:

Analyze and Evaluate: Thoroughly assess the candidate's answer based on the following criteria:

Clarity and Structure: Was the answer easy to follow? Did it have a clear beginning, middle, and end (for example, using the STAR method implicitly or explicitly)?

Relevance and Completeness: Did the answer fully address the question? Was it too brief or overly verbose?

Depth and Technical Acumen (if applicable): Did the candidate demonstrate deep knowledge or critical thinking?

Confidence and Professionalism: Was the language appropriate and confident?

Tone and Persona: The feedback must be delivered as if you are a human mentor or interviewer giving personalized advice. Use a warm, professional, and encouraging tone. Do not use phrases like “As an AI...”

Content Focus:

If the answer was strong (rating 7 or higher): Clearly state what was excellent (for example, “Your use of the STAR method was perfect,” or “The technical detail you provided was impressive”). Offer one or two minor suggestions for improvement or polish.

If the answer needs improvement (rating 6 or below): Clearly and gently explain why it fell short (for example, lack of structure, missing key technical points, or rambling). Then provide specific, actionable ways to improve the answer, focusing on what they should add, remove, or how they should re-structure it.

Format: Your final output must be a single JSON object with two keys:

rating: An overall score out of 10 (integer)

feedback: The complete, professionally written feedback addressed to the candidate

Example JSON Output Structure:
{
"rating": 8,
"feedback": "Hello Candidate, I appreciated..."
}`
        try {
            const result = await chatSession.sendMessage(feedbackPrompt)
            const text = result.response.text();

            const mockJsonResp = text.replace(/```json/g, "").replace(/```/g, "")
                .replace(/[\u0000-\u001F]+/g, "")
                .trim();
            const jsonFeedbackResp = JSON.parse(mockJsonResp);
            console.log("Feedback Generated: ", jsonFeedbackResp);

            const resp = await db.insert(userAnswerSchema)
                .values({
                    mockIdRef: interviewData?.mockId,
                    question: mockInterviewQuestions[activeQuestionIndex]?.question,
                    correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer,
                    userAns: userAnswer,
                    feedback: jsonFeedbackResp?.feedback,
                    rating: jsonFeedbackResp?.rating,
                    userEmail: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format("DD-MM-yyyy"),
                })
            if (resp) {
                toast("Answer recorded successfully!");
                resetRecordingState();
            }
        } catch (error) {
            console.error("Error saving answer:", error);
            toast("Error while saving your response, please try again.");
        }
        setLoading(false);
    };


return (
    <div className="flex flex-col justify-center items-center mt-1">
        {/* Webcam container */}
        <div className="w-full max-w-xl flex flex-col justify-center items-center bg-blue-200 rounded-lg p-5 mt-20">
            <Image
                src="/images/webcam.png"
                width={200}
                height={200}
                className="absolute"
                alt="image"
            />
            <Webcam
                mirrored={true}
                style={{
                    height: 400,
                    width: '100%',
                    zIndex: 10,
                    borderRadius: 15,
                }}
            />
        </div>

        {/* Centered button */}
        <Button
            disabled={loading}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full px-6 py-2"
            onClick={StartStopRecording}
        >
            {isRecording ? (
                <span className="flex items-center gap-2">
                    <Mic /> Stop Recording
                </span>
            ) : (
                'Record Answer'
            )}
        </Button>
        
    </div>

)
}

export default RecordAnswerSection
