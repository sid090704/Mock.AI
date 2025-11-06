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
import { ChevronsUpDown,Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

function Feedback({ params }) {

    const [feedbackList, setFeedbackList] = React.useState([]);
    const [averageRating, setAverageRating] = React.useState(0);
    const router = useRouter();

    useEffect(() => {
        getFeedback();
    }, []);


    const getFeedback = async () => {
        const result = await db.select().from(userAnswerSchema)
            .where(eq(userAnswerSchema.mockIdRef, params.interviewId))
            .orderBy(userAnswerSchema.id);

        const ratings = result.map((item) => Number(item.rating)).filter((r) => !isNaN(r));
        const avgRating = ratings.length
            ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
            : 0;

        console.log("Average Rating:", avgRating.toFixed(2));


        console.log("Feedback Data: ", result);
        setFeedbackList(result);
        setAverageRating(Math.round(avgRating));

    }



    return (
        <div className='p-10'>


            {feedbackList.length === 0
                ?
                <h2 className='text-gray-500 text-3xl flex justify-center mt-20'>No feedback available. Please complete this interview first!</h2>

                :
                <>
                    <div className="text-center my-10 space-y-5">
                        {/* Congratulations Header */}
                        <h2 className=" text-5xl font-extrabold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-pulse leading-[1.2] pb-1">
                             Congratulations!
                        </h2>

                        {/* Subheading */}
                        <h2 className="text-2xl md:text-3xl font-semibold text-white/90 mt-10 tracking-wide">
                            Here’s your <span className="text-cyan-300">interview feedback:</span> 
                        </h2>

                        {/* Rating */}
                        <h2 className="text-xl md:text-2xl mt-6 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                            Overall Rating:&nbsp;
                            <strong className="text-white bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                                {averageRating}/10
                            </strong>
                        </h2>

                        {/* Analysis Header */}
                        <h2 className="text-semibold text-base md:text-lg text-gray-300 mt-4 tracking-wide italic">
                             Detailed Interview Analysis Below:
                        </h2>
                    </div>
                    {feedbackList && feedbackList.map((feedbackItem, index) => (
                 <Collapsible
          key={index}
          className="p-5 rounded-2xl backdrop-blur-lg border border-white/10 
                     bg-white/5 hover:bg-white/10 
                     transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.2)]
                     overflow-hidden"
        >
          {/* Header */}
          <CollapsibleTrigger
            className="w-full flex items-start justify-between text-left
                       px-5 py-4 rounded-xl font-semibold text-white/90
                       bg-gradient-to-r from-[#1e1e2a]/60 via-[#24243e]/50 to-[#1a1a28]/60
                       hover:from-[#2c2c45]/60 hover:to-[#262640]/60
                       transition-all duration-300 backdrop-blur-sm
                       whitespace-normal break-words"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-3 w-full text-wrap">
              <span className="text-sm font-bold text-cyan-300 bg-cyan-900/40 px-3 py-1 rounded-full shrink-0">
                Q{index + 1}
              </span>
              <span className="text-base text-white/90 leading-relaxed break-words">
                {feedbackItem.question}
              </span>
            </div>
            <ChevronsUpDown className="h-5 w-5 text-cyan-300 flex-shrink-0 ml-2" />
          </CollapsibleTrigger>

          {/* Expanded Content */}
          <CollapsibleContent className="mt-4 space-y-4 text-wrap break-words">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg px-4 py-3 text-white/80">
              <Star className="text-yellow-400" size={18} />
              <strong>Rating:</strong>{" "}
              <span className="text-cyan-300 font-semibold">
                {feedbackItem.rating}/10
              </span>
            </div>

            <div className="p-4 rounded-lg border border-white/10 bg-white/5 text-gray-200 break-words">
              <strong className="text-cyan-300">Your Answer:</strong>
              <p className="mt-2 text-sm leading-relaxed text-white/80 whitespace-pre-line">
                {feedbackItem.userAns}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-white/10 bg-white/5 text-gray-200 break-words">
              <strong className="text-green-300">Ideal Answer:</strong>
              <p className="mt-2 text-sm leading-relaxed text-white/80 whitespace-pre-line">
                {feedbackItem.correctAns}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-white/10 bg-white/5 text-gray-200 break-words">
              <strong className="text-yellow-300">Feedback:</strong>
              <p className="mt-2 text-sm leading-relaxed text-white/80 whitespace-pre-line">
                {feedbackItem.feedback}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>


                    ))}
                </>}
            <div className='flex justify-center'>
                <Button className="mt-2 bg-purple-400 hover:bg-purple-700 text-white font-bold rounded-full px-6 py-2"
                    onClick={() => router.replace('/dashboard')}>Dashboard</Button>
            </div>





        </div>
    )
}

export default Feedback
