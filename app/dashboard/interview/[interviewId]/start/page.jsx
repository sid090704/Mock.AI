"use client";
import React, { useEffect, use } from 'react'; // 1. Added 'use'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({ params: paramsPromise }) { // 2. Rename to avoid confusion
    // 3. Unwrap the params promise
    const params = use(paramsPromise);
    
    const [interviewData, setInterviewData] = React.useState();
    const [mockInterviewQuestions, setMockInterviewQuestions] = React.useState([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = React.useState(0);

    useEffect(() => {
        getInterviewData();
    }, []);

    const getInterviewData = async () => {
        try {
            // 4. Fetch details
            const result = await db.select().from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));

            // 5. Safety check: Check if record exists before accessing [0]
            if (!result || result.length === 0) {
                console.error("No interview found for ID:", params.interviewId);
                return;
            }
            console.log("Fetched Interview Data:", result[0].jsonMockResp);

            // 6. Clean and parse JSON response
            const jsonMockResp = JSON.parse(result[0].jsonMockResp);
            
            setMockInterviewQuestions(jsonMockResp);
            setInterviewData(result[0]);
            
            console.log("Interview Details Loaded");
        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
    }

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* Questions Section - Pass the questions array */}
                <QuestionsSection
                    mockInterviewQuestions={mockInterviewQuestions}
                    activeQuestionIndex={activeQuestionIndex}
                />

                {/* Recording Section */}
                <RecordAnswerSection
                    mockInterviewQuestions={mockInterviewQuestions}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                />
            </div>
            
            {/* Navigation buttons */}
            <div className='flex justify-end gap-6 my-10'>
                {activeQuestionIndex > 0 && (
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
                        Previous Question
                    </Button>
                )}
                
                {activeQuestionIndex < mockInterviewQuestions?.length - 1 && (
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
                        Next Question
                    </Button>
                )}

                {activeQuestionIndex === mockInterviewQuestions?.length - 1 && (
                    <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
                        <Button variant="destructive">End Interview</Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default StartInterview;