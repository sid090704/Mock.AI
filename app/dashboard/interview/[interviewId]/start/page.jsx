"use client"
import React, { useEffect } from 'react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import QuestionsSection from './_components/QuestionsSection'
import RecordAnswerSection from './_components/RecordAnswerSection'
import { Button } from '@/components/ui/button'
import  Link  from 'next/link'




function startInterview({ params }) {

    const [interviewData, setInterviewData] = React.useState("");
    const [mockInterviewQuestions, setMockInterviewQuestions] = React.useState("");
    const [activeQuestionIndex, setActiveQuestionIndex] = React.useState(0);

    useEffect(() => {
        getInterviewData();
    }, []);

    /**
     * USED TO GET INTERVIEW DETAILS FROM THE DATABASE 
     * USING mockId
     */

    const getInterviewData = async () => {
        //fetch interview details from the database using params.interviewId
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewId));

        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        setMockInterviewQuestions(jsonMockResp);
        console.log("Interview Details: ", result);
        setInterviewData(result[0]);
    }


    return (
        <div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-20'>
                {/*Questions}*/}
                <QuestionsSection
                    mockInterviewQuestions={mockInterviewQuestions}
                    activeQuestionIndex={activeQuestionIndex}

                />


                {/* Video/Audio Recording */}
                <RecordAnswerSection
                    mockInterviewQuestions={mockInterviewQuestions}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}

                />


            </div>
            <div className='flex justify-left gap-2 my-4 '>
                {activeQuestionIndex>0 &&
                 <Button className=" font-bold rounded-full px-6 py-2"
                 onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
                
                {activeQuestionIndex!=mockInterviewQuestions.length-1 && 
                <Button className=" font-bold rounded-full px-6 py-2"
                onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
                
                {activeQuestionIndex==mockInterviewQuestions.length-1 && 
                <Link href={`/dashboard/interview/${interviewData.mockId}/feedback`}>
                <Button className=" font-bold rounded-full px-6 py-2 bg-red-600 hover:bg-red-700">End Interview</Button>
                </Link>}

            </div>

            










        </div>
    )
}

export default startInterview
