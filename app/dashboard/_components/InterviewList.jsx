"use client"
import React, { use, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { MockInterview } from '@/utils/schema';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import InterviewItemCard from './InterviewItemCard';

function InterviewList() {

    const { user } = useUser();
    const [interviewList, setInterviewList] = React.useState([]);


    useEffect(() => {
        user && getInterviewList();
    }, [user])
    const getInterviewList = async () => {
        const result = await db.select()
            .from(MockInterview)
            .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(MockInterview.createdAt, 'desc');

        console.log("Previous Interviews: ", result);
        setInterviewList(result);


    }

    return (
        <div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-start items-start my-10">
                {interviewList?.map((interviewItem, index) => (
                    <InterviewItemCard key={index} interviewItem={interviewItem} />
                ))}
            </div>

        </div>
    )
}

export default InterviewList
