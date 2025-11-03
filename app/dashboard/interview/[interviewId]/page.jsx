"use client"
import React, { use, useEffect } from 'react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import Webcam from 'react-webcam'
import { Camera, CameraIcon ,Lightbulb,WebcamIcon} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function Interview({params}) {
    const [interviewData, setInterviewData] = React.useState("");
    const [webcamEnabled, setWebcamEnabled] = React.useState(false);


    useEffect(()=>{
        console.log("Interview ID: ",params.interviewId);
        getInterviewData();

    },[])

    /**
     * USED TO GET INTERVIEW DETAILS FROM THE DATABASE 
     * USING mockId
     */

    const getInterviewData=async()=>{
        //fetch interview details from the database using params.interviewId
        const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

        console.log("Interview Details: ",result);
        setInterviewData(result[0]);
    }

  return (
    <div className='my-10 flex justify-center flex-col items-center'>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 w-full max-w-5xl'>
      
      <div className='flex flex-col my-10 gap-6 h-72 p-7 border rounded-lg bg-blue-200'>

        <h2 className='text-lg'>
            <strong>Job Role/Job Position: </strong>
            {interviewData?.jobRole || "Loading..."}
        </h2>
        <h2 className='text-lg'>
            <strong>Company Name: </strong>
            {interviewData?.company || "Loading..."}
        </h2>
        <h2 className='text-lg'>
            <strong>Job Requirement/Tech Stack: </strong>
            {interviewData?.jobRequirement || "Loading..."}
        </h2>
        <h2 className='text-lg'>
            <strong>Years of Experience: </strong>
            {interviewData?.experience || "Loading..."}
        </h2>
        <div className='mt-20 text-sm p-5 my-5 border rounded-lg border-yellow-200 bg-yellow-100'>
            <h2 className='flex gap-2 items-center my-2 text-yellow-500'><Lightbulb/> <strong>Information</strong> </h2>
            <h2 className=''>{process.env.NEXT_PUBLIC_INFO}</h2>
        </div>

      </div>

        <div>
        { webcamEnabled? <Webcam 
          onUserMedia={()=>setWebcamEnabled(true)}
          onUserMediaError={()=>setWebcamEnabled(false)}
          mirrored={true}
          style={{
            height: '288px',
            width: '512px',
            marginTop: '40px',
            borderRadius: '8px',
            border: '2px solid #e2e8f0',
            backgroundColor: '#f1f5f9',
          }}

        
        />
        :
        <>
        <WebcamIcon className="h-72 w-full my-10 p-20 bg-secondary rounded-lg border" />
        <Button className="w-full" onClick={()=>setWebcamEnabled(true)}>Enable Webcam and Microphone</Button>
        </>
        }
         <Link href={`/dashboard/interview/${params.interviewId}/start`}>
         <Button className="mt-5 w-full" disabled={!webcamEnabled}>Start Interview</Button>
         </Link>
        
          
      </div>

      </div>

      
      

      

      



    </div>
  )
}

export default Interview
