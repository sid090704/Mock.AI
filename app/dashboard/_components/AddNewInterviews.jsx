"use client"
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { chatSession } from '@/utils/gemini'

function AddNewInterviews() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [jobRole, setJobRole] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [jobRequirement, setJobRequirement] = React.useState("");
  const [experience, setExperience] = React.useState("");


  const onSubmit=async(e)=>{
    console.log(jobRole,company,jobRequirement,experience);
    e.preventDefault();

    const inputPrompt=`You are an expert technical interviewer who creates realistic, mixed-difficulty interview questions.
Generate a total of 10 interview questions and detailed answers based on the following input:
Job Role: ${jobRole}
Company: ${company}
Job Requirements / Tech Stack: ${jobRequirement}
Years of Experience: ${experience}
Guidelines:
Generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} questions total — a random mix of:
majorly technical and technical based scenario questions
a few behavioral questions(less weight should be given to these.)
(Behavioral questions should be realistic and related to teamwork, communication, or problem-handling.)
The difficulty level should be mixed (easy, medium, hard) but adjust dynamically based on experience:
If Years of Experience = 0 (Fresher):
Focus on fundamental concepts, basic problem-solving, logical reasoning, and academic knowledge relevant to {{jobRequirement}} as well as general technical requirements.
Avoid deep system design or high-level architectural questions.
Include scenario-based or conceptual questions that assess understanding and learning potential, not prior work experience.
Behavioral questions should explore teamwork in college projects, learning attitude, and adaptability.
If Years of Experience > 0:
Ask real-world, practical, and scenario-based questions aligned with the candidate’s experience level.
Include mid-to-advanced technical questions relevant to {{Job Requirement}}.
Behavioral questions should assess how they handle challenges in professional environments.
Frame all questions as if a real interviewer from {{Company}} is conducting the interview.
Example: “At {{Company}}, we often deal with XYZ challenges. How would you approach…?”
Ensure questions are relevant to the company’s domain and tech stack provided.
Each answer should:
Be clear, realistic, and well-explained, similar to how a strong candidate would respond in a real interview.
Avoid short or generic answers.
Include reasoning, examples, and best practices when relevant.
Avoid bullet or numbered lists inside answers unless needed for clarity.
Return the output strictly in valid JSON format, with no extra text, markdown, or commentary outside the JSON.
Output Format:
[
{"question": "string", "answer": "string"},
{"question": "string", "answer": "string"},
...
]
        Ensure the output is valid JSON and each question-answer pair is enclosed properly.`;
  
    const result= await chatSession.sendMessage(inputPrompt);

    console.log("Interview Questions Generated: ",result.response.text());
  }
  
  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md 
      cursor-pointer transition-all'
      onClick={() => setOpenDialog(true)}
      >
        <h2 className=' text-lg'>
          + Add New
        </h2>
      </div>
      <Dialog open={openDialog}>
      
      <DialogContent className="max-w-2xl">
      <DialogHeader>
      <DialogTitle className="text-2xl">Job Description</DialogTitle>
      <DialogDescription>
        <form onSubmit={onSubmit}>
        <div>
          <h2>Describe the job you want to give interview for:</h2>
          <div className='grid w-full gap-1 my-4'>
            <label className='text-md- text-black'>Job Role/Job Position</label>
            <Input type="text" placeholder="Ex. Data Analyst" required
            onChange={(event)=>setJobRole(event.target.value)} />
          </div>
          <div className='grid w-full gap-1 my-4'>
            <label className='text-md- text-black'>Company Name</label>
            <Input type="text" placeholder="Ex. Deloitte" required
            onChange={(event)=>setCompany(event.target.value)} />
          </div>
          <div className="grid w-full gap-1">
            <label className='text-black text-md'>Job Requirement/Tech Stack</label>
            <Textarea placeholder="Ex. Python, PowerBI, Tableau, etc." id="message" required
            onChange={(event)=>setJobRequirement(event.target.value)}/>
          </div>
          <div className='grid w-full gap-1 my-4'>
            <label className='text-md- text-black'>Years of Experience</label>
            <Input type="number" placeholder="Ex. 2" required  max="30"
            onChange={(event)=>setExperience(event.target.value)} />
          </div>
        </div>
        <div className='mt-4 flex gap-4 justify-end'>
          <button onClick={() => setOpenDialog(false)}>Cancel</button>
          <button type="submit" className='bg-blue-900 text-white px-4 py-2 rounded-md ml-2'>Start Interview</button>
        </div>
        </form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
    </div>
  )
}

export default AddNewInterviews
