"use client"
import React, { useEffect } from 'react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import QuestionsSection from './_components/QuestionsSection'
import RecordAnswerSection from './_components/RecordAnswerSection'


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










        </div>
    )
}

export default startInterview
