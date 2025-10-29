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

function AddNewInterviews() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [jobRole, setJobRole] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [jobRequirement, setJobRequirement] = React.useState("");
  const [experience, setExperience] = React.useState("");
  const onSubmit=(e)=>{
    console.log("Job Role:", jobRole);
    console.log("Job Requirement:", jobRequirement);
    console.log("Experience:", experience);
    e.preventDefault();
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
