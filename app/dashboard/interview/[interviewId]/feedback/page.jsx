"use client"
import { userAnswerSchema } from '@/utils/schema'
import React, { useEffect } from 'react'
import { db } from '@/utils/db'
import { eq } from 'drizzle-orm'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

function Feedback({ params }) {

    const [feedbackList, setFeedbackList] = React.useState([]);
    const router = useRouter();

    useEffect(() => {
        getFeedback();
    }, []);


    const getFeedback = async () => {
        const result = await db.select().from(userAnswerSchema)
            .where(eq(userAnswerSchema.mockIdRef, params.interviewId))
            .orderBy(userAnswerSchema.id);


        console.log("Feedback Data: ", result);
        setFeedbackList(result);

    }



    return (
        <div className='p-10'>
            <h2 className='text-3xl font-bold text-green-500'>Congratulations!</h2>
            <h2 className='font-bold text-2xl my-3'>Here is your interview feedback:</h2>
            <h2 className='text-blue-600 text-lg my-3'>Your overall interview rating: <strong>7/10</strong></h2>
            <h2 className='text-sm text-gray-500'>Your interview analysis:</h2>
            {feedbackList && feedbackList.map((feedbackItem, index) => (
                <Collapsible key={index} className=' p-5 bg-secondary my-3 rounded-lg border border-black'>
                    <CollapsibleTrigger className='font-semibold p-2 bg-purple-200 rounded-lg border border-black' >
                        Q{index + 1}. {feedbackItem.question} <ChevronsUpDown />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className='flex flex-col gap-2 mt-3'>
                            <h2 className='text-blue-600 p-2 border rounded-lg border-gray-400 bg-blue-50'><strong>Rating:</strong> {feedbackItem.rating}</h2>

                            <h2 className='p-2 border rounded-lg border-gray-400 text-sm bg-red-50'><strong>Your Answer:</strong> {feedbackItem.userAns}</h2>

                            <h2 className='p-2 border rounded-lg border-gray-400 text-sm bg-green-50'><strong>Ideal Answer:</strong> {feedbackItem.correctAns}</h2>

                            <h2 className='p-2 border rounded-lg border-gray-400 text-sm bg-yellow-50'><strong>Feedback:</strong> {feedbackItem.feedback}</h2>

                        </div>
                    </CollapsibleContent>
                </Collapsible>
                

            ))}
            <div className='flex justify-center'>
            <Button className="mt-2 bg-purple-400 hover:bg-purple-700 text-white font-bold rounded-full px-6 py-2"
            onClick={()=>router.replace('/dashboard')}>Go Home</Button>
            </div>





        </div>
    )
}

export default Feedback
